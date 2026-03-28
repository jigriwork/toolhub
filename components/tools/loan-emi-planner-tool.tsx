"use client";

import { useMemo, useState } from "react";
import { ToolResultCard } from "@/components/tool-result-card";

type LoanInput = {
  principal: number;
  annualRate: number;
  months: number;
};

function calculateLoan(input: LoanInput) {
  const monthlyRate = input.annualRate / 12 / 100;
  const emi =
    monthlyRate === 0
      ? input.principal / input.months
      : (input.principal * monthlyRate * (1 + monthlyRate) ** input.months) /
      ((1 + monthlyRate) ** input.months - 1);

  const totalPayment = emi * input.months;
  const totalInterest = totalPayment - input.principal;

  return {
    emi,
    totalPayment,
    totalInterest,
    interestShare: totalPayment > 0 ? (totalInterest / totalPayment) * 100 : 0,
  };
}

export function LoanEmiPlannerTool() {
  const [principal, setPrincipal] = useState(800000);
  const [annualRate, setAnnualRate] = useState(9.5);
  const [months, setMonths] = useState(120);

  const [compareEnabled, setCompareEnabled] = useState(false);
  const [comparePrincipal, setComparePrincipal] = useState(800000);
  const [compareAnnualRate, setCompareAnnualRate] = useState(10.25);
  const [compareMonths, setCompareMonths] = useState(96);

  const base = useMemo(
    () =>
      calculateLoan({
        principal: Math.max(0, principal),
        annualRate: Math.max(0, annualRate),
        months: Math.max(1, months),
      }),
    [principal, annualRate, months],
  );

  const compare = useMemo(
    () =>
      calculateLoan({
        principal: Math.max(0, comparePrincipal),
        annualRate: Math.max(0, compareAnnualRate),
        months: Math.max(1, compareMonths),
      }),
    [comparePrincipal, compareAnnualRate, compareMonths],
  );

  const winner = compare.totalInterest < base.totalInterest ? "Option B" : "Option A";

  return (
    <div className="space-y-5">
      <div className="grid gap-3 sm:grid-cols-3">
        <input type="number" value={principal} onChange={(e) => setPrincipal(Number(e.target.value))} className="field" placeholder="Loan amount" />
        <input type="number" value={annualRate} onChange={(e) => setAnnualRate(Number(e.target.value))} className="field" placeholder="Annual interest %" />
        <input type="number" value={months} onChange={(e) => setMonths(Number(e.target.value))} className="field" placeholder="Tenure (months)" />
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <ToolResultCard icon="📆" label="Monthly EMI" value={base.emi.toFixed(2)} />
        <ToolResultCard icon="💸" label="Total Interest" value={base.totalInterest.toFixed(2)} />
        <ToolResultCard icon="🧮" label="Total Payment" value={base.totalPayment.toFixed(2)} />
        <ToolResultCard icon="📊" label="Interest Share" value={`${base.interestShare.toFixed(2)}%`} />
      </div>

      <section className="rounded-xl border p-4" style={{ borderColor: "var(--border)" }}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="font-semibold">Compare loan options</p>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => setCompareEnabled((value) => !value)}
          >
            {compareEnabled ? "Hide Comparison" : "Enable Comparison"}
          </button>
        </div>

        {compareEnabled ? (
          <div className="mt-4 space-y-4">
            <div className="grid gap-3 sm:grid-cols-3">
              <input type="number" value={comparePrincipal} onChange={(e) => setComparePrincipal(Number(e.target.value))} className="field" placeholder="Option B amount" />
              <input type="number" value={compareAnnualRate} onChange={(e) => setCompareAnnualRate(Number(e.target.value))} className="field" placeholder="Option B interest %" />
              <input type="number" value={compareMonths} onChange={(e) => setCompareMonths(Number(e.target.value))} className="field" placeholder="Option B tenure" />
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <ToolResultCard icon="📆" label="Option B EMI" value={compare.emi.toFixed(2)} />
              <ToolResultCard icon="💸" label="Option B Interest" value={compare.totalInterest.toFixed(2)} />
              <ToolResultCard icon="🧮" label="Option B Total" value={compare.totalPayment.toFixed(2)} />
              <ToolResultCard icon="✅" label="Lower Interest" value={winner} />
            </div>
          </div>
        ) : null}
      </section>
    </div>
  );
}
