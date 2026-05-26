"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./theme-toggle";
import { motion } from "framer-motion";
import { Zap } from "lucide-react";
import { useState, useEffect } from "react";

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -16, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "border-b border-black/8 bg-background/90 backdrop-blur-2xl shadow-lg shadow-black/10"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        {/* Logo */}
        <Link
          href="/"
          className="group flex items-center gap-2.5 font-semibold tracking-tight"
        >
          <div
            className="relative flex size-8 items-center justify-center rounded-xl text-sm font-bold text-white shadow-lg transition-all duration-300 group-hover:scale-105"
            style={{
              background: "linear-gradient(135deg, #DD2C00, #FF6B35)",
              boxShadow: "0 4px 16px #DD2C0040",
            }}
          >
            <Zap className="size-4" />
            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/20 to-transparent" />
          </div>
          <span className="text-foreground transition-colors">Eudora</span>
        </Link>

        {/* Nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {[
            { label: "How it works", href: "#how-it-works" },
            { label: "FAQ", href: "#faq" },
          ].map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="relative rounded-lg px-3 py-2 text-sm text-muted-foreground transition-all duration-200 hover:text-foreground hover:bg-primary/5"
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button
            asChild
            size="sm"
            className="relative rounded-full px-5 text-white shadow-lg border-0 transition-all duration-300 hover:scale-105"
            style={{
              background: "linear-gradient(135deg, #DD2C00, #FF6B35)",
              boxShadow: "0 4px 16px #DD2C0035",
            }}
          >
            <Link href="/audit">Start audit</Link>
          </Button>
        </div>
      </div>
    </motion.header>
  );
}
