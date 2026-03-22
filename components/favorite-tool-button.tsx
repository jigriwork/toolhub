"use client";

import { useEffect, useState } from "react";
import { isFavoriteTool, toggleFavoriteTool } from "@/lib/tool-storage";

export function FavoriteToolButton({ slug }: { slug: string }) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [feedback, setFeedback] = useState<"Saved" | "Removed" | null>(null);

  useEffect(() => {
    setIsFavorite(isFavoriteTool(slug));
  }, [slug]);

  return (
    <button
      type="button"
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        const next = toggleFavoriteTool(slug);
        setIsFavorite(next);
        setFeedback(next ? "Saved" : "Removed");
        window.setTimeout(() => setFeedback(null), 1200);
      }}
      className={`min-h-9 rounded-lg border px-2.5 py-1.5 text-xs font-semibold transition hover:bg-black/5 dark:hover:bg-white/10 ${
        isFavorite ? "bg-blue-600 text-white" : ""
      }`}
      style={isFavorite ? undefined : { borderColor: "var(--border)" }}
      aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
      title={isFavorite ? "Remove from favorites" : "Add to favorites"}
    >
      {feedback ? `✓ ${feedback}` : isFavorite ? "★ Saved" : "☆ Favorite"}
    </button>
  );
}
