import { describe, expect, it } from "vitest";
import { runAudit } from "../lib/audit-engine";
import type { AuditFormInput } from "@/types/audit";

const baseInput = (overrides: Partial<AuditFormInput> = {}): AuditFormInput => ({
  teamSize: 5,
  primaryUseCase: "mixed",
  tools: [],
  ...overrides,
});

describe("Anthropic API Audit Recommendation Rules", () => {
  it("flags duplication when client has light Anthropic API spend alongside active Claude seats", () => {
    const result = runAudit(
      baseInput({
        teamSize: 5,
        tools: [
          { toolId: "claude", plan: "Pro", monthlySpend: 20, seatCount: 1 },
          { toolId: "anthropic-api", plan: "Pay-as-you-go", monthlySpend: 40, seatCount: 1 },
        ],
      }),
    );
    // Since API spend is $40/mo (under $100) and Claude is active, it should flag Claude subscription plus light Anthropic API
    expect(
      result.recommendations.some(
        (r) => r.category === "alternative" && r.relatedTools?.includes("anthropic-api") && r.relatedTools?.includes("claude"),
      ),
    ).toBe(true);
  });

  it("handles moderate Anthropic API spend and suggests routing optimizations", () => {
    const result = runAudit(
      baseInput({
        teamSize: 5,
        tools: [
          { toolId: "anthropic-api", plan: "Pay-as-you-go", monthlySpend: 250, seatCount: 1 },
        ],
      }),
    );
    expect(
      result.recommendations.some(
        (r) => r.category === "credits" && r.relatedTools?.includes("anthropic-api") && r.reasoning.includes("Review batching"),
      ),
    ).toBe(true);
  });

  it("handles heavy Anthropic API spend and suggests volume negotiation", () => {
    const result = runAudit(
      baseInput({
        teamSize: 5,
        tools: [
          { toolId: "anthropic-api", plan: "Pay-as-you-go", monthlySpend: 800, seatCount: 1 },
        ],
      }),
    );
    expect(
      result.recommendations.some(
        (r) => r.category === "credits" && r.relatedTools?.includes("anthropic-api") && r.reasoning.includes("negotiate committed use"),
      ),
    ).toBe(true);
  });
});
