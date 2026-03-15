"use client";

import { useState } from "react";

function isValidHttpUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export function UrlShortenerTool() {
  const [inputUrl, setInputUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const generate = async () => {
    const normalized = inputUrl.trim();
    setError("");
    setShortUrl("");
    setCopied(false);

    if (!isValidHttpUrl(normalized)) {
      setError("Please enter a valid URL starting with http:// or https://");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/url-shorten", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: normalized }),
      });

      const data = (await response.json()) as { shortUrl?: string };
      const text = String(data.shortUrl ?? "").trim();

      if (!response.ok || !text.startsWith("http")) {
        throw new Error("Failed to shorten");
      }

      setShortUrl(text);
    } catch {
      setError("Could not generate a short URL right now. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <label htmlFor="long-url" className="block text-sm font-medium">
        Paste long URL
      </label>
      <input
        id="long-url"
        type="url"
        value={inputUrl}
        placeholder="https://example.com/very/long/url"
        onChange={(event) => setInputUrl(event.target.value)}
        className="w-full rounded-xl border bg-transparent px-4 py-3"
        style={{ borderColor: "var(--border)" }}
      />

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          className="btn btn-primary"
          disabled={isLoading}
          onClick={() => void generate()}
        >
          {isLoading ? "Generating..." : "Generate Short URL"}
        </button>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => {
            setInputUrl("");
            setShortUrl("");
            setError("");
            setCopied(false);
          }}
        >
          Clear
        </button>
      </div>

      {error ? <p className="text-sm text-red-500">{error}</p> : null}

      {shortUrl ? (
        <div className="rounded-xl border p-4" style={{ borderColor: "var(--border)" }}>
          <p className="text-sm" style={{ color: "var(--muted)" }}>
            Your short URL
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <a
              href={shortUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="break-all text-blue-600 underline"
            >
              {shortUrl}
            </a>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={async () => {
                await navigator.clipboard.writeText(shortUrl);
                setCopied(true);
                window.setTimeout(() => setCopied(false), 1200);
              }}
            >
              {copied ? "Copied" : "Copy"}
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
