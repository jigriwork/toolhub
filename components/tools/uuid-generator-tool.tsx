"use client";

import { useMemo, useState } from "react";

export function UuidGeneratorTool() {
  const [count, setCount] = useState(5);
  const [seed, setSeed] = useState(0);
  const output = useMemo(
    () => Array.from({ length: Math.min(100, Math.max(1, count)) }, () => crypto.randomUUID()).join("\n"),
    [count, seed],
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <input type="number" min={1} max={100} value={count} onChange={(e) => setCount(Number(e.target.value))} className="w-32 rounded-xl border bg-transparent px-3 py-2" style={{ borderColor: "var(--border)" }} />
        <button type="button" className="btn btn-primary" onClick={() => setSeed((v) => v + 1)}>Generate</button>
        <button type="button" className="btn btn-secondary" onClick={() => void navigator.clipboard.writeText(output)}>Copy</button>
      </div>
      <textarea readOnly value={output} className="h-52 w-full rounded-xl border bg-transparent p-4" style={{ borderColor: "var(--border)" }} />
    </div>
  );
}
