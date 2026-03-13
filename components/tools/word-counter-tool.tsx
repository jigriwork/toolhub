"use client";

import { useMemo, useState } from "react";
import { TextToolActions } from "@/components/text-tool-actions";
import { ToolResultCard } from "@/components/tool-result-card";

const SAMPLE_TEXT =
  "ToolHub helps creators and teams work faster.\n\nUse this sample text to test word count, character count, and reading time.";

export function WordCounterTool() {
  const [text, setText] = useState(SAMPLE_TEXT);
  const [copied, setCopied] = useState(false);

  const stats = useMemo(() => {
    const trimmed = text.trim();
    const words = trimmed ? trimmed.split(/\s+/).length : 0;
    const characters = text.length;
    const charactersWithoutSpaces = text.replace(/\s/g, "").length;
    const sentences = trimmed
      ? trimmed.split(/[.!?]+/).filter((line) => line.trim().length > 0).length
      : 0;
    const paragraphs = trimmed
      ? text.split(/\n\s*\n/).filter((line) => line.trim().length > 0).length
      : 0;
    const readingTime = words > 0 ? Math.max(1, Math.ceil(words / 200)) : 0;

    return {
      words,
      characters,
      charactersWithoutSpaces,
      sentences,
      paragraphs,
      readingTime,
    };
  }, [text]);

  return (
    <>
      <TextToolActions
        onSample={() => setText(SAMPLE_TEXT)}
        onClear={() => setText("")}
        onReset={() => setText(SAMPLE_TEXT)}
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
        placeholder="Paste or type your text here..."
        className="h-56 w-full rounded-xl border bg-transparent p-4 outline-none focus:ring-2 focus:ring-blue-500"
        style={{ borderColor: "var(--border)" }}
      />

      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <ToolResultCard icon="📝" label="Words" value={stats.words} />
        <ToolResultCard icon="🔤" label="Characters" value={stats.characters} />
        <ToolResultCard
          icon="✂️"
          label="Characters (No Spaces)"
          value={stats.charactersWithoutSpaces}
        />
        <ToolResultCard icon="📍" label="Sentences" value={stats.sentences} />
        <ToolResultCard icon="📄" label="Paragraphs" value={stats.paragraphs} />
        <ToolResultCard
          icon="⏱"
          label="Reading Time (min)"
          value={stats.readingTime}
        />
      </div>
    </>
  );
}
