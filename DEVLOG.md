# Devlog

## 2026-05-23 — Initial production scaffold

### Done

- Next.js App Router app in `frontend/` with Tailwind 4 + shadcn/ui
- Landing page (hero, social proof, how-it-works, FAQ, CTA)
- Audit form with React Hook Form + Zod + localStorage persistence
- Deterministic audit engine with pricing catalog (8 tools)
- Results page: savings hero, Recharts, recommendations, AI summary, PDF, share, lead modal
- Public share route with Open Graph metadata
- Supabase schema (`audits`, `leads`)
- API routes: audit, summary, leads, audit by slug
- OpenRouter + Resend integrations with fallbacks
- Vitest: 6 audit engine tests
- Root documentation set

### Next

- [ ] Run Lighthouse on Vercel preview; tune images/fonts
- [ ] Upstash rate limiting for multi-instance
- [ ] OG image generation (`@vercel/og`)
- [ ] Pricing data refresh automation (quarterly)
- [ ] Product Hunt assets + launch checklist (`GTM.md`)
