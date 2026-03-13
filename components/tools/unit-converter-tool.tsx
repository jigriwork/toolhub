"use client";

import { useMemo, useState } from "react";

const lengthUnits = {
  m: 1,
  km: 1000,
  cm: 0.01,
  mm: 0.001,
  ft: 0.3048,
  in: 0.0254,
};

const weightUnits = {
  kg: 1,
  g: 0.001,
  lb: 0.453592,
};

function convertTemperature(value: number, from: string, to: string) {
  if (from === to) return value;
  let celsius = value;
  if (from === "f") celsius = ((value - 32) * 5) / 9;
  if (from === "k") celsius = value - 273.15;
  if (to === "f") return (celsius * 9) / 5 + 32;
  if (to === "k") return celsius + 273.15;
  return celsius;
}

export function UnitConverterTool() {
  const [mode, setMode] = useState<"length" | "weight" | "temperature">("length");
  const [value, setValue] = useState(1);
  const [from, setFrom] = useState("m");
  const [to, setTo] = useState("km");

  const result = useMemo(() => {
    if (mode === "temperature") return convertTemperature(value, from, to);

    const units = mode === "length" ? lengthUnits : weightUnits;
    const base = value * units[from as keyof typeof units];
    return base / units[to as keyof typeof units];
  }, [mode, value, from, to]);

  const unitOptions =
    mode === "length"
      ? Object.keys(lengthUnits)
      : mode === "weight"
        ? Object.keys(weightUnits)
        : ["c", "f", "k"];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {(["length", "weight", "temperature"] as const).map((m) => (
          <button key={m} type="button" className={`btn ${mode === m ? "btn-primary" : "btn-secondary"}`} onClick={() => {
            setMode(m);
            setFrom(m === "length" ? "m" : m === "weight" ? "kg" : "c");
            setTo(m === "length" ? "km" : m === "weight" ? "g" : "f");
          }}>{m}</button>
        ))}
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        <input type="number" value={value} onChange={(e) => setValue(Number(e.target.value))} className="w-full rounded-xl border bg-transparent px-4 py-3" style={{ borderColor: "var(--border)" }} />
        <select value={from} onChange={(e) => setFrom(e.target.value)} className="w-full rounded-xl border bg-transparent px-4 py-3" style={{ borderColor: "var(--border)" }}>
          {unitOptions.map((u) => <option key={u} value={u}>{u}</option>)}
        </select>
        <select value={to} onChange={(e) => setTo(e.target.value)} className="w-full rounded-xl border bg-transparent px-4 py-3" style={{ borderColor: "var(--border)" }}>
          {unitOptions.map((u) => <option key={u} value={u}>{u}</option>)}
        </select>
      </div>
      <div className="rounded-xl border p-4 text-lg font-semibold" style={{ borderColor: "var(--border)" }}>
        {value} {from} = {Number.isFinite(result) ? result.toFixed(4) : "-"} {to}
      </div>
    </div>
  );
}
