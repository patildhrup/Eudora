import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { AuditForm } from "@/components/audit/audit-form";

export const metadata = {
  title: "AI Spend Audit — Enter your stack",
  description: "Add your AI tools and monthly spend to calculate savings.",
};

export default function AuditPage() {
  return (
    <div className="flex min-h-full flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-12 sm:px-6">
        <div className="mb-10">
          <h1 className="text-3xl font-semibold tracking-tight">Your AI stack</h1>
          <p className="mt-2 text-muted-foreground">
            Enter each tool, plan, and what you actually pay monthly. Progress saves
            automatically.
          </p>
        </div>
        <AuditForm />
      </main>
      <SiteFooter />
    </div>
  );
}
