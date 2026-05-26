"use client";

import { motion } from "framer-motion";

const tools = [
  {
    name: "ChatGPT",
    color: "#10a37f",
    bg: "rgba(16, 163, 127, 0.08)",
    border: "rgba(16, 163, 127, 0.2)",
    logo: (
      <svg className="size-4 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M21.74 11.64a4.44 4.44 0 0 0-.25-1.92 4.41 4.41 0 0 0-1.84-2.26 4.38 4.38 0 0 0-.15-2.73 4.43 4.43 0 0 0-2.31-2.33 4.43 4.43 0 0 0-2.74-.11 4.42 4.42 0 0 0-2.45-2.22 4.46 4.46 0 0 0-5.71 3.2 4.43 4.43 0 0 0-2.27 2.37 4.43 4.43 0 0 0-.1 2.73A4.42 4.42 0 0 0 2 10.7a4.42 4.42 0 0 0 .25 1.93 4.42 4.42 0 0 0 1.83 2.26 4.39 4.39 0 0 0 .16 2.73 4.43 4.43 0 0 0 2.31 2.32 4.42 4.42 0 0 0 2.74.12 4.42 4.42 0 0 0 2.45 2.21 4.46 4.46 0 0 0 5.71-3.2 4.43 4.43 0 0 0 2.27-2.36 4.42 4.42 0 0 0 .1-2.74 4.4 4.4 0 0 0 2.05-2.63zm-9.74 8.79a2.76 2.76 0 0 1-1.39-.37l.08-.05 5.56-3.21a.91.91 0 0 0 .46-.79v-7.85l2.25 1.3a.13.13 0 0 1 .07.1v6.52a2.77 2.77 0 0 1-4.04 2.45zM4.61 17.5a2.76 2.76 0 0 1-.36-1.4v-6.42a.12.12 0 0 1 .06-.11l5.59-3.23a.92.92 0 0 0 .46-.8V1.9l2.25 1.3a.14.14 0 0 1 .07.12v3.91a.93.93 0 0 0 .46.8l5.57 3.22a2.77 2.77 0 0 1-2.88 4.77l-5.59-3.22a.91.91 0 0 0-.91 0L9.4 16.03l-2.25 1.3a.14.14 0 0 1-.1-.01zM3.48 9.38a2.75 2.75 0 0 1 1.74-2.09l.01.07v6.43a.92.92 0 0 0 .46.8l5.59 3.23v2.6l-2.25-1.3a.14.14 0 0 1-.07-.11V12.5a.93.93 0 0 0-.46-.8L3.92 8.48a2.75 2.75 0 0 1-.44-.9zm14.13 6.94l-5.59 3.23a.92.92 0 0 0-.46.8v2.61l-2.25-1.3a.13.13 0 0 1-.07-.11v-6.52a2.77 2.77 0 0 1 4.04-2.45l-.08.05-5.56 3.21a.91.91 0 0 0-.46.79v7.85l2.25-1.3a.13.13 0 0 1-.07-.1z" />
      </svg>
    ),
  },
  {
    name: "Claude",
    color: "#d97706",
    bg: "rgba(217, 119, 6, 0.08)",
    border: "rgba(217, 119, 6, 0.2)",
    logo: (
      <svg className="size-4 stroke-current fill-none stroke-2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v18M3 12h18M12 3l9 9M12 3L3 12M12 21l9-9M12 21l-9 9" />
      </svg>
    ),
  },
  {
    name: "Cursor",
    color: "#a855f7",
    bg: "rgba(168, 85, 247, 0.08)",
    border: "rgba(168, 85, 247, 0.2)",
    logo: (
      <svg className="size-4 stroke-current fill-none stroke-2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5" />
      </svg>
    ),
  },
  {
    name: "GitHub Copilot",
    color: "#f43f5e",
    bg: "rgba(244, 63, 94, 0.08)",
    border: "rgba(244, 63, 94, 0.2)",
    logo: (
      <svg className="size-4 stroke-current fill-none stroke-2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13a9 9 0 019-9 9 9 0 019 9v3a3 3 0 01-3 3H6a3 3 0 01-3-3v-3z" />
      </svg>
    ),
  },
  {
    name: "Gemini",
    color: "#3b82f6",
    bg: "rgba(59, 130, 246, 0.08)",
    border: "rgba(59, 130, 246, 0.2)",
    logo: (
      <svg className="size-4 stroke-current fill-none stroke-2 animate-pulse" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 2l2.5 7.5L22 12l-7.5 2.5L12 22l-2.5-7.5L2 12l7.5-2.5z" />
      </svg>
    ),
  },
];

export function TrustBar() {
  return (
    <div className="w-full py-6 border-y border-white/5 bg-black/10 backdrop-blur-md">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <p className="text-center text-xs font-semibold uppercase tracking-widest text-muted-foreground/50 mb-4">
          Supported AI Platforms & Vendors
        </p>
        <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-6">
          {tools.map((tool) => (
            <motion.div
              key={tool.name}
              whileHover={{ scale: 1.05, y: -2 }}
              className="flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all duration-300 border backdrop-blur-sm"
              style={{
                borderColor: tool.border,
                background: tool.bg,
                color: tool.color,
                boxShadow: `0 4px 12px ${tool.color}15`,
              }}
            >
              <div className="shrink-0">{tool.logo}</div>
              <span className="text-zinc-200 text-xs sm:text-sm tracking-tight">{tool.name}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}