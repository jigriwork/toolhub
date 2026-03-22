"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { FavoriteToolButton } from "@/components/favorite-tool-button";
import { ToolCard } from "@/components/tool-card";
import { toolCategories, tools, type ToolCategory } from "@/data/tools";
import {
  getFavoriteTools,
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
  const INITIAL_VISIBLE = 12;
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<ToolCategory | "All">("All");
  const [showAll, setShowAll] = useState(false);
  const [quickView, setQuickView] = useState<"Featured" | "Trending" | "New">("Featured");
  const [recent, setRecent] = useState<string[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [stats, setStats] = useState<ToolhubStats>(emptyStats);
  const resultsRef = useRef<HTMLDivElement | null>(null);
  const quickPicksRef = useRef<HTMLDivElement | null>(null);
  const hasInteractedWithCategory = useRef(false);

  useEffect(() => {
    const handle = window.setTimeout(() => {
      trackSearch(query);
    }, 500);
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

  const trendingTools = useMemo(() => {
    return [...tools]
      .sort(
        (a, b) =>
          (stats.toolVisits[b.slug] ?? 0) - (stats.toolVisits[a.slug] ?? 0) ||
          a.name.localeCompare(b.name),
      )
      .slice(0, 6);
  }, [stats]);

  const newestTools = useMemo(() => [...tools].slice(-6).reverse(), []);

  const categoryCounts = useMemo(() => {
    return tools.reduce<Record<ToolCategory, number>>((acc, tool) => {
      acc[tool.category] += 1;
      return acc;
    }, {
      Text: 0,
      Image: 0,
      Utility: 0,
      Business: 0,
      SEO: 0,
      Developer: 0,
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

  const quickViewTools = useMemo(() => {
    if (quickView === "Trending") return trendingTools;
    if (quickView === "New") return newestTools;
    return featuredTools;
  }, [featuredTools, newestTools, quickView, trendingTools]);

  const visibleFilteredTools = useMemo(
    () => (showAll ? filteredTools : filteredTools.slice(0, INITIAL_VISIBLE)),
    [filteredTools, showAll],
  );

  useEffect(() => {
    if (!hasInteractedWithCategory.current) return;
    resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [activeCategory]);

  return (
    <section className="space-y-8 sm:space-y-10">
      <div className="premium-card card mb-4 space-y-4 p-4 sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-sm font-semibold">Find the perfect tool in seconds</p>
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
              hasInteractedWithCategory.current = true;
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
                hasInteractedWithCategory.current = true;
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
      </div>

      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-lg font-semibold sm:text-xl">Your Shortcuts</h2>
          <p className="text-xs sm:text-sm" style={{ color: "var(--muted)" }}>
            Recently used tools and favorites at one place
          </p>
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border p-4 sm:p-5" style={{ borderColor: "var(--border)" }}>
            <h3 className="mb-3 text-base font-semibold sm:text-lg">Recently Used</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              {recentTools.length === 0 ? (
                <div className="col-span-full rounded-xl border border-dashed p-4 text-sm" style={{ borderColor: "var(--border)", color: "var(--muted)" }}>
                  <p className="font-medium">No recently used tools yet.</p>
                  <p className="mt-1">Open any tool once and it will appear here automatically.</p>
                  <button
                    type="button"
                    className="btn btn-secondary mt-3"
                    onClick={() => quickPicksRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })}
                  >
                    Browse Quick Picks
                  </button>
                </div>
              ) : (
                recentTools.slice(0, 4).map((tool) => (
                  <ToolCard
                    key={tool.slug}
                    tool={tool}
                    rightSlot={<FavoriteToolButton slug={tool.slug} />}
                  />
                ))
              )}
            </div>
          </div>

          <div className="rounded-2xl border p-4 sm:p-5" style={{ borderColor: "var(--border)" }}>
            <h3 className="mb-3 text-base font-semibold sm:text-lg">Favorites</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              {favoriteTools.length === 0 ? (
                <div className="col-span-full rounded-xl border border-dashed p-4 text-sm" style={{ borderColor: "var(--border)", color: "var(--muted)" }}>
                  <p className="font-medium">No favorites yet.</p>
                  <p className="mt-1">Tap ☆ Favorite on any tool card to pin it here.</p>
                  <button
                    type="button"
                    className="btn btn-secondary mt-3"
                    onClick={() => {
                      hasInteractedWithCategory.current = true;
                      setActiveCategory("All");
                      resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
                    }}
                  >
                    Explore All Tools
                  </button>
                </div>
              ) : (
                favoriteTools.slice(0, 4).map((tool) => (
                  <ToolCard
                    key={tool.slug}
                    tool={tool}
                    rightSlot={<FavoriteToolButton slug={tool.slug} />}
                  />
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <h2 className="mb-4 text-lg font-semibold sm:text-xl">Business Suite</h2>
        <p className="mb-4 text-sm" style={{ color: "var(--muted)" }}>
          Discover business-ready tools for invoices, festive creatives, offer posters, and marketing captions.
        </p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {businessTools.map((tool) => (
            <ToolCard
              key={`business-${tool.slug}`}
              tool={tool}
              rightSlot={<FavoriteToolButton slug={tool.slug} />}
            />
          ))}
        </div>
      </div>

      <div ref={quickPicksRef} className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-lg font-semibold sm:text-xl">Quick Picks</h2>
          <div className="flex flex-wrap gap-2">
            {(["Featured", "Trending", "New"] as const).map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => setQuickView(mode)}
                className={`min-h-9 rounded-full border px-3 py-1.5 text-xs font-semibold sm:text-sm ${quickView === mode ? "bg-blue-600 text-white" : ""}`}
                style={quickView === mode ? undefined : { borderColor: "var(--border)" }}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {quickViewTools.map((tool) => (
            <ToolCard
              key={`quick-${quickView.toLowerCase()}-${tool.slug}`}
              tool={tool}
              rightSlot={<FavoriteToolButton slug={tool.slug} />}
            />
          ))}
        </div>
      </div>

      <div ref={resultsRef} className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-lg font-semibold sm:text-xl">
            {activeCategory === "All" ? "All Tools" : `${activeCategory} Tools`}
          </h2>
          <p className="text-xs sm:text-sm" style={{ color: "var(--muted)" }}>
            Showing {filteredTools.length} tool{filteredTools.length === 1 ? "" : "s"}
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {visibleFilteredTools.map((tool) => (
            <ToolCard
              key={`all-${tool.slug}`}
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

      {filteredTools.length === 0 && (
        <p className="mt-4 text-sm" style={{ color: "var(--muted)" }}>
          No tools found. Try another keyword.
        </p>
      )}
    </section>
  );
}
