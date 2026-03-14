"use client";

export type ToolhubStats = {
  toolVisits: Record<string, number>;
  searches: Record<string, number>;
  favoritesToggles: number;
  recentInteractions: number;
};

const KEY = "toolhub_analytics_stats";
const EVENT = "toolhub-analytics-update";

const defaultStats: ToolhubStats = {
  toolVisits: {},
  searches: {},
  favoritesToggles: 0,
  recentInteractions: 0,
};

async function sendAnalyticsEvent(event: {
  eventType: "tool_visit" | "search" | "favorite_toggle" | "recent_interaction";
  slug?: string;
  term?: string;
  metadata?: Record<string, unknown>;
}) {
  if (typeof window === "undefined") return;

  try {
    await fetch("/api/analytics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(event),
      keepalive: true,
    });
  } catch {
    // Ignore analytics network errors silently.
  }
}

export function getStats(): ToolhubStats {
  if (typeof window === "undefined") return defaultStats;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return defaultStats;
    return { ...defaultStats, ...(JSON.parse(raw) as Partial<ToolhubStats>) };
  } catch {
    return defaultStats;
  }
}

function setStats(next: ToolhubStats) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(next));
  window.dispatchEvent(new CustomEvent(EVENT));
}

export function trackToolVisit(slug: string) {
  const stats = getStats();
  stats.toolVisits[slug] = (stats.toolVisits[slug] ?? 0) + 1;
  setStats(stats);
  void sendAnalyticsEvent({ eventType: "tool_visit", slug });
}

export function trackSearch(query: string) {
  const term = query.trim().toLowerCase();
  if (term.length < 2) return;
  const stats = getStats();
  stats.searches[term] = (stats.searches[term] ?? 0) + 1;
  setStats(stats);
  void sendAnalyticsEvent({ eventType: "search", term });
}

export function trackFavoriteInteraction() {
  const stats = getStats();
  stats.favoritesToggles += 1;
  setStats(stats);
  void sendAnalyticsEvent({ eventType: "favorite_toggle" });
}

export function trackRecentInteraction() {
  const stats = getStats();
  stats.recentInteractions += 1;
  setStats(stats);
  void sendAnalyticsEvent({ eventType: "recent_interaction" });
}

export function onStatsUpdate(handler: () => void) {
  if (typeof window === "undefined") return () => {};
  window.addEventListener(EVENT, handler);
  window.addEventListener("storage", handler);
  return () => {
    window.removeEventListener(EVENT, handler);
    window.removeEventListener("storage", handler);
  };
}
