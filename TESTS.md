# Tests

## Audit engine (`frontend/lib/audit-engine/audit-engine.test.ts`)

Run:

```bash
cd frontend && npm test
```

| Test | Asserts |
|------|---------|
| Total spend | Sums all tool `monthlySpend` |
| Premium downgrade | Cursor Ultra → savings + plan-downgrade rec |
| Chat overlap | Claude + ChatGPT → consolidation rec |
| Credex CTA | High-waste stack → `monthlySavings >= 500` and CTA flag |
| Well optimized | Single Cursor Pro → `isWellOptimized` |
| Seat rightsizing | Copilot seats > team size → seat rec |

## Manual QA

- [ ] Submit audit with 2+ tools → results + slug
- [ ] Share URL loads without login
- [ ] Lead form honeypot blocks bots (fill hidden field → silent OK)
- [ ] Dark mode toggle on all pages
- [ ] PDF download produces file
- [ ] AI summary loads (or fallback without API key)

## CI suggestion

```yaml
- run: cd frontend && npm ci && npm test && npm run build
```
