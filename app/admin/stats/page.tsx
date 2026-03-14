"use client";

import { useEffect, useMemo, useState } from "react";
import { getStats, onStatsUpdate } from "@/lib/analytics";
import { getToolBySlug } from "@/data/tools";

export default function AdminStatsPage() {
  const [stats, setStats] = useState(getStats());

  useEffect(() => {
    const sync = () => setStats(getStats());
    sync();
    return onStatsUpdate(sync);
  }, []);

  const topTools = useMemo(
    () =>
      Object.entries(stats.toolVisits)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 12),
    [stats.toolVisits],
  );

  const topSearches = useMemo(
    () =>
      Object.entries(stats.searches)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 12),
    [stats.searches],
  );

  return (
    <main className="container py-10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-3xl font-bold">Admin Stats</h1>
        <form action="/admin/logout" method="post">
          <button
            type="submit"
            className="rounded-md border px-3 py-1.5 text-sm font-medium"
            style={{ borderColor: "var(--border)" }}
          >
            Logout
          </button>
        </form>
      </div>
      <p className="mt-2 text-sm" style={{ color: "var(--muted)" }}>
        Local analytics snapshot for product iteration. Replace with backend pipeline later.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="card p-4">
          <p className="text-xs uppercase" style={{ color: "var(--muted)" }}>Favorite toggles</p>
          <p className="mt-1 text-2xl font-semibold">{stats.favoritesToggles}</p>
        </div>
        <div className="card p-4">
          <p className="text-xs uppercase" style={{ color: "var(--muted)" }}>Recent interactions</p>
          <p className="mt-1 text-2xl font-semibold">{stats.recentInteractions}</p>
        </div>
        <div className="card p-4">
          <p className="text-xs uppercase" style={{ color: "var(--muted)" }}>Unique searched terms</p>
          <p className="mt-1 text-2xl font-semibold">{Object.keys(stats.searches).length}</p>
        </div>
        <div className="card p-4">
          <p className="text-xs uppercase" style={{ color: "var(--muted)" }}>Visited tool types</p>
          <p className="mt-1 text-2xl font-semibold">{Object.keys(stats.toolVisits).length}</p>
        </div>
      </div>

      <section className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="card p-5">
          <h2 className="text-xl font-semibold">Most visited tools</h2>
          <ul className="mt-4 space-y-2 text-sm">
            {topTools.length === 0 ? (
              <li style={{ color: "var(--muted)" }}>No visits tracked yet.</li>
            ) : (
              topTools.map(([slug, count]) => (
                <li key={slug} className="flex items-center justify-between rounded-lg border px-3 py-2" style={{ borderColor: "var(--border)" }}>
                  <span>{getToolBySlug(slug)?.name ?? slug}</span>
                  <span className="font-semibold">{count}</span>
                </li>
              ))
            )}
          </ul>
        </div>

        <div className="card p-5">
          <h2 className="text-xl font-semibold">Most searched terms</h2>
          <ul className="mt-4 space-y-2 text-sm">
            {topSearches.length === 0 ? (
              <li style={{ color: "var(--muted)" }}>No searches tracked yet.</li>
            ) : (
              topSearches.map(([term, count]) => (
                <li key={term} className="flex items-center justify-between rounded-lg border px-3 py-2" style={{ borderColor: "var(--border)" }}>
                  <span>{term}</span>
                  <span className="font-semibold">{count}</span>
                </li>
              ))
            )}
          </ul>
        </div>
      </section>
    </main>
  );
}
