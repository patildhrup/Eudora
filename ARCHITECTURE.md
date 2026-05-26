# Architecture

## Overview

Eudora is a **Next.js App Router** application in `frontend/`. All product logic lives in a single deployable unit on Vercel.

```
frontend/
├── src/app/           # Routes, API handlers, layouts
├── components/        # UI (landing, audit, results, shadcn)
├── lib/
│   ├── audit-engine/  # Deterministic savings logic
│   ├── supabase/      # DB clients
│   ├── openrouter.ts  # AI summaries only
│   └── resend.ts      # Transactional email
├── hooks/             # localStorage form persistence
├── types/             # Shared TypeScript contracts
└── utils/             # Formatting helpers
```

## Request flows

### Audit run

1. User submits form → `POST /api/audit`
2. Rate limit check (in-memory per IP)
3. Zod validation
4. `runAudit()` — pure TypeScript, no LLM
5. Persist row in `audits` (service role) with generated slug
6. Client stores payload in `sessionStorage` → `/results?slug=…`

### AI summary

1. Results page → `POST /api/summary` with audit result JSON
2. OpenRouter chat completion (Claude/Gemini via env model)
3. Fallback template if API missing or fails
4. Optional update of `audits.ai_summary`

### Lead capture

1. Modal → `POST /api/leads` with honeypot field
2. Insert `leads` row
3. Resend notifies Credex + sends user their share link

### Public share

1. `GET /share/[slug]` — server component
2. Service role fetch from Supabase
3. OG/Twitter metadata from savings headline
4. No PII in snapshot (tool names + team size only)

## Design decisions

| Decision | Rationale |
|----------|-----------|
| Deterministic engine | Defensible savings; AI only narrates |
| Service role on server | RLS-friendly; no anon writes |
| sessionStorage for results | Fast UX; slug enables refresh/share |
| In-memory rate limit | Simple MVP; upgrade to Redis/@upstash for scale |
| Pricing catalog module | Single source for UI + engine + docs |

## Security

- Secrets server-only (`SUPABASE_SERVICE_ROLE_KEY`, `OPENROUTER_API_KEY`, `RESEND_API_KEY`)
- Honeypot on lead form
- Rate limiting on API routes
- Public audits store aggregated snapshot, not raw form PII
