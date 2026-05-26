"use client";

import { motion } from "framer-motion";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { FAQ } from "@/components/landing/faq";
import { Hero } from "@/components/landing/hero";
import { HowItWorks } from "@/components/landing/how-it-works";
import { SocialProof } from "@/components/landing/social-proof";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";

export default function HomePage() {
  return (
    <div className="flex min-h-full flex-col">
      <SiteHeader />
      <main className="flex-1">
        <Hero />
        <SocialProof />
        <HowItWorks />

        {/* ── CTA Section ── */}
        <section className="px-4 pb-28 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative mx-auto max-w-3xl overflow-hidden rounded-3xl p-12 text-center backdrop-blur-sm"
            style={{
              background:
                "linear-gradient(135deg, #DD2C0015 0%, #FF6B3508 60%, transparent 100%)",
              border: "1px solid #DD2C0025",
            }}
          >
            {/* Glow blob */}
            <div
              className="pointer-events-none absolute left-1/2 top-0 h-48 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
              style={{ background: "#DD2C0025" }}
            />
            {/* Top accent line */}
            <div
              className="absolute top-0 left-12 right-12 h-px"
              style={{
                background:
                  "linear-gradient(90deg, transparent, #DD2C0060, transparent)",
              }}
            />

            <div className="relative">
              <div
                className="mb-4 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs"
                style={{
                  border: "1px solid #DD2C0030",
                  background: "#DD2C0010",
                  color: "#FF6B35",
                }}
              >
                <Sparkles className="size-3" style={{ color: "#DD2C00" }} />
                Most teams discover 15–40% savings
              </div>

              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Ready to find your waste?
              </h2>
              <p className="mt-3 text-muted-foreground">
                Join hundreds of founders who&apos;ve audited their AI stack.
                Free, instant, no signup.
              </p>

              <Button
                asChild
                size="lg"
                className="group mt-8 h-12 rounded-full px-8 text-base font-semibold text-white border-0 transition-all duration-300 hover:scale-105"
                style={{
                  background: "linear-gradient(135deg, #DD2C00, #FF6B35)",
                  boxShadow: "0 8px 30px #DD2C0045",
                }}
              >
                <Link href="/audit">
                  Start free audit
                  <ArrowRight className="ml-2 size-4 transition-transform duration-200 group-hover:translate-x-1" />
                </Link>
              </Button>
            </div>
          </motion.div>
        </section>

        <FAQ />
      </main>
      <SiteFooter />
    </div>
  );
}
