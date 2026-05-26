import { describe, expect, it } from "vitest";
import { runAudit } from "../lib/audit-engine";
import type { AuditFormInput } from "@/types/audit";

const baseInput = (overrides: Partial<AuditFormInput> = {}): AuditFormInput => ({
  teamSize: 5,
  primaryUseCase: "mixed",
  tools: [],
  ...overrides,
});

describe("Claude Pricing & Recommendation Logic", () => {
  it("flags premium tier underutilization for solo users on high Max tier", () => {
    const result = runAudit(
      baseInput({
        teamSize: 1,
        tools: [
          { toolId: "claude", plan: "Max (20x)", monthlySpend: 200, seatCount: 1 },
        ],
      }),
    );
    // Solo user on Claude Max (20x) should be recommended to downgrade to Claude Pro/Team
    expect(result.monthlySavings).toBeGreaterThan(0);
    expect(
      result.recommendations.some(
        (r) => r.category === "plan-downgrade" && r.relatedTools?.includes("claude"),
      ),
    ).toBe(true);
  });

  it("suggests team plan consolidation when individual paid seats reach threshold", () => {
    const result = runAudit(
      baseInput({
        teamSize: 5,
        tools: [
          { toolId: "claude", plan: "Free", monthlySpend: 200, seatCount: 5 },
        ],
      }),
    );
    expect(
      result.recommendations.some(
        (r) => r.category === "plan-optimization" && r.issue.includes("Individual plans at team scale"),
      ),
    ).toBe(true);
  });

  it("recommends downgrading from Enterprise plan for small teams", () => {
    const result = runAudit(
      baseInput({
        teamSize: 3,
        tools: [
          { toolId: "claude", plan: "Enterprise", monthlySpend: 150, seatCount: 3 },
        ],
      }),
    );
    // Enterprise plan overkill for teams under 8
    expect(
      result.recommendations.some(
        (r) => r.category === "enterprise-overkill" && r.relatedTools?.includes("claude"),
      ),
    ).toBe(true);
  });

  it("does not flag any issues for well-provisioned paid Claude seats", () => {
    const result = runAudit(
      baseInput({
        teamSize: 5,
        tools: [
          { toolId: "claude", plan: "Team", monthlySpend: 150, seatCount: 5 },
        ],
      }),
    );
    expect(result.isWellOptimized).toBe(true);
  });
});
