"use client";

import { motion } from "framer-motion";
import { Sparkles, TrendingDown, ArrowRight, ShieldCheck, ArrowUpRight } from "lucide-react";

export function RightSide() {
    return (
        <div className="relative w-full max-w-md mx-auto">
            {/* Glow background effects */}
            <div
                className="absolute -inset-1 rounded-[2.5rem] bg-gradient-to-r from-[#DD2C00] to-[#FF6B35] opacity-25 blur-xl transition duration-1000 group-hover:opacity-40 animate-pulse"
                style={{ filter: "blur(10px)" }}
            />

            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="relative overflow-hidden rounded-3xl border border-white/10 bg-black/40 p-6 backdrop-blur-xl shadow-2xl"
                style={{
                    boxShadow: "0 20px 50px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
                }}
            >
                {/* Shiny reflection overlay */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none" />

                {/* Card Header */}
                <div className="flex items-center justify-between border-b border-white/5 pb-4">
                    <div className="flex items-center gap-2">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </span>
                        <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-400">
                            Live Audit Simulation
                        </span>
                    </div>
                    <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                        <ShieldCheck className="size-3 text-emerald-400" />
                        <span>Secure & Private</span>
                    </div>
                </div>

                {/* Savings visual block */}
                <div className="my-6 space-y-4">
                    <div className="flex justify-between items-center text-xs text-muted-foreground uppercase tracking-wider">
                        <span>AI Stack Cost Analysis</span>
                        <div className="flex items-center gap-1 text-[#FF6B35]">
                            <TrendingDown className="size-3.5" />
                            <span className="font-semibold">45% saved</span>
                        </div>
                    </div>

                    {/* Current vs Optimized Progress and Numbers */}
                    <div className="space-y-4">
                        {/* Before / Current */}
                        <div className="space-y-1">
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Current Spend</span>
                                <span className="font-semibold text-white">$2,140/mo</span>
                            </div>
                            <div className="h-2 w-full rounded-full bg-white/5 overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: "100%" }}
                                    transition={{ duration: 1.2, ease: "easeOut" }}
                                    className="h-full rounded-full bg-zinc-500/30"
                                />
                            </div>
                        </div>

                        {/* Transition Arrow Visual */}
                        <div className="flex justify-center my-[-4px]">
                            <div className="bg-[#DD2C00]/10 border border-[#DD2C00]/20 rounded-full p-1.5 shadow-md">
                                <motion.div
                                    animate={{ y: [0, 4, 0] }}
                                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                                >
                                    <ArrowRight className="size-3.5 text-[#FF6B35] transform rotate-90" />
                                </motion.div>
                            </div>
                        </div>

                        {/* After / Optimized */}
                        <div className="space-y-1">
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground font-medium text-emerald-400">Optimized Spend</span>
                                <span className="font-bold text-emerald-400">$1,180/mo</span>
                            </div>
                            <div className="h-2.5 w-full rounded-full bg-emerald-500/10 overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: "55%" }}
                                    transition={{ duration: 1.2, delay: 0.3, ease: "easeOut" }}
                                    className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400"
                                    style={{
                                        boxShadow: "0 0 12px oklch(0.72 0.16 150)",
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Hero Savings Highlights */}
                <div className="rounded-2xl bg-white/[0.03] border border-white/[0.05] p-4 text-center relative overflow-hidden">
                    <div className="absolute top-1 right-1">
                        <Sparkles className="size-3.5 text-amber-400 opacity-60" />
                    </div>
                    <p className="text-[11px] text-muted-foreground uppercase tracking-widest">
                        Total Annual Savings
                    </p>
                    <motion.p
                        initial={{ scale: 0.9 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.6 }}
                        className="text-3xl font-extrabold tracking-tight mt-1 bg-gradient-to-r from-white via-zinc-100 to-zinc-400 bg-clip-text text-transparent"
                    >
                        $11,520<span className="text-xs font-semibold text-muted-foreground ml-1">/year</span>
                    </motion.p>
                    <div className="mt-2 inline-flex items-center gap-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 text-[10px] text-emerald-400 font-semibold">
                        <span>$960/mo saved instantly</span>
                    </div>
                </div>

                {/* Micro audit simulation item rows */}
                <div className="mt-4 space-y-2">
                    <div className="flex justify-between items-center rounded-xl bg-white/[0.01] border border-white/[0.03] p-2.5 text-xs">
                        <div className="flex items-center gap-2">
                            <div className="size-2 rounded-full bg-[#DD2C00]" />
                            <span className="text-zinc-300">ChatGPT Overlap (5 seats)</span>
                        </div>
                        <span className="text-emerald-400 font-medium">-$120/mo</span>
                    </div>
                    <div className="flex justify-between items-center rounded-xl bg-white/[0.01] border border-white/[0.03] p-2.5 text-xs">
                        <div className="flex items-center gap-2">
                            <div className="size-2 rounded-full bg-purple-500" />
                            <span className="text-zinc-300">Cursor Rightsizing</span>
                        </div>
                        <span className="text-emerald-400 font-medium">-$240/mo</span>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}