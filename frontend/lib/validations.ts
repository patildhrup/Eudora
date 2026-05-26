import { z } from "zod";
import { AI_TOOL_IDS, PRIMARY_USE_CASES } from "@/types/audit";

export const toolEntrySchema = z.object({
  toolId: z.enum(AI_TOOL_IDS),
  plan: z.string().min(1).max(80),
  monthlySpend: z.number().min(0).max(1_000_000),
  seatCount: z.number().int().min(0).max(10_000),
});

export const auditFormSchema = z.object({
  tools: z.array(toolEntrySchema).min(1).max(20),
  teamSize: z.number().int().min(1).max(100_000),
  primaryUseCase: z.enum(PRIMARY_USE_CASES),
});

export const leadSchema = z.object({
  email: z.string().email().max(255),
  company: z.string().max(120).optional().or(z.literal("")),
  role: z.string().max(80).optional().or(z.literal("")),
  teamSize: z.number().int().min(1).max(100_000),
  auditSlug: z.string().optional(),
  monthlySavings: z.number().optional(),
  honeypot: z.string().optional(),
});

export type AuditFormValues = z.infer<typeof auditFormSchema>;
export type LeadFormValues = z.infer<typeof leadSchema>;
