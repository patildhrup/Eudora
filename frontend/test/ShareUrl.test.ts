import { describe, expect, it } from "vitest";
import { generateAuditSlug } from "../lib/slug";

describe("Audit Shareable URL and Slug Generation", () => {
  it("generates a valid, url-safe slug", () => {
    const slug = generateAuditSlug();
    expect(slug).toBeTypeOf("string");
    expect(slug.length).toBeGreaterThanOrEqual(8); // 6 random bytes converted to base64url is 8 chars
    
    // Should be base64url format (a-z, 0-9, -, _)
    expect(slug).toMatch(/^[a-z0-9_-]+$/);
  });

  it("produces unique slugs on consecutive calls", () => {
    const slugs = new Set<string>();
    for (let i = 0; i < 100; i++) {
      slugs.add(generateAuditSlug());
    }
    expect(slugs.size).toBe(100);
  });
});
