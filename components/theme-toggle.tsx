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
        className="btn btn-secondary h-10 w-10"
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
      className="btn btn-secondary h-10 w-10"
      aria-label="Toggle theme"
      title="Toggle theme"
    >
      {isDark ? "☀️" : "🌙"}
    </button>
  );
}
