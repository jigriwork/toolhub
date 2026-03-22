"use client";

import { useEffect, useMemo, useState } from "react";

type Store = { id: string; name: string; city: string; todaySales: number };

const STORES_KEY = "toolhub-pos-stores";
const CLOUD_FLAG_KEY = "toolhub-pos-cloud-sync-enabled";

const inr = (v: number) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(v || 0);

function loadSyncEnabled() {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(CLOUD_FLAG_KEY) === "1";
}

function loadStores(): Store[] {
  if (typeof window === "undefined") return [];
  const rawStores = localStorage.getItem(STORES_KEY);
  if (!rawStores) return [];

  try {
    const parsed = JSON.parse(rawStores) as Store[];
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (s) =>
        typeof s?.id === "string" &&
        typeof s?.name === "string" &&
        typeof s?.city === "string" &&
        typeof s?.todaySales === "number",
    );
  } catch {
    return [];
  }
}

export function CloudSyncMultiStoreTool() {
  const [syncEnabled, setSyncEnabled] = useState(loadSyncEnabled);
  const [stores, setStores] = useState<Store[]>(loadStores);
  const [newName, setNewName] = useState("");
  const [newCity, setNewCity] = useState("");

  useEffect(() => {
    localStorage.setItem(CLOUD_FLAG_KEY, syncEnabled ? "1" : "0");
  }, [syncEnabled]);

  useEffect(() => {
    localStorage.setItem(STORES_KEY, JSON.stringify(stores));
  }, [stores]);

  const totals = useMemo(
    () => ({
      outlets: stores.length,
      combinedSales: stores.reduce((s, st) => s + st.todaySales, 0),
    }),
    [stores],
  );

  return (
    <div className="space-y-5">
      <section className="rounded-xl border p-4" style={{ borderColor: "var(--border)" }}>
        <h3 className="text-base font-semibold">What this means</h3>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm" style={{ color: "var(--muted)" }}>
          <li><strong>Cloud sync</strong>: keep POS data backed up and available across devices.</li>
          <li><strong>Multi-store</strong>: manage more than one branch/outlet from one dashboard.</li>
          <li>This page is a setup planner. Your POS can run fully without cloud sync.</li>
        </ul>

        <label className="flex items-center gap-2 text-sm font-medium">
          <input type="checkbox" checked={syncEnabled} onChange={(e) => setSyncEnabled(e.target.checked)} />
          Enable optional cloud sync
        </label>
        <p className="mt-2 text-sm" style={{ color: "var(--muted)" }}>
          {syncEnabled
            ? "Cloud sync mode enabled (planner). Ready to connect backend auth + APIs."
            : "Currently local-only mode. Data remains on device."}
        </p>
      </section>

      <section className="grid gap-3 md:grid-cols-4">
        <input className="field" value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Store name" />
        <input className="field" value={newCity} onChange={(e) => setNewCity(e.target.value)} placeholder="City" />
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => {
            if (!newName.trim()) return;
            setStores((curr) => [...curr, { id: crypto.randomUUID(), name: newName.trim(), city: newCity.trim() || "N/A", todaySales: 0 }]);
            setNewName("");
            setNewCity("");
          }}
        >
          + Add store
        </button>
        <button type="button" className="btn btn-secondary" onClick={() => setStores([])} disabled={stores.length === 0}>
          Clear stores
        </button>
      </section>

      <section className="grid gap-3 md:grid-cols-2">
        <div className="rounded-xl border p-4" style={{ borderColor: "var(--border)" }}>
          <p className="text-sm" style={{ color: "var(--muted)" }}>Total outlets</p>
          <p className="text-2xl font-bold">{totals.outlets}</p>
        </div>
        <div className="rounded-xl border p-4" style={{ borderColor: "var(--border)" }}>
          <p className="text-sm" style={{ color: "var(--muted)" }}>Combined today sales</p>
          <p className="text-2xl font-bold">{inr(totals.combinedSales)}</p>
        </div>
      </section>

      <section className="rounded-xl border p-4" style={{ borderColor: "var(--border)" }}>
        <h3 className="mb-3 text-base font-semibold">Multi-store list</h3>
        {stores.length === 0 ? (
          <div className="rounded-lg border border-dashed p-6 text-center text-sm" style={{ borderColor: "var(--border)", color: "var(--muted)" }}>
            No branches added yet. Add your actual store names only.
          </div>
        ) : (
          <div className="space-y-2">
            {stores.map((store) => (
              <div key={store.id} className="flex items-center justify-between rounded-lg border px-3 py-2 text-sm" style={{ borderColor: "var(--border)" }}>
                <div>
                  <p className="font-medium">{store.name}</p>
                  <p className="text-xs text-slate-500">{store.city}</p>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    className="field max-w-36"
                    type="number"
                    min={0}
                    value={store.todaySales}
                    onChange={(e) =>
                      setStores((curr) =>
                        curr.map((x) => (x.id === store.id ? { ...x, todaySales: Number(e.target.value) || 0 } : x)),
                      )
                    }
                  />
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setStores((curr) => curr.filter((x) => x.id !== store.id))}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
