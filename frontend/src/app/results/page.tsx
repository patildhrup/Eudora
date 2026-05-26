"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { SavingsHero } from "@/components/results/savings-hero";
import { SpendChart } from "@/components/results/spend-chart";
import { RecommendationList } from "@/components/results/recommendation-list";
import { CredexCta } from "@/components/results/credex-cta";
import { ResultsActions } from "@/components/results/results-actions";
import { AiSummaryCard } from "@/components/results/ai-summary-card";
import { LeadCaptureModal } from "@/components/results/lead-capture-modal";
import type { AuditResult } from "@/types/audit";
import type { AuditFormValues } from "@/lib/validations";
import { Skeleton } from "@/components/ui/skeleton";

interface AuditPayload {
  result: AuditResult;
  input: AuditFormValues;
  slug: string;
}

function ResultsContent() {
  const searchParams = useSearchParams();
  const slugParam = searchParams.get("slug");
  const [data, setData] = useState<AuditPayload | null>(null);
  const [leadOpen, setLeadOpen] = useState(false);

  useEffect(() => {
    const raw = sessionStorage.getItem("eudora-audit-result");
    if (raw) {
      try {
        setData(JSON.parse(raw) as AuditPayload);
        return;
      } catch {
        // fall through
      }
    }
    if (slugParam) {
      fetch(`/api/audit/${slugParam}`)
        .then((r) => r.json())
        .then((row) => {
          if (row?.result) {
            setData({
              slug: row.slug,
              result: row.result,
              input: {
                teamSize: row.input_snapshot?.teamSize ?? 5,
                primaryUseCase: "mixed",
                tools: [],
              },
            });
          }
        })
        .catch(() => null);
    }
  }, [slugParam]);

  useEffect(() => {
    const t = setTimeout(() => setLeadOpen(true), 8000);
    return () => clearTimeout(t);
  }, []);

  if (!data) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-40 w-full rounded-2xl" />
        <Skeleton className="h-64 w-full rounded-xl" />
      </div>
    );
  }

  const { result, input, slug } = data;

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Your audit results</h1>
          <p className="mt-1 text-muted-foreground">
            {result.isWellOptimized
              ? "Your stack looks lean — minor optimizations below."
              : "Prioritized savings based on your inputs."}
          </p>
        </div>
        <ResultsActions slug={slug} result={result} input={input} />
      </div>

      <SavingsHero result={result} />

      {result.showCredexCta && <CredexCta monthlySavings={result.monthlySavings} />}

      <div className="grid gap-6 lg:grid-cols-2">
        <SpendChart result={result} />
        <AiSummaryCard
          slug={slug}
          result={result}
          teamSize={input.teamSize}
          primaryUseCase={input.primaryUseCase}
          toolIds={input.tools.map((t) => t.toolId)}
        />
      </div>

      <RecommendationList result={result} />

      <LeadCaptureModal
        open={leadOpen}
        onOpenChange={setLeadOpen}
        auditSlug={slug}
        monthlySavings={result.monthlySavings}
        defaultTeamSize={input.teamSize}
      />
    </div>
  );
}

export default function ResultsPage() {
  return (
    <div className="flex min-h-full flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-12 sm:px-6">
        <Suspense fallback={<Skeleton className="h-40 w-full" />}>
          <ResultsContent />
        </Suspense>
      </main>
      <SiteFooter />
    </div>
  );
}
