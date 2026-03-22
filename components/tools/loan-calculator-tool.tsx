"use client";

import { useMemo, useState } from "react";
import { ToolResultCard } from "@/components/tool-result-card";

export function LoanCalculatorTool() {
  const [amount, setAmount] = useState(800000);
  const [rate, setRate] = useState(9.5);
  const [years, setYears] = useState(10);

  const result = useMemo(() => {
    const months = years * 12;
    const monthlyRate = rate / 12 / 100;
    const monthlyPayment =
      monthlyRate === 0
        ? amount / months
        : (amount * monthlyRate) / (1 - (1 + monthlyRate) ** -months);
    const totalPayment = monthlyPayment * months;
    const totalInterest = totalPayment - amount;
    return { monthlyPayment, totalPayment, totalInterest };
  }, [amount, rate, years]);

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-3">
        <input type="number" value={amount} onChange={(e) => setAmount(Number(e.target.value))} className="w-full rounded-xl border bg-transparent px-4 py-3" style={{ borderColor: "var(--border)" }} />
        <input type="number" value={rate} onChange={(e) => setRate(Number(e.target.value))} className="w-full rounded-xl border bg-transparent px-4 py-3" style={{ borderColor: "var(--border)" }} />
        <input type="number" value={years} onChange={(e) => setYears(Number(e.target.value))} className="w-full rounded-xl border bg-transparent px-4 py-3" style={{ borderColor: "var(--border)" }} />
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        <ToolResultCard icon="📅" label="Monthly Payment" value={result.monthlyPayment.toFixed(2)} />
        <ToolResultCard icon="📈" label="Total Interest" value={result.totalInterest.toFixed(2)} />
        <ToolResultCard icon="✅" label="Total Payment" value={result.totalPayment.toFixed(2)} />
      </div>
    </div>
  );
}
