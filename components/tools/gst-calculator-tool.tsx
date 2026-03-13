"use client";

import { useMemo, useState } from "react";
import { ToolResultCard } from "@/components/tool-result-card";

export function GstCalculatorTool() {
  const [amount, setAmount] = useState(1000);
  const [rate, setRate] = useState(18);

  const result = useMemo(() => {
    const gst = (amount * rate) / 100;
    const inclusive = amount + gst;
    const baseFromInclusive = amount / (1 + rate / 100);
    const gstFromInclusive = amount - baseFromInclusive;
    return { gst, inclusive, baseFromInclusive, gstFromInclusive };
  }, [amount, rate]);

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <input type="number" value={amount} onChange={(e) => setAmount(Number(e.target.value))} className="w-full rounded-xl border bg-transparent px-4 py-3" style={{ borderColor: "var(--border)" }} />
        <input type="number" value={rate} onChange={(e) => setRate(Number(e.target.value))} className="w-full rounded-xl border bg-transparent px-4 py-3" style={{ borderColor: "var(--border)" }} />
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <ToolResultCard icon="🧾" label="GST Amount (exclusive mode)" value={result.gst.toFixed(2)} />
        <ToolResultCard icon="💰" label="Total with GST" value={result.inclusive.toFixed(2)} />
        <ToolResultCard icon="📉" label="Taxable value (inclusive mode)" value={result.baseFromInclusive.toFixed(2)} />
        <ToolResultCard icon="📌" label="GST from inclusive amount" value={result.gstFromInclusive.toFixed(2)} />
      </div>
    </div>
  );
}
