"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, TrendingDown, Shield, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RightSide } from "@/components/layout/right-side";

const stats = [
  { label: "Avg. savings found", value: "32%", icon: TrendingDown },
  { label: "Audit time", value: "3 min", icon: Zap },
  { label: "Data stays private", value: "100%", icon: Shield },
];

export function Hero() {
  return (
    <section className="relative overflow-hidden px-4 pb-20 pt-12 sm:px-6 sm:pt-20">
      {/* ── Background orbs ── */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        {/* Primary warm orb */}
        <div
          className="absolute left-1/2 top-[-80px] h-[600px] w-[900px] -translate-x-1/2 rounded-full blur-3xl pulse-glow"
          style={{
            background:
              "radial-gradient(ellipse at center, #DD2C0022 0%, #FF6B3512 40%, transparent 70%)",
          }}
        />
        {/* Secondary amber accent */}
        <div
          className="absolute right-[-200px] top-[200px] h-[400px] w-[500px] rounded-full blur-3xl float-delayed"
          style={{
            background:
              "radial-gradient(ellipse at center, #FF8C4210 0%, #FF6B3508 50%, transparent 70%)",
          }}
        />
        {/* Grid overlay */}
        <div className="bg-grid absolute inset-0 opacity-40" />
        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
      </div>

      <div className="mx-auto max-w-6xl">
        <div className="grid items-center gap-12 lg:grid-cols-12">
          {/* Left Column: Headline and actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="lg:col-span-7 text-center lg:text-left flex flex-col items-center lg:items-start"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="mb-6 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-medium backdrop-blur-sm"
              style={{
                border: "1px solid #DD2C0030",
                background: "#DD2C0012",
                color: "#FF6B35",
              }}
            >
              <Sparkles className="size-3.5" style={{ color: "#DD2C00" }} />
              Free AI spend audit — takes just 3 minutes
              <span
                className="ml-1 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide"
                style={{ background: "#DD2C0025", color: "#FF6B35" }}
              >
                New
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="text-4xl font-bold leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl"
            >
              Stop{" "}
              <span className="relative inline-block">
                <span className="gradient-text">overpaying</span>
                <svg
                  className="absolute -bottom-2 left-0 w-full"
                  viewBox="0 0 200 8"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M0 6 Q50 2 100 6 Q150 10 200 6"
                    stroke="url(#underline-gradient)"
                    strokeWidth="2"
                    fill="none"
                    strokeLinecap="round"
                  />
                  <defs>
                    <linearGradient
                      id="underline-gradient"
                      x1="0"
                      x2="200"
                      y1="0"
                      y2="0"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop stopColor="#DD2C00" />
                      <stop offset="0.5" stopColor="#FF6B35" />
                      <stop offset="1" stopColor="#FF8C42" />
                    </linearGradient>
                  </defs>
                </svg>
              </span>{" "}
              for AI tools
            </motion.h1>

            {/* Sub-headline */}
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.25 }}
              className="mt-6 text-base leading-relaxed text-muted-foreground sm:text-lg max-w-xl"
            >
              Cursor, Copilot, Claude, ChatGPT, APIs, and more —{" "}
              <span className="text-foreground/90 font-medium">
                get defensible savings estimates, plan recommendations,
              </span>{" "}
              and a shareable report your board will actually read.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.35 }}
              className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row w-full lg:justify-start"
            >
              <Button
                asChild
                size="lg"
                className="group relative h-12 overflow-hidden rounded-full px-8 text-base font-semibold text-white border-0 transition-all duration-300 hover:scale-105 w-full sm:w-auto"
                style={{
                  background: "linear-gradient(135deg, #DD2C00, #FF6B35)",
                  boxShadow: "0 8px 30px #DD2C0040",
                }}
              >
                <Link href="/audit">
                  <span className="relative z-10 flex items-center gap-2">
                    Audit my stack
                    <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
                  </span>
                  <div className="absolute inset-0 shimmer opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </Link>
              </Button>
              <Button
                asChild
                variant="ghost"
                size="lg"
                className="h-12 rounded-full border border-border/60 bg-background/60 px-8 text-base backdrop-blur-sm transition-all duration-300 hover:border-primary/30 hover:bg-primary/5 w-full sm:w-auto"
              >
                <a href="#how-it-works">See how it works</a>
              </Button>
            </motion.div>

            {/* Trust line */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.45 }}
              className="mt-4 text-xs text-muted-foreground/60"
            >
              No login required · Deterministic analysis · Built by Credex
            </motion.p>
          </motion.div>

          {/* Right Column: Animated savings card */}
          <div className="lg:col-span-5 flex justify-center w-full">
            <RightSide />
          </div>
        </div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.55 }}
          className="mx-auto mt-16 grid max-w-3xl grid-cols-3 gap-4"
        >
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 + i * 0.1 }}
              className="glass-card border-gradient relative flex flex-col items-center gap-1.5 rounded-2xl p-5 text-center transition-all duration-300 hover:bg-primary/5"
            >
              <stat.icon className="size-4" style={{ color: "#DD2C00" }} />
              <p className="text-2xl font-bold text-foreground">{stat.value}</p>
              <p className="text-[11px] text-muted-foreground leading-tight">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
