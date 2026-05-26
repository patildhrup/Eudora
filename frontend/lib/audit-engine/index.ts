import type {
  AIToolId,
  AuditFormInput,
  AuditResult,
  Recommendation,
  ToolEntry,
} from "@/types/audit";
import {
  expectedMonthlyCost,
  findPlan,
  getToolDisplayName,
  TOOL_PRICING,
} from "./pricing";

const CREDEX_SAVINGS_THRESHOLD = 500;

function uid(): string {
  return `rec_${Math.random().toString(36).slice(2, 10)}`;
}

function clampSavings(amount: number, cap: number): number {
  return Math.max(0, Math.min(amount, cap));
}

/** Recommend cheaper same-vendor plan when list price is materially lower. */
function analyzePlanPricing(
  entry: ToolEntry,
  teamSize: number,
): Recommendation[] {
  const recs: Recommendation[] = [];
  const plan = findPlan(entry.toolId, entry.plan);
  const pricing = TOOL_PRICING[entry.toolId];
  const seats = Math.max(1, entry.seatCount);
  const actual = entry.monthlySpend;

  if (!plan) {
    const listEstimate = pricing.plans
      .filter((p) => !p.isEnterprise && p.pricePerSeat > 0)
      .map((p) => ({
        plan: p,
        cost: p.pricePerSeat * Math.max(seats, p.minSeats ?? 1),
      }))
      .sort((a, b) => a.cost - b.cost)[0];

    if (listEstimate && actual > listEstimate.cost * 1.25) {
      const savings = clampSavings(actual - listEstimate.cost, actual * 0.4);
      if (savings >= 5) {
        recs.push({
          id: uid(),
          issue: `${getToolDisplayName(entry.toolId)} spend exceeds typical list pricing`,
          reasoning: `You reported $${actual}/mo on "${entry.plan}" but comparable ${listEstimate.plan.label} list pricing is ~$${listEstimate.cost}/mo for ${seats} seat(s). You may be on a legacy tier, add-ons, or over-provisioned seats.`,
          suggestedAction: `Verify your invoice against ${listEstimate.plan.label} ($${listEstimate.plan.pricePerSeat}/seat). Renegotiate or downgrade if you are not using premium features.`,
          estimatedMonthlySavings: savings,
          confidence: "medium",
          category: "plan-downgrade",
          relatedTools: [entry.toolId],
        });
      }
    }
    return recs;
  }

  const listCost = expectedMonthlyCost(entry.toolId, entry.plan, seats);
  if (listCost !== null && actual > listCost * 1.2) {
    const savings = clampSavings(actual - listCost, actual * 0.35);
    if (savings >= 10) {
      recs.push({
        id: uid(),
        issue: `Reported spend above list price for ${plan.label}`,
        reasoning: `List price for ${plan.label} is approximately $${listCost}/mo (${seats} seats) but you pay $${actual}/mo — possible unused seats, regional tax, or bundled SKUs.`,
        suggestedAction: "Audit seat assignments and billing line items; remove inactive seats first.",
        estimatedMonthlySavings: savings,
        confidence: "high",
        category: "seat-rightsizing",
        relatedTools: [entry.toolId],
      });
    }
  }

  if (plan.isPremiumTier && seats === 1 && teamSize <= 3) {
    const proPlan = pricing.plans.find(
      (p) =>
        !p.isPremiumTier &&
        !p.isEnterprise &&
        p.pricePerSeat > 0 &&
        p.pricePerSeat < plan.pricePerSeat,
    );
    if (proPlan) {
      const optimized = proPlan.pricePerSeat * seats;
      const savings = clampSavings(actual - optimized, actual * 0.6);
      if (savings >= 15) {
        recs.push({
          id: uid(),
          issue: `Premium tier (${plan.label}) likely underutilized`,
          reasoning: `${plan.label} targets power users ($${plan.pricePerSeat}/mo). For a team of ${teamSize} with a single seat, ${proPlan.label} ($${proPlan.pricePerSeat}/mo) usually covers daily coding/chat workflows.`,
          suggestedAction: `Trial downgrade to ${proPlan.label} for 30 days; upgrade only if you hit rate limits consistently.`,
          estimatedMonthlySavings: savings,
          confidence: "medium",
          category: "plan-downgrade",
          relatedTools: [entry.toolId],
        });
      }
    }
  }

  if (plan.isEnterprise && teamSize < 8) {
    const teamPlan = pricing.plans.find(
      (p) => !p.isEnterprise && (p.minSeats ?? 0) >= 2 && p.pricePerSeat > 0,
    );
    const businessPlan = pricing.plans.find(
      (p) => !p.isEnterprise && !p.isPremiumTier && p.id.includes("business"),
    );
    const fallback = teamPlan ?? businessPlan ?? pricing.plans.find((p) => p.id === "pro" || p.id === "plus");
    if (fallback) {
      const optimized = fallback.pricePerSeat * Math.max(seats, fallback.minSeats ?? 1);
      const savings = clampSavings(actual - optimized, actual * 0.5);
      if (savings >= 25) {
        recs.push({
          id: uid(),
          issue: "Enterprise plan may be premature",
          reasoning: `Enterprise tiers add SSO, audit logs, and procurement overhead — valuable at scale, but teams under ~8 rarely use those controls enough to justify $${actual}/mo.`,
          suggestedAction: `Move to ${fallback.label} until you need centralized admin/compliance; revisit enterprise when headcount or compliance requirements grow.`,
          estimatedMonthlySavings: savings,
          confidence: "medium",
          category: "enterprise-overkill",
          relatedTools: [entry.toolId],
        });
      }
    }
  }

  if (seats > teamSize && plan.pricePerSeat > 0) {
    const excess = seats - teamSize;
    const savings = clampSavings(excess * plan.pricePerSeat, actual * 0.4);
    if (savings >= 10) {
      recs.push({
        id: uid(),
        issue: "More licensed seats than team size",
        reasoning: `You license ${seats} seats but reported team size ${teamSize}. Each unused seat on ${plan.label} costs ~$${plan.pricePerSeat}/mo.`,
        suggestedAction: `Remove ${excess} inactive seat(s) in your admin console this billing cycle.`,
        estimatedMonthlySavings: savings,
        confidence: "high",
        category: "seat-rightsizing",
        relatedTools: [entry.toolId],
      });
    }
  }

  if (seats >= 3 && (plan.id === "pro" || plan.id === "plus" || plan.id === "free")) {
    const teamPlan = pricing.plans.find((p) => p.id === "team" || p.id === "business");
    if (teamPlan && teamPlan.pricePerSeat > 0) {
      const currentImplied = plan.pricePerSeat > 0 ? plan.pricePerSeat * seats : actual;
      const teamCost = teamPlan.pricePerSeat * Math.max(seats, teamPlan.minSeats ?? 2);
      if (currentImplied > teamCost * 1.05) {
        const savings = clampSavings(currentImplied - teamCost, actual * 0.3);
        if (savings >= 15) {
          recs.push({
            id: uid(),
            issue: "Individual plans at team scale",
            reasoning: `With ${seats} seats, per-seat ${plan.label} pricing often exceeds centralized ${teamPlan.label} billing and admin.`,
            suggestedAction: `Consolidate to ${teamPlan.label} (~$${teamPlan.pricePerSeat}/seat) for shared billing and seat management.`,
            estimatedMonthlySavings: savings,
            confidence: "medium",
            category: "plan-optimization",
            relatedTools: [entry.toolId],
          });
        }
      }
    }
  }

  return recs;
}

function analyzeApiSpend(entry: ToolEntry): Recommendation[] {
  const pricing = TOOL_PRICING[entry.toolId];
  if (!pricing.apiSpendBands) return [];

  const band = pricing.apiSpendBands.find(
    (b) => entry.monthlySpend >= b.min && entry.monthlySpend < b.max,
  );
  if (!band || entry.monthlySpend < 20) return [];

  return [
    {
      id: uid(),
      issue: `${getToolDisplayName(entry.toolId)} usage band: ${band.label}`,
      reasoning: band.suggestion,
      suggestedAction:
        entry.monthlySpend < 50
          ? "Map workloads to a single access path (API vs chat subscription) to avoid paying twice for similar capabilities."
          : "Instrument per-workload cost and set monthly budget alerts in your provider dashboard.",
      estimatedMonthlySavings:
        entry.monthlySpend < 50 ? clampSavings(entry.monthlySpend * 0.3, 25) : 0,
      confidence: entry.monthlySpend < 50 ? "low" : "low",
      category: "credits",
      relatedTools: [entry.toolId],
    },
  ];
}

function analyzeConsolidation(
  tools: ToolEntry[],
  primaryUseCase: AuditFormInput["primaryUseCase"],
): Recommendation[] {
  const recs: Recommendation[] = [];
  const ids = new Set(tools.map((t) => t.toolId));
  const spend = (id: AIToolId) =>
    tools.filter((t) => t.toolId === id).reduce((s, t) => s + t.monthlySpend, 0);

  const chatTools = (["claude", "chatgpt", "gemini"] as AIToolId[]).filter((id) =>
    ids.has(id),
  );
  const chatSpend = chatTools.reduce((s, id) => s + spend(id), 0);
  if (chatTools.length >= 2 && chatSpend >= 40) {
    const lowest = chatTools.sort((a, b) => spend(a) - spend(b))[0];
    const others = chatTools.filter((t) => t !== lowest);
    const redundant = others.reduce((s, id) => s + spend(id), 0);
    const savings = clampSavings(redundant * 0.7, redundant);
    recs.push({
      id: uid(),
      issue: "Overlapping chat AI subscriptions",
      reasoning: `You pay for ${chatTools.map(getToolDisplayName).join(", ")} (~$${chatSpend}/mo combined). For ${primaryUseCase} workflows, one primary chat tool plus API where needed is usually sufficient.`,
      suggestedAction: `Standardize on ${getToolDisplayName(lowest)} for general work; cancel or downgrade redundant chat plans after a 2-week team trial.`,
      estimatedMonthlySavings: savings,
      confidence: "medium",
      category: "consolidation",
      relatedTools: chatTools,
    });
  }

  if (ids.has("cursor") && ids.has("windsurf")) {
    const combined = spend("cursor") + spend("windsurf");
    const cheaper = spend("cursor") <= spend("windsurf") ? "cursor" : "windsurf";
    const drop = cheaper === "cursor" ? "windsurf" : "cursor";
    const dropSpend = spend(drop as AIToolId);
    if (dropSpend > 0) {
      recs.push({
        id: uid(),
        issue: "Duplicate AI-native IDEs",
        reasoning: `Cursor and Windsurf both provide agentic coding (~$${combined}/mo). Maintaining two IDE AI stacks splits context, key management, and spend.`,
        suggestedAction: `Pick one primary IDE (${cheaper === "cursor" ? "Cursor" : "Windsurf"}) and cancel the other unless you have a documented team split (e.g., mobile vs backend).`,
        estimatedMonthlySavings: clampSavings(dropSpend, dropSpend),
        confidence: "high",
        category: "consolidation",
        relatedTools: ["cursor", "windsurf"],
      });
    }
  }

  if (
    primaryUseCase === "coding" &&
    ids.has("cursor") &&
    ids.has("github-copilot")
  ) {
    const copilotSpend = spend("github-copilot");
    if (copilotSpend > 0) {
      recs.push({
        id: uid(),
        issue: "Copilot + Cursor overlap for coding",
        reasoning:
          "Cursor includes inline completion and agents; Copilot adds overlapping completion inside VS Code/JetBrains. Many teams keep only one.",
        suggestedAction:
          "If Cursor is primary, downgrade Copilot to individual seats actually using non-Cursor editors only.",
        estimatedMonthlySavings: clampSavings(copilotSpend * 0.5, copilotSpend),
        confidence: "medium",
        category: "consolidation",
        relatedTools: ["cursor", "github-copilot"],
      });
    }
  }

  if (ids.has("openai-api") && ids.has("chatgpt") && spend("openai-api") < 80) {
    recs.push({
      id: uid(),
      issue: "ChatGPT plus light OpenAI API spend",
      reasoning: `OpenAI API at ~$${spend("openai-api")}/mo alongside ChatGPT often means prototyping on API while chat covers daily use — duplicate access paths.`,
      suggestedAction:
        "Route ad-hoc tasks through ChatGPT Team; reserve API keys for production automations only.",
      estimatedMonthlySavings: clampSavings(spend("openai-api") * 0.4, 40),
      confidence: "low",
      category: "alternative",
      relatedTools: ["openai-api", "chatgpt"],
    });
  }

  if (ids.has("anthropic-api") && ids.has("claude") && spend("anthropic-api") < 100) {
    recs.push({
      id: uid(),
      issue: "Claude subscription plus light Anthropic API",
      reasoning:
        "Sub-$100/mo API spend with active Claude seats suggests experiments could move to Pro/Team seats until production traffic justifies API.",
      suggestedAction:
        "Pause API keys for manual workflows; use Claude app for exploration. Re-enable API for shipped features only.",
      estimatedMonthlySavings: clampSavings(spend("anthropic-api") * 0.35, 35),
      confidence: "low",
      category: "alternative",
      relatedTools: ["anthropic-api", "claude"],
    });
  }

  return recs;
}

function analyzeAlternatives(tools: ToolEntry[]): Recommendation[] {
  const recs: Recommendation[] = [];
  const copilot = tools.find((t) => t.toolId === "github-copilot");
  if (copilot && copilot.monthlySpend > 0 && copilot.seatCount >= 5) {
    const listBusiness = 19 * copilot.seatCount;
    if (copilot.monthlySpend > listBusiness * 1.1) {
      recs.push({
        id: uid(),
        issue: "Copilot Business pricing check",
        reasoning: `At ${copilot.seatCount} seats, Business list is ~$${listBusiness}/mo vs your $${copilot.monthlySpend}/mo.`,
        suggestedAction:
          "Confirm all seats are on Business not Enterprise; consider Cursor Business only for engineers who need agents.",
        estimatedMonthlySavings: clampSavings(copilot.monthlySpend - listBusiness, 50),
        confidence: "medium",
        category: "plan-optimization",
        relatedTools: ["github-copilot"],
      });
    }
  }
  return recs;
}

function dedupeRecommendations(recs: Recommendation[]): Recommendation[] {
  const seen = new Set<string>();
  return recs
    .sort((a, b) => b.estimatedMonthlySavings - a.estimatedMonthlySavings)
    .filter((r) => {
      const key = `${r.category}:${r.relatedTools?.join(",") ?? ""}:${r.issue.slice(0, 40)}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return r.estimatedMonthlySavings > 0 || r.category === "credits";
    });
}

function computeOptimizedSpend(
  tools: ToolEntry[],
  recommendations: Recommendation[],
): number {
  const current = tools.reduce((s, t) => s + t.monthlySpend, 0);
  const highConfidenceSavings = recommendations
    .filter((r) => r.confidence === "high")
    .reduce((s, r) => s + r.estimatedMonthlySavings, 0);
  const mediumSavings = recommendations
    .filter((r) => r.confidence === "medium")
    .reduce((s, r) => s + r.estimatedMonthlySavings, 0);
  const totalSavings = highConfidenceSavings + mediumSavings * 0.6;
  return Math.max(current - totalSavings, current * 0.55);
}

/**
 * Deterministic audit engine — no LLM calls.
 */
export function runAudit(input: AuditFormInput): AuditResult {
  const tools = input.tools.filter((t) => t.monthlySpend > 0 || t.seatCount > 0);
  const currentMonthlySpend = tools.reduce((s, t) => s + t.monthlySpend, 0);

  let recommendations: Recommendation[] = [
    ...tools.flatMap((e) => analyzePlanPricing(e, input.teamSize)),
    ...tools.flatMap((e) => analyzeApiSpend(e)),
    ...analyzeConsolidation(tools, input.primaryUseCase),
    ...analyzeAlternatives(tools),
  ];

  recommendations = dedupeRecommendations(recommendations);

  const optimisticSavings = recommendations.reduce(
    (s, r) => s + r.estimatedMonthlySavings,
    0,
  );
  const optimizedMonthlySpend = computeOptimizedSpend(tools, recommendations);
  const monthlySavings = Math.max(0, currentMonthlySpend - optimizedMonthlySpend);
  const annualSavings = monthlySavings * 12;

  const breakdown = tools.map((t) => {
    const toolRecs = recommendations.filter((r) => r.relatedTools?.includes(t.toolId));
    const toolSavings = toolRecs.reduce((s, r) => s + r.estimatedMonthlySavings * 0.7, 0);
    return {
      toolId: t.toolId,
      currentSpend: t.monthlySpend,
      suggestedSpend: Math.max(0, t.monthlySpend - toolSavings),
      savings: Math.min(toolSavings, t.monthlySpend),
    };
  });

  const isWellOptimized =
    monthlySavings < 50 || (monthlySavings / Math.max(currentMonthlySpend, 1)) < 0.08;

  if (isWellOptimized && recommendations.length === 0) {
    recommendations = [
      {
        id: uid(),
        issue: "Stack appears well-optimized",
        reasoning:
          "Based on your inputs, we did not find high-confidence downgrades or consolidation wins. Continue monitoring seat growth and API budgets quarterly.",
        suggestedAction:
          "Re-run this audit when team size grows 25%+ or you add a new AI vendor.",
        estimatedMonthlySavings: 0,
        confidence: "high",
        category: "plan-optimization",
      },
    ];
  }

  return {
    currentMonthlySpend,
    optimizedMonthlySpend,
    monthlySavings,
    annualSavings,
    recommendations,
    isWellOptimized,
    showCredexCta: monthlySavings >= CREDEX_SAVINGS_THRESHOLD,
    breakdown,
    auditedAt: new Date().toISOString(),
  };
}

export { CREDEX_SAVINGS_THRESHOLD };
