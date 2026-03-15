"use client";

import { useState } from "react";

function createUuids(count: number) {
  return Array.from({ length: Math.min(100, Math.max(1, count)) }, () => crypto.randomUUID()).join("\n");
}

export function UuidGeneratorTool() {
  const [count, setCount] = useState(5);
  const [output, setOutput] = useState(() => createUuids(5));

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <input type="number" min={1} max={100} value={count} onChange={(e) => setCount(Number(e.target.value))} className="field w-full sm:w-32" style={{ borderColor: "var(--border)" }} />
        <button type="button" className="btn btn-primary" onClick={() => setOutput(createUuids(count))}>Generate</button>
        <button type="button" className="btn btn-secondary" onClick={() => void navigator.clipboard.writeText(output)}>Copy</button>
      </div>
      <textarea readOnly value={output} className="textarea h-52" style={{ borderColor: "var(--border)" }} />
    </div>
  );
}
