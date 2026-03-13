"use client";

import { useMemo, useState } from "react";

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border p-4" style={{ borderColor: "var(--border)" }}>
      <p className="text-xs uppercase tracking-wide" style={{ color: "var(--muted)" }}>
        {label}
      </p>
      <p className="mt-1 text-2xl font-semibold">{value}</p>
    </div>
  );
}

export function WordCounterTool() {
  const [text, setText] = useState("");

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
      <textarea
        value={text}
        onChange={(event) => setText(event.target.value)}
        placeholder="Paste or type your text here..."
        className="h-56 w-full rounded-xl border bg-transparent p-4 outline-none focus:ring-2 focus:ring-blue-500"
        style={{ borderColor: "var(--border)" }}
      />

      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard label="Words" value={stats.words} />
        <StatCard label="Characters" value={stats.characters} />
        <StatCard
          label="Characters (No Spaces)"
          value={stats.charactersWithoutSpaces}
        />
        <StatCard label="Sentences" value={stats.sentences} />
        <StatCard label="Paragraphs" value={stats.paragraphs} />
        <StatCard label="Reading Time (min)" value={stats.readingTime} />
      </div>
    </>
  );
}
