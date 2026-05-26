import { Request, Response } from "express";
import { randomBytes } from "crypto";
import { runAudit } from "../lib/audit-engine";
import { getToolDisplayName } from "../lib/audit-engine/pricing";
import { auditFormSchema } from "../lib/validations";
import { supabase } from "../config/supabase";
import { generateAuditSummary } from "../services/openrouter.service";
import { z } from "zod";

function generateSlug(): string {
  return randomBytes(6).toString("base64url").toLowerCase();
}

export async function createAudit(req: Request, res: Response): Promise<void> {
  try {
    const parsed = auditFormSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: "Validation failed", details: parsed.error.flatten() });
      return;
    }

    const result = runAudit(parsed.data);
    const slug = generateSlug();

    const input_snapshot = {
      teamSize: parsed.data.teamSize,
      primaryUseCase: parsed.data.primaryUseCase,
      toolCount: parsed.data.tools.length,
      toolNames: parsed.data.tools.map((t) => getToolDisplayName(t.toolId)),
    };

    let auditId: string | null = null;

    try {
      const { data, error } = await supabase
        .from("audits")
        .insert({
          slug,
          input_snapshot,
          result,
          ai_summary: null,
        })
        .select("id")
        .single();

      if (error) {
        console.error("Supabase error during audit insertion:", error);
      } else if (data) {
        auditId = data.id;
      }
    } catch (e) {
      console.error("Database connection failure:", e);
      // Non-blocking for offline development or network issues
    }

    res.json({
      auditId,
      slug,
      result,
      input: parsed.data,
    });
  } catch (err) {
    console.error("Error creating audit:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function getAuditBySlug(req: Request, res: Response): Promise<void> {
  const { slug } = req.params;

  try {
    const { data, error } = await supabase
      .from("audits")
      .select("slug, result, input_snapshot, ai_summary")
      .eq("slug", slug)
      .single();

    if (error || !data) {
      res.status(404).json({ error: "Audit not found" });
      return;
    }

    res.json(data);
  } catch (err) {
    console.error("Error retrieving audit:", err);
    res.status(503).json({ error: "Service unavailable" });
  }
}

const summaryBodySchema = z.object({
  slug: z.string().min(4).max(32).optional(),
  result: z.any(), // AuditResult validation bypassed here to keep controller fast
  teamSize: z.number(),
  primaryUseCase: z.string(),
  toolNames: z.array(z.string()),
});

export async function generateSummary(req: Request, res: Response): Promise<void> {
  try {
    const parsed = summaryBodySchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: "Validation failed", details: parsed.error.flatten() });
      return;
    }

    const { result, teamSize, primaryUseCase, toolNames, slug } = parsed.data;

    const topRecommendations = (result.recommendations || [])
      .filter((r: any) => r.estimatedMonthlySavings > 0)
      .slice(0, 4)
      .map((r: any) => ({
        issue: r.issue,
        action: r.suggestedAction,
        savings: r.estimatedMonthlySavings,
      }));

    const summary = await generateAuditSummary({
      currentMonthlySpend: result.currentMonthlySpend,
      monthlySavings: result.monthlySavings,
      annualSavings: result.annualSavings,
      teamSize,
      primaryUseCase,
      toolNames,
      topRecommendations,
      isWellOptimized: result.isWellOptimized,
    });

    if (slug) {
      try {
        const { error } = await supabase
          .from("audits")
          .update({ ai_summary: summary })
          .eq("slug", slug);

        if (error) {
          console.error("Supabase summary update error:", error);
        }
      } catch (err) {
        console.error("Failed to update summary in database:", err);
      }
    }

    res.json({ summary });
  } catch (err) {
    console.error("Error generating summary:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}
