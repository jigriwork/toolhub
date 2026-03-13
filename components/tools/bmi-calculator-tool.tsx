"use client";

import { useMemo, useState } from "react";
import { ToolResultCard } from "@/components/tool-result-card";

function getCategory(bmi: number) {
  if (bmi < 18.5) return "Underweight";
  if (bmi < 25) return "Normal";
  if (bmi < 30) return "Overweight";
  return "Obesity";
}

export function BmiCalculatorTool() {
  const [weightKg, setWeightKg] = useState(70);
  const [heightCm, setHeightCm] = useState(172);

  const bmi = useMemo(() => {
    if (heightCm <= 0) return 0;
    const heightM = heightCm / 100;
    return weightKg / (heightM * heightM);
  }, [weightKg, heightCm]);

  return (
    <div className="space-y-5">
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="space-y-1">
          <span className="text-sm" style={{ color: "var(--muted)" }}>
            Weight (kg)
          </span>
          <input
            type="number"
            min={1}
            value={weightKg}
            onChange={(event) => setWeightKg(Number(event.target.value))}
            className="w-full rounded-xl border bg-transparent px-4 py-2"
            style={{ borderColor: "var(--border)" }}
          />
        </label>
        <label className="space-y-1">
          <span className="text-sm" style={{ color: "var(--muted)" }}>
            Height (cm)
          </span>
          <input
            type="number"
            min={1}
            value={heightCm}
            onChange={(event) => setHeightCm(Number(event.target.value))}
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
            setWeightKg(70);
            setHeightCm(172);
          }}
        >
          Reset
        </button>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => {
            setWeightKg(0);
            setHeightCm(0);
          }}
        >
          Clear
        </button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <ToolResultCard icon="⚖️" label="BMI" value={bmi > 0 ? bmi.toFixed(2) : "-"} />
        <ToolResultCard
          icon="📊"
          label="Category"
          value={bmi > 0 ? getCategory(bmi) : "-"}
          helpText="BMI is an estimate and not a medical diagnosis."
        />
      </div>
    </div>
  );
}
