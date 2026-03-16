"use client";

import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";

function useIsHydrated() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const isHydrated = useIsHydrated();

  if (!isHydrated || !resolvedTheme) {
    return (
      <button
        type="button"
        className="btn btn-secondary h-10 w-10 rounded-xl"
        aria-label="Toggle theme"
        title="Toggle theme"
      />
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="btn btn-secondary h-10 gap-2 rounded-xl px-3 sm:w-auto"
      aria-label="Toggle theme"
      title="Toggle theme"
    >
      <span aria-hidden>{isDark ? "☀️" : "🌙"}</span>
      <span className="hidden text-xs font-semibold sm:inline">{isDark ? "Light" : "Dark"}</span>
    </button>
  );
}
