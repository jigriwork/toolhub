"use client";

import { useMemo, useState } from "react";
import { ToolCard } from "@/components/tool-card";
import { tools } from "@/data/tools";

export function ToolSearch() {
  const [query, setQuery] = useState("");

  const filteredTools = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) {
      return tools;
    }

    return tools.filter((tool) =>
      `${tool.name} ${tool.description}`.toLowerCase().includes(q),
    );
  }, [query]);

  return (
    <section>
      <div className="mb-6">
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search tools..."
          className="w-full rounded-xl border bg-transparent px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
          style={{ borderColor: "var(--border)" }}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredTools.map((tool) => (
          <ToolCard key={tool.slug} tool={tool} />
        ))}
      </div>

      {filteredTools.length === 0 && (
        <p className="mt-4 text-sm" style={{ color: "var(--muted)" }}>
          No tools found. Try another keyword.
        </p>
      )}
    </section>
  );
}
