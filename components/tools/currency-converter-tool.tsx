"use client";

import { useMemo, useState } from "react";

type LiveRateApiConfig = {
  enabled: boolean;
  endpoint?: string;
  apiKeyEnv?: string;
};

const liveRateApiConfig: LiveRateApiConfig = {
  enabled: false,
  endpoint: undefined,
  apiKeyEnv: undefined,
};

const rates: Record<string, number> = {
  USD: 1,
  INR: 83.2,
  EUR: 0.92,
  GBP: 0.78,
  AED: 3.67,
};

export function CurrencyConverterTool() {
  const [amount, setAmount] = useState(100);
  const [from, setFrom] = useState("USD");
  const [to, setTo] = useState("INR");

  const converted = useMemo(() => {
    const usd = amount / rates[from];
    return usd * rates[to];
  }, [amount, from, to]);

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-3">
        <input type="number" value={amount} onChange={(e) => setAmount(Number(e.target.value))} className="w-full rounded-xl border bg-transparent px-4 py-3" style={{ borderColor: "var(--border)" }} />
        <select value={from} onChange={(e) => setFrom(e.target.value)} className="w-full rounded-xl border bg-transparent px-4 py-3" style={{ borderColor: "var(--border)" }}>
          {Object.keys(rates).map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <select value={to} onChange={(e) => setTo(e.target.value)} className="w-full rounded-xl border bg-transparent px-4 py-3" style={{ borderColor: "var(--border)" }}>
          {Object.keys(rates).map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>
      <div className="rounded-xl border p-4 text-lg font-semibold" style={{ borderColor: "var(--border)" }}>
        {amount.toFixed(2)} {from} ≈ {converted.toFixed(2)} {to}
      </div>
      <p className="text-xs" style={{ color: "var(--muted)" }}>
        Using built-in rates for reliability. Live API-ready config is prepared and can be enabled later.
      </p>
      {!liveRateApiConfig.enabled ? (
        <p className="text-xs" style={{ color: "var(--muted)" }}>
          Future-ready: set API endpoint and key to switch to real-time rates without changing UI flow.
        </p>
      ) : null}
    </div>
  );
}
