"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { leadSchema, type LeadFormValues } from "@/lib/validations";

interface LeadCaptureModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  auditSlug?: string;
  monthlySavings?: number;
  defaultTeamSize?: number;
}

export function LeadCaptureModal({
  open,
  onOpenChange,
  auditSlug,
  monthlySavings,
  defaultTeamSize = 5,
}: LeadCaptureModalProps) {
  const [done, setDone] = useState(false);
  const form = useForm<LeadFormValues>({
    resolver: zodResolver(leadSchema),
    defaultValues: {
      email: "",
      company: "",
      role: "",
      teamSize: defaultTeamSize,
      auditSlug,
      monthlySavings,
      honeypot: "",
    },
  });

  const onSubmit = async (values: LeadFormValues) => {
    const res = await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    if (!res.ok) {
      toast.error("Could not save — try again");
      return;
    }
    setDone(true);
    toast.success("Report sent to your inbox");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Get your full report</DialogTitle>
          <DialogDescription>
            We&apos;ll email your audit link and savings breakdown. No spam.
          </DialogDescription>
        </DialogHeader>
        {done ? (
          <p className="text-sm text-muted-foreground">Thanks — check your inbox.</p>
        ) : (
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <input
              type="text"
              className="hidden"
              tabIndex={-1}
              autoComplete="off"
              {...form.register("honeypot")}
            />
            <div className="space-y-2">
              <Label htmlFor="email">Work email</Label>
              <Input id="email" type="email" {...form.register("email")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="company">Company</Label>
              <Input id="company" {...form.register("company")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Input id="role" placeholder="CTO, VP Eng…" {...form.register("role")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="leadTeamSize">Team size</Label>
              <Input
                id="leadTeamSize"
                type="number"
                {...form.register("teamSize", { valueAsNumber: true })}
              />
            </div>
            <Button type="submit" className="w-full rounded-full" disabled={form.formState.isSubmitting}>
              Send report
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
