"use client";

import { useMemo, useState } from "react";

const inr = (v: number) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(v || 0);

const HSN_SAC_OPTIONS = [
  { code: "9983", label: "Professional Services" },
  { code: "9987", label: "Maintenance Services" },
  { code: "9985", label: "Support Services" },
  { code: "6204", label: "Readymade Garments" },
  { code: "8471", label: "Computer Equipment" },
];

export function GstBillingHelperTool() {
  const [taxableValue, setTaxableValue] = useState(10000);
  const [gstRate, setGstRate] = useState(18);
  const [saleType, setSaleType] = useState<"intrastate" | "interstate">("intrastate");
  const [hsnSac, setHsnSac] = useState("9983");

  const calc = useMemo(() => {
    const totalTax = (taxableValue * gstRate) / 100;
    const cgst = saleType === "intrastate" ? totalTax / 2 : 0;
    const sgst = saleType === "intrastate" ? totalTax / 2 : 0;
    const igst = saleType === "interstate" ? totalTax : 0;
    return {
      totalTax,
      cgst,
      sgst,
      igst,
      grandTotal: taxableValue + totalTax,
    };
  }, [gstRate, saleType, taxableValue]);

  return (
    <div className="space-y-5">
      <section className="grid gap-3 md:grid-cols-4">
        <label className="text-sm">Taxable amount<input className="field" type="number" min={0} value={taxableValue} onChange={(e) => setTaxableValue(Number(e.target.value))} /></label>
        <label className="text-sm">GST rate %<input className="field" type="number" min={0} value={gstRate} onChange={(e) => setGstRate(Number(e.target.value))} /></label>
        <label className="text-sm">Sale type
          <select className="select" value={saleType} onChange={(e) => setSaleType(e.target.value as "intrastate" | "interstate")}>
            <option value="intrastate">Intrastate (CGST + SGST)</option>
            <option value="interstate">Interstate (IGST)</option>
          </select>
        </label>
        <label className="text-sm">HSN/SAC
          <select className="select" value={hsnSac} onChange={(e) => setHsnSac(e.target.value)}>
            {HSN_SAC_OPTIONS.map((x) => <option key={x.code} value={x.code}>{x.code} · {x.label}</option>)}
          </select>
        </label>
      </section>

      <section className="rounded-xl border p-4" style={{ borderColor: "var(--border)" }}>
        <h3 className="mb-3 text-base font-semibold">GST breakdown</h3>
        <div className="grid gap-2 text-sm sm:grid-cols-2">
          <div className="flex justify-between"><span style={{ color: "var(--muted)" }}>Taxable value</span><strong>{inr(taxableValue)}</strong></div>
          <div className="flex justify-between"><span style={{ color: "var(--muted)" }}>GST rate</span><strong>{gstRate}%</strong></div>
          <div className="flex justify-between"><span style={{ color: "var(--muted)" }}>CGST</span><strong>{inr(calc.cgst)}</strong></div>
          <div className="flex justify-between"><span style={{ color: "var(--muted)" }}>SGST</span><strong>{inr(calc.sgst)}</strong></div>
          <div className="flex justify-between"><span style={{ color: "var(--muted)" }}>IGST</span><strong>{inr(calc.igst)}</strong></div>
          <div className="flex justify-between"><span style={{ color: "var(--muted)" }}>Total tax</span><strong>{inr(calc.totalTax)}</strong></div>
          <div className="flex justify-between border-t pt-2 sm:col-span-2" style={{ borderColor: "var(--border)" }}><span className="font-semibold">Invoice total</span><strong>{inr(calc.grandTotal)}</strong></div>
        </div>
      </section>

      <section className="rounded-xl border p-4 text-sm" style={{ borderColor: "var(--border)" }}>
        <h3 className="mb-2 text-base font-semibold">Tax summary</h3>
        <p>HSN/SAC: <strong>{hsnSac}</strong></p>
        <p>Sale type: <strong>{saleType === "intrastate" ? "Intrastate" : "Interstate"}</strong></p>
        <p style={{ color: "var(--muted)" }}>Use this summary directly while preparing invoice/proforma tax section.</p>
      </section>
    </div>
  );
}
