import { describe, expect, it } from "vitest";
import { runAudit } from "../lib/audit-engine";
import type { AuditFormInput } from "@/types/audit";

const baseInput = (overrides: Partial<AuditFormInput> = {}): AuditFormInput => ({
  teamSize: 5,
  primaryUseCase: "mixed",
  tools: [],
  ...overrides,
});

describe("OpenAI API Audit Recommendation Rules", () => {
  it("suggests consolidation of light API usage when active alongside ChatGPT Pro/Team", () => {
    const result = runAudit(
      baseInput({
        teamSize: 5,
        tools: [
          { toolId: "chatgpt", plan: "Plus", monthlySpend: 20, seatCount: 1 },
          { toolId: "openai-api", plan: "Pay-as-you-go", monthlySpend: 30, seatCount: 1 },
        ],
      }),
    );
    // Since API spend is $30/mo (under $50/mo) and ChatGPT is active, a recommendation should prompt overlap check
    expect(
      result.recommendations.some(
        (r) => r.category === "alternative" && r.relatedTools?.includes("openai-api") && r.relatedTools?.includes("chatgpt"),
      ),
    ).toBe(true);
  });

  it("handles moderate usage range and flags standard budgeting / monitoring suggestion", () => {
    const result = runAudit(
      baseInput({
        teamSize: 5,
        tools: [
          { toolId: "openai-api", plan: "Pay-as-you-go", monthlySpend: 200, seatCount: 1 },
        ],
      }),
    );
    // Moderate band is 50 to 500. It should yield a budget check recommendation.
    expect(
      result.recommendations.some(
        (r) => r.category === "credits" && r.relatedTools?.includes("openai-api") && r.reasoning.includes("Enable usage caps"),
      ),
    ).toBe(true);
  });

  it("triggers suggestions for high volume api usage", () => {
    const result = runAudit(
      baseInput({
        teamSize: 5,
        tools: [
          { toolId: "openai-api", plan: "Pay-as-you-go", monthlySpend: 1200, seatCount: 1 },
        ],
      }),
    );
    // Heavy band is >500. It should yield a volume check recommendation.
    expect(
      result.recommendations.some(
        (r) => r.category === "credits" && r.relatedTools?.includes("openai-api") && r.reasoning.includes("Evaluate reserved capacity"),
      ),
    ).toBe(true);
  });
});
