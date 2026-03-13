"use client";

import { useMemo, useState } from "react";
import { ToolResultCard } from "@/components/tool-result-card";

export function DiscountCalculatorTool() {
  const [price, setPrice] = useState(2500);
  const [discount, setDiscount] = useState(20);

  const result = useMemo(() => {
    const saved = (price * discount) / 100;
    const finalPrice = price - saved;
    return { saved, finalPrice };
  }, [price, discount]);

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <input type="number" value={price} onChange={(e) => setPrice(Number(e.target.value))} className="w-full rounded-xl border bg-transparent px-4 py-3" style={{ borderColor: "var(--border)" }} />
        <input type="number" value={discount} onChange={(e) => setDiscount(Number(e.target.value))} className="w-full rounded-xl border bg-transparent px-4 py-3" style={{ borderColor: "var(--border)" }} />
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <ToolResultCard icon="🏷️" label="Discount Amount" value={result.saved.toFixed(2)} />
        <ToolResultCard icon="💵" label="Final Price" value={result.finalPrice.toFixed(2)} />
      </div>
    </div>
  );
}
