# Metrics

## Acquisition

| Metric | Definition |
|--------|------------|
| Landing sessions | Unique visitors `/` |
| Audit starts | `/audit` views |
| Audit completions | `POST /api/audit` success |

## Activation

| Metric | Definition |
|--------|------------|
| Avg tools per audit | `tools.length` mean |
| Avg reported spend | `currentMonthlySpend` mean |
| Share created | Row in `audits` |

## Value

| Metric | Definition |
|--------|------------|
| Median monthly savings | `monthlySavings` p50 |
| % well optimized | `isWellOptimized` rate |
| % Credex eligible | `showCredexCta` rate |

## Conversion

| Metric | Definition |
|--------|------------|
| Lead submit rate | `leads` / completions |
| Email capture on modal | Lead modal submits |
| Credex clicks | Outbound `utm_source=eudora` |

## Quality

| Metric | Target |
|--------|--------|
| Lighthouse Performance | ≥ 85 |
| Lighthouse Accessibility | ≥ 90 |
| API error rate | < 1% |
| Summary fallback rate | Track when OpenRouter fails |

## Dashboard (Supabase SQL sketches)

```sql
-- Completions last 7 days
select date_trunc('day', created_at), count(*) from audits group by 1;

-- Avg savings
select avg((result->>'monthlySavings')::numeric) from audits;
```
