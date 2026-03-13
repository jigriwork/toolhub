"use client";

import { useState } from "react";

const toSentenceCase = (text: string) =>
  text
    .toLowerCase()
    .replace(/(^\s*[a-z]|[.!?]\s+[a-z])/g, (match) => match.toUpperCase());

const toCapitalizeWords = (text: string) =>
  text.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());

export function TextCaseConverterTool() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);

  const copyOutput = async () => {
    if (!output) {
      return;
    }

    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  return (
    <div className="space-y-4">
      <textarea
        value={input}
        onChange={(event) => {
          const value = event.target.value;
          setInput(value);
          setOutput(value);
        }}
        placeholder="Type or paste your text..."
        className="h-40 w-full rounded-xl border bg-transparent p-4 outline-none focus:ring-2 focus:ring-blue-500"
        style={{ borderColor: "var(--border)" }}
      />

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => setOutput(input.toLowerCase())}
        >
          lowercase
        </button>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => setOutput(input.toUpperCase())}
        >
          UPPERCASE
        </button>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => setOutput(toSentenceCase(input))}
        >
          Sentence case
        </button>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => setOutput(toCapitalizeWords(input))}
        >
          Capitalize Words
        </button>
        <button type="button" className="btn btn-primary" onClick={copyOutput}>
          {copied ? "Copied!" : "Copy Output"}
        </button>
      </div>

      <textarea
        readOnly
        value={output}
        placeholder="Converted text will appear here..."
        className="h-40 w-full rounded-xl border bg-transparent p-4"
        style={{ borderColor: "var(--border)" }}
      />
    </div>
  );
}
