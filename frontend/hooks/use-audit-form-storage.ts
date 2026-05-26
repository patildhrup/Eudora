"use client";

import { useCallback, useEffect, useState } from "react";
import type { AuditFormValues } from "@/lib/validations";

const STORAGE_KEY = "eudora-audit-form-v1";

const defaultValues: AuditFormValues = {
  teamSize: 5,
  primaryUseCase: "coding",
  tools: [
    { toolId: "cursor", plan: "Pro", monthlySpend: 20, seatCount: 1 },
  ],
};

export function useAuditFormStorage() {
  const [initial, setInitial] = useState<AuditFormValues>(defaultValues);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        setInitial(JSON.parse(raw) as AuditFormValues);
      }
    } catch {
      // ignore corrupt storage
    }
    setHydrated(true);
  }, []);

  const persist = useCallback((values: AuditFormValues) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(values));
    } catch {
      // quota exceeded
    }
  }, []);

  const clear = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return { initial, hydrated, persist, clear, defaultValues };
}
