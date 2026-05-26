"use client";

import { motion } from "framer-motion";
import { BarChart3, ClipboardList, Share2 } from "lucide-react";

const steps = [
  {
    icon: ClipboardList,
    step: "01",
    title: "Enter your stack",
    description:
      "Add each AI tool, plan, monthly spend, and seats. We persist your progress locally — no account needed.",
    gradientFrom: "#DD2C0018",
    gradientTo: "#DD2C0005",
    iconColor: "#DD2C00",
    iconBg: "#DD2C0018",
    iconBorder: "#DD2C0030",
    shadowHover: "#DD2C0025",
  },
  {
    icon: BarChart3,
    step: "02",
    title: "Get deterministic insights",
    description:
      "Our audit engine compares list pricing, overlap, and seat utilization — no black-box math, full transparency.",
    gradientFrom: "#FF6B3518",
    gradientTo: "#FF6B3505",
    iconColor: "#FF6B35",
    iconBg: "#FF6B3518",
    iconBorder: "#FF6B3530",
    shadowHover: "#FF6B3525",
  },
  {
    icon: Share2,
    step: "03",
    title: "Share & act",
    description:
      "Download a PDF, share a public link, and book Credex if savings exceed $500/mo. From messy to board-ready.",
    gradientFrom: "#FF8C4218",
    gradientTo: "#FF8C4205",
    iconColor: "#FF8C42",
    iconBg: "#FF8C4218",
    iconBorder: "#FF8C4230",
    shadowHover: "#FF8C4225",
  },
];

export function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="relative py-24 px-4 sm:px-6 overflow-hidden"
    >
      {/* Background orbs */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div
          className="absolute left-[-100px] top-1/2 h-[400px] w-[400px] -translate-y-1/2 rounded-full blur-3xl"
          style={{ background: "#DD2C000A" }}
        />
        <div
          className="absolute right-[-100px] top-1/2 h-[400px] w-[400px] -translate-y-1/2 rounded-full blur-3xl"
          style={{ background: "#FF6B350A" }}
        />
      </div>

      <div className="mx-auto max-w-6xl">
        {/* Section header */}
        <div className="text-center">
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="text-[11px] font-semibold uppercase tracking-[0.2em]"
            style={{ color: "#DD2C00" }}
          >
            How it works
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl"
          >
            From messy subscriptions to{" "}
            <span className="gradient-text">clarity in minutes</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mx-auto mt-4 max-w-xl text-muted-foreground"
          >
            Three steps from subscription sprawl to a board-ready savings
            narrative.
          </motion.p>
        </div>

        {/* Cards */}
        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 + i * 0.12 }}
              className="group relative overflow-hidden rounded-2xl p-6 backdrop-blur-sm transition-all duration-300"
              style={{
                background: `linear-gradient(135deg, ${step.gradientFrom}, ${step.gradientTo})`,
                border: "1px solid #00000010",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.boxShadow = `0 16px 48px ${step.shadowHover}`;
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
              }}
            >
              {/* Top accent line */}
              <div
                className="absolute top-0 left-6 right-6 h-px"
                style={{
                  background: `linear-gradient(90deg, transparent, ${step.iconColor}40, transparent)`,
                }}
              />

              {/* Step number watermark */}
              <span
                className="text-5xl font-black absolute top-4 right-5 leading-none select-none"
                style={{ color: `${step.iconColor}10` }}
              >
                {step.step}
              </span>

              {/* Icon */}
              <div
                className="mb-5 flex size-11 items-center justify-center rounded-xl border transition-transform duration-300 group-hover:scale-110"
                style={{
                  background: step.iconBg,
                  borderColor: step.iconBorder,
                }}
              >
                <step.icon
                  className="size-5"
                  style={{ color: step.iconColor }}
                />
              </div>

              {/* Content */}
              <h3 className="text-lg font-semibold text-foreground">
                {step.title}
              </h3>
              <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">
                {step.description}
              </p>

              {/* Hover shimmer */}
              <div className="absolute inset-0 shimmer opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
