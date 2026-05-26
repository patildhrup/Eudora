import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/utils/format";

export function CredexCta({ monthlySavings }: { monthlySavings: number }) {
  return (
    <Card className="rounded-xl border-indigo-500/30 bg-indigo-500/5">
      <CardContent className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-semibold">
            Save {formatCurrency(monthlySavings)}+/mo with Credex
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            At this savings level, a Credex consultant can negotiate vendor contracts,
            consolidate billing, and model API committed use — typically free for
            qualifying startups.
          </p>
        </div>
        <Button asChild className="shrink-0 rounded-full">
          <a
            href="https://credex.dev?utm_source=eudora&utm_medium=audit_cta"
            target="_blank"
            rel="noopener noreferrer"
          >
            Book consultation
            <ArrowUpRight className="size-4" />
          </a>
        </Button>
      </CardContent>
    </Card>
  );
}
