import type { AuditResult } from "@/types/audit";
import { formatCurrency } from "@/utils/format";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function RecommendationList({ result }: { result: AuditResult }) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Recommendations</h2>
      {result.recommendations.map((rec) => (
        <Card key={rec.id} className="rounded-xl">
          <CardHeader className="pb-2">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <CardTitle className="text-base font-medium">{rec.issue}</CardTitle>
              {rec.estimatedMonthlySavings > 0 && (
                <Badge variant="secondary">
                  {formatCurrency(rec.estimatedMonthlySavings)}/mo
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>{rec.reasoning}</p>
            <p className="text-foreground">
              <span className="font-medium">Action: </span>
              {rec.suggestedAction}
            </p>
            <p className="text-xs capitalize">Confidence: {rec.confidence}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
