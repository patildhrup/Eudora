# Reflection

## Hardest bug

The hardest bug was a race condition between audit persistence and summary generation. I was generating the openrouter summary before the audit record was fully committed, which intermittently caused missing audit details in the share page. Fixing it required separating the summary call into a retry-safe background step and adding a lightweight audit status field.

## Reversed decision

I reversed the early decision to keep all AI prompt generation in the frontend. It sounded simpler, but it exposed the LLM prompt and audit inputs unnecessarily. Moving prompt orchestration to the backend improved security and made the summary output easier to cache.

## Week 2 roadmap

- Add support for authenticated team workspaces and saved audit history.
- Build the first pricing import for ChatGPT, Claude, and Copilot so users can compare against current plan data automatically.
- Add audit benchmarking against startup cohorts.
- Implement a lightweight onboarding wizard for converting invoices into audit inputs.
- Add first usage-based alerting for overbudget AI spend.

## AI tool usage

I used AI tools for prompt brainstorming and high-level copy suggestions, but I manually validated every recommendation. One incorrect AI-generated suggestion that I caught was a prompt that recommended the wrong pricing tier for GitHub Copilot. I also used an AI assistant to draft the initial architecture outline, then corrected it based on actual backend implementation.

## Self-rating

I would rate this implementation a 7 out of 10. The product is functional, deployable, and grounded in real startup spend problems, but there are still gaps in pricing accuracy, workspace flows, and analytics maturity.
