"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Plus, Trash2, ArrowRight, ArrowLeft, Check, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuditFormStorage } from "@/hooks/use-audit-form-storage";
import { auditFormSchema, type AuditFormValues } from "@/lib/validations";
import { AI_TOOL_IDS, PRIMARY_USE_CASES, type AIToolId } from "@/types/audit";
import { getToolDisplayName, TOOL_PRICING } from "@/lib/audit-engine/pricing";
import { formatCurrency } from "@/utils/format";

const toolLabels: Record<AIToolId, string> = Object.fromEntries(
  AI_TOOL_IDS.map((id) => [id, getToolDisplayName(id)]),
) as Record<AIToolId, string>;

export function AuditForm() {
  const router = useRouter();
  const { initial, hydrated, persist } = useAuditFormStorage();
  const [step, setStep] = useState(1);

  const form = useForm<AuditFormValues>({
    resolver: zodResolver(auditFormSchema),
    defaultValues: initial,
    mode: "onChange",
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "tools",
  });

  useEffect(() => {
    if (hydrated) form.reset(initial);
  }, [hydrated, initial, form]);

  useEffect(() => {
    const sub = form.watch((values) => {
      if (hydrated) persist(values as AuditFormValues);
    });
    return () => sub.unsubscribe();
  }, [form, persist, hydrated]);

  const onSubmit = async (values: AuditFormValues) => {
    try {
      const res = await fetch("/api/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Audit failed");

      sessionStorage.setItem(
        "eudora-audit-result",
        JSON.stringify({
          result: data.result,
          input: data.input,
          slug: data.slug,
        }),
      );
      router.push(`/results?slug=${data.slug}`);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Something went wrong");
    }
  };

  const plansForTool = (toolId: AIToolId) =>
    TOOL_PRICING[toolId].plans.map((p) => p.label);

  const nextStep = async () => {
    if (step === 1) {
      const isValid = await form.trigger(["teamSize", "primaryUseCase"]);
      if (isValid) setStep(2);
    } else if (step === 2) {
      const isValid = await form.trigger("tools");
      if (isValid) {
        if (!fields || fields.length === 0) {
          toast.error("Please add at least one AI tool to analyze.");
          return;
        }
        setStep(3);
      }
    }
  };

  const prevStep = () => {
    setStep((s) => Math.max(1, s - 1));
  };

  const toolsWatch = form.watch("tools") || [];
  const totalSpend = toolsWatch.reduce((acc, t) => acc + (Number(t.monthlySpend) || 0), 0);
  const totalSeats = toolsWatch.reduce((acc, t) => acc + (Number(t.seatCount) || 0), 0);

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10">
      {/* ── Progress indicator ── */}
      <div className="relative mx-auto max-w-xl pb-6">
        {/* Progress line */}
        <div className="absolute top-[20px] left-0 h-[2px] w-full -translate-y-1/2 rounded-full bg-zinc-200 dark:bg-zinc-800" />
        <motion.div
          className="absolute top-[20px] left-0 h-[2px] -translate-y-1/2 rounded-full bg-primary"
          style={{
            boxShadow: "0 0 10px var(--color-primary)",
          }}
          animate={{ width: `${((step - 1) / 2) * 100}%` }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
        />

        {/* Steps */}
        <div className="relative flex justify-between">
          {[
            { num: 1, label: "Context", desc: "Team info" },
            { num: 2, label: "AI Stack", desc: "Enter tooling" },
            { num: 3, label: "Review", desc: "Verify detail" },
          ].map((item) => {
            const isActive = step === item.num;
            const isCompleted = step > item.num;

            return (
              <div key={item.num} className="flex flex-col items-center">
                <motion.div
                  className={`flex size-10 items-center justify-center rounded-full border-2 text-sm font-semibold transition-all duration-300 z-10 ${
                    isActive
                      ? "border-primary bg-background text-primary shadow-[0_0_15px_rgba(221,44,0,0.25)]"
                      : isCompleted
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-zinc-200 bg-zinc-50 text-zinc-400 dark:border-zinc-800 dark:bg-zinc-950"
                  }`}
                  animate={isActive ? { scale: [1, 1.05, 1] } : { scale: 1 }}
                  transition={isActive ? { repeat: Infinity, duration: 2.5 } : undefined}
                >
                  {isCompleted ? <Check className="size-4" /> : item.num}
                </motion.div>
                <div className="mt-2 text-center">
                  <p className={`text-xs font-semibold ${isActive ? "text-primary" : "text-muted-foreground"}`}>
                    {item.label}
                  </p>
                  <p className="hidden text-[10px] text-muted-foreground/60 sm:block">{item.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Step content wrapper with animation ── */}
      <div className="min-h-[280px]">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step-1"
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 16 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="rounded-2xl border-border/80 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold">Tell us about your team</CardTitle>
                  <CardDescription>
                    We use these inputs to calculate custom rightsizing recommendations.
                  </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-6 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="teamSize" className="text-sm font-medium">Team size</Label>
                    <Input
                      id="teamSize"
                      type="number"
                      min={1}
                      className="h-10 rounded-lg"
                      {...form.register("teamSize", { valueAsNumber: true })}
                    />
                    {form.formState.errors.teamSize && (
                      <p className="text-xs text-destructive">{form.formState.errors.teamSize.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Primary use case</Label>
                    <Select
                      value={form.watch("primaryUseCase")}
                      onValueChange={(v) =>
                        form.setValue("primaryUseCase", v as AuditFormValues["primaryUseCase"], { shouldValidate: true })
                      }
                    >
                      <SelectTrigger className="h-10 rounded-lg">
                        <SelectValue placeholder="Select primary workload..." />
                      </SelectTrigger>
                      <SelectContent>
                        {PRIMARY_USE_CASES.map((uc) => (
                          <SelectItem key={uc} value={uc}>
                            {uc.replace("-", " ")}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {form.formState.errors.primaryUseCase && (
                      <p className="text-xs text-destructive">{form.formState.errors.primaryUseCase.message}</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step-2"
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 16 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold">Your AI Tool Inventory</h3>
                  <p className="text-xs text-muted-foreground">Add all the AI subscriptions your team pays for.</p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="rounded-full gap-1 border-primary/20 text-primary hover:bg-primary/5 transition-colors"
                  onClick={() =>
                    append({
                      toolId: "chatgpt",
                      plan: "Plus",
                      monthlySpend: 20,
                      seatCount: 1,
                    })
                  }
                >
                  <Plus className="size-3.5" />
                  Add tool
                </Button>
              </div>

              {fields.map((field, index) => (
                <motion.div
                  key={field.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Card className="relative overflow-hidden rounded-xl border-border/70 shadow-sm transition-all hover:border-border">
                    <CardContent className="grid gap-4 pt-6 sm:grid-cols-2 lg:grid-cols-5">
                      <div className="space-y-2 sm:col-span-2">
                        <Label className="text-xs font-semibold text-muted-foreground uppercase">Tool</Label>
                        <Select
                          value={form.watch(`tools.${index}.toolId`)}
                          onValueChange={(v) => {
                            const toolId = v as AIToolId;
                            form.setValue(`tools.${index}.toolId`, toolId, { shouldValidate: true });
                            const firstPlan = TOOL_PRICING[toolId].plans.find(
                              (p) => p.pricePerSeat > 0,
                            );
                            if (firstPlan) {
                              form.setValue(`tools.${index}.plan`, firstPlan.label, { shouldValidate: true });
                              form.setValue(
                                `tools.${index}.monthlySpend`,
                                firstPlan.pricePerSeat,
                                { shouldValidate: true }
                              );
                            }
                          }}
                        >
                          <SelectTrigger className="h-10 rounded-lg">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {AI_TOOL_IDS.map((id) => (
                              <SelectItem key={id} value={id}>
                                {toolLabels[id]}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs font-semibold text-muted-foreground uppercase">Plan</Label>
                        <Select
                          value={form.watch(`tools.${index}.plan`)}
                          onValueChange={(v) => form.setValue(`tools.${index}.plan`, v, { shouldValidate: true })}
                        >
                          <SelectTrigger className="h-10 rounded-lg">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {plansForTool(form.watch(`tools.${index}.toolId`)).map(
                              (plan) => (
                                <SelectItem key={plan} value={plan}>
                                  {plan}
                                </SelectItem>
                              ),
                            )}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs font-semibold text-muted-foreground uppercase">Monthly Spend ($)</Label>
                        <Input
                          type="number"
                          min={0}
                          step={1}
                          className="h-10 rounded-lg"
                          {...form.register(`tools.${index}.monthlySpend`, {
                            valueAsNumber: true,
                          })}
                        />
                        {form.formState.errors.tools?.[index]?.monthlySpend && (
                          <p className="text-xs text-destructive">
                            {form.formState.errors.tools?.[index]?.monthlySpend?.message}
                          </p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs font-semibold text-muted-foreground uppercase">Seats</Label>
                        <Input
                          type="number"
                          min={0}
                          className="h-10 rounded-lg"
                          {...form.register(`tools.${index}.seatCount`, {
                            valueAsNumber: true,
                          })}
                        />
                        {form.formState.errors.tools?.[index]?.seatCount && (
                          <p className="text-xs text-destructive">
                            {form.formState.errors.tools?.[index]?.seatCount?.message}
                          </p>
                        )}
                      </div>
                      <div className="absolute top-2 right-2 sm:static sm:flex sm:items-end sm:justify-end sm:pb-1">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="text-zinc-400 hover:text-destructive hover:bg-destructive/5 rounded-full"
                          disabled={fields.length <= 1}
                          onClick={() => remove(index)}
                          aria-label="Remove tool"
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step-3"
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 16 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <Card className="rounded-2xl border-border/80 shadow-sm overflow-hidden">
                <CardHeader className="bg-muted/10 pb-4">
                  <div className="flex items-center gap-2">
                    <Sparkles className="size-4 text-primary" />
                    <CardTitle className="text-lg">Audit Stack Summary</CardTitle>
                  </div>
                  <CardDescription>Review your inputs. We are ready to run the cost audit engine.</CardDescription>
                </CardHeader>
                <CardContent className="divide-y divide-border/60 pt-4">
                  {/* Context preview */}
                  <div className="grid gap-4 pb-4 sm:grid-cols-2">
                    <div>
                      <span className="text-xs font-semibold text-muted-foreground uppercase block">Team headcount</span>
                      <span className="text-lg font-semibold">{form.watch("teamSize")} seat(s)</span>
                    </div>
                    <div>
                      <span className="text-xs font-semibold text-muted-foreground uppercase block">Workload focus</span>
                      <span className="text-lg font-semibold capitalize">{form.watch("primaryUseCase").replace("-", " ")}</span>
                    </div>
                  </div>

                  {/* Tools preview */}
                  <div className="py-4 space-y-3">
                    <span className="text-xs font-semibold text-muted-foreground uppercase block">Tooling break down</span>
                    <div className="space-y-2">
                      {toolsWatch.map((t, idx) => (
                        <div key={idx} className="flex justify-between items-center rounded-lg bg-zinc-50 dark:bg-zinc-950 px-4 py-2 text-sm border border-border/40">
                          <div>
                            <span className="font-semibold text-foreground">{getToolDisplayName(t.toolId)}</span>
                            <span className="text-xs text-muted-foreground ml-2">({t.plan})</span>
                          </div>
                          <div className="text-right">
                            <span className="font-medium text-foreground block">{formatCurrency(t.monthlySpend)}/mo</span>
                            <span className="text-[10px] text-muted-foreground block">{t.seatCount} seat(s)</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Totals */}
                  <div className="pt-4 flex justify-between items-center text-foreground font-semibold">
                    <div>
                      <span className="text-xs font-semibold text-muted-foreground uppercase block">Aggregate summary</span>
                      <span className="text-sm text-muted-foreground">{totalSeats} licensed seats</span>
                    </div>
                    <div className="text-right">
                      <span className="text-sm text-muted-foreground uppercase block font-semibold">Total current cost</span>
                      <span className="text-2xl font-bold text-primary">{formatCurrency(totalSpend)}/mo</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Wizard Controls ── */}
      <div className="flex items-center justify-between border-t border-border/50 pt-6">
        <Button
          type="button"
          variant="ghost"
          onClick={prevStep}
          className={`rounded-full h-11 px-6 ${step === 1 ? "invisible" : ""}`}
        >
          <ArrowLeft className="mr-2 size-4" />
          Back
        </Button>

        {step < 3 ? (
          <Button
            type="button"
            onClick={nextStep}
            className="rounded-full h-11 px-8 text-white border-0 transition-transform duration-200 hover:scale-102"
            style={{
              background: "linear-gradient(135deg, #DD2C00, #FF6B35)",
            }}
          >
            Continue
            <ArrowRight className="ml-2 size-4" />
          </Button>
        ) : (
          <Button
            type="submit"
            size="lg"
            className="rounded-full h-11 px-8 text-white border-0 transition-transform duration-200 hover:scale-102"
            style={{
              background: "linear-gradient(135deg, #DD2C00, #FF6B35)",
              boxShadow: "0 4px 20px rgba(221,44,0,0.3)",
            }}
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? (
              <>
                <Loader2 className="animate-spin mr-2 size-4" />
                Auditing stack…
              </>
            ) : (
              <>
                Calculate savings
                <Check className="ml-2 size-4" />
              </>
            )}
          </Button>
        )}
      </div>
    </form>
  );
}
