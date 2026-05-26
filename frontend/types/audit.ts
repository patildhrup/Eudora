export const AI_TOOL_IDS = [
  "cursor",
  "github-copilot",
  "claude",
  "chatgpt",
  "anthropic-api",
  "openai-api",
  "gemini",
  "windsurf",
] as const;

export type AIToolId = (typeof AI_TOOL_IDS)[number];

export const PRIMARY_USE_CASES = [
  "coding",
  "writing",
  "research",
  "customer-support",
  "mixed",
] as const;

export type PrimaryUseCase = (typeof PRIMARY_USE_CASES)[number];

export interface ToolEntry {
  toolId: AIToolId;
  plan: string;
  monthlySpend: number;
  seatCount: number;
}

export interface AuditFormInput {
  tools: ToolEntry[];
  teamSize: number;
  primaryUseCase: PrimaryUseCase;
}

export interface Recommendation {
  id: string;
  issue: string;
  reasoning: string;
  suggestedAction: string;
  estimatedMonthlySavings: number;
  confidence: "high" | "medium" | "low";
  category:
    | "plan-downgrade"
    | "plan-optimization"
    | "consolidation"
    | "alternative"
    | "enterprise-overkill"
    | "credits"
    | "seat-rightsizing";
  relatedTools?: AIToolId[];
}

export interface AuditResult {
  currentMonthlySpend: number;
  optimizedMonthlySpend: number;
  monthlySavings: number;
  annualSavings: number;
  recommendations: Recommendation[];
  isWellOptimized: boolean;
  showCredexCta: boolean;
  breakdown: {
    toolId: AIToolId;
    currentSpend: number;
    suggestedSpend: number;
    savings: number;
  }[];
  auditedAt: string;
}

export interface StoredAudit {
  id: string;
  slug: string;
  input_snapshot: Omit<AuditFormInput, "tools"> & {
    toolCount: number;
    toolNames: string[];
  };
  result: AuditResult;
  ai_summary: string | null;
  created_at: string;
}

export interface LeadPayload {
  email: string;
  company: string;
  role: string;
  teamSize: number;
  auditSlug?: string;
  monthlySavings?: number;
  honeypot?: string;
}
