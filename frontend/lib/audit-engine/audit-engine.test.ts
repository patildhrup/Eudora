import { describe, expect, it } from "vitest";
import { runAudit } from "./index";
import type { AuditFormInput } from "@/types/audit";

const baseInput = (overrides: Partial<AuditFormInput> = {}): AuditFormInput => ({
  teamSize: 5,
  primaryUseCase: "coding",
  tools: [],
  ...overrides,
});

describe("runAudit", () => {
  it("calculates total current spend from all tools", () => {
    const result = runAudit(
      baseInput({
        tools: [
          { toolId: "cursor", plan: "Pro", monthlySpend: 20, seatCount: 1 },
          { toolId: "chatgpt", plan: "Plus", monthlySpend: 20, seatCount: 1 },
        ],
      }),
    );
    expect(result.currentMonthlySpend).toBe(40);
  });

  it("flags premium tier downgrade for solo users on Cursor Ultra", () => {
    const result = runAudit(
      baseInput({
        teamSize: 2,
        tools: [
          { toolId: "cursor", plan: "Ultra", monthlySpend: 200, seatCount: 1 },
        ],
      }),
    );
    expect(result.monthlySavings).toBeGreaterThan(50);
    expect(
      result.recommendations.some((r) => r.category === "plan-downgrade"),
    ).toBe(true);
  });

  it("detects overlapping chat subscriptions", () => {
    const result = runAudit(
      baseInput({
        primaryUseCase: "writing",
        tools: [
          { toolId: "claude", plan: "Pro", monthlySpend: 20, seatCount: 1 },
          { toolId: "chatgpt", plan: "Plus", monthlySpend: 20, seatCount: 1 },
        ],
      }),
    );
    expect(
      result.recommendations.some((r) => r.category === "consolidation"),
    ).toBe(true);
  });

  it("shows Credex CTA when savings exceed threshold", () => {
    const result = runAudit(
      baseInput({
        teamSize: 3,
        tools: [
          { toolId: "cursor", plan: "Ultra", monthlySpend: 200, seatCount: 1 },
          { toolId: "windsurf", plan: "Teams", monthlySpend: 90, seatCount: 3 },
          { toolId: "claude", plan: "Max (20x)", monthlySpend: 200, seatCount: 1 },
          { toolId: "chatgpt", plan: "Plus", monthlySpend: 20, seatCount: 1 },
          { toolId: "github-copilot", plan: "Enterprise", monthlySpend: 450, seatCount: 10 },
          { toolId: "gemini", plan: "Google Workspace AI", monthlySpend: 200, seatCount: 5 },
        ],
      }),
    );
    expect(result.monthlySavings).toBeGreaterThanOrEqual(500);
    expect(result.showCredexCta).toBe(result.monthlySavings >= 500);
  });

  it("reports well-optimized stack for minimal spend", () => {
    const result = runAudit(
      baseInput({
        teamSize: 2,
        tools: [
          { toolId: "cursor", plan: "Pro", monthlySpend: 20, seatCount: 1 },
        ],
      }),
    );
    expect(result.isWellOptimized).toBe(true);
  });

  it("flags unused seats when seat count exceeds team size", () => {
    const result = runAudit(
      baseInput({
        teamSize: 3,
        tools: [
          {
            toolId: "github-copilot",
            plan: "Business",
            monthlySpend: 95,
            seatCount: 5,
          },
        ],
      }),
    );
    expect(
      result.recommendations.some((r) => r.category === "seat-rightsizing"),
    ).toBe(true);
  });
});
