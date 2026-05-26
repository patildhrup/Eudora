"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./theme-toggle";
import { motion, AnimatePresence } from "framer-motion";
import { Asterisk, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const isHome = pathname === "/";

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on path changes
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const navItems = [
    { label: "Home", href: "/" },
    { label: "How it works", href: isHome ? "#how-it-works" : "/#how-it-works" },
    { label: "FAQ", href: isHome ? "#faq" : "/#faq" },
  ];

  return (
    <motion.header
      initial={{ y: -16, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled || mobileOpen
          ? "border-b border-black/8 bg-background/95 backdrop-blur-2xl shadow-lg shadow-black/10"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 relative z-50">
        {/* Left Side: Logo */}
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
            <Asterisk className="size-4" />
            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/20 to-transparent" />
          </div>
          <span className="text-foreground transition-colors">Eudora</span>
          <i className="text-primary text-sm font-semibold">Insights</i>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href.replace(/#.*$/, "")) &&
                  item.href === pathname;
            return (
              <Link
                key={item.label}
                href={item.href}
                className={`relative rounded-lg px-3 py-2 text-sm transition-all duration-200 hover:text-foreground hover:bg-primary/5 ${
                  isActive ? "text-foreground font-semibold" : "text-muted-foreground"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button
            asChild
            size="sm"
            className="hidden sm:inline-flex relative rounded-full px-5 text-white shadow-lg border-0 transition-all duration-300 hover:scale-105"
            style={{
              background: "linear-gradient(135deg, #DD2C00, #FF6B35)",
              boxShadow: "0 4px 16px #DD2C0035",
            }}
          >
            <Link href="/audit">Start audit</Link>
          </Button>

          {/* Mobile Menu Trigger Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="rounded-full md:hidden text-muted-foreground hover:text-foreground hover:bg-primary/5 size-9"
            aria-label="Toggle mobile menu"
          >
            {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Drawer Dropdown Panel */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="md:hidden border-b border-border bg-background/95 backdrop-blur-2xl overflow-hidden shadow-inner absolute top-full left-0 w-full z-40"
          >
            <div className="flex flex-col gap-2 px-4 py-6">
              {navItems.map((item) => {
                const isActive =
                  item.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(item.href.replace(/#.*$/, "")) &&
                      item.href === pathname;
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    className={`block rounded-lg px-4 py-3 text-base transition-all duration-200 hover:bg-primary/5 ${
                      isActive
                        ? "text-primary bg-primary/5 font-bold"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
              
              <div className="pt-4 mt-2 border-t border-border/50">
                <Button
                  asChild
                  className="w-full relative h-11 rounded-full text-white border-0 font-bold"
                  style={{
                    background: "linear-gradient(135deg, #DD2C00, #FF6B35)",
                  }}
                >
                  <Link href="/audit">Start free audit</Link>
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
