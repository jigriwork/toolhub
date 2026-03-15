"use client";

import { ChangeEvent, useEffect, useMemo, useRef, useState } from "react";

type FestivalKey =
  | "diwali"
  | "holi"
  | "eid"
  | "new-year"
  | "christmas"
  | "independence-day"
  | "republic-day"
  | "raksha-bandhan"
  | "dussehra"
  | "ganesh-chaturthi";

type ThemeKey = "premium" | "festive" | "elegant" | "bold-sale" | "modern-business";
type FormatKey = "square" | "story";

type FestivalPalette = {
  title: string;
  greeting: string;
  gradient: [string, string, string];
  accent: string;
  decorative: string;
};

const FESTIVALS: Record<FestivalKey, FestivalPalette> = {
  diwali: {
    title: "Diwali",
    greeting: "Wishing you a bright and prosperous Diwali!",
    gradient: ["#12001e", "#5c1a72", "#f59e0b"],
    accent: "#fbbf24",
    decorative: "#fde68a",
  },
  holi: {
    title: "Holi",
    greeting: "Celebrate colors, joy, and new beginnings this Holi!",
    gradient: ["#7c3aed", "#ec4899", "#22c55e"],
    accent: "#67e8f9",
    decorative: "#fde047",
  },
  eid: {
    title: "Eid",
    greeting: "Eid Mubarak! May peace and blessings be with you.",
    gradient: ["#052e2b", "#0f766e", "#99f6e4"],
    accent: "#fef08a",
    decorative: "#99f6e4",
  },
  "new-year": {
    title: "New Year",
    greeting: "Cheers to a successful and joyful New Year!",
    gradient: ["#0b1022", "#1e3a8a", "#38bdf8"],
    accent: "#93c5fd",
    decorative: "#e0f2fe",
  },
  christmas: {
    title: "Christmas",
    greeting: "Merry Christmas and warm wishes to your family!",
    gradient: ["#14532d", "#b91c1c", "#fef2f2"],
    accent: "#facc15",
    decorative: "#dcfce7",
  },
  "independence-day": {
    title: "Independence Day",
    greeting: "Proudly celebrating freedom and unity. Happy Independence Day!",
    gradient: ["#ea580c", "#ffffff", "#16a34a"],
    accent: "#1d4ed8",
    decorative: "#fed7aa",
  },
  "republic-day": {
    title: "Republic Day",
    greeting: "Honoring the spirit of the nation. Happy Republic Day!",
    gradient: ["#f97316", "#f8fafc", "#22c55e"],
    accent: "#2563eb",
    decorative: "#bae6fd",
  },
  "raksha-bandhan": {
    title: "Raksha Bandhan",
    greeting: "Celebrating the bond of love and protection. Happy Raksha Bandhan!",
    gradient: ["#7c2d12", "#be185d", "#f59e0b"],
    accent: "#fcd34d",
    decorative: "#fbcfe8",
  },
  dussehra: {
    title: "Dussehra",
    greeting: "May goodness and success triumph this Dussehra!",
    gradient: ["#7f1d1d", "#ea580c", "#facc15"],
    accent: "#fde68a",
    decorative: "#ffedd5",
  },
  "ganesh-chaturthi": {
    title: "Ganesh Chaturthi",
    greeting: "Ganpati Bappa Morya! Wishing joy and prosperity.",
    gradient: ["#7c3aed", "#1d4ed8", "#f59e0b"],
    accent: "#fdba74",
    decorative: "#ddd6fe",
  },
};

const THEMES: Record<ThemeKey, { overlay: string; panel: string; heading: string; body: string; tag: string }> = {
  premium: {
    overlay: "rgba(10, 10, 10, 0.35)",
    panel: "rgba(17, 24, 39, 0.78)",
    heading: "#ffffff",
    body: "#e5e7eb",
    tag: "#fde68a",
  },
  festive: {
    overlay: "rgba(255, 255, 255, 0.08)",
    panel: "rgba(255, 255, 255, 0.18)",
    heading: "#ffffff",
    body: "#f8fafc",
    tag: "#fef08a",
  },
  elegant: {
    overlay: "rgba(14, 14, 14, 0.42)",
    panel: "rgba(255, 255, 255, 0.14)",
    heading: "#f8fafc",
    body: "#f1f5f9",
    tag: "#e2e8f0",
  },
  "bold-sale": {
    overlay: "rgba(12, 17, 29, 0.2)",
    panel: "rgba(17, 24, 39, 0.86)",
    heading: "#ffffff",
    body: "#fef3c7",
    tag: "#fb7185",
  },
  "modern-business": {
    overlay: "rgba(15, 23, 42, 0.24)",
    panel: "rgba(15, 23, 42, 0.68)",
    heading: "#ffffff",
    body: "#dbeafe",
    tag: "#7dd3fc",
  },
};

function drawWrappedText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
  maxLines = 4,
) {
  const words = text.split(/\s+/).filter(Boolean);
  if (words.length === 0) return 0;

  const lines: string[] = [];
  let currentLine = words[0] ?? "";

  for (let i = 1; i < words.length; i += 1) {
    const test = `${currentLine} ${words[i]}`;
    if (ctx.measureText(test).width < maxWidth) {
      currentLine = test;
    } else {
      lines.push(currentLine);
      currentLine = words[i] ?? "";
    }
  }
  lines.push(currentLine);

  const sliced = lines.slice(0, maxLines);
  if (lines.length > maxLines && sliced.length > 0) {
    sliced[sliced.length - 1] = `${sliced[sliced.length - 1]}...`;
  }

  sliced.forEach((line, index) => ctx.fillText(line, x, y + index * lineHeight));
  return sliced.length * lineHeight;
}

export function FestivalPostGeneratorTool() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const logoRef = useRef<HTMLImageElement | null>(null);

  const [festival, setFestival] = useState<FestivalKey>("diwali");
  const [theme, setTheme] = useState<ThemeKey>("premium");
  const [format, setFormat] = useState<FormatKey>("square");

  const [businessName, setBusinessName] = useState("Your Business Name");
  const [phone, setPhone] = useState("+91 90000 00000");
  const [website, setWebsite] = useState("@yourbrand");
  const [addressTagline, setAddressTagline] = useState("Trusted quality. Better value.");
  const [ctaLine, setCtaLine] = useState("Visit us today");
  const [customMessage, setCustomMessage] = useState("");
  const [offerLine, setOfferLine] = useState("Festive offer up to 30% OFF");
  const [logoDataUrl, setLogoDataUrl] = useState("");

  const dimensions = format === "story" ? { width: 1080, height: 1920 } : { width: 1080, height: 1080 };

  const greeting = useMemo(() => customMessage.trim() || FESTIVALS[festival].greeting, [customMessage, festival]);

  useEffect(() => {
    if (!logoDataUrl) {
      logoRef.current = null;
      return;
    }
    const image = new Image();
    image.onload = () => {
      logoRef.current = image;
      drawPreview();
    };
    image.src = logoDataUrl;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [logoDataUrl]);

  const drawPreview = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const { width, height } = dimensions;
    canvas.width = width;
    canvas.height = height;

    const palette = FESTIVALS[festival];
    const style = THEMES[theme];

    const bg = ctx.createLinearGradient(0, 0, width, height);
    bg.addColorStop(0, palette.gradient[0]);
    bg.addColorStop(0.5, palette.gradient[1]);
    bg.addColorStop(1, palette.gradient[2]);
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, width, height);

    ctx.fillStyle = style.overlay;
    ctx.fillRect(0, 0, width, height);

    ctx.globalAlpha = 0.24;
    ctx.fillStyle = palette.decorative;
    ctx.beginPath();
    ctx.arc(width * 0.14, height * 0.14, width * 0.16, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(width * 0.88, height * 0.3, width * 0.12, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(width * 0.18, height * 0.85, width * 0.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;

    const panelX = width * 0.08;
    const panelWidth = width * 0.84;
    const panelHeight = format === "story" ? height * 0.6 : height * 0.62;
    const panelY = format === "story" ? height * 0.2 : height * 0.2;

    ctx.fillStyle = style.panel;
    ctx.beginPath();
    ctx.roundRect(panelX, panelY, panelWidth, panelHeight, 28);
    ctx.fill();

    let cursorY = panelY + 78;
    const textX = panelX + 56;
    const textWidth = panelWidth - 112;

    ctx.fillStyle = style.tag;
    ctx.font = "700 28px Inter, system-ui, sans-serif";
    ctx.fillText(`${palette.title} Special`, textX, cursorY);

    cursorY += 62;
    ctx.fillStyle = style.heading;
    ctx.font = "800 62px Inter, system-ui, sans-serif";
    drawWrappedText(ctx, "Warm Festive Wishes", textX, cursorY, textWidth, 68, 2);

    cursorY += 150;
    ctx.fillStyle = style.body;
    ctx.font = "500 34px Inter, system-ui, sans-serif";
    cursorY += drawWrappedText(ctx, greeting, textX, cursorY, textWidth, 42, 3) + 10;

    if (offerLine.trim()) {
      ctx.fillStyle = palette.accent;
      ctx.font = "700 38px Inter, system-ui, sans-serif";
      cursorY += drawWrappedText(ctx, offerLine, textX, cursorY, textWidth, 44, 2) + 10;
    }

    if (ctaLine.trim()) {
      ctx.fillStyle = "rgba(15, 23, 42, 0.78)";
      const ctaText = ctaLine.trim();
      ctx.font = "600 28px Inter, system-ui, sans-serif";
      const ctaWidth = Math.min(textWidth, ctx.measureText(ctaText).width + 50);
      ctx.beginPath();
      ctx.roundRect(textX, cursorY, ctaWidth, 54, 999);
      ctx.fill();
      ctx.fillStyle = "#f8fafc";
      ctx.fillText(ctaText, textX + 22, cursorY + 35);
      cursorY += 76;
    }

    const infoY = panelY + panelHeight - 108;
    ctx.fillStyle = "rgba(255,255,255,0.25)";
    ctx.fillRect(panelX + 34, infoY, panelWidth - 68, 2);

    ctx.fillStyle = style.body;
    ctx.font = "700 34px Inter, system-ui, sans-serif";
    ctx.fillText(businessName || "Your Business Name", textX, infoY + 48);

    ctx.font = "500 24px Inter, system-ui, sans-serif";
    const infoParts = [phone, website, addressTagline].filter((item) => item.trim());
    ctx.fillText(infoParts.join("  •  "), textX, infoY + 86);

    const logo = logoRef.current;
    if (logo) {
      const logoSize = 120;
      const boxX = panelX + panelWidth - logoSize - 54;
      const boxY = panelY + 36;
      ctx.fillStyle = "rgba(255,255,255,0.95)";
      ctx.beginPath();
      ctx.roundRect(boxX, boxY, logoSize, logoSize, 20);
      ctx.fill();

      const ratio = logo.width / logo.height;
      let drawW = logoSize - 20;
      let drawH = logoSize - 20;
      if (ratio > 1) {
        drawH = drawW / ratio;
      } else {
        drawW = drawH * ratio;
      }
      ctx.drawImage(logo, boxX + (logoSize - drawW) / 2, boxY + (logoSize - drawH) / 2, drawW, drawH);
    }
  };

  useEffect(() => {
    drawPreview();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [festival, theme, format, businessName, phone, website, addressTagline, ctaLine, greeting, offerLine]);

  const onLogoUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => setLogoDataUrl(String(reader.result ?? ""));
    reader.readAsDataURL(file);
  };

  const downloadImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement("a");
    link.href = canvas.toDataURL("image/png", 1);
    link.download = `toolhub-${festival}-${format}-post.png`;
    link.click();
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 lg:grid-cols-[1.05fr_1fr]">
        <div className="space-y-4 rounded-2xl border p-4 sm:p-5" style={{ borderColor: "var(--border)" }}>
          <h3 className="text-base font-semibold">Post details</h3>

          <div className="grid gap-3 sm:grid-cols-2">
            <label className="space-y-1 text-sm">
              <span className="muted">Festival</span>
              <select className="select" value={festival} onChange={(e) => setFestival(e.target.value as FestivalKey)}>
                {Object.entries(FESTIVALS).map(([key, value]) => (
                  <option key={key} value={key}>
                    {value.title}
                  </option>
                ))}
              </select>
            </label>
            <label className="space-y-1 text-sm">
              <span className="muted">Theme style</span>
              <select className="select" value={theme} onChange={(e) => setTheme(e.target.value as ThemeKey)}>
                <option value="premium">Premium</option>
                <option value="festive">Festive</option>
                <option value="elegant">Elegant</option>
                <option value="bold-sale">Bold Sale</option>
                <option value="modern-business">Modern Business</option>
              </select>
            </label>
          </div>

          <label className="space-y-1 text-sm">
            <span className="muted">Post format</span>
            <select className="select" value={format} onChange={(e) => setFormat(e.target.value as FormatKey)}>
              <option value="square">Instagram Post (1:1)</option>
              <option value="story">Instagram Story (9:16)</option>
            </select>
          </label>

          <div className="grid gap-3 sm:grid-cols-2">
            <input className="field" value={businessName} onChange={(e) => setBusinessName(e.target.value)} placeholder="Business/store name" />
            <input className="field" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone number" />
            <input className="field" value={website} onChange={(e) => setWebsite(e.target.value)} placeholder="Website / Instagram handle (optional)" />
            <input className="field" value={addressTagline} onChange={(e) => setAddressTagline(e.target.value)} placeholder="Address or tagline (optional)" />
          </div>

          <input className="field" value={ctaLine} onChange={(e) => setCtaLine(e.target.value)} placeholder="Optional CTA line" />
          <input className="field" value={offerLine} onChange={(e) => setOfferLine(e.target.value)} placeholder="Optional offer line" />
          <textarea className="textarea" value={customMessage} onChange={(e) => setCustomMessage(e.target.value)} placeholder="Optional custom greeting/message" />

          <div className="grid gap-3 sm:grid-cols-[1fr_auto_auto] sm:items-end">
            <input type="file" accept="image/*" onChange={onLogoUpload} className="w-full rounded-xl border p-3 text-sm" style={{ borderColor: "var(--border)" }} />
            <button type="button" className="btn btn-secondary" onClick={() => setLogoDataUrl("")}>
              Remove logo
            </button>
            <button type="button" className="btn btn-primary" onClick={downloadImage}>
              Download Image
            </button>
          </div>
        </div>

        <div className="space-y-3">
          <p className="text-sm font-medium">Live preview</p>
          <div className="rounded-2xl border p-2 sm:p-3" style={{ borderColor: "var(--border)" }}>
            <canvas
              ref={canvasRef}
              className="mx-auto block h-auto w-full rounded-xl"
              style={{ aspectRatio: format === "story" ? "9 / 16" : "1 / 1", maxHeight: "76vh", background: "#111827" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
