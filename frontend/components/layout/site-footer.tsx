import Link from "next/link";
import { Zap } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="relative border-t border-border/50 py-14 overflow-hidden">
      {/* Warm gradient background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(to top, #DD2C000A 0%, transparent 100%)",
        }}
      />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
          {/* Brand */}
          <div className="max-w-xs">
            <Link
              href="/"
              className="group inline-flex items-center gap-2.5 font-semibold"
            >
              <div
                className="flex size-7 items-center justify-center rounded-lg text-white shadow-md transition-transform duration-300 group-hover:scale-105"
                style={{
                  background: "linear-gradient(135deg, #DD2C00, #FF6B35)",
                  boxShadow: "0 4px 12px #DD2C0035",
                }}
              >
                <Zap className="size-3.5" />
              </div>
              <span className="text-foreground">Eudora</span>
            </Link>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              AI spend audits by{" "}
              <a
                href="https://credex.dev"
                className="transition-colors hover:underline underline-offset-4"
                style={{ color: "#DD2C00" }}
                target="_blank"
                rel="noopener noreferrer"
              >
                Credex
              </a>
              {" "}— procurement intelligence for startup AI stacks.
            </p>
          </div>

          {/* Links */}
          <div className="flex gap-10 text-sm">
            <div className="flex flex-col gap-2">
              <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground/50 mb-1">
                Product
              </p>
              <Link
                href="/audit"
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                Run audit
              </Link>
            </div>
            <div className="flex flex-col gap-2">
              <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground/50 mb-1">
                Company
              </p>
              <a
                href="https://credex.dev"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                Credex
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 flex flex-col gap-2 border-t border-border/40 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-muted-foreground/50">
            © {new Date().getFullYear()} Credex. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground/40">
            Built with deterministic clarity ⚡
          </p>
        </div>
      </div>
    </footer>
  );
}
