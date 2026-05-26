import { Resend } from "resend";
import dotenv from "dotenv";

dotenv.config();

export async function sendLeadNotification(payload: {
  email: string;
  company?: string;
  role?: string;
  teamSize: number;
  monthlySavings?: number;
  auditSlug?: string;
}): Promise<{ ok: boolean; error?: string }> {
  const apiKey = process.env.RESEND_API_KEY;
  // Fallback to resend's sandbox domain email or standard email if RESEND_FROM_EMAIL is set
  const from = process.env.RESEND_FROM_EMAIL ?? "onboarding@resend.dev";
  const notify = process.env.RESEND_NOTIFY_EMAIL ?? "hello@credex.dev";

  if (!apiKey) {
    return { ok: false, error: "Resend API key not configured" };
  }

  const resend = new Resend(apiKey);
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3001";

  const companyVal = payload.company || "N/A";
  const roleVal = payload.role || "N/A";
  const companyClientText = payload.company ? ` for ${payload.company}` : "";

  try {
    // Send admin notification
    await resend.emails.send({
      from,
      to: notify,
      subject: `New AI Spend Audit lead: ${companyVal}`,
      html: `
        <h2>New lead</h2>
        <p><strong>Email:</strong> ${payload.email}</p>
        <p><strong>Company:</strong> ${companyVal}</p>
        <p><strong>Role:</strong> ${roleVal}</p>
        <p><strong>Team size:</strong> ${payload.teamSize}</p>
        <p><strong>Est. monthly savings:</strong> $${payload.monthlySavings ?? "—"}</p>
        ${payload.auditSlug ? `<p><a href="${appUrl}/share/${payload.auditSlug}">View audit</a></p>` : ""}
      `,
    });

    // Send user copy
    await resend.emails.send({
      from,
      to: payload.email,
      subject: "Your AI Spend Audit results",
      html: `
        <p>Thanks for using the AI Spend Audit.</p>
        <p>We estimated ~$${payload.monthlySavings ?? 0}/mo in potential savings${companyClientText}.</p>
        ${payload.auditSlug ? `<p><a href="${appUrl}/share/${payload.auditSlug}">View your shareable report</a></p>` : ""}
        <p>— Credex team</p>
      `,
    });

    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Send failed" };
  }
}
