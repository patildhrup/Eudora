import { formatCurrency } from "@/utils/format";
import type { AuditResult } from "@/types/audit";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function SavingsHero({ result }: { result: AuditResult }) {
  return (
    <Card className="overflow-hidden rounded-2xl border-violet-500/20 bg-gradient-to-br from-violet-500/10 via-background to-indigo-500/5">
      <CardContent className="p-8 sm:p-10">
        <Badge variant="secondary" className="mb-4">
          {result.isWellOptimized ? "Well optimized" : "Savings opportunity"}
        </Badge>
        <p className="text-sm text-muted-foreground">Estimated monthly savings</p>
        <p className="mt-1 text-5xl font-semibold tracking-tight sm:text-6xl">
          {formatCurrency(result.monthlySavings)}
        </p>
        <p className="mt-2 text-muted-foreground">
          {formatCurrency(result.annualSavings)}/year · Current spend{" "}
          {formatCurrency(result.currentMonthlySpend)}/mo → Optimized{" "}
          {formatCurrency(result.optimizedMonthlySpend)}/mo
        </p>
      </CardContent>
    </Card>
  );
}
