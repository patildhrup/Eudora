import { randomBytes } from "crypto";

export function generateAuditSlug(): string {
  return randomBytes(6).toString("base64url").toLowerCase();
}
