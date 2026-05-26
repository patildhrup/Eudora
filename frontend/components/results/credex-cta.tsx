import { ArrowUpRight, Sparkles, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/utils/format";
import { motion } from "framer-motion";

export function CredexCta({ monthlySavings }: { monthlySavings: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="relative overflow-hidden rounded-2xl p-[1.5px]"
      style={{
        background: "linear-gradient(135deg, #DD2C00, #a855f7, #3b82f6)",
      }}
    >
      {/* Background glow overlay */}
      <div className="absolute inset-0 bg-[#DD2C00]/10 mix-blend-overlay" />

      <Card className="rounded-[15px] border-0 bg-zinc-950/90 backdrop-blur-2xl overflow-hidden">
        <CardContent className="flex flex-col gap-6 p-6 sm:flex-row sm:items-center sm:justify-between relative">
          
          {/* Animated decorative glow orb */}
          <div className="pointer-events-none absolute right-[-50px] top-[-50px] size-48 rounded-full bg-[#DD2C00]/10 blur-3xl" />
          <div className="pointer-events-none absolute left-[20%] bottom-[-50px] size-48 rounded-full bg-indigo-500/10 blur-3xl" />

          {/* Left Block: Icon & Premium highlighted copy */}
          <div className="flex items-start gap-4 relative z-10">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#DD2C00]/20 to-[#FF6B35]/20 border border-[#DD2C00]/30 shadow-[0_0_15px_rgba(221,44,0,0.15)] text-primary">
              <Sparkles className="size-5 text-[#FF6B35]" />
            </div>
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#FF6B35]">
                  PREMIUM PARTNERSHIP
                </span>
                <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-400 border border-emerald-500/20">
                  Qualified Startups
                </span>
              </div>
              <p className="text-lg font-black tracking-tight text-white mt-1">
                You may qualify for discounted enterprise AI credits through Credex.
              </p>
              <p className="text-sm text-zinc-400 max-w-2xl leading-relaxed">
                Startups saving over <strong className="text-zinc-200">{formatCurrency(500)}/mo</strong> qualify for Eudora&apos;s direct partnership track.
                Get discounted enterprise API credits, custom billing consolidation, and active contract negotiations completely free.
              </p>
            </div>
          </div>

          {/* Right Block: CTA button */}
          <div className="shrink-0 relative z-10">
            <Button
              asChild
              className="relative h-11 overflow-hidden rounded-full px-6 font-bold text-white border-0 transition-all duration-300 hover:scale-105"
              style={{
                background: "linear-gradient(135deg, #DD2C00, #FF6B35)",
                boxShadow: "0 4px 20px rgba(221, 44, 0, 0.35)",
              }}
            >
              <a
                href="https://credex.dev?utm_source=eudora&utm_medium=audit_cta"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5"
              >
                Claim My Credits
                <ArrowUpRight className="size-4" />
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
