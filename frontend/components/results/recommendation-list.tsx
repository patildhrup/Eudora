import type { AuditResult, Recommendation } from "@/types/audit";
import type { AuditFormValues } from "@/lib/validations";
import { formatCurrency } from "@/utils/format";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, ArrowRight, MessageSquare, AlertCircle } from "lucide-react";
import { getToolDisplayName } from "@/lib/audit-engine/pricing";

interface RecommendationListProps {
  result: AuditResult;
  input?: AuditFormValues;
}

export function RecommendationList({ result, input }: RecommendationListProps) {
  // Helper to resolve current tool, plan, and recommended action beautifully
  const getFlowDetails = (rec: Recommendation) => {
    const toolId = rec.relatedTools?.[0];
    const toolName = toolId ? getToolDisplayName(toolId) : "AI Stack";
    
    // Find the tool entry in input snapshot if available
    const toolEntry = input?.tools?.find((t) => t.toolId === toolId);
    const currentPlan = toolEntry?.plan ?? (rec.issue.toLowerCase().includes("enterprise") ? "Enterprise" : "Team/Premium");
    
    let recommendedPlan = "";
    if (rec.category === "plan-downgrade") {
      recommendedPlan = rec.suggestedAction.match(/pro|plus|team/i)?.[0] ?? "Standard";
      // Capitalize
      recommendedPlan = recommendedPlan.charAt(0).toUpperCase() + recommendedPlan.slice(1);
    } else if (rec.category === "consolidation") {
      recommendedPlan = "Cancel Overlap";
    } else if (rec.category === "seat-rightsizing") {
      recommendedPlan = `${toolEntry ? Math.min(toolEntry.seatCount, input?.teamSize ?? 1) : "Optimized"} Seats`;
    } else if (rec.category === "enterprise-overkill") {
      recommendedPlan = "Team/Pro";
    } else {
      recommendedPlan = "Optimized";
    }

    return {
      toolName,
      currentPlan,
      recommendedPlan,
    };
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 border-b border-border/50 pb-4">
        <Sparkles className="size-5 text-primary" />
        <h2 className="text-xl font-bold tracking-tight">Step-by-Step Optimization Plan</h2>
      </div>

      <div className="grid gap-6">
        {result.recommendations.map((rec) => {
          const { toolName, currentPlan, recommendedPlan } = getFlowDetails(rec);
          
          return (
            <Card
              key={rec.id}
              className="relative overflow-hidden rounded-2xl border-border/75 bg-card/60 backdrop-blur-sm transition-all duration-300 hover:border-primary/20 hover:shadow-lg"
            >
              {/* Highlight gradient accent */}
              <div className="absolute left-0 top-0 h-full w-[4px] bg-gradient-to-b from-[#DD2C00] to-[#FF6B35]" />

              <CardContent className="p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  {/* Left Side: Tool and Flow Transition */}
                  <div className="space-y-1">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                      RECOMMENDED ACTION
                    </span>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-semibold text-foreground text-base">
                        {toolName}
                      </span>
                      <div className="inline-flex items-center gap-1.5 rounded-lg bg-muted px-2.5 py-1 text-xs text-muted-foreground border border-border/40 font-medium">
                        <span>{currentPlan}</span>
                        <ArrowRight className="size-3 text-zinc-400" />
                        <span className="text-primary font-semibold">{recommendedPlan}</span>
                      </div>
                    </div>
                  </div>

                  {/* Right Side: Savings amount pill */}
                  {rec.estimatedMonthlySavings > 0 && (
                    <div className="shrink-0">
                      <div
                        className="inline-flex items-center gap-1 rounded-xl px-4 py-2 text-sm font-bold text-white shadow-md border-0"
                        style={{
                          background: "linear-gradient(135deg, #DD2C00, #FF6B35)",
                          boxShadow: "0 4px 12px rgba(221, 44, 0, 0.2)",
                        }}
                      >
                        Save {formatCurrency(rec.estimatedMonthlySavings)}/mo
                      </div>
                    </div>
                  )}
                </div>

                {/* One-line Reasoning (Styled beautifully like a quote block) */}
                <div className="mt-4 rounded-xl bg-zinc-50 dark:bg-zinc-950 p-4 border border-border/40">
                  <div className="flex items-start gap-2.5">
                    <MessageSquare className="size-4 text-primary mt-1 shrink-0" />
                    <div>
                      <p className="text-sm text-zinc-600 dark:text-zinc-300 italic font-medium leading-relaxed">
                        &ldquo;{rec.reasoning}&rdquo;
                      </p>
                      <p className="mt-2 text-xs text-foreground font-semibold">
                        <span className="text-muted-foreground">Action Needed: </span>
                        {rec.suggestedAction}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Footer details badge */}
                <div className="mt-3 flex items-center justify-between text-[11px] text-muted-foreground">
                  <span className="capitalize">
                    Category: <strong className="text-foreground">{rec.category.replace("-", " ")}</strong>
                  </span>
                  <span className="flex items-center gap-1">
                    <AlertCircle className="size-3 text-amber-500" />
                    Confidence: <strong className="capitalize text-foreground">{rec.confidence}</strong>
                  </span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
