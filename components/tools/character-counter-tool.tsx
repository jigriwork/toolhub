"use client";

import { useMemo, useState } from "react";
import { TextToolActions } from "@/components/text-tool-actions";
import { ToolResultCard } from "@/components/tool-result-card";

const SAMPLE = "Craft concise and high-impact metadata descriptions for better click-through rates.";

export function CharacterCounterTool() {
  const [text, setText] = useState(SAMPLE);
  const [copied, setCopied] = useState(false);

  const stats = useMemo(() => {
    const withSpaces = text.length;
    const withoutSpaces = text.replace(/\s/g, "").length;
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    return { withSpaces, withoutSpaces, words };
  }, [text]);

  return (
    <div className="space-y-4">
      <TextToolActions
        onSample={() => setText(SAMPLE)}
        onClear={() => setText("")}
        onReset={() => setText(SAMPLE)}
        onCopy={async () => {
          await navigator.clipboard.writeText(text);
          setCopied(true);
          setTimeout(() => setCopied(false), 1200);
        }}
        copied={copied}
        copyLabel="Copy Text"
      />

      <textarea
        value={text}
        onChange={(event) => setText(event.target.value)}
        placeholder="Type or paste content to count characters..."
        className="h-52 w-full rounded-xl border bg-transparent p-4 outline-none focus:ring-2 focus:ring-blue-500"
        style={{ borderColor: "var(--border)" }}
      />

      <div className="grid gap-3 sm:grid-cols-3">
        <ToolResultCard icon="🔡" label="Characters" value={stats.withSpaces} />
        <ToolResultCard icon="✂️" label="Without Spaces" value={stats.withoutSpaces} />
        <ToolResultCard icon="📝" label="Words" value={stats.words} />
      </div>
    </div>
  );
}
