"use client";

import { useMemo, useState } from "react";

const inr = (v: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 2 }).format(v || 0);

export function ProfitPricingCalculatorTool() {
  const [costPrice, setCostPrice] = useState(1000);
  const [mode, setMode] = useState<"margin" | "markup">("margin");
  const [percent, setPercent] = useState(25);
  const [gstRate, setGstRate] = useState(18);
  const [gstInclusive, setGstInclusive] = useState(false);
  const [discountPercent, setDiscountPercent] = useState(0);

  const result = useMemo(() => {
    const baseSelling =
      mode === "margin"
        ? costPrice / Math.max(0.0001, 1 - percent / 100)
        : costPrice * (1 + percent / 100);

    const withGst = gstInclusive ? baseSelling : baseSelling * (1 + gstRate / 100);
    const discountAmount = (withGst * discountPercent) / 100;
    const finalSelling = Math.max(0, withGst - discountAmount);
    const profit = finalSelling - costPrice;
    const realizedMargin = costPrice > 0 ? (profit / finalSelling) * 100 : 0;

    return { baseSelling, withGst, discountAmount, finalSelling, profit, realizedMargin };
  }, [costPrice, discountPercent, gstInclusive, gstRate, mode, percent]);

  return (
    <div className="space-y-5">
      <section className="grid gap-3 md:grid-cols-3">
        <label className="text-sm">Cost price<input className="field" type="number" min={0} value={costPrice} onChange={(e) => setCostPrice(Number(e.target.value))} /></label>
        <label className="text-sm">Pricing mode
          <select className="select" value={mode} onChange={(e) => setMode(e.target.value as "margin" | "markup")}>
            <option value="margin">Target Margin %</option>
            <option value="markup">Markup %</option>
          </select>
        </label>
        <label className="text-sm">{mode === "margin" ? "Margin %" : "Markup %"}
          <input className="field" type="number" min={0} value={percent} onChange={(e) => setPercent(Number(e.target.value))} />
        </label>
      </section>

      <section className="grid gap-3 md:grid-cols-3">
        <label className="text-sm">GST rate %<input className="field" type="number" min={0} value={gstRate} onChange={(e) => setGstRate(Number(e.target.value))} /></label>
        <label className="text-sm">Offer discount %<input className="field" type="number" min={0} value={discountPercent} onChange={(e) => setDiscountPercent(Number(e.target.value))} /></label>
        <label className="mt-6 flex items-center gap-2 text-sm"><input type="checkbox" checked={gstInclusive} onChange={(e) => setGstInclusive(e.target.checked)} /> Selling price already GST inclusive</label>
      </section>

      <section className="rounded-xl border p-4" style={{ borderColor: "var(--border)" }}>
        <h3 className="mb-3 text-base font-semibold">Pricing result</h3>
        <div className="grid gap-2 text-sm sm:grid-cols-2">
          <div className="flex justify-between"><span style={{ color: "var(--muted)" }}>Base selling price</span><strong>{inr(result.baseSelling)}</strong></div>
          <div className="flex justify-between"><span style={{ color: "var(--muted)" }}>With GST</span><strong>{inr(result.withGst)}</strong></div>
          <div className="flex justify-between"><span style={{ color: "var(--muted)" }}>Discount impact</span><strong>- {inr(result.discountAmount)}</strong></div>
          <div className="flex justify-between"><span style={{ color: "var(--muted)" }}>Final selling price</span><strong>{inr(result.finalSelling)}</strong></div>
          <div className="flex justify-between"><span style={{ color: "var(--muted)" }}>Estimated profit</span><strong>{inr(result.profit)}</strong></div>
          <div className="flex justify-between"><span style={{ color: "var(--muted)" }}>Realized margin</span><strong>{Number.isFinite(result.realizedMargin) ? result.realizedMargin.toFixed(2) : "0.00"}%</strong></div>
        </div>
      </section>
    </div>
  );
}
