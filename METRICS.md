# Metrics

## North Star metric

- Completed shareable audits per week.

This measures both product utility and viral distribution: an audit only matters if it is completed and shared.

## Input metrics

- Audit start rate
- Audit completion rate
- Share URL creation rate
- Lead capture conversion rate
- AI summary generation success rate

## Event tracking strategy

Track events with a lightweight analytics schema:

- `audit_started`
- `audit_completed`
- `share_url_created`
- `lead_submitted`
- `summary_generated`
- `email_sent`

Capture context for each event:

- vendor count
- total spend range
- industry tag (if provided)
- acquisition source

## Funnel metrics

- **Top**: visits -> audit starts
- **Middle**: audit starts -> audit completes
- **Bottom**: audit completes -> qualified leads

Benchmark assumptions:

- 12% start rate from visitors
- 40% completion for started audits
- 25% lead conversion from completed audits

## Pivot thresholds

- If audit completion falls below 30%, the flow needs a usability pivot.
- If share URLs are created on fewer than 20% of completed audits, the product is not viral enough.
- If lead capture conversion is below 10%, focus on stronger value capture and better lead framing.

## Why DAU is NOT the right metric

DAU is too broad because Eudora is not a habitual consumer app. The real value is in the one-time or periodic audit that generates qualified spending recommendations. Tracking daily active users would obscure whether users are actually finishing audits and inviting teammates.

## B2B lead generation analytics thinking

Measure the funnel with business intent in mind:

- completed audit => lead capture => follow-up call
- primary signal: audits that include a company email and spend data
- secondary signal: share link creation and revisit on audit report
- tertiary signal: email submissions for the same audit

This prioritizes quality interactions over raw traffic.
