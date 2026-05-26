import { Request, Response } from "express";
import { leadSchema } from "../lib/validations";
import { supabase } from "../config/supabase";
import { sendLeadNotification } from "../services/resend.service";

export async function createLead(req: Request, res: Response): Promise<void> {
  try {
    const parsed = leadSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: "Validation failed", details: parsed.error.flatten() });
      return;
    }

    // Honeypot check for spam prevention
    if (parsed.data.honeypot) {
      // Return 200 mock success silently to frustrate bots
      res.json({ ok: true });
      return;
    }

    const { email, company, role, teamSize, auditSlug, monthlySavings } = parsed.data;

    try {
      const { error } = await supabase.from("leads").insert({
        email,
        company: company || "",
        role: role || "",
        team_size: teamSize,
        audit_slug: auditSlug ?? null,
        monthly_savings: monthlySavings ?? null,
      });

      if (error) {
        console.error("Supabase lead insertion error:", error);
        res.status(503).json({ error: "Could not save lead to database" });
        return;
      }
    } catch (err) {
      console.error("Database connection failure:", err);
      res.status(503).json({ error: "Service unavailable" });
      return;
    }

    // Attempt Resend email dispatch
    const emailResult = await sendLeadNotification({
      email,
      company,
      role,
      teamSize,
      auditSlug,
      monthlySavings,
    });

    res.json({
      ok: true,
      emailSent: emailResult.ok,
      error: emailResult.error,
    });
  } catch (err) {
    console.error("Error creating lead:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}
