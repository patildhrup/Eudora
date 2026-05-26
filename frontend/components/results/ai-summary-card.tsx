"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { AuditResult } from "@/types/audit";
import { getToolDisplayName } from "@/lib/audit-engine/pricing";

interface AiSummaryCardProps {
  slug: string;
  result: AuditResult;
  teamSize: number;
  primaryUseCase: string;
  toolIds: string[];
}

export function AiSummaryCard({
  slug,
  result,
  teamSize,
  primaryUseCase,
  toolIds,
}: AiSummaryCardProps) {
  const [summary, setSummary] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/summary", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            slug,
            result,
            teamSize,
            primaryUseCase,
            toolNames: toolIds.map((id) =>
              getToolDisplayName(id as Parameters<typeof getToolDisplayName>[0]),
            ),
          }),
        });
        const data = await res.json();
        if (!cancelled) setSummary(data.summary ?? null);
      } catch {
        if (!cancelled) setSummary(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [slug, result, teamSize, primaryUseCase, toolIds]);

  return (
    <Card className="rounded-xl">
      <CardHeader>
        <CardTitle className="text-base">Executive summary</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="size-4 animate-spin" />
            Generating personalized summary…
          </div>
        ) : (
          <p className="text-sm leading-relaxed text-muted-foreground">
            {summary ??
              "Your stack has been analyzed. Review recommendations below for actionable next steps."}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
