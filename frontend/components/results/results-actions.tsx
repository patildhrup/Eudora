"use client";

import { useState } from "react";
import { Copy, Download, Mail } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { LeadCaptureModal } from "./lead-capture-modal";
import type { AuditResult } from "@/types/audit";
import type { AuditFormValues } from "@/lib/validations";
import { formatCurrency } from "@/utils/format";

interface ResultsActionsProps {
  slug: string;
  result: AuditResult;
  input: AuditFormValues;
}

export function ResultsActions({ slug, result, input }: ResultsActionsProps) {
  const [leadOpen, setLeadOpen] = useState(false);
  const shareUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/share/${slug}`
      : `/share/${slug}`;

  const copyLink = async () => {
    await navigator.clipboard.writeText(shareUrl);
    toast.success("Link copied");
  };

  const downloadPdf = async () => {
    const { default: jsPDF } = await import("jspdf");
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("AI Spend Audit — Eudora", 14, 20);
    doc.setFontSize(11);
    doc.text(`Monthly savings: ${formatCurrency(result.monthlySavings)}`, 14, 32);
    doc.text(`Annual savings: ${formatCurrency(result.annualSavings)}`, 14, 40);
    doc.text(`Current spend: ${formatCurrency(result.currentMonthlySpend)}/mo`, 14, 48);
    let y = 58;
    result.recommendations.slice(0, 8).forEach((r, i) => {
      if (y > 270) return;
      doc.text(`${i + 1}. ${r.issue}`, 14, y);
      y += 8;
      const lines = doc.splitTextToSize(r.suggestedAction, 180);
      doc.setFontSize(9);
      doc.text(lines, 14, y);
      y += lines.length * 5 + 6;
      doc.setFontSize(11);
    });
    doc.save(`ai-spend-audit-${slug}.pdf`);
  };

  return (
    <>
      <div className="flex flex-wrap gap-2">
        <Button variant="outline" size="sm" className="rounded-full" onClick={copyLink}>
          <Copy className="size-4" />
          Share
        </Button>
        <Button variant="outline" size="sm" className="rounded-full" onClick={downloadPdf}>
          <Download className="size-4" />
          PDF
        </Button>
        <Button size="sm" className="rounded-full" onClick={() => setLeadOpen(true)}>
          <Mail className="size-4" />
          Email report
        </Button>
      </div>
      <LeadCaptureModal
        open={leadOpen}
        onOpenChange={setLeadOpen}
        auditSlug={slug}
        monthlySavings={result.monthlySavings}
        defaultTeamSize={input.teamSize}
      />
    </>
  );
}
