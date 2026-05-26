import type { AIToolId } from "@/types/audit";

/** Per-seat monthly USD. Flat plans use seats: 1. */
export interface PlanDefinition {
  id: string;
  label: string;
  pricePerSeat: number;
  minSeats?: number;
  maxSeats?: number;
  isEnterprise?: boolean;
  isPremiumTier?: boolean;
  notes?: string;
}

export interface ToolPricing {
  toolId: AIToolId;
  displayName: string;
  plans: PlanDefinition[];
  /** Typical API spend bands (USD/mo) for usage-based tools */
  apiSpendBands?: { label: string; min: number; max: number; suggestion: string }[];
}

/**
 * Public list prices as of Q2 2026. See PRICING_DATA.md for sources and refresh cadence.
 * Engine uses these for deterministic comparisons only — never inflated savings.
 */
export const TOOL_PRICING: Record<AIToolId, ToolPricing> = {
  cursor: {
    toolId: "cursor",
    displayName: "Cursor",
    plans: [
      { id: "free", label: "Free", pricePerSeat: 0 },
      { id: "pro", label: "Pro", pricePerSeat: 20 },
      { id: "business", label: "Business", pricePerSeat: 40 },
      { id: "ultra", label: "Ultra", pricePerSeat: 200, isPremiumTier: true },
    ],
  },
  "github-copilot": {
    toolId: "github-copilot",
    displayName: "GitHub Copilot",
    plans: [
      { id: "free", label: "Free", pricePerSeat: 0 },
      { id: "pro", label: "Pro (Individual)", pricePerSeat: 10 },
      { id: "business", label: "Business", pricePerSeat: 19 },
      { id: "enterprise", label: "Enterprise", pricePerSeat: 39, isEnterprise: true },
    ],
  },
  claude: {
    toolId: "claude",
    displayName: "Claude",
    plans: [
      { id: "free", label: "Free", pricePerSeat: 0 },
      { id: "pro", label: "Pro", pricePerSeat: 20 },
      { id: "max-5x", label: "Max (5x)", pricePerSeat: 100, isPremiumTier: true },
      { id: "max-20x", label: "Max (20x)", pricePerSeat: 200, isPremiumTier: true },
      { id: "team", label: "Team", pricePerSeat: 30, minSeats: 2 },
      { id: "enterprise", label: "Enterprise", pricePerSeat: 50, isEnterprise: true },
    ],
  },
  chatgpt: {
    toolId: "chatgpt",
    displayName: "ChatGPT",
    plans: [
      { id: "free", label: "Free", pricePerSeat: 0 },
      { id: "plus", label: "Plus", pricePerSeat: 20 },
      { id: "team", label: "Team", pricePerSeat: 30, minSeats: 2 },
      { id: "enterprise", label: "Enterprise", pricePerSeat: 60, isEnterprise: true },
    ],
  },
  "anthropic-api": {
    toolId: "anthropic-api",
    displayName: "Anthropic API",
    plans: [{ id: "pay-as-you-go", label: "Pay-as-you-go", pricePerSeat: 0 }],
    apiSpendBands: [
      {
        label: "Light",
        min: 0,
        max: 50,
        suggestion:
          "Under ~$50/mo API spend, a Claude Pro seat may cover ad-hoc needs vs raw API for non-production workloads.",
      },
      {
        label: "Moderate",
        min: 50,
        max: 500,
        suggestion: "Review batching, prompt caching, and Haiku/Sonnet tier routing before adding chat subscriptions.",
      },
      {
        label: "Heavy",
        min: 500,
        max: Infinity,
        suggestion:
          "At scale, negotiate committed use or volume tiers; Credex can model committed spend vs list API rates.",
      },
    ],
  },
  "openai-api": {
    toolId: "openai-api",
    displayName: "OpenAI API",
    plans: [{ id: "pay-as-you-go", label: "Pay-as-you-go", pricePerSeat: 0 }],
    apiSpendBands: [
      {
        label: "Light",
        min: 0,
        max: 50,
        suggestion:
          "Light API usage alongside ChatGPT Plus often indicates duplicate access paths — consolidate where possible.",
      },
      {
        label: "Moderate",
        min: 50,
        max: 500,
        suggestion: "Enable usage caps and review mini/nano models for classification and extraction tasks.",
      },
      {
        label: "Heavy",
        min: 500,
        max: Infinity,
        suggestion: "Evaluate reserved capacity and fine-tuned model ROI at this spend level.",
      },
    ],
  },
  gemini: {
    toolId: "gemini",
    displayName: "Gemini",
    plans: [
      { id: "free", label: "Free", pricePerSeat: 0 },
      { id: "advanced", label: "Google AI Pro / Advanced", pricePerSeat: 20 },
      { id: "business", label: "Google Workspace AI", pricePerSeat: 30, isEnterprise: true },
    ],
  },
  windsurf: {
    toolId: "windsurf",
    displayName: "Windsurf",
    plans: [
      { id: "free", label: "Free", pricePerSeat: 0 },
      { id: "pro", label: "Pro", pricePerSeat: 15 },
      { id: "teams", label: "Teams", pricePerSeat: 30, minSeats: 2 },
      { id: "enterprise", label: "Enterprise", pricePerSeat: 60, isEnterprise: true },
    ],
  },
};

export function getToolDisplayName(toolId: AIToolId): string {
  return TOOL_PRICING[toolId].displayName;
}

export function normalizePlanId(plan: string): string {
  return plan
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

export function findPlan(toolId: AIToolId, planLabel: string): PlanDefinition | undefined {
  const normalized = normalizePlanId(planLabel);
  const pricing = TOOL_PRICING[toolId];
  return (
    pricing.plans.find((p) => p.id === normalized || normalizePlanId(p.label) === normalized) ??
    pricing.plans.find((p) => normalized.includes(p.id) || p.id.includes(normalized))
  );
}

export function expectedMonthlyCost(
  toolId: AIToolId,
  planLabel: string,
  seats: number,
): number | null {
  const plan = findPlan(toolId, planLabel);
  if (!plan) return null;
  const effectiveSeats = Math.max(seats, plan.minSeats ?? 1);
  return plan.pricePerSeat * effectiveSeats;
}
