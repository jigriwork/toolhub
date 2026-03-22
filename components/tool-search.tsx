"use client";

import { useEffect, useMemo, useState } from "react";
import { FavoriteToolButton } from "@/components/favorite-tool-button";
import { ToolCard } from "@/components/tool-card";
import { toolCategories, tools, type ToolCategory } from "@/data/tools";
import {
  getFavoriteTools,
  getRecentTools,
  onToolStorageUpdate,
} from "@/lib/tool-storage";
import { trackSearch } from "@/lib/analytics";

export function ToolSearch() {
  const INITIAL_VISIBLE = 12;
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<ToolCategory | "All">("All");
  const [showAll, setShowAll] = useState(false);
  const [recent, setRecent] = useState<string[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    const handle = window.setTimeout(() => {
      trackSearch(query);
    }, 400);
    return () => window.clearTimeout(handle);
  }, [query]);

  useEffect(() => {
    const sync = () => {
      setRecent(getRecentTools());
      setFavorites(getFavoriteTools());
    };
    sync();
    return onToolStorageUpdate(sync);
  }, []);

  const categoryCounts = useMemo(() => {
    return tools.reduce<Record<ToolCategory, number>>(
      (acc, tool) => {
        acc[tool.category] += 1;
        return acc;
      },
      {
        Text: 0,
        Image: 0,
        Utility: 0,
        Business: 0,
        SEO: 0,
        Developer: 0,
      },
    );
  }, []);

  const recentTools = useMemo(
    () =>
      recent
        .map((slug) => tools.find((tool) => tool.slug === slug))
        .filter((tool): tool is (typeof tools)[number] => Boolean(tool)),
    [recent],
  );

  const favoriteTools = useMemo(
    () =>
      favorites
        .map((slug) => tools.find((tool) => tool.slug === slug))
        .filter((tool): tool is (typeof tools)[number] => Boolean(tool)),
    [favorites],
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
  }, [activeCategory, query]);

  const visibleTools = useMemo(
    () => (showAll ? filteredTools : filteredTools.slice(0, INITIAL_VISIBLE)),
    [filteredTools, showAll],
  );

  useEffect(() => {
    setShowAll(false);
  }, [query, activeCategory]);

  return (
    <section className="space-y-6 sm:space-y-7">
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border p-4 sm:p-5" style={{ borderColor: "var(--border)" }}>
          <h3 className="mb-3 text-base font-semibold sm:text-lg">Favorites</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            {favoriteTools.length === 0 ? (
              <p className="col-span-full text-sm" style={{ color: "var(--muted)" }}>
                No favorites yet. Tap ☆ Favorite on any tool card.
              </p>
            ) : (
              favoriteTools.slice(0, 4).map((tool) => (
                <ToolCard
                  key={`favorite-${tool.slug}`}
                  tool={tool}
                  rightSlot={<FavoriteToolButton slug={tool.slug} />}
                />
              ))
            )}
          </div>
        </div>

        <div className="rounded-2xl border p-4 sm:p-5" style={{ borderColor: "var(--border)" }}>
          <h3 className="mb-3 text-base font-semibold sm:text-lg">Recently Used</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            {recentTools.length === 0 ? (
              <p className="col-span-full text-sm" style={{ color: "var(--muted)" }}>
                No recently used tools yet. Open any tool once and it will appear here.
              </p>
            ) : (
              recentTools.slice(0, 4).map((tool) => (
                <ToolCard
                  key={`recent-${tool.slug}`}
                  tool={tool}
                  rightSlot={<FavoriteToolButton slug={tool.slug} />}
                />
              ))
            )}
          </div>
        </div>
      </div>

      <div className="premium-card card space-y-4 p-4 sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-sm font-semibold">Find tools quickly</p>
          <span className="chip">{tools.length} tools</span>
        </div>

        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search tools, use-cases, categories..."
          className="field outline-none focus:ring-2 focus:ring-blue-500"
          style={{ borderColor: "var(--border)" }}
        />

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setActiveCategory("All")}
            className={`min-h-10 rounded-full border px-3 py-1.5 text-sm font-medium ${activeCategory === "All" ? "bg-blue-600 text-white" : ""}`}
            style={activeCategory === "All" ? undefined : { borderColor: "var(--border)" }}
          >
            All ({tools.length})
          </button>
          {toolCategories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => setActiveCategory(category)}
              className={`min-h-10 rounded-full border px-3 py-1.5 text-sm font-medium ${activeCategory === category ? "bg-blue-600 text-white" : ""}`}
              style={activeCategory === category ? undefined : { borderColor: "var(--border)" }}
            >
              {category} ({categoryCounts[category]})
            </button>
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

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {visibleTools.map((tool) => (
            <ToolCard
              key={`visible-${tool.slug}`}
              tool={tool}
              rightSlot={<FavoriteToolButton slug={tool.slug} />}
            />
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
    </section>
  );
}
