"use client";

import { useMemo, useState } from "react";

export function MetaTagGeneratorTool() {
  const [title, setTitle] = useState("ToolHub | Business & Creative Tools");
  const [description, setDescription] = useState(
    "Fast browser-based tools for billing, creative assets, and daily business operations.",
  );
  const [ogImage, setOgImage] = useState("https://www.example.com/og-image.jpg");
  const [ogTitle, setOgTitle] = useState("ToolHub | Business & Creative Tools");
  const [ogDescription, setOgDescription] = useState(
    "Use ToolHub to create invoices, quotes, social creatives, and utility outputs quickly.",
  );
  const [robots, setRobots] = useState("index,follow");
  const [canonical, setCanonical] = useState("https://www.example.com/page");
  const [copied, setCopied] = useState(false);

  const output = useMemo(() => {
    const lines = [
      `<title>${title.trim()}</title>`,
      `<meta name="description" content="${description.trim()}" />`,
      `<meta name="robots" content="${robots.trim()}" />`,
      `<link rel="canonical" href="${canonical.trim()}" />`,
      `<meta property="og:title" content="${ogTitle.trim()}" />`,
      `<meta property="og:description" content="${ogDescription.trim()}" />`,
      `<meta property="og:image" content="${ogImage.trim()}" />`,
    ];

    return lines.join("\n");
  }, [title, description, robots, canonical, ogTitle, ogDescription, ogImage]);

  const copyOutput = async () => {
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="space-y-5">
      <div className="grid gap-4 md:grid-cols-2">
        <label className="text-sm font-medium">
          Title tag
          <input className="field mt-1" value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Page title" />
        </label>
        <label className="text-sm font-medium">
          Meta description
          <textarea className="textarea mt-1 min-h-[96px]" value={description} onChange={(event) => setDescription(event.target.value)} placeholder="Write a concise page summary" />
        </label>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="text-sm font-medium">
          OG title
          <input className="field mt-1" value={ogTitle} onChange={(event) => setOgTitle(event.target.value)} placeholder="Open Graph title" />
        </label>
        <label className="text-sm font-medium">
          OG description
          <textarea className="textarea mt-1 min-h-[96px]" value={ogDescription} onChange={(event) => setOgDescription(event.target.value)} placeholder="Open Graph description" />
        </label>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <label className="text-sm font-medium md:col-span-2">
          OG image URL
          <input className="field mt-1" value={ogImage} onChange={(event) => setOgImage(event.target.value)} placeholder="https://..." />
        </label>
        <label className="text-sm font-medium">
          Robots
          <input className="field mt-1" value={robots} onChange={(event) => setRobots(event.target.value)} placeholder="index,follow" />
        </label>
      </div>

      <label className="block text-sm font-medium">
        Canonical URL
        <input className="field mt-1" value={canonical} onChange={(event) => setCanonical(event.target.value)} placeholder="https://..." />
      </label>

      <div className="rounded-xl border p-4" style={{ borderColor: "var(--border)" }}>
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <p className="text-sm font-semibold">Generated HTML meta tags</p>
          <button type="button" className="btn btn-secondary" onClick={() => void copyOutput()}>
            {copied ? "Copied!" : "Copy tags"}
          </button>
        </div>
        <pre className="overflow-x-auto rounded-lg bg-slate-950 p-3 text-xs text-slate-100">
          <code>{output}</code>
        </pre>
      </div>
    </div>
  );
}
