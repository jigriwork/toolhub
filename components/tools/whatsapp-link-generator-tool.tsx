"use client";

import { useMemo, useState } from "react";

function normalizePhone(raw: string) {
  return raw.replace(/[^\d]/g, "");
}

export function WhatsappLinkGeneratorTool() {
  const [phone, setPhone] = useState("91");
  const [message, setMessage] = useState("");
  const [copied, setCopied] = useState(false);

  const link = useMemo(() => {
    const normalized = normalizePhone(phone);
    if (!normalized) return "";
    const query = message.trim() ? `?text=${encodeURIComponent(message.trim())}` : "";
    return `https://wa.me/${normalized}${query}`;
  }, [phone, message]);

  const copyLink = async () => {
    if (!link) return;
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="space-y-5">
      <div className="grid gap-4 md:grid-cols-2">
        <label className="text-sm font-medium">
          Phone number (with country code)
          <input
            className="field mt-1"
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            placeholder="919876543210"
          />
        </label>

        <label className="text-sm font-medium">
          Prefilled message (optional)
          <textarea
            className="textarea mt-1 min-h-[96px]"
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            placeholder="Hi! I want details for your latest offer."
          />
        </label>
      </div>

      <div className="rounded-xl border p-4" style={{ borderColor: "var(--border)" }}>
        <p className="text-sm font-semibold">Generated wa.me link</p>
        <p className="mt-2 break-all text-sm" style={{ color: "var(--muted)" }}>
          {link || "Enter a valid phone number to generate your WhatsApp link."}
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        <button type="button" className="btn btn-primary" onClick={() => window.open(link, "_blank", "noopener,noreferrer")} disabled={!link}>
          Open link
        </button>
        <button type="button" className="btn btn-secondary" onClick={() => void copyLink()} disabled={!link}>
          {copied ? "Copied!" : "Copy link"}
        </button>
      </div>
    </div>
  );
}
