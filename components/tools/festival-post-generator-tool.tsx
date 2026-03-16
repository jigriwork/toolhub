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

type OccasionMode = "preset" | "custom";

type ThemeKey =
  | "premium-festive"
  | "classic-greeting"
  | "luxury-retail"
  | "modern-celebration"
  | "elegant-minimal"
  | "traditional-indian"
  | "bold-promotional"
  | "decorative-ceremonial";

type FormatKey = "instagram-post" | "instagram-story" | "flyer-portrait";

type FestivalPalette = {
  title: string;
  greeting: string;
  motif: "diwali" | "eid" | "christmas" | "holi" | "patriotic" | "new-year" | "generic";
  gradient: [string, string, string];
  accent: string;
  decorative: string;
};

const FESTIVALS: Record<FestivalKey, FestivalPalette> = {
  diwali: {
    title: "Diwali",
    greeting: "Wishing you a bright and prosperous Diwali!",
    motif: "diwali",
    gradient: ["#12001e", "#5c1a72", "#f59e0b"],
    accent: "#fbbf24",
    decorative: "#fde68a",
  },
  holi: {
    title: "Holi",
    greeting: "Celebrate colors, joy, and new beginnings this Holi!",
    motif: "holi",
    gradient: ["#7c3aed", "#ec4899", "#22c55e"],
    accent: "#67e8f9",
    decorative: "#fde047",
  },
  eid: {
    title: "Eid",
    greeting: "Eid Mubarak! May peace and blessings be with you.",
    motif: "eid",
    gradient: ["#052e2b", "#0f766e", "#99f6e4"],
    accent: "#fef08a",
    decorative: "#99f6e4",
  },
  "new-year": {
    title: "New Year",
    greeting: "Cheers to a successful and joyful New Year!",
    motif: "new-year",
    gradient: ["#0b1022", "#1e3a8a", "#38bdf8"],
    accent: "#93c5fd",
    decorative: "#e0f2fe",
  },
  christmas: {
    title: "Christmas",
    greeting: "Merry Christmas and warm wishes to your family!",
    motif: "christmas",
    gradient: ["#14532d", "#b91c1c", "#fef2f2"],
    accent: "#facc15",
    decorative: "#dcfce7",
  },
  "independence-day": {
    title: "Independence Day",
    greeting: "Proudly celebrating freedom and unity. Happy Independence Day!",
    motif: "patriotic",
    gradient: ["#ea580c", "#ffffff", "#16a34a"],
    accent: "#1d4ed8",
    decorative: "#fed7aa",
  },
  "republic-day": {
    title: "Republic Day",
    greeting: "Honoring the spirit of the nation. Happy Republic Day!",
    motif: "patriotic",
    gradient: ["#f97316", "#f8fafc", "#22c55e"],
    accent: "#2563eb",
    decorative: "#bae6fd",
  },
  "raksha-bandhan": {
    title: "Raksha Bandhan",
    greeting: "Celebrating the bond of love and protection. Happy Raksha Bandhan!",
    motif: "generic",
    gradient: ["#7c2d12", "#be185d", "#f59e0b"],
    accent: "#fcd34d",
    decorative: "#fbcfe8",
  },
  dussehra: {
    title: "Dussehra",
    greeting: "May goodness and success triumph this Dussehra!",
    motif: "generic",
    gradient: ["#7f1d1d", "#ea580c", "#facc15"],
    accent: "#fde68a",
    decorative: "#ffedd5",
  },
  "ganesh-chaturthi": {
    title: "Ganesh Chaturthi",
    greeting: "Ganpati Bappa Morya! Wishing joy and prosperity.",
    motif: "generic",
    gradient: ["#7c3aed", "#1d4ed8", "#f59e0b"],
    accent: "#fdba74",
    decorative: "#ddd6fe",
  },
};

const THEMES: Record<
  ThemeKey,
  {
    overlay: string;
    panel: string;
    heading: string;
    subheading: string;
    body: string;
    tag: string;
    ctaBg: string;
    ctaText: string;
    border: string;
  }
> = {
  "premium-festive": {
    overlay: "rgba(10, 10, 10, 0.35)",
    panel: "rgba(17, 24, 39, 0.78)",
    heading: "#ffffff",
    subheading: "#fef3c7",
    body: "#e5e7eb",
    tag: "#fde68a",
    ctaBg: "#fbbf24",
    ctaText: "#1f2937",
    border: "rgba(255,255,255,0.25)",
  },
  "classic-greeting": {
    overlay: "rgba(255, 255, 255, 0.08)",
    panel: "rgba(255, 255, 255, 0.18)",
    heading: "#ffffff",
    subheading: "#fef08a",
    body: "#f8fafc",
    tag: "#fef08a",
    ctaBg: "rgba(15,23,42,0.82)",
    ctaText: "#f8fafc",
    border: "rgba(255,255,255,0.26)",
  },
  "luxury-retail": {
    overlay: "rgba(14, 14, 14, 0.42)",
    panel: "rgba(255, 255, 255, 0.14)",
    heading: "#f8fafc",
    subheading: "#fcd34d",
    body: "#f1f5f9",
    tag: "#e2e8f0",
    ctaBg: "#111827",
    ctaText: "#fcd34d",
    border: "rgba(252,211,77,0.48)",
  },
  "modern-celebration": {
    overlay: "rgba(12, 17, 29, 0.2)",
    panel: "rgba(17, 24, 39, 0.86)",
    heading: "#ffffff",
    subheading: "#67e8f9",
    body: "#fef3c7",
    tag: "#93c5fd",
    ctaBg: "#0f172a",
    ctaText: "#e0f2fe",
    border: "rgba(147,197,253,0.42)",
  },
  "elegant-minimal": {
    overlay: "rgba(5, 10, 20, 0.18)",
    panel: "rgba(7, 12, 23, 0.7)",
    heading: "#f8fafc",
    subheading: "#cbd5e1",
    body: "#e2e8f0",
    tag: "#cbd5e1",
    ctaBg: "rgba(255,255,255,0.15)",
    ctaText: "#f8fafc",
    border: "rgba(255,255,255,0.22)",
  },
  "traditional-indian": {
    overlay: "rgba(53, 12, 12, 0.3)",
    panel: "rgba(68, 21, 21, 0.66)",
    heading: "#fff7ed",
    subheading: "#fcd34d",
    body: "#ffedd5",
    tag: "#fde68a",
    ctaBg: "#7c2d12",
    ctaText: "#fff7ed",
    border: "rgba(253,230,138,0.45)",
  },
  "bold-promotional": {
    overlay: "rgba(8, 47, 73, 0.18)",
    panel: "rgba(15, 23, 42, 0.84)",
    heading: "#ffffff",
    subheading: "#f472b6",
    body: "#e0f2fe",
    tag: "#f472b6",
    ctaBg: "#db2777",
    ctaText: "#ffffff",
    border: "rgba(244,114,182,0.45)",
  },
  "decorative-ceremonial": {
    overlay: "rgba(28, 25, 23, 0.35)",
    panel: "rgba(30, 41, 59, 0.68)",
    heading: "#fff7ed",
    subheading: "#fed7aa",
    body: "#ffedd5",
    tag: "#fde68a",
    ctaBg: "#9a3412",
    ctaText: "#fffbeb",
    border: "rgba(254,215,170,0.52)",
  },
};

const DIMENSIONS: Record<FormatKey, { width: number; height: number; label: string }> = {
  "instagram-post": { width: 1080, height: 1080, label: "Instagram Post (1:1)" },
  "instagram-story": { width: 1080, height: 1920, label: "Instagram Story (9:16)" },
  "flyer-portrait": { width: 1240, height: 1754, label: "Flyer / Poster (Portrait)" },
};

const FESTIVAL_KEYS = Object.keys(FESTIVALS) as FestivalKey[];
const FORMAT_KEYS = Object.keys(DIMENSIONS) as FormatKey[];

function inferCustomPalette(name: string): FestivalPalette {
  const lower = name.toLowerCase();
  if (/eid|ramzan|ramadan/.test(lower)) {
    return { ...FESTIVALS.eid, title: name || "Custom Occasion" };
  }
  if (/christmas|xmas/.test(lower)) {
    return { ...FESTIVALS.christmas, title: name || "Custom Occasion" };
  }
  if (/holi|color/.test(lower)) {
    return { ...FESTIVALS.holi, title: name || "Custom Occasion" };
  }
  if (/independence|republic|patriot|tricolor/.test(lower)) {
    return { ...FESTIVALS["independence-day"], title: name || "Custom Occasion" };
  }
  if (/new year|anniversary|opening|wedding|celebration/.test(lower)) {
    return { ...FESTIVALS["new-year"], title: name || "Custom Occasion" };
  }

  return {
    title: name || "Custom Occasion",
    greeting: `Warm wishes for ${name || "your special occasion"}.`,
    motif: "generic",
    gradient: ["#1f2937", "#334155", "#0ea5e9"],
    accent: "#93c5fd",
    decorative: "#dbeafe",
  };
}

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

  const [occasionMode, setOccasionMode] = useState<OccasionMode>("preset");
  const [festival, setFestival] = useState<FestivalKey>("diwali");
  const [customOccasionName, setCustomOccasionName] = useState("Store Anniversary");
  const [theme, setTheme] = useState<ThemeKey>("premium-festive");
  const [format, setFormat] = useState<FormatKey>("instagram-post");

  const [businessName, setBusinessName] = useState("Your Business Name");
  const [phone, setPhone] = useState("+91 90000 00000");
  const [website, setWebsite] = useState("@yourbrand / yourstore.com");
  const [tagline, setTagline] = useState("Trusted quality. Better value.");
  const [headline, setHeadline] = useState("Seasonal Wishes & Special Offers");
  const [subheadline, setSubheadline] = useState("Designed for your valued customers");
  const [greetingMessage, setGreetingMessage] = useState("");
  const [offerText, setOfferText] = useState("Festive offer up to 30% OFF");
  const [ctaLine, setCtaLine] = useState("Visit us today");
  const [footerLine, setFooterLine] = useState("Limited period festive collection • Terms apply");
  const [logoDataUrl, setLogoDataUrl] = useState("");

  const dimensions = DIMENSIONS[format];

  const palette = useMemo(
    () =>
      occasionMode === "custom"
        ? inferCustomPalette(customOccasionName.trim())
        : FESTIVALS[festival],
    [customOccasionName, festival, occasionMode],
  );

  const occasionName = useMemo(
    () => (occasionMode === "custom" ? customOccasionName.trim() || "Custom Occasion" : palette.title),
    [customOccasionName, occasionMode, palette.title],
  );

  const greeting = useMemo(
    () => greetingMessage.trim() || palette.greeting,
    [greetingMessage, palette.greeting],
  );

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
    const scale = 2;
    canvas.width = width * scale;
    canvas.height = height * scale;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(scale, scale);

    const style = THEMES[theme];

    const bg = ctx.createLinearGradient(0, 0, width, height);
    bg.addColorStop(0, palette.gradient[0]);
    bg.addColorStop(0.5, palette.gradient[1]);
    bg.addColorStop(1, palette.gradient[2]);
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, width, height);

    ctx.fillStyle = style.overlay;
    ctx.fillRect(0, 0, width, height);

    ctx.strokeStyle = style.border;
    ctx.lineWidth = Math.max(2, width * 0.004);
    ctx.strokeRect(width * 0.035, height * 0.035, width * 0.93, height * 0.93);

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

    const motifColor = palette.decorative;
    const motifAccent = palette.accent;
    if (palette.motif === "diwali") {
      for (const x of [width * 0.17, width * 0.5, width * 0.83]) {
        ctx.fillStyle = motifColor;
        ctx.beginPath();
        ctx.ellipse(x, height * 0.14, width * 0.022, height * 0.016, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = motifAccent;
        ctx.beginPath();
        ctx.arc(x, height * 0.13, width * 0.006, 0, Math.PI * 2);
        ctx.fill();
      }
    } else if (palette.motif === "eid") {
      ctx.strokeStyle = motifColor;
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.arc(width * 0.84, height * 0.15, width * 0.06, 0.4, Math.PI * 1.8);
      ctx.stroke();
      ctx.fillStyle = motifAccent;
      ctx.beginPath();
      ctx.arc(width * 0.77, height * 0.11, width * 0.007, 0, Math.PI * 2);
      ctx.arc(width * 0.8, height * 0.09, width * 0.005, 0, Math.PI * 2);
      ctx.fill();
    } else if (palette.motif === "holi") {
      for (let i = 0; i < 8; i += 1) {
        ctx.fillStyle = i % 2 === 0 ? motifColor : motifAccent;
        ctx.beginPath();
        ctx.arc(width * (0.08 + i * 0.11), height * 0.1, width * 0.012, 0, Math.PI * 2);
        ctx.fill();
      }
    } else if (palette.motif === "christmas") {
      ctx.strokeStyle = motifColor;
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(width * 0.1, height * 0.12);
      ctx.lineTo(width * 0.9, height * 0.12);
      ctx.stroke();
      for (let i = 0; i < 9; i += 1) {
        ctx.fillStyle = i % 2 ? motifColor : motifAccent;
        ctx.beginPath();
        ctx.arc(width * (0.13 + i * 0.09), height * 0.12, width * 0.008, 0, Math.PI * 2);
        ctx.fill();
      }
    } else if (palette.motif === "patriotic") {
      ctx.fillStyle = "rgba(255,255,255,0.18)";
      ctx.fillRect(width * 0.075, height * 0.08, width * 0.85, height * 0.04);
      ctx.fillStyle = "#f97316";
      ctx.fillRect(width * 0.075, height * 0.08, width * 0.85, height * 0.013);
      ctx.fillStyle = "#16a34a";
      ctx.fillRect(width * 0.075, height * 0.107, width * 0.85, height * 0.013);
    }

    const panelX = width * 0.08;
    const panelWidth = width * 0.84;
    const panelHeight = format === "instagram-story" ? height * 0.64 : height * 0.68;
    const panelY = format === "instagram-story" ? height * 0.16 : height * 0.2;

    ctx.fillStyle = style.panel;
    ctx.beginPath();
    ctx.roundRect(panelX, panelY, panelWidth, panelHeight, 28);
    ctx.fill();

    let cursorY = panelY + 78;
    const textX = panelX + 56;
    const textWidth = panelWidth - 112;

    ctx.fillStyle = style.tag;
    ctx.font = "700 28px Inter, system-ui, sans-serif";
    ctx.fillText(`${occasionName} Special`, textX, cursorY);

    cursorY += 52;
    ctx.fillStyle = style.subheading;
    ctx.font = "600 34px Inter, system-ui, sans-serif";
    drawWrappedText(ctx, subheadline, textX, cursorY, textWidth, 42, 2);

    cursorY += 62;
    ctx.fillStyle = style.heading;
    ctx.font = "800 62px Inter, system-ui, sans-serif";
    drawWrappedText(ctx, headline, textX, cursorY, textWidth, 68, 2);

    cursorY += 150;
    ctx.fillStyle = style.body;
    ctx.font = "500 34px Inter, system-ui, sans-serif";
    cursorY += drawWrappedText(ctx, greeting, textX, cursorY, textWidth, 42, 3) + 10;

    if (offerText.trim()) {
      ctx.fillStyle = palette.accent;
      ctx.font = "700 38px Inter, system-ui, sans-serif";
      cursorY += drawWrappedText(ctx, offerText, textX, cursorY, textWidth, 44, 2) + 10;
    }

    if (ctaLine.trim()) {
      ctx.fillStyle = style.ctaBg;
      const ctaText = ctaLine.trim();
      ctx.font = "600 28px Inter, system-ui, sans-serif";
      const ctaWidth = Math.min(textWidth, ctx.measureText(ctaText).width + 50);
      ctx.beginPath();
      ctx.roundRect(textX, cursorY, ctaWidth, 54, 999);
      ctx.fill();
      ctx.fillStyle = style.ctaText;
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
    const infoParts = [phone, website, tagline].filter((item) => item.trim());
    ctx.fillText(infoParts.join("  •  "), textX, infoY + 86);

    if (footerLine.trim()) {
      ctx.font = "500 20px Inter, system-ui, sans-serif";
      ctx.fillStyle = "rgba(248,250,252,0.85)";
      drawWrappedText(ctx, footerLine, panelX + 48, panelY + panelHeight + 34, panelWidth - 96, 28, 2);
    }

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
  }, [occasionName, palette, theme, format, businessName, phone, website, tagline, headline, subheadline, ctaLine, greeting, offerText, footerLine]);

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
    link.download = `toolhub-${occasionName.replace(/\s+/g, "-").toLowerCase()}-${format}.png`;
    link.click();
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 lg:grid-cols-[1.05fr_1fr]">
        <div className="space-y-4 rounded-2xl border p-4 sm:p-5" style={{ borderColor: "var(--border)" }}>
          <h3 className="text-base font-semibold">Post details</h3>

          <div className="rounded-xl border p-3 text-sm" style={{ borderColor: "var(--border)" }}>
            <p className="font-medium">Occasion mode</p>
            <div className="mt-2 flex flex-wrap gap-2">
              <button
                type="button"
                className={`btn ${occasionMode === "preset" ? "btn-primary" : "btn-secondary"}`}
                onClick={() => setOccasionMode("preset")}
              >
                Preset festival
              </button>
              <button
                type="button"
                className={`btn ${occasionMode === "custom" ? "btn-primary" : "btn-secondary"}`}
                onClick={() => setOccasionMode("custom")}
              >
                Custom occasion
              </button>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {occasionMode === "preset" ? (
              <label className="space-y-1 text-sm">
                <span className="muted">Festival</span>
                <select className="select" value={festival} onChange={(e) => setFestival(e.target.value as FestivalKey)}>
                  {FESTIVAL_KEYS.map((key) => (
                    <option key={key} value={key}>
                      {FESTIVALS[key].title}
                    </option>
                  ))}
                </select>
              </label>
            ) : (
              <label className="space-y-1 text-sm">
                <span className="muted">Custom festival / occasion name</span>
                <input
                  className="field"
                  value={customOccasionName}
                  onChange={(e) => setCustomOccasionName(e.target.value)}
                  placeholder="Store anniversary / Grand opening / Local festival"
                />
              </label>
            )}
            <label className="space-y-1 text-sm">
              <span className="muted">Theme style</span>
              <select className="select" value={theme} onChange={(e) => setTheme(e.target.value as ThemeKey)}>
                <option value="premium-festive">Premium Festive</option>
                <option value="classic-greeting">Classic Greeting</option>
                <option value="luxury-retail">Luxury Retail</option>
                <option value="modern-celebration">Modern Celebration</option>
                <option value="elegant-minimal">Elegant Minimal</option>
                <option value="traditional-indian">Traditional Indian</option>
                <option value="bold-promotional">Bold Promotional</option>
                <option value="decorative-ceremonial">Decorative Ceremonial</option>
              </select>
            </label>
          </div>

          <label className="space-y-1 text-sm">
            <span className="muted">Post format</span>
            <select className="select" value={format} onChange={(e) => setFormat(e.target.value as FormatKey)}>
              {FORMAT_KEYS.map((key) => (
                <option key={key} value={key}>
                  {DIMENSIONS[key].label}
                </option>
              ))}
            </select>
          </label>

          <div className="grid gap-3 sm:grid-cols-2">
            <input className="field" value={businessName} onChange={(e) => setBusinessName(e.target.value)} placeholder="Business/store name" />
            <input className="field" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone number" />
            <input className="field" value={website} onChange={(e) => setWebsite(e.target.value)} placeholder="Website / Instagram handle (optional)" />
            <input className="field" value={tagline} onChange={(e) => setTagline(e.target.value)} placeholder="Tagline" />
          </div>

          <input className="field" value={headline} onChange={(e) => setHeadline(e.target.value)} placeholder="Headline" />
          <input className="field" value={subheadline} onChange={(e) => setSubheadline(e.target.value)} placeholder="Subheadline" />
          <textarea className="textarea" value={greetingMessage} onChange={(e) => setGreetingMessage(e.target.value)} placeholder="Greeting message (optional override)" />
          <input className="field" value={offerText} onChange={(e) => setOfferText(e.target.value)} placeholder="Offer text" />
          <input className="field" value={ctaLine} onChange={(e) => setCtaLine(e.target.value)} placeholder="Optional CTA line" />
          <input className="field" value={footerLine} onChange={(e) => setFooterLine(e.target.value)} placeholder="Footer line" />

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
              style={{
                aspectRatio:
                  format === "instagram-story"
                    ? "9 / 16"
                    : format === "flyer-portrait"
                      ? "1240 / 1754"
                      : "1 / 1",
                maxHeight: "76vh",
                background: "#111827",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
