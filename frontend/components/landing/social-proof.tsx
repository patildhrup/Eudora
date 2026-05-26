"use client";

import { motion } from "framer-motion";

const logos = [
  { name: "YC-backed startups", emoji: "🚀" },
  { name: "Series A eng teams", emoji: "⚙️" },
  { name: "Bootstrapped SaaS", emoji: "💡" },
  { name: "Agencies", emoji: "🏢" },
  { name: "Scaleups", emoji: "📈" },
];

export function SocialProof() {
  return (
    <section className="relative border-y border-border/50 py-12 overflow-hidden">
      {/* Warm gradient bg */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(90deg, #DD2C0008 0%, transparent 40%, #FF6B3508 100%)",
        }}
      />

      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground/60"
        >
          Trusted by founders optimizing AI burn
        </motion.p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-2 gap-y-3">
          {logos.map((logo, i) => (
            <motion.div
              key={logo.name}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.07 }}
              className="flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-muted-foreground backdrop-blur-sm transition-all duration-200 hover:text-foreground"
              style={{
                border: "1px solid #DD2C0015",
                background: "#DD2C000A",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.border = "1px solid #DD2C0030";
                (e.currentTarget as HTMLDivElement).style.background = "#DD2C0015";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.border = "1px solid #DD2C0015";
                (e.currentTarget as HTMLDivElement).style.background = "#DD2C000A";
              }}
            >
              <span className="text-base">{logo.emoji}</span>
              {logo.name}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
