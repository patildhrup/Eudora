const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";

export interface SummaryContext {
  currentMonthlySpend: number;
  monthlySavings: number;
  annualSavings: number;
  teamSize: number;
  primaryUseCase: string;
  toolNames: string[];
  topRecommendations: { issue: string; action: string; savings: number }[];
  isWellOptimized: boolean;
}

const FALLBACK_SUMMARY = (ctx: SummaryContext): string => {
  if (ctx.isWellOptimized) {
    return `Your AI stack (~$${ctx.currentMonthlySpend.toLocaleString()}/mo) looks lean for a ${ctx.teamSize}-person team focused on ${ctx.primaryUseCase}. We did not find major quick wins — keep revisiting spend as you add seats or vendors.`;
  }
  return `You are spending about $${ctx.currentMonthlySpend.toLocaleString()}/mo across ${ctx.toolNames.join(", ")}. Our audit suggests roughly $${ctx.monthlySavings.toLocaleString()}/mo (~$${ctx.annualSavings.toLocaleString()}/yr) in defensible savings, mainly from plan right-sizing and reducing overlapping tools. Start with the highest-confidence recommendations this week.`;
};

export async function generateAuditSummary(ctx: SummaryContext): Promise<string> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  const model =
    process.env.OPENROUTER_MODEL ?? "google/gemini-2.0-flash-001";

  if (!apiKey) {
    return FALLBACK_SUMMARY(ctx);
  }

  const system = `You are a startup CFO advisor writing a 3-4 sentence AI spend audit summary.
Be direct, founder-friendly, and financially precise. No hype. No markdown. Do not invent savings numbers — use only those provided.`;

  const user = JSON.stringify(ctx, null, 2);

  try {
    const res = await fetch(OPENROUTER_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL ?? "https://eudora.app",
        "X-Title": "Eudora AI Spend Audit",
      },
      body: JSON.stringify({
        model,
        max_tokens: 280,
        temperature: 0.4,
        messages: [
          { role: "system", content: system },
          { role: "user", content: user },
        ],
      }),
    });

    if (!res.ok) {
      return FALLBACK_SUMMARY(ctx);
    }

    const data = (await res.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    const text = data.choices?.[0]?.message?.content?.trim();
    return text && text.length > 40 ? text : FALLBACK_SUMMARY(ctx);
  } catch {
    return FALLBACK_SUMMARY(ctx);
  }
}
