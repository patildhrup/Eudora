"use client";

import type { AuditResult } from "@/types/audit";
import { formatCurrency } from "@/utils/format";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { motion } from "framer-motion";
import { TrendingUp, Calendar, Landmark, Coins, ArrowUpRight } from "lucide-react";

interface DetailedSummaryCardProps {
  result: AuditResult;
}

export function DetailedSummaryCard({ result }: DetailedSummaryCardProps) {
  const { monthlySavings, annualSavings, recommendations } = result;

  // Calculate projections
  const threeYearSavings = monthlySavings * 36;

  // Group savings by category
  const categorySavings = recommendations.reduce((acc, rec) => {
    const category = rec.category || "other";
    acc[category] = (acc[category] || 0) + rec.estimatedMonthlySavings;
    return acc;
  }, {} as Record<string, number>);

  // Display name mappings for categories
  const categoryNames: Record<string, string> = {
    "plan-downgrade": "Plan Downgrades",
    "plan-optimization": "Plan Optimizations",
    "consolidation": "Overlap Consolidation",
    "alternative": "Cheaper Alternatives",
    "enterprise-overkill": "Enterprise Tier Rightsizing",
    "credits": "API Committed Use / Credits",
    "seat-rightsizing": "Inactive Seat Removals",
    "other": "Other Adjustments",
  };

  const activeCategories = Object.entries(categorySavings)
    .filter(([_, value]) => value > 0)
    .sort((a, b) => b[1] - a[1]);

  return (
    <Card className="rounded-2xl border-border/80 bg-card/50 backdrop-blur-sm relative overflow-hidden">
      {/* Decorative top right golden gradient glow */}
      <div className="absolute right-0 top-0 size-32 bg-gradient-to-br from-amber-500/10 to-primary/5 blur-2xl pointer-events-none" />

      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <Landmark className="size-4.5 text-[#FF6B35]" />
          <div>
            <CardTitle className="text-base font-semibold">Financial Savings Projections</CardTitle>
            <CardDescription>Impact models projected over short, mid, and long-term horizons</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Projections Grid: 1 Month, 1 Year, 3 Years */}
        <div className="grid gap-3 grid-cols-1 sm:grid-cols-3">
          {/* 1 Month */}
          <div className="rounded-xl bg-white/[0.02] border border-border/40 p-3.5 text-center relative overflow-hidden flex flex-col justify-center min-h-[85px]">
            <div className="absolute top-1.5 left-1.5">
              <Coins className="size-3 text-zinc-400" />
            </div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">1 Month</p>
            <p className="text-xl sm:text-2xl font-black text-foreground mt-1">
              {formatCurrency(monthlySavings)}
            </p>
            <span className="text-[9px] font-medium text-emerald-400 mt-1 block">Instant liquidity</span>
          </div>

          {/* 1 Year */}
          <div className="rounded-xl bg-white/[0.02] border border-border/40 p-3.5 text-center relative overflow-hidden flex flex-col justify-center min-h-[85px]">
            <div className="absolute top-1.5 left-1.5">
              <Calendar className="size-3 text-zinc-400" />
            </div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">1 Year</p>
            <p className="text-xl sm:text-2xl font-black text-foreground mt-1">
              {formatCurrency(annualSavings)}
            </p>
            <span className="text-[9px] font-medium text-emerald-400 mt-1 block">12x annualized runrate</span>
          </div>

          {/* 3 Years (Cumulative) */}
          <div className="rounded-xl bg-gradient-to-br from-[#DD2C00]/5 to-[#FF6B35]/5 border border-[#DD2C00]/20 p-3.5 text-center relative overflow-hidden shadow-sm flex flex-col justify-center min-h-[85px]">
            <div className="absolute top-1.5 left-1.5">
              <TrendingUp className="size-3 text-[#FF6B35]" />
            </div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#FF6B35]">3 Years</p>
            <p className="text-xl sm:text-2xl font-black text-primary mt-1">
              {formatCurrency(threeYearSavings)}
            </p>
            <span className="text-[9px] font-bold text-primary mt-1 block">Cumulative savings</span>
          </div>
        </div>

        {/* Breakdown by Optimization Vectors */}
        {activeCategories.length > 0 && (
          <div className="space-y-3 pt-2 border-t border-border/40">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              Savings Breakdown by Optimization Vector
            </span>
            <div className="space-y-2">
              {activeCategories.map(([category, value]) => (
                <div
                  key={category}
                  className="flex items-center justify-between text-xs rounded-xl bg-zinc-50 dark:bg-zinc-950 px-3.5 py-2.5 border border-border/40 gap-2"
                >
                  <span className="font-semibold text-zinc-300 truncate">
                    {categoryNames[category] || category}
                  </span>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-emerald-400 font-bold">
                      -{formatCurrency(value)}/mo
                    </span>
                    <span className="text-[10px] text-muted-foreground font-medium hidden xs:inline">
                      ({Math.round((value / monthlySavings) * 100)}%)
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
