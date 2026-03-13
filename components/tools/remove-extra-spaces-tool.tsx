"use client";

import { useState } from "react";
import { TextToolActions } from "@/components/text-tool-actions";

const SAMPLE = "ToolHub    makes   online tools\n\ncleaner,   faster,   and   easier.";

function cleanText(input: string) {
  return input
    .split("\n")
    .map((line) => line.replace(/\s+/g, " ").trim())
    .filter((line, index, arr) => line.length > 0 || (index > 0 && arr[index - 1] !== ""))
    .join("\n");
}

export function RemoveExtraSpacesTool() {
  const [input, setInput] = useState(SAMPLE);
  const [output, setOutput] = useState(cleanText(SAMPLE));
  const [copied, setCopied] = useState(false);

  const onClean = () => setOutput(cleanText(input));

  return (
    <div className="space-y-4">
      <TextToolActions
        onSample={() => {
          setInput(SAMPLE);
          setOutput(cleanText(SAMPLE));
        }}
        onClear={() => {
          setInput("");
          setOutput("");
        }}
        onReset={() => {
          setInput(SAMPLE);
          setOutput(cleanText(SAMPLE));
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
        value={input}
        onChange={(event) => setInput(event.target.value)}
        placeholder="Paste text with extra spaces..."
        className="h-40 w-full rounded-xl border bg-transparent p-4 outline-none focus:ring-2 focus:ring-blue-500"
        style={{ borderColor: "var(--border)" }}
      />

      <button type="button" className="btn btn-primary" onClick={onClean}>
        Remove Extra Spaces
      </button>

      <textarea
        readOnly
        value={output}
        placeholder="Cleaned output will appear here..."
        className="h-40 w-full rounded-xl border bg-transparent p-4"
        style={{ borderColor: "var(--border)" }}
      />
    </div>
  );
}
