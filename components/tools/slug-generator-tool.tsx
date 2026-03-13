"use client";

import { useMemo, useState } from "react";
import { TextToolActions } from "@/components/text-tool-actions";

const SAMPLE = "Premium Utility Platform for Modern Teams";

const toSlug = (text: string) =>
  text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

export function SlugGeneratorTool() {
  const [input, setInput] = useState(SAMPLE);
  const slug = useMemo(() => toSlug(input), [input]);

  return (
    <div className="space-y-4">
      <TextToolActions
        onSample={() => setInput(SAMPLE)}
        onClear={() => setInput("")}
        onReset={() => setInput(SAMPLE)}
        onCopy={() => void navigator.clipboard.writeText(slug)}
      />
      <input value={input} onChange={(e) => setInput(e.target.value)} className="w-full rounded-xl border bg-transparent px-4 py-3" style={{ borderColor: "var(--border)" }} />
      <div className="rounded-xl border p-4 text-lg font-semibold" style={{ borderColor: "var(--border)" }}>{slug || "-"}</div>
    </div>
  );
}
