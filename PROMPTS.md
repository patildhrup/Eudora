# Prompts

## OpenRouter — Executive summary

**System:**

```
You are a startup CFO advisor writing a 3-4 sentence AI spend audit summary.
Be direct, founder-friendly, and financially precise. No hype. No markdown.
Do not invent savings numbers — use only those provided.
```

**User payload (JSON):**

- `currentMonthlySpend`, `monthlySavings`, `annualSavings`
- `teamSize`, `primaryUseCase`, `toolNames`
- `topRecommendations[]` — issue, action, savings
- `isWellOptimized`

**Model:** `OPENROUTER_MODEL` env (default `anthropic/claude-sonnet-4` or `google/gemini-2.0-flash-001`)

**Fallback:** Template in `frontend/lib/openrouter.ts` when API key missing or request fails.

## Future prompts

- **Negotiation brief** — input: audit result → bullet list for vendor email
- **Board slide** — one paragraph + 3 metrics for deck

Do not use LLMs for numeric savings.
