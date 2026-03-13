"use client";

import { useMemo, useState } from "react";
import { ToolResultCard } from "@/components/tool-result-card";

export function PercentageCalculatorTool() {
  const [value, setValue] = useState(250);
  const [percent, setPercent] = useState(15);
  const [from, setFrom] = useState(120);
  const [to, setTo] = useState(150);

  const result = useMemo(() => {
    const percentOf = (value * percent) / 100;
    const change = from === 0 ? 0 : ((to - from) / from) * 100;
    return { percentOf, change };
  }, [value, percent, from, to]);

  return (
    <div className="space-y-5">
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="space-y-1">
          <span className="text-sm" style={{ color: "var(--muted)" }}>
            Value (Y)
          </span>
          <input
            type="number"
            value={value}
            onChange={(event) => setValue(Number(event.target.value))}
            className="w-full rounded-xl border bg-transparent px-4 py-2"
            style={{ borderColor: "var(--border)" }}
          />
        </label>
        <label className="space-y-1">
          <span className="text-sm" style={{ color: "var(--muted)" }}>
            Percent (X)
          </span>
          <input
            type="number"
            value={percent}
            onChange={(event) => setPercent(Number(event.target.value))}
            className="w-full rounded-xl border bg-transparent px-4 py-2"
            style={{ borderColor: "var(--border)" }}
          />
        </label>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <label className="space-y-1">
          <span className="text-sm" style={{ color: "var(--muted)" }}>
            From value
          </span>
          <input
            type="number"
            value={from}
            onChange={(event) => setFrom(Number(event.target.value))}
            className="w-full rounded-xl border bg-transparent px-4 py-2"
            style={{ borderColor: "var(--border)" }}
          />
        </label>
        <label className="space-y-1">
          <span className="text-sm" style={{ color: "var(--muted)" }}>
            To value
          </span>
          <input
            type="number"
            value={to}
            onChange={(event) => setTo(Number(event.target.value))}
            className="w-full rounded-xl border bg-transparent px-4 py-2"
            style={{ borderColor: "var(--border)" }}
          />
        </label>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => {
            setValue(250);
            setPercent(15);
            setFrom(120);
            setTo(150);
          }}
        >
          Reset
        </button>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => {
            setValue(0);
            setPercent(0);
            setFrom(0);
            setTo(0);
          }}
        >
          Clear
        </button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <ToolResultCard
          icon="🧮"
          label={`${percent}% of ${value}`}
          value={result.percentOf.toFixed(2)}
        />
        <ToolResultCard
          icon="📈"
          label="Percentage Change"
          value={`${result.change.toFixed(2)}%`}
          helpText={result.change >= 0 ? "Increase" : "Decrease"}
        />
      </div>
    </div>
  );
}
