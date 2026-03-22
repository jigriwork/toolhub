"use client";

import { useMemo, useState } from "react";
import { TextToolActions } from "@/components/text-tool-actions";

const SAMPLE = "ToolHub";

export function TextRepeaterTool() {
  const [text, setText] = useState(SAMPLE);
  const [count, setCount] = useState(5);
  const [separator, setSeparator] = useState("newline");
  const [copied, setCopied] = useState(false);

  const output = useMemo(() => {
    const safeCount = Math.min(200, Math.max(1, count));
    const sep = separator === "newline" ? "\n" : separator === "comma" ? ", " : " ";
    return Array.from({ length: safeCount }, () => text).join(sep);
  }, [text, count, separator]);

  return (
    <div className="space-y-4">
      <TextToolActions
        onSample={() => {
          setText(SAMPLE);
          setCount(5);
          setSeparator("newline");
        }}
        onClear={() => setText("")}
        onReset={() => {
          setText(SAMPLE);
          setCount(5);
          setSeparator("newline");
        }}
        onCopy={async () => {
          await navigator.clipboard.writeText(output);
          setCopied(true);
          setTimeout(() => setCopied(false), 1200);
        }}
        copied={copied}
        copyLabel="Copy Output"
      />

      <textarea
        value={text}
        onChange={(event) => setText(event.target.value)}
        className="h-32 w-full rounded-xl border bg-transparent p-4 outline-none focus:ring-2 focus:ring-blue-500"
        style={{ borderColor: "var(--border)" }}
        placeholder="Enter text to repeat"
      />

      <div className="grid gap-3 sm:grid-cols-2">
        <label className="space-y-1">
          <span className="text-sm" style={{ color: "var(--muted)" }}>
            Repeat count
          </span>
          <input
            type="number"
            min={1}
            max={200}
            value={count}
            onChange={(event) => setCount(Number(event.target.value))}
            className="w-full rounded-xl border bg-transparent px-4 py-2"
            style={{ borderColor: "var(--border)" }}
          />
        </label>
        <label className="space-y-1">
          <span className="text-sm" style={{ color: "var(--muted)" }}>
            Separator
          </span>
          <select
            value={separator}
            onChange={(event) => setSeparator(event.target.value)}
            className="w-full rounded-xl border bg-transparent px-4 py-2"
            style={{ borderColor: "var(--border)" }}
          >
            <option value="newline">New line</option>
            <option value="space">Space</option>
            <option value="comma">Comma</option>
          </select>
        </label>
      </div>

      <textarea
        readOnly
        value={output}
        className="h-44 w-full rounded-xl border bg-transparent p-4"
        style={{ borderColor: "var(--border)" }}
      />
    </div>
  );
}
