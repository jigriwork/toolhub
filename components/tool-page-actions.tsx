"use client";

import { useEffect, useState } from "react";
import { trackToolVisit } from "@/lib/analytics";
import { addRecentTool } from "@/lib/tool-storage";

export function ToolPageActions({ slug }: { slug: string }) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    addRecentTool(slug);
    trackToolVisit(slug);
  }, [slug]);

  return (
    <button
      type="button"
      className="btn btn-secondary"
      onClick={async () => {
        await navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1400);
      }}
    >
      {copied ? "Link copied" : "Share / Copy Link"}
    </button>
  );
}
