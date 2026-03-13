"use client";

import { useState } from "react";
import { TextToolActions } from "@/components/text-tool-actions";

const SAMPLE = '{"tool":"ToolHub","features":["format","validate","minify"]}';

export function JsonFormatterTool() {
  const [input, setInput] = useState(SAMPLE);
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const format = () => {
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed, null, 2));
      setError("");
    } catch {
      setError("Invalid JSON. Please check syntax.");
      setOutput("");
    }
  };

  const minify = () => {
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed));
      setError("");
    } catch {
      setError("Invalid JSON. Please check syntax.");
      setOutput("");
    }
  };

  return (
    <div className="space-y-4">
      <TextToolActions
        onSample={() => setInput(SAMPLE)}
        onClear={() => {
          setInput("");
          setOutput("");
        }}
        onReset={() => {
          setInput(SAMPLE);
          setOutput("");
          setError("");
        }}
        onCopy={async () => {
          await navigator.clipboard.writeText(output);
          setCopied(true);
          setTimeout(() => setCopied(false), 1200);
        }}
        copied={copied}
        copyLabel="Copy Output"
      />
      <textarea value={input} onChange={(e) => setInput(e.target.value)} className="h-40 w-full rounded-xl border bg-transparent p-4" style={{ borderColor: "var(--border)" }} />
      <div className="flex flex-wrap gap-2">
        <button className="btn btn-primary" type="button" onClick={format}>Format JSON</button>
        <button className="btn btn-secondary" type="button" onClick={minify}>Minify JSON</button>
      </div>
      {error ? <p className="text-sm text-red-500">{error}</p> : null}
      <textarea readOnly value={output} className="h-40 w-full rounded-xl border bg-transparent p-4" style={{ borderColor: "var(--border)" }} />
    </div>
  );
}
