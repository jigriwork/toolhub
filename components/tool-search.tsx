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
import { trackSearch, getStats, onStatsUpdate, type ToolhubStats } from "@/lib/analytics";

const emptyStats: ToolhubStats = {
  toolVisits: {},
  searches: {},
  favoritesToggles: 0,
  recentInteractions: 0,
};

export function ToolSearch() {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<ToolCategory | "All">("All");
  const [recent, setRecent] = useState<string[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
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

  return (
    <section className="space-y-8">
      <div className="mb-4 space-y-4">
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search tools..."
          className="w-full rounded-xl border bg-transparent px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
          style={{ borderColor: "var(--border)" }}
        />
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setActiveCategory("All")}
            className={`rounded-full border px-3 py-1.5 text-sm font-medium ${
              activeCategory === "All" ? "bg-blue-600 text-white" : ""
            }`}
            style={activeCategory === "All" ? undefined : { borderColor: "var(--border)" }}
          >
            All
          </button>
          {toolCategories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => setActiveCategory(category)}
              className={`rounded-full border px-3 py-1.5 text-sm font-medium ${
                activeCategory === category ? "bg-blue-600 text-white" : ""
              }`}
              style={
                activeCategory === category ? undefined : { borderColor: "var(--border)" }
              }
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h2 className="mb-4 text-xl font-semibold">All Tools</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredTools.map((tool) => (
            <ToolCard
              key={tool.slug}
              tool={tool}
              rightSlot={<FavoriteToolButton slug={tool.slug} />}
            />
          ))}
        </div>
      </div>

      <div>
        <h2 className="mb-4 text-xl font-semibold">Featured Tools</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {featuredTools.map((tool) => (
            <ToolCard
              key={tool.slug}
              tool={tool}
              rightSlot={<FavoriteToolButton slug={tool.slug} />}
            />
          ))}
        </div>
      </div>

      <div>
        <h2 className="mb-4 text-xl font-semibold">Trending Tools</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {trendingTools.map((tool) => (
            <ToolCard
              key={`trending-${tool.slug}`}
              tool={tool}
              rightSlot={<FavoriteToolButton slug={tool.slug} />}
            />
          ))}
        </div>
      </div>

      <div>
        <h2 className="mb-4 text-xl font-semibold">New Tools</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {newestTools.map((tool) => (
            <ToolCard
              key={`new-${tool.slug}`}
              tool={tool}
              rightSlot={<FavoriteToolButton slug={tool.slug} />}
            />
          ))}
        </div>
      </div>

      <div>
        <h2 className="mb-4 text-xl font-semibold">Most Used Tools</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {trendingTools.map((tool) => (
            <ToolCard
              key={`most-used-${tool.slug}`}
              tool={tool}
              rightSlot={<FavoriteToolButton slug={tool.slug} />}
            />
          ))}
        </div>
      </div>

      <div>
        <h2 className="mb-4 text-xl font-semibold">Recently Used</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {recentTools.length === 0 ? (
            <p className="text-sm" style={{ color: "var(--muted)" }}>
              No recently used tools yet. Open any tool to populate this section.
            </p>
          ) : (
            recentTools.map((tool) => (
              <ToolCard
                key={tool.slug}
                tool={tool}
                rightSlot={<FavoriteToolButton slug={tool.slug} />}
              />
            ))
          )}
        </div>
      </div>

      <div>
        <h2 className="mb-4 text-xl font-semibold">Favorites</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {favoriteTools.length === 0 ? (
            <p className="text-sm" style={{ color: "var(--muted)" }}>
              No favorites yet. Tap Favorite on any tool card.
            </p>
          ) : (
            favoriteTools.map((tool) => (
              <ToolCard
                key={tool.slug}
                tool={tool}
                rightSlot={<FavoriteToolButton slug={tool.slug} />}
              />
            ))
          )}
        </div>
      </div>

      {filteredTools.length === 0 && (
        <p className="mt-4 text-sm" style={{ color: "var(--muted)" }}>
          No tools found. Try another keyword.
        </p>
      )}
    </section>
  );
}
