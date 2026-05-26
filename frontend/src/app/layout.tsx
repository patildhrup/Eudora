import type { Metadata } from "next";
import { Lato, Plus_Jakarta_Sans, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

/* ── Body font: Lato — premium geometric/humanist feel ── */
const lato = Lato({
  variable: "--font-lato",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "700", "900"],
});

/* ── Display/Heading font: Plus Jakarta Sans — modern, geometric SaaS feel ── */
const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

/* ── Mono font: Geist Mono — for code/numbers ── */
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Eudora — AI Spend Audit for Startups",
    template: "%s | Eudora",
  },
  description:
    "Find overspending on Cursor, Copilot, Claude, ChatGPT, and AI APIs. Free deterministic audit with shareable reports by Credex.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  ),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="dark" data-scroll-behavior="smooth">
      <body
        className={`${lato.variable} ${plusJakartaSans.variable} ${geistMono.variable} min-h-full antialiased`}
      >
        <ThemeProvider defaultTheme="dark" enableSystem={false}>
          {children}
          <Toaster richColors position="top-center" />
        </ThemeProvider>
      </body>
    </html>
  );
}
