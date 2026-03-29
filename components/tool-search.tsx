"use client";

import { useEffect, useMemo, useState } from "react";
import { ToolCard } from "@/components/tool-card";
import { toolCategories, tools, type ToolCategory } from "@/data/tools";
import {
  getRecentTools,
  onToolStorageUpdate,
} from "../lib/tool-storage";
import { trackSearch, getStats, onStatsUpdate, type ToolhubStats } from "@/lib/analytics";

const emptyStats: ToolhubStats = {
  toolVisits: {},
  searches: {},
  favoritesToggles: 0,
  recentInteractions: 0,
};

export function ToolSearch() {
  const INITIAL_VISIBLE = 16;
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<ToolCategory | "All">("All");
  const [showAll, setShowAll] = useState(false);
  const [recent, setRecent] = useState<string[]>([]);
  const [stats, setStats] = useState<ToolhubStats>(emptyStats);

  useEffect(() => {
    const handle = window.setTimeout(() => {
      trackSearch(query);
    }, 500);
    return () => window.clearTimeout(handle);
  }, [query]);

  useEffect(() => {
    const sync = () => {
      setRecent(getRecentTools());
    };
    sync();
    return onToolStorageUpdate(sync);
  }, []);

  useEffect(() => {
    const syncStats = () => setStats(getStats());
    syncStats();
    return onStatsUpdate(syncStats);
  }, []);

  const featuredTools = useMemo(() => tools.filter((tool) => tool.featured), []);
  const businessTools = useMemo(
    () => tools.filter((tool) => tool.category === "Business"),
    [],
  );
  const creativeTools = useMemo(
    () => tools.filter((tool) => tool.category === "Creative"),
    [],
  );
  const imagePdfTools = useMemo(
    () => tools.filter((tool) => tool.category === "Image & PDF"),
    [],
  );
  const recentTools = useMemo(
    () =>
      recent
        .map((slug) => tools.find((tool) => tool.slug === slug))
        .filter((tool): tool is (typeof tools)[number] => Boolean(tool)),
    [recent],
  );

  const popularTools = useMemo(() => {
    return [...tools]
      .sort(
        (a, b) =>
          (stats.toolVisits[b.slug] ?? 0) - (stats.toolVisits[a.slug] ?? 0) ||
          a.name.localeCompare(b.name),
      )
      .slice(0, 6);
  }, [stats]);

  const categoryCounts = useMemo(() => {
    return tools.reduce<Record<ToolCategory, number>>((acc, tool) => {
      acc[tool.category] += 1;
      return acc;
    }, {
      Business: 0,
      Creative: 0,
      "Image & PDF": 0,
      Essentials: 0,
    });
  }, []);

  const availableCategories = useMemo(
    () => toolCategories.filter((category) => categoryCounts[category] > 0),
    [categoryCounts],
  );

  const filteredTools = useMemo(() => {
    const q = query.trim().toLowerCase();

    return tools.filter((tool) => {
      const categoryMatch =
        activeCategory === "All" ? true : tool.category === activeCategory;
      const queryMatch =
        !q || `${tool.name} ${tool.description} ${tool.seoDescription}`.toLowerCase().includes(q);
      return categoryMatch && queryMatch;
    });
  }, [query, activeCategory]);

  const visibleFilteredTools = useMemo(
    () => (showAll ? filteredTools : filteredTools.slice(0, INITIAL_VISIBLE)),
    [filteredTools, showAll],
  );

  return (
    <section className="space-y-8 sm:space-y-10">
      <div className="premium-card card mb-4 space-y-4 p-4 sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-sm font-semibold">Find the right tool in seconds</p>
          <span className="chip">{tools.length} tools</span>
        </div>
        <input
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setShowAll(false);
          }}
          placeholder="Search tools, use-cases, categories..."
          className="field outline-none focus:ring-2 focus:ring-blue-500"
          style={{ borderColor: "var(--border)" }}
        />
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => {
              setActiveCategory("All");
              setShowAll(false);
            }}
            className={`min-h-10 rounded-full border px-3 py-1.5 text-sm font-medium ${activeCategory === "All" ? "bg-blue-600 text-white" : ""
              }`}
            style={activeCategory === "All" ? undefined : { borderColor: "var(--border)" }}
          >
            All ({tools.length})
          </button>
          {availableCategories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => {
                setActiveCategory(category);
                setShowAll(false);
              }}
              className={`min-h-10 rounded-full border px-3 py-1.5 text-sm font-medium ${activeCategory === category ? "bg-blue-600 text-white" : ""
                }`}
              style={
                activeCategory === category ? undefined : { borderColor: "var(--border)" }
              }
            >
              {category} ({categoryCounts[category]})
            </button>
          ))}
        </div>
        <p className="text-xs" style={{ color: "var(--muted)" }}>
          Start with Business Suite for invoices, quotations, POS, and payments. Then use Creative, Image & PDF, and Essentials as support tools.
        </p>
      </div>

      <div className="space-y-2">
        <h2 className="mb-4 text-lg font-semibold sm:text-xl">Business Suite</h2>
        <p className="mb-4 text-sm" style={{ color: "var(--muted)" }}>
          Core operations tools for billing, documentation, taxation, and POS.
        </p>
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {businessTools.map((tool) => (
            <ToolCard key={`business-${tool.slug}`} tool={tool} />
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <h2 className="text-lg font-semibold sm:text-xl">Creative Studio</h2>
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
          {creativeTools.map((tool) => (
            <ToolCard key={`creative-${tool.slug}`} tool={tool} />
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <h2 className="text-lg font-semibold sm:text-xl">Image & PDF Tools</h2>
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {imagePdfTools.slice(0, 8).map((tool) => (
            <ToolCard key={`imgpdf-${tool.slug}`} tool={tool} />
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-lg font-semibold sm:text-xl">Popular Tools</h2>
          <p className="text-xs sm:text-sm" style={{ color: "var(--muted)" }}>
            Based on usage trends and featured priority
          </p>
        </div>
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
          {(recentTools.length > 0 ? recentTools.slice(0, 3) : featuredTools.slice(0, 3)).concat(popularTools.slice(0, 3)).slice(0, 6).map((tool) => (
            <ToolCard key={`popular-${tool.slug}`} tool={tool} />
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-lg font-semibold sm:text-xl">
            {activeCategory === "All" ? "All Tools" : `${activeCategory} Tools`}
          </h2>
          <p className="text-xs sm:text-sm" style={{ color: "var(--muted)" }}>
            Showing {filteredTools.length} tool{filteredTools.length === 1 ? "" : "s"}
          </p>
        </div>
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {visibleFilteredTools.map((tool) => (
            <ToolCard key={`all-${tool.slug}`} tool={tool} />
          ))}
        </div>
        {filteredTools.length > INITIAL_VISIBLE ? (
          <div className="pt-1">
            <button
              type="button"
              onClick={() => setShowAll((value) => !value)}
              className="btn btn-secondary"
            >
              {showAll ? "Show Less" : `Show All (${filteredTools.length})`}
            </button>
          </div>
        ) : null}
      </div>

      {filteredTools.length === 0 && (
        <div className="rounded-xl border border-dashed p-4 text-sm" style={{ borderColor: "var(--border)", color: "var(--muted)" }}>
          No tools found for this search. Try another keyword or switch category.
        </div>
      )}
    </section>
  );
}
