# Eudora

Eudora is an AI Spend Audit platform designed for startups and growth-stage teams that want to stop wasting money on ChatGPT, Claude, Cursor, GitHub Copilot, Gemini, OpenAI API, Anthropic API and other AI subscriptions. It turns subscription data into deterministic savings recommendations and shareable audit reports so founders can act on overspend immediately.

## What it does

- Tracks AI subscription costs, user counts, and usage patterns.
- Calculates overspending using rules-based financial logic.
- Recommends cheaper plans, lower-cost alternatives, and coverage consolidation.
- Generates a personalized AI-powered summary that is ready for founders and finance teams.
- Creates shareable audit URLs and captures leads after the savings are visible.

## Features

- AI spend audit flow for startup tool stacks
- Deterministic overspend calculation engine
- Monthly and yearly savings forecasts
- Personalized audit summary generation
- Shareable, copyable audit report links
- Lead capture after insights are shown
- Supabase-backed session and audit persistence
- Resend email notifications for audit notifications
- Integration with openrouter for AI summary generation

## Tech stack

- Next.js 14+ (frontend and API routes)
- React 18+ with TypeScript
- Tailwind CSS + shadcn/ui
- Supabase (auth, database, session storage)
- Resend for transactional emails
- openrouter API for LLM summarization
- Render for deployment

## Installation

```bash
cd frontend
npm install
cd ../backend
npm install
```

## Local setup

1. Copy environment files:

```bash
cp frontend/.env.example frontend/.env.local
cp backend/.env.example backend/.env.local
```

2. Configure Supabase credentials in `backend/.env.local` and `frontend/.env.local`.
3. Configure `RESEND_API_KEY`, `OPENROUTER_API_KEY`, and `SUPABASE_URL`.
4. Run backend and frontend in parallel:

```bash
cd backend && npm run dev
cd ../frontend && npm run dev
```

5. Open `http://localhost:3000` for the app and `http://localhost:54321` for Supabase if using local emulation.

## Deployment

The app is production-ready for Render and can be deployed as two services:

- `frontend` as a static Next.js site
- `backend` as a Node API service

Deployment steps:

1. Connect the GitHub repo to Render.
2. Configure environment variables for both services.
3. Set build commands:
   - Frontend: `npm install && npm run build`
   - Backend: `npm install && npm run build`
4. Set start commands:
   - Backend: `npm run start`
   - Frontend: `npm run start`
5. Enable TLS and CDN caching for the frontend.

## Screenshots

![Audit flow](screenshots/01-audit-flow.png)

![Savings dashboard](screenshots/02-savings-dashboard.png)

![Shareable link](screenshots/03-shareable-link.png)

## Architecture overview

Eudora uses a hybrid architecture:

- Next.js handles the UI, page rendering, and API routes.
- A lightweight backend service processes audit logic, stores audits in Supabase, and orchestrates AI summary generation.
- The audit engine sits in the `frontend/audit-engine` module and is reused in server-side validation.
- Audit reports are shared through unique URLs and persisted to Supabase.

## Decisions

1. **Next.js** for full-stack page routing and API route consistency.
2. **TypeScript** across frontend and backend to avoid type drift between finance logic and UI state.
3. **Supabase** as the database because it offers hosted Postgres, auth, and edge-friendly APIs with minimal ops.
4. **openrouter** rather than vendor-specific LLM APIs to avoid lock-in and preserve flexibility.
5. **Render** over Vercel for predictable backend service deployment with custom API tooling.

## Future improvements

- Add multi-tenant billing history and team-level workspace management.
- Add automated plan reconciliation using current vendor pricing feeds.
- Add usage-based anomaly detection and spend alerts.
- Add an onboarding assistant that converts invoice data into audit inputs.
- Add benchmark comparisons for startup AI spend vs. category peers.
