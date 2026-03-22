"use client";

import { useMemo, useState } from "react";

const inr = (v: number) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(v || 0);

export function PosProTool() {
  const [saleAmount, setSaleAmount] = useState(2500);
  const [cash, setCash] = useState(1000);
  const [upi, setUpi] = useState(1500);
  const [card, setCard] = useState(0);
  const [returnsAmount, setReturnsAmount] = useState(0);
  const [role, setRole] = useState<"owner" | "cashier">("owner");
  const [openingCash, setOpeningCash] = useState(5000);
  const [closingCash, setClosingCash] = useState(6200);

  const splitTotal = cash + upi + card;

  const summary = useMemo(() => {
    const netSales = Math.max(0, saleAmount - returnsAmount);
    const expectedCash = openingCash + cash - returnsAmount;
    const variance = closingCash - expectedCash;
    return { netSales, expectedCash, variance };
  }, [cash, closingCash, openingCash, returnsAmount, saleAmount]);

  return (
    <div className="space-y-5">
      <section className="grid gap-3 md:grid-cols-3">
        <label className="text-sm">Cashier role
          <select className="select" value={role} onChange={(e) => setRole(e.target.value as "owner" | "cashier")}>
            <option value="owner">Owner</option>
            <option value="cashier">Cashier</option>
          </select>
        </label>
        <label className="text-sm">Sale amount<input className="field" type="number" min={0} value={saleAmount} onChange={(e) => setSaleAmount(Number(e.target.value))} /></label>
        <label className="text-sm">Returns/refunds<input className="field" type="number" min={0} value={returnsAmount} onChange={(e) => setReturnsAmount(Number(e.target.value))} /></label>
      </section>

      <section className="rounded-xl border p-4" style={{ borderColor: "var(--border)" }}>
        <h3 className="mb-3 text-base font-semibold">Split payments</h3>
        <div className="grid gap-3 md:grid-cols-3">
          <label className="text-sm">Cash<input className="field" type="number" min={0} value={cash} onChange={(e) => setCash(Number(e.target.value))} /></label>
          <label className="text-sm">UPI<input className="field" type="number" min={0} value={upi} onChange={(e) => setUpi(Number(e.target.value))} /></label>
          <label className="text-sm">Card<input className="field" type="number" min={0} value={card} onChange={(e) => setCard(Number(e.target.value))} /></label>
        </div>
        <p className="mt-2 text-sm" style={{ color: splitTotal === saleAmount ? "#166534" : "#b45309" }}>
          Split total: <strong>{inr(splitTotal)}</strong> {splitTotal === saleAmount ? "✓ matches sale amount" : "⚠ does not match sale amount"}
        </p>
      </section>

      <section className="rounded-xl border p-4" style={{ borderColor: "var(--border)" }}>
        <h3 className="mb-3 text-base font-semibold">Daily close report</h3>
        <div className="grid gap-3 md:grid-cols-2">
          <label className="text-sm">Opening cash<input className="field" type="number" min={0} value={openingCash} onChange={(e) => setOpeningCash(Number(e.target.value))} /></label>
          <label className="text-sm">Closing cash<input className="field" type="number" min={0} value={closingCash} onChange={(e) => setClosingCash(Number(e.target.value))} /></label>
        </div>
        <div className="mt-4 grid gap-2 text-sm sm:grid-cols-2">
          <div className="flex justify-between"><span style={{ color: "var(--muted)" }}>Net sales</span><strong>{inr(summary.netSales)}</strong></div>
          <div className="flex justify-between"><span style={{ color: "var(--muted)" }}>Expected cash</span><strong>{inr(summary.expectedCash)}</strong></div>
          <div className="flex justify-between border-t pt-2 sm:col-span-2" style={{ borderColor: "var(--border)" }}>
            <span className="font-semibold">Variance</span>
            <strong style={{ color: summary.variance === 0 ? "#166534" : "#b91c1c" }}>{inr(summary.variance)}</strong>
          </div>
        </div>
      </section>
    </div>
  );
}
