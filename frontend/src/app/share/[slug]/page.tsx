import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { SavingsHero } from "@/components/results/savings-hero";
import { RecommendationList } from "@/components/results/recommendation-list";
import { CredexCta } from "@/components/results/credex-cta";
import { SpendChart } from "@/components/results/spend-chart";
import type { AuditResult } from "@/types/audit";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/utils/format";

async function getAudit(slug: string) {
  try {
    const backendUrl = process.env.BACKEND_API_URL || "http://localhost:3000";
    const res = await fetch(`${backendUrl}/api/audit/${slug}`, {
      next: { revalidate: 30 }, // cache for 30s
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data as {
      slug: string;
      result: AuditResult;
      input_snapshot: { toolNames: string[]; teamSize: number };
      ai_summary: string | null;
    };
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const audit = await getAudit(slug);
  if (!audit) {
    return { title: "Audit not found" };
  }
  const savings = audit.result.monthlySavings;
  const title = `AI Spend Audit — ${formatCurrency(savings)}/mo savings`;
  const description = `Public audit: ${formatCurrency(audit.result.currentMonthlySpend)}/mo current spend, ${formatCurrency(savings)}/mo potential savings across ${audit.input_snapshot.toolNames.join(", ")}.`;

  const ogImageUrl = `${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}/api/og?slug=${slug}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      siteName: "Eudora AI Spend Audit",
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImageUrl],
    },
  };
}

export default async function SharePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const audit = await getAudit(slug);
  if (!audit) notFound();

  const { result, ai_summary } = audit;

  return (
    <div className="flex min-h-full flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-12 sm:px-6">
        <p className="mb-6 text-sm text-muted-foreground">Shared audit · No personal data</p>
        <SavingsHero result={result} />
        {result.showCredexCta && (
          <div className="mt-6">
            <CredexCta monthlySavings={result.monthlySavings} />
          </div>
        )}
        {ai_summary && (
          <p className="mt-6 rounded-xl border border-border/80 bg-muted/30 p-5 text-sm leading-relaxed text-muted-foreground">
            {ai_summary}
          </p>
        )}
        <div className="mt-8">
          <SpendChart result={result} />
        </div>
        <div className="mt-8">
          <RecommendationList result={result} />
        </div>
        <div className="mt-12 text-center">
          <Button asChild className="rounded-full">
            <Link href="/audit">Run your own audit</Link>
          </Button>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
