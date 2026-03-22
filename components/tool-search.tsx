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
  const HIDDEN_CANVA_SLUGS = new Set(["festival-post-generator", "offer-poster-generator"]);
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<ToolCategory | "All">("All");
  const [recent, setRecent] = useState<string[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [stats, setStats] = useState<ToolhubStats>(emptyStats);

  const isDiscoverable = (slug: string) =>
    !HIDDEN_CANVA_SLUGS.has(slug) || favorites.includes(slug);

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

  const featuredTools = useMemo(
    () => tools.filter((tool) => tool.featured && isDiscoverable(tool.slug)),
    [favorites],
  );
  const businessTools = useMemo(
    () => tools.filter((tool) => tool.category === "Business" && isDiscoverable(tool.slug)),
    [favorites],
  );
  const recentTools = useMemo(
    () =>
      recent
        .map((slug) => tools.find((tool) => tool.slug === slug))
        .filter((tool): tool is (typeof tools)[number] => Boolean(tool))
        .filter((tool) => isDiscoverable(tool.slug)),
    [recent, favorites],
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
      .filter((tool) => isDiscoverable(tool.slug))
      .sort(
        (a, b) =>
          (stats.toolVisits[b.slug] ?? 0) - (stats.toolVisits[a.slug] ?? 0) ||
          a.name.localeCompare(b.name),
      )
      .slice(0, 6);
  }, [favorites, stats]);

  const newestTools = useMemo(
    () => [...tools].filter((tool) => isDiscoverable(tool.slug)).slice(-6).reverse(),
    [favorites],
  );

  const filteredTools = useMemo(() => {
    const q = query.trim().toLowerCase();

    return tools.filter((tool) => {
      if (!isDiscoverable(tool.slug)) return false;
      const categoryMatch =
        activeCategory === "All" ? true : tool.category === activeCategory;
      const queryMatch =
        !q || `${tool.name} ${tool.description} ${tool.seoDescription}`.toLowerCase().includes(q);
      return categoryMatch && queryMatch;
    });
  }, [query, activeCategory, favorites]);

  return (
    <section className="space-y-8 sm:space-y-10">
      <div className="premium-card card mb-4 space-y-4 p-4 sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-sm font-semibold">Find the perfect tool in seconds</p>
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
            className={`min-h-10 rounded-full border px-3 py-1.5 text-sm font-medium ${activeCategory === "All" ? "bg-blue-600 text-white" : ""
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
              className={`min-h-10 rounded-full border px-3 py-1.5 text-sm font-medium ${activeCategory === category ? "bg-blue-600 text-white" : ""
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

      <div className="space-y-2">
        <h2 className="mb-4 text-lg font-semibold sm:text-xl">All Tools</h2>
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
        <h2 className="mb-4 text-lg font-semibold sm:text-xl">Featured Tools</h2>
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
        <h2 className="mb-4 text-lg font-semibold sm:text-xl">Trending Tools</h2>
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
        <h2 className="mb-4 text-lg font-semibold sm:text-xl">New Tools</h2>
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
        <h2 className="mb-4 text-lg font-semibold sm:text-xl">Most Used Tools</h2>
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
        <h2 className="mb-4 text-lg font-semibold sm:text-xl">Recently Used</h2>
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
        <h2 className="mb-4 text-lg font-semibold sm:text-xl">Favorites</h2>
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
