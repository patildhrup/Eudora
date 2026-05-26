"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    q: "Is this using AI to calculate savings?",
    a: "No. All dollar estimates come from our deterministic audit engine using public list prices and your inputs. AI is only used for the optional narrative summary — the numbers are always rule-based and transparent.",
  },
  {
    q: "Which tools do you support?",
    a: "Cursor, GitHub Copilot, Claude, ChatGPT, Anthropic API, OpenAI API, Gemini, and Windsurf — with more vendors on the roadmap. We cover the full modern AI dev stack.",
  },
  {
    q: "Is my data public?",
    a: "Share links expose savings and recommendations only — no email or company name is ever shown. Full inputs stay in your browser until you submit an audit.",
  },
  {
    q: "What is Credex?",
    a: "Credex helps startups negotiate and consolidate AI vendor spend. If we find $500+/mo in savings, we'll suggest a free consultation to help you act on the findings.",
  },
  {
    q: "How accurate are the savings estimates?",
    a: "Estimates use current public pricing from each vendor and apply deterministic rules for overlap and utilization. Results are conservative by design — real savings are typically higher.",
  },
];

function FAQItem({ item, index }: { item: (typeof faqs)[0]; index: number }) {
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.07 }}
      className="group relative overflow-hidden rounded-2xl backdrop-blur-sm transition-all duration-300"
      style={{
        border: open ? "1px solid #DD2C0035" : "1px solid #00000010",
        background: open ? "#DD2C0008" : "oklch(1 0 0 / 4%)",
      }}
    >
      <button
        id={`faq-${index}`}
        className="flex w-full items-start justify-between gap-4 px-6 py-5 text-left"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
      >
        <span className="font-medium text-foreground leading-snug">{item.q}</span>
        <div
          className="mt-0.5 flex-shrink-0 flex size-6 items-center justify-center rounded-full border transition-all duration-300"
          style={
            open
              ? {
                  border: "1px solid #DD2C0060",
                  background: "#DD2C0020",
                  color: "#DD2C00",
                }
              : {
                  border: "1px solid #00000015",
                  color: "oklch(0.52 0.03 40)",
                }
          }
        >
          <ChevronDown
            className={`size-3.5 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
          />
        </div>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <p className="px-6 pb-5 text-sm leading-relaxed text-muted-foreground">
              {item.a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export function FAQ() {
  return (
    <section id="faq" className="relative py-24 px-4 sm:px-6">
      <div className="mx-auto max-w-2xl">
        {/* Section header */}
        <div className="text-center">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="text-[11px] font-semibold uppercase tracking-[0.2em]"
            style={{ color: "#DD2C00" }}
          >
            FAQ
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl"
          >
            Got questions?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-4 text-muted-foreground"
          >
            Everything you need to know before you run your first audit.
          </motion.p>
        </div>

        {/* Items */}
        <div className="mt-10 space-y-3">
          {faqs.map((item, i) => (
            <FAQItem key={item.q} item={item} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
