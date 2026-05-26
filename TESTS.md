# Tests

## Audit engine tests

The audit engine is the most critical part of Eudora. These tests verify the savings and recommendation logic.

| Filename | Purpose | Expected behavior | Edge cases tested |
| --- | --- | --- | --- |
| `frontend/audit-engine/audit-engine.test.ts` | Core savings rules for all vendors | Validates monthly/annual savings output for canonical input | missing optional fields, zero spend, annual vs monthly plans |
| `frontend/audit-engine/Claude-pricing.test.ts` | Claude-specific plan recommendations | Ensures Claude seat and bundle logic maps to the correct recommendation | overprovisioned seats, free tier vs paid tier |
| `frontend/audit-engine/GitHub-Copilot.test.ts` | GitHub Copilot subscription analysis | Verifies enterprise vs individual Copilot cost tradeoffs | multi-seat plans, standby seats, seat caps |
| `frontend/audit-engine/OpenAI-API.test.ts` | API usage and cost forecast | Confirms OpenAI API rate-based costs and monthly projection | burst usage, annual prepay, usage with discount |
| `frontend/audit-engine/Anthropic.test.ts` | Anthropic cost classification | Checks suggestion logic for Claude-like API and inference costs | usage-backed vs fixed subscription |
| `frontend/audit-engine/ShareUrl.test.ts` | Shareable report URL generation | Confirms slug creation and share page retrieval | duplicate slug handling, expired report fallback |

## How to run tests

From the frontend workspace:

```bash
cd frontend
npm test
```

If the repository uses Vitest, run:

```bash
cd frontend
npx vitest run
```

## Additional test cases

- Zero-dollar subscriptions: should not blow up the savings calculator.
- Missing vendor metadata: should fall back to safe “manual review” recommendations.
- Multiple vendors in one audit: should aggregate monthly and annual totals correctly.
- Shared backend validation: server-side calculations should match client-side results.
- Summary generation fallback: if openrouter fails, the audit should still return actionable savings numbers.
