"use client";

import { trackFavoriteInteraction, trackRecentInteraction } from "@/lib/analytics";

const FAVORITES_KEY = "toolhub_favorite_tools";
const RECENT_KEY = "toolhub_recent_tools";
const STORAGE_EVENT = "toolhub-tool-storage-update";
const MAX_RECENT = 10;

function readList(key: string): string[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((item): item is string => typeof item === "string");
  } catch {
    return [];
  }
}

function writeList(key: string, value: string[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, JSON.stringify(value));
  window.dispatchEvent(new CustomEvent(STORAGE_EVENT));
}

export function getFavoriteTools() {
  return readList(FAVORITES_KEY);
}

export function isFavoriteTool(slug: string) {
  return getFavoriteTools().includes(slug);
}

export function toggleFavoriteTool(slug: string) {
  const current = getFavoriteTools();
  const exists = current.includes(slug);
  const next = exists ? current.filter((item) => item !== slug) : [...current, slug];
  writeList(FAVORITES_KEY, next);
  trackFavoriteInteraction();
  return !exists;
}

export function getRecentTools() {
  return readList(RECENT_KEY);
}

export function addRecentTool(slug: string) {
  const current = getRecentTools();
  const next = [slug, ...current.filter((item) => item !== slug)].slice(0, MAX_RECENT);
  writeList(RECENT_KEY, next);
  trackRecentInteraction();
}

export function onToolStorageUpdate(handler: () => void) {
  if (typeof window === "undefined") return () => {};
  window.addEventListener(STORAGE_EVENT, handler);
  window.addEventListener("storage", handler);
  return () => {
    window.removeEventListener(STORAGE_EVENT, handler);
    window.removeEventListener("storage", handler);
  };
}
