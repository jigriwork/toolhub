"use client";

import { trackFavoriteInteraction, trackRecentInteraction } from "@/lib/analytics";

const RECENT_KEY = "toolhub_recent_tools";
const FAVORITES_KEY = "toolhub_favorite_tools";
const MAX_RECENT = 8;
const STORAGE_EVENT = "toolhub-storage-update";

function parseStringArray(value: string | null) {
  if (!value) return [] as string[];

  try {
    const parsed = JSON.parse(value) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((item): item is string => typeof item === "string");
  } catch {
    return [];
  }
}

export function getRecentTools() {
  if (typeof window === "undefined") return [] as string[];
  return parseStringArray(window.localStorage.getItem(RECENT_KEY));
}

export function addRecentTool(slug: string) {
  if (typeof window === "undefined") return;
  const current = getRecentTools();
  const next = [slug, ...current.filter((item) => item !== slug)].slice(0, MAX_RECENT);
  window.localStorage.setItem(RECENT_KEY, JSON.stringify(next));
  trackRecentInteraction();
  window.dispatchEvent(new CustomEvent(STORAGE_EVENT));
}

export function getFavoriteTools() {
  if (typeof window === "undefined") return [] as string[];
  return parseStringArray(window.localStorage.getItem(FAVORITES_KEY));
}

export function isFavoriteTool(slug: string) {
  return getFavoriteTools().includes(slug);
}

export function toggleFavoriteTool(slug: string) {
  if (typeof window === "undefined") return false;
  const current = getFavoriteTools();
  const exists = current.includes(slug);
  const next = exists
    ? current.filter((item) => item !== slug)
    : [slug, ...current.filter((item) => item !== slug)];
  window.localStorage.setItem(FAVORITES_KEY, JSON.stringify(next));
  trackFavoriteInteraction();
  window.dispatchEvent(new CustomEvent(STORAGE_EVENT));
  return !exists;
}

export function onToolStorageUpdate(handler: () => void) {
  if (typeof window === "undefined") return () => {};
  const listener = () => handler();
  window.addEventListener(STORAGE_EVENT, listener);
  window.addEventListener("storage", listener);
  return () => {
    window.removeEventListener(STORAGE_EVENT, listener);
    window.removeEventListener("storage", listener);
  };
}
