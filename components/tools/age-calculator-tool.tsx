"use client";

import { useState } from "react";

type AgeResult = {
  years: number;
  months: number;
  days: number;
};

function calculateAge(dateString: string): AgeResult | null {
  if (!dateString) {
    return null;
  }

  const dob = new Date(dateString);
  const today = new Date();

  if (Number.isNaN(dob.getTime()) || dob > today) {
    return null;
  }

  let years = today.getFullYear() - dob.getFullYear();
  let months = today.getMonth() - dob.getMonth();
  let days = today.getDate() - dob.getDate();

  if (days < 0) {
    const lastMonthDays = new Date(
      today.getFullYear(),
      today.getMonth(),
      0,
    ).getDate();
    days += lastMonthDays;
    months -= 1;
  }

  if (months < 0) {
    months += 12;
    years -= 1;
  }

  return { years, months, days };
}

export function AgeCalculatorTool() {
  const [dob, setDob] = useState("");
  const [result, setResult] = useState<AgeResult | null>(null);
  const [error, setError] = useState("");

  const onCalculate = () => {
    const age = calculateAge(dob);
    if (!age) {
      setError("Please enter a valid date of birth in the past.");
      setResult(null);
      return;
    }

    setError("");
    setResult(age);
  };

  return (
    <div className="max-w-md space-y-4">
      <input
        type="date"
        value={dob}
        onChange={(event) => setDob(event.target.value)}
        className="w-full rounded-xl border bg-transparent px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
        style={{ borderColor: "var(--border)" }}
      />
      <button type="button" onClick={onCalculate} className="btn btn-primary">
        Calculate Age
      </button>

      {error && <p className="text-sm text-red-500">{error}</p>}

      {result && (
        <div className="rounded-xl border p-4" style={{ borderColor: "var(--border)" }}>
          <p className="text-lg font-semibold">
            {result.years} years, {result.months} months, {result.days} days
          </p>
        </div>
      )}
    </div>
  );
}
