"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { AuditResult } from "@/types/audit";
import { getToolDisplayName } from "@/lib/audit-engine/pricing";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function SpendChart({ result }: { result: AuditResult }) {
  const data = result.breakdown.map((b) => ({
    name: getToolDisplayName(b.toolId).split(" ")[0],
    current: b.currentSpend,
    optimized: Math.round(b.suggestedSpend),
  }));

  return (
    <Card className="rounded-xl">
      <CardHeader>
        <CardTitle className="text-base">Spend by tool</CardTitle>
      </CardHeader>
      <CardContent className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip
              formatter={(value) => [`$${value}`, ""]}
              contentStyle={{
                borderRadius: 8,
                border: "1px solid var(--border)",
              }}
            />
            <Bar dataKey="current" name="Current" fill="oklch(0.55 0.2 280)" radius={4} />
            <Bar dataKey="optimized" name="Optimized" fill="oklch(0.65 0.15 160)" radius={4} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
