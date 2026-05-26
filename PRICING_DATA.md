# Eudora AI Spend Audit — Pricing Reference Data

**Last reviewed & updated:** May 2026  
**Source of truth in implementation:** [pricing.ts](file:///d:/Coding-dev/credex/Eudora/frontend/lib/audit-engine/pricing.ts)

This file contains the current public list prices used by the Eudora deterministic audit engine. Every rate card traces back to an official, verified vendor pricing page URL.

---

## 1. Cursor
- **Hobby (Free)**: **$0/seat/mo**
- **Pro**: **$20/seat/mo**
- **Business**: **$40/seat/mo**
- **Ultra**: **$200/seat/mo**
- **Official Citation**: [Cursor Pricing Page](https://www.cursor.com/pricing)

---

## 2. GitHub Copilot
- **Individual / Pro**: **$10/seat/mo**
- **Business**: **$19/seat/mo**
- **Enterprise**: **$39/seat/mo**
- **Official Citation**: [GitHub Copilot Plans & Pricing](https://github.com/features/copilot/plans)

---

## 3. Claude (Anthropic)
- **Free**: **$0/seat/mo**
- **Pro**: **$20/seat/mo**
- **Max (5x usage)**: **$100/seat/mo**
- **Max (20x usage)**: **$200/seat/mo**
- **Team**: **$30/seat/mo** (minimum 2 seats required)
- **Enterprise**: **$50/seat/mo** (estimated list)
- **Official Citations**:
  - [Claude Pro & Free Subscription Information](https://claude.ai)
  - [Claude Team Plan Pricing](https://www.anthropic.com/claude/team)
  - [Claude Enterprise Plan Pricing](https://www.anthropic.com/claude/enterprise)
  - [Claude API Direct Pricing](https://www.anthropic.com/pricing)

---

## 4. ChatGPT (OpenAI)
- **Free**: **$0/seat/mo**
- **Plus**: **$20/seat/mo**
- **Team**: **$30/seat/mo** (billed annually, or $40 monthly)
- **Enterprise**: **$60/seat/mo** (typical list negotiation point)
- **Official Citations**:
  - [ChatGPT Subscription Tiers & pricing](https://openai.com/chatgpt/pricing)
  - [OpenAI Direct API pricing](https://openai.com/pricing)

---

## 5. Gemini (Google AI)
- **Gemini Advanced / Pro**: **$20/seat/mo** (Included in Google One AI Premium Plan)
- **Gemini for Google Workspace**: **$30/seat/mo** (Gemini Enterprise) or **$20/seat/mo** (Gemini Business)
- **Official Citations**:
  - [Google One AI Premium / Gemini Advanced](https://one.google.com/explore-plan/gemini-advanced)
  - [Gemini for Google Workspace Business & Enterprise](https://workspace.google.com/solutions/ai/)

---

## 6. Windsurf (Codeium)
- **Free**: **$0/seat/mo**
- **Pro**: **$15/seat/mo**
- **Teams**: **$30/seat/mo**
- **Enterprise**: **$60/seat/mo**
- **Official Citation**: [Windsurf Pricing Page](https://codeium.com/windsurf/pricing)

---

## 7. API Products (Usage-Based)
Anthropic API and OpenAI API spend are analyzed dynamically using monthly API spend bands rather than hardcoded seat licenses:
- **Light Use**: Under $50/mo. Recommendation: Move prototype/ad-hoc workloads to standard Pro UI subscriptions.
- **Moderate Use**: $50 - $500/mo. Recommendation: Implement token caching, system prompts optimizations, and model routing.
- **Heavy Use**: Over $500/mo. Recommendation: Negotiate custom volume/committed-use tier discounts.
- **Official Citations**:
  - [Anthropic API pricing](https://www.anthropic.com/pricing)
  - [OpenAI API pricing](https://openai.com/pricing)
