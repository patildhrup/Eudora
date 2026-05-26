import { describe, expect, it } from "vitest";
import { runAudit } from "../lib/audit-engine";
import type { AuditFormInput } from "@/types/audit";

const baseInput = (overrides: Partial<AuditFormInput> = {}): AuditFormInput => ({
  teamSize: 5,
  primaryUseCase: "coding",
  tools: [],
  ...overrides,
});

describe("Core Audit Engine - General Rules", () => {
  it("calculates totals correctly for a canonical input containing multiple vendors", () => {
    const result = runAudit(
      baseInput({
        teamSize: 5,
        tools: [
          { toolId: "cursor", plan: "Pro", monthlySpend: 100, seatCount: 5 },
          { toolId: "chatgpt", plan: "Plus", monthlySpend: 100, seatCount: 5 },
        ],
      }),
    );
    expect(result.currentMonthlySpend).toBe(200);
    expect(result.annualSavings).toBe(result.monthlySavings * 12);
  });

  it("handles zero-dollar subscriptions gracefully without blowing up", () => {
    const result = runAudit(
      baseInput({
        teamSize: 5,
        tools: [
          { toolId: "cursor", plan: "Free", monthlySpend: 0, seatCount: 5 },
          { toolId: "chatgpt", plan: "Free", monthlySpend: 0, seatCount: 5 },
        ],
      }),
    );
    expect(result.currentMonthlySpend).toBe(0);
    expect(result.monthlySavings).toBe(0);
    expect(result.isWellOptimized).toBe(true);
  });

  it("handles missing vendor/plan metadata by failing back gracefully", () => {
    const result = runAudit(
      baseInput({
        teamSize: 3,
        tools: [
          { toolId: "cursor", plan: "Unknown Legacy Plan", monthlySpend: 300, seatCount: 3 },
        ],
      }),
    );
    // Should fallback to typical plan estimation check and suggest rightsizing/review
    expect(result.recommendations.length).toBeGreaterThan(0);
    expect(
      result.recommendations.some(
        (r) => r.issue.includes("exceeds typical list pricing") || r.category === "plan-downgrade",
      ),
    ).toBe(true);
  });

  it("correctly aggregates multiple overlapping vendor recommendations", () => {
    const result = runAudit(
      baseInput({
        primaryUseCase: "coding",
        tools: [
          { toolId: "cursor", plan: "Pro", monthlySpend: 100, seatCount: 5 },
          { toolId: "windsurf", plan: "Teams", monthlySpend: 150, seatCount: 5 },
        ],
      }),
    );
    // Overlapping IDE recommendation should be triggered
    expect(
      result.recommendations.some(
        (r) => r.category === "consolidation" && r.issue.toLowerCase().includes("ide"),
      ),
    ).toBe(true);
  });
});
