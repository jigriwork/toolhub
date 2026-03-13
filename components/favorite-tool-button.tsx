"use client";

import { useEffect, useState } from "react";
import { isFavoriteTool, toggleFavoriteTool } from "@/lib/tool-storage";

export function FavoriteToolButton({ slug }: { slug: string }) {
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    setIsFavorite(isFavoriteTool(slug));
  }, [slug]);

  return (
    <button
      type="button"
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        setIsFavorite(toggleFavoriteTool(slug));
      }}
      className="rounded-lg border px-2.5 py-1 text-xs font-semibold transition hover:bg-black/5 dark:hover:bg-white/10"
      style={{ borderColor: "var(--border)" }}
      aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
      title={isFavorite ? "Remove from favorites" : "Add to favorites"}
    >
      {isFavorite ? "★ Favorite" : "☆ Favorite"}
    </button>
  );
}
