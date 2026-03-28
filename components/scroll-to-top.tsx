"use client";

import { useEffect, useState } from "react";

export function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 320);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      type="button"
      aria-label="Scroll to top"
      title="Back to top"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="fixed bottom-5 right-5 z-50 rounded-full border px-3 py-2 text-sm font-semibold shadow-lg transition hover:-translate-y-0.5"
      style={{
        borderColor: "color-mix(in oklab, var(--border) 72%, var(--primary))",
        background: "color-mix(in oklab, var(--card) 90%, var(--primary) 10%)",
      }}
    >
      ↑ Top
    </button>
  );
}
