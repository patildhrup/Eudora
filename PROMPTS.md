# Prompts

## System prompts

- **Audit summary system prompt:**
  - "You are an operations analyst for startup software spend. Generate a short, high-confidence summary of AI tool spending inefficiencies and savings recommendations based only on supplied audit input. Do not hallucinate product names or pricing details."

- **Fallback prompt:**
  - "If the audit payload is incomplete, explain which inputs are missing and provide conservative spending guidance without claiming exact savings."

## Full LLM prompts

### Primary summarization prompt

```text
You are a spend optimization analyst.
Analyze the following startup AI audit data and return:
1. key overspend drivers
2. the most credible savings recommendation
3. monthly and annual savings range
4. one note on what to validate next.

Audit input:
- Vendors: {vendors}
- Current spend: {currentSpend}
- Active seats/users: {seats}
- Plan names: {plans}
- Billing cadence: {billing}
- Optional notes: {notes}

Answer in 4 short paragraphs with no extra marketing language.
```

### Fallback logic

- If `openrouter` returns an error or is unavailable, use a fallback prompt that produces a conservative summary from the audited savings numbers only.
- If the returned text is not vendor-specific, regenerate once with stronger instructions to cite only exact data.
- If the LLM response contains `I think`, `maybe`, or unsupported pricing claims, reject it and keep the product on a safe alternate summary.

## Why prompts were designed this way

- The prompt forces the model to stay in analyst mode rather than marketing mode.
- It explicitly asks for a conservative summary and one validation note to reduce hallucination.
- It creates structure so the result is easier to parse and uses less token budget.
- Using a fallback prompt protects the product when AI quality is variable.

## Prompt iterations that failed

1. **Too broad summary prompt**: The first prompt asked for a "recommendation and insights." It produced generic fluff like "you should evaluate your usage." That failed because it did not constrain the format.
2. **Vendor-agnostic prompt**: Asking for "common savings opportunities" resulted in non-specific advice and sometimes wrong plan names.
3. **Open-ended pricing prompt**: The model started inventing vendor pricing tiers when the audit data did not support them.

## Hallucination prevention strategy

- Keep the prompt grounded with explicit input fields and exact numbers.
- Reject AI summaries that include claims not supported by the audit payload.
- Use a fallback path that only renders numeric savings if the AI output is invalid.
- Put the summary orchestration on the backend so the user cannot modify prompts directly.
