"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import type { AuditResult } from "@/types/audit";
import type { AuditFormValues } from "@/lib/validations";
import { getToolDisplayName } from "@/lib/audit-engine/pricing";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { formatCurrency } from "@/utils/format";
import { motion } from "framer-motion";
import { TrendingDown, Users, Sparkles, Award } from "lucide-react";

interface SpendingDiagnosticsProps {
  result: AuditResult;
  input?: AuditFormValues;
}

const COLORS = ["#DD2C00", "#FF6B35", "#FF8C42", "#a855f7", "#3b82f6", "#10a37f", "#f43f5e", "#d97706"];

export function SpendingDiagnostics({ result, input }: SpendingDiagnosticsProps) {
  // Calculate AI Spend Efficiency Score
  // 100 is perfectly optimized. Waste drops the score.
  const totalCurrent = result.currentMonthlySpend || 1;
  const totalSavings = result.monthlySavings || 0;
  const wastePercentage = (totalSavings / totalCurrent) * 100;
  const efficiencyScore = Math.max(0, Math.min(100, Math.round(100 - wastePercentage)));

  // Determine grade & color
  let grade = "Excellent";
  let gradeColor = "text-emerald-500 border-emerald-500/30 bg-emerald-500/5";
  let desc = "Your AI spend is highly optimized. Minimal waste detected!";

  if (efficiencyScore < 70) {
    grade = "Critical Waste";
    gradeColor = "text-red-500 border-red-500/30 bg-red-500/5";
    desc = "Significant waste found. Multiple duplicate and over-provisioned seats detected.";
  } else if (efficiencyScore < 90) {
    grade = "Needs Rightsizing";
    gradeColor = "text-amber-500 border-amber-500/30 bg-amber-500/5";
    desc = "Moderately optimized. Moderate savings available via plan rightsizing.";
  }

  // Data for Spend Allocation Pie Chart
  const pieData = result.breakdown
    .filter((b) => b.currentSpend > 0)
    .map((b) => ({
      name: getToolDisplayName(b.toolId),
      value: b.currentSpend,
    }));

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* CARD 1: AI Spend Efficiency Score & Before/After Comparison */}
      <Card className="rounded-2xl border-border/80 bg-card/50 backdrop-blur-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Award className="size-4.5 text-primary" />
            <CardTitle className="text-base font-semibold">Spend Efficiency Diagnostics</CardTitle>
          </div>
          <CardDescription>Overall score and direct before/after comparisons</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Efficiency Score Radial/Gauge Look */}
          <div className="flex items-center gap-5 rounded-2xl bg-zinc-50 dark:bg-zinc-950 p-4 border border-border/40">
            <div className="relative flex size-20 shrink-0 items-center justify-center rounded-full border-4 border-muted">
              {/* Outer stroke showing score */}
              <svg className="absolute inset-0 size-full -rotate-90">
                <circle
                  cx="36"
                  cy="36"
                  r="32"
                  className="fill-none stroke-primary"
                  strokeWidth="4"
                  strokeDasharray={`${2 * Math.PI * 32}`}
                  strokeDashoffset={`${2 * Math.PI * 32 * (1 - efficiencyScore / 100)}`}
                  transform="translate(4, 4)"
                  style={{ transition: "stroke-dashoffset 1s ease-out" }}
                />
              </svg>
              <div className="text-center">
                <span className="text-2xl font-black tracking-tighter text-foreground">{efficiencyScore}</span>
                <span className="text-[9px] text-muted-foreground block font-bold mt-[-2px]">/100</span>
              </div>
            </div>
            <div>
              <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-bold ${gradeColor}`}>
                {grade}
              </span>
              <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">{desc}</p>
            </div>
          </div>

          {/* Before vs After Horizontal Bar Chart */}
          <div className="space-y-4 pt-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              Current vs Optimized Comparison
            </span>
            <div className="space-y-3">
              {/* Current */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground font-semibold">Before (Current Stack)</span>
                  <span className="font-bold text-foreground">{formatCurrency(result.currentMonthlySpend)}/mo</span>
                </div>
                <div className="h-5 w-full rounded-lg bg-zinc-100 dark:bg-zinc-900 overflow-hidden relative">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 1 }}
                    className="h-full rounded-lg bg-zinc-500/25 flex items-center px-3"
                  />
                  <div className="absolute inset-0 flex items-center justify-between px-3 text-[10px] font-bold text-muted-foreground/80">
                    <span className="uppercase tracking-wider">Unoptimized Spend</span>
                    <span>100%</span>
                  </div>
                </div>
              </div>

              {/* Optimized */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-emerald-500 font-semibold">After (Eudora Optimized)</span>
                  <span className="font-bold text-emerald-500">{formatCurrency(result.optimizedMonthlySpend)}/mo</span>
                </div>
                <div className="h-5.5 w-full rounded-lg bg-emerald-500/5 dark:bg-emerald-500/10 overflow-hidden relative border border-emerald-500/10">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(result.optimizedMonthlySpend / totalCurrent) * 100}%` }}
                    transition={{ duration: 1, delay: 0.2 }}
                    className="h-full rounded-lg bg-gradient-to-r from-emerald-500 to-teal-400 opacity-90"
                  />
                  <div className="absolute inset-0 flex items-center justify-between px-3 text-[10px] font-bold text-emerald-500">
                    <span className="uppercase tracking-wider">Lean Stack</span>
                    <span>{Math.round((result.optimizedMonthlySpend / totalCurrent) * 100)}%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Overall Savings pill */}
            {result.monthlySavings > 0 && (
              <div className="rounded-xl bg-[#DD2C00]/5 border border-[#DD2C00]/10 p-3 flex justify-between items-center text-xs">
                <div className="flex items-center gap-1.5 text-[#FF6B35]">
                  <TrendingDown className="size-4" />
                  <span className="font-bold">Total Savings Identified</span>
                </div>
                <span className="font-black text-[#DD2C00]">
                  {formatCurrency(result.monthlySavings)}/mo ({Math.round(wastePercentage)}%)
                </span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* CARD 2: Spend Allocation (Pie Chart) & Seat Utilization Progress Bars */}
      <Card className="rounded-2xl border-border/80 bg-card/50 backdrop-blur-sm">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <Users className="size-4.5 text-primary" />
            <CardTitle className="text-base font-semibold">Seat Utilization & Allocation</CardTitle>
          </div>
          <CardDescription>AI tool breakdown and licensed seats vs headcount</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          {/* Recharts Pie Chart & Legend */}
          <div className="grid grid-cols-12 items-center gap-4">
            <div className="col-span-5 h-28 relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={25}
                    outerRadius={45}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v) => `$${v}`} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="col-span-7 flex flex-wrap gap-x-3 gap-y-1.5">
              {pieData.map((d, index) => (
                <div key={d.name} className="flex items-center gap-1.5 text-[10px]">
                  <div
                    className="size-2 rounded-full shrink-0"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <span className="text-zinc-600 dark:text-zinc-300 truncate max-w-[90px] font-medium">
                    {d.name}
                  </span>
                  <span className="text-muted-foreground font-bold">
                    ({Math.round((d.value / totalCurrent) * 100)}%)
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Seat Utilization Progress Bars */}
          <div className="space-y-3 border-t border-border/40 pt-4">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              Seat Assignments vs Team Headcount
            </span>
            <div className="space-y-3.5">
              {input?.tools?.length ? (
                input.tools.map((t, idx) => {
                  const seats = t.seatCount || 1;
                  const maxHeadcount = input.teamSize || 1;
                  
                  // Calculate utilization percentage (capped at 100%)
                  const utilization = Math.min(100, Math.round((maxHeadcount / seats) * 100));
                  const hasWaste = seats > maxHeadcount;

                  return (
                    <div key={idx} className="space-y-1 text-xs">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-zinc-300">{getToolDisplayName(t.toolId)}</span>
                        <div className="flex items-center gap-1.5">
                          <span className="text-muted-foreground text-[10px]">
                            {seats} seats / {maxHeadcount} cap
                          </span>
                          {hasWaste ? (
                            <span className="text-rose-500 font-bold text-[9px] bg-rose-500/10 px-1.5 py-0.5 rounded border border-rose-500/20">
                              {seats - maxHeadcount} Excess
                            </span>
                          ) : (
                            <span className="text-emerald-500 font-bold text-[9px] bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                              Optimal
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="h-1.5 w-full bg-zinc-100 dark:bg-zinc-900 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${utilization}%` }}
                          transition={{ duration: 0.8 }}
                          className={`h-full rounded-full ${
                            hasWaste ? "bg-amber-500" : "bg-primary"
                          }`}
                        />
                      </div>
                    </div>
                  );
                })
              ) : (
                // Shared Link placeholder/fallbacks
                <div className="space-y-2.5">
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span className="text-zinc-300">Audited AI Seat Provisioning</span>
                      <span className="text-rose-500 font-bold text-[9px] bg-rose-500/10 px-1 py-0.5 rounded">Excess Detected</span>
                    </div>
                    <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                      <div className="h-full bg-amber-500 w-[60%]" />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
