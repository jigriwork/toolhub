"use client";

import { useMemo, useState } from "react";
import { ToolResultCard } from "@/components/tool-result-card";

export function EmiCalculatorTool() {
  const [principal, setPrincipal] = useState(500000);
  const [annualRate, setAnnualRate] = useState(10);
  const [months, setMonths] = useState(60);

  const result = useMemo(() => {
    const monthlyRate = annualRate / 12 / 100;
    const emi =
      monthlyRate === 0
        ? principal / months
        : (principal * monthlyRate * (1 + monthlyRate) ** months) /
          ((1 + monthlyRate) ** months - 1);
    const total = emi * months;
    const interest = total - principal;
    return { emi, total, interest };
  }, [principal, annualRate, months]);

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-3">
        <input type="number" value={principal} onChange={(e) => setPrincipal(Number(e.target.value))} className="w-full rounded-xl border bg-transparent px-4 py-3" style={{ borderColor: "var(--border)" }} />
        <input type="number" value={annualRate} onChange={(e) => setAnnualRate(Number(e.target.value))} className="w-full rounded-xl border bg-transparent px-4 py-3" style={{ borderColor: "var(--border)" }} />
        <input type="number" value={months} onChange={(e) => setMonths(Number(e.target.value))} className="w-full rounded-xl border bg-transparent px-4 py-3" style={{ borderColor: "var(--border)" }} />
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        <ToolResultCard icon="📆" label="Monthly EMI" value={result.emi.toFixed(2)} />
        <ToolResultCard icon="💸" label="Total Interest" value={result.interest.toFixed(2)} />
        <ToolResultCard icon="🧮" label="Total Payment" value={result.total.toFixed(2)} />
      </div>
    </div>
  );
}
