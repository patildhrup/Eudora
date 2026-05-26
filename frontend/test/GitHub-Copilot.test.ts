import { describe, expect, it } from "vitest";
import { runAudit } from "../lib/audit-engine";
import type { AuditFormInput } from "@/types/audit";

const baseInput = (overrides: Partial<AuditFormInput> = {}): AuditFormInput => ({
  teamSize: 5,
  primaryUseCase: "coding",
  tools: [],
  ...overrides,
});

describe("GitHub Copilot Audit Recommendation Rules", () => {
  it("flags enterprise plan overkill for small developer headcounts", () => {
    const result = runAudit(
      baseInput({
        teamSize: 4,
        tools: [
          { toolId: "github-copilot", plan: "Enterprise", monthlySpend: 156, seatCount: 4 },
        ],
      }),
    );
    // Enterprise plan overkill for teams under 8
    expect(
      result.recommendations.some(
        (r) => r.category === "enterprise-overkill" && r.relatedTools?.includes("github-copilot"),
      ),
    ).toBe(true);
  });

  it("suggests rightsizing when reported spend is above standard list pricing", () => {
    const result = runAudit(
      baseInput({
        teamSize: 5,
        tools: [
          { toolId: "github-copilot", plan: "Business", monthlySpend: 200, seatCount: 5 },
        ],
      }),
    );
    // List price for Business is 19 * 5 = 95. 200 is way above 95.
    expect(
      result.recommendations.some(
        (r) => r.category === "seat-rightsizing" && r.relatedTools?.includes("github-copilot"),
      ),
    ).toBe(true);
  });

  it("recommends alternative editor setup or overlap reduction when Cursor and Copilot are both active", () => {
    const result = runAudit(
      baseInput({
        primaryUseCase: "coding",
        tools: [
          { toolId: "cursor", plan: "Pro", monthlySpend: 20, seatCount: 1 },
          { toolId: "github-copilot", plan: "Pro (Individual)", monthlySpend: 10, seatCount: 1 },
        ],
      }),
    );
    // Overlapping IDE/Completion check
    expect(
      result.recommendations.some(
        (r) => r.category === "consolidation" && r.relatedTools?.includes("github-copilot") && r.relatedTools?.includes("cursor"),
      ),
    ).toBe(true);
  });

  it("validates enterprise Copilot business pricing cap check for large volume teams", () => {
    const result = runAudit(
      baseInput({
        teamSize: 10,
        tools: [
          { toolId: "github-copilot", plan: "Business", monthlySpend: 300, seatCount: 10 },
        ],
      }),
    );
    // Business list is 19 * 10 = 190. Reported spend is 300.
    expect(
      result.recommendations.some(
        (r) => r.category === "plan-optimization" && r.issue.includes("Copilot Business pricing check"),
      ),
    ).toBe(true);
  });
});
