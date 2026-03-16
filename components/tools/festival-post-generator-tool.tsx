"use client";

import { ChangeEvent, useEffect, useMemo, useRef, useState } from "react";

type FestivalKey =
  | "diwali"
  | "holi"
  | "eid"
  | "christmas"
  | "new-year"
  | "independence-day"
  | "republic-day";

type OccasionMode = "preset" | "custom";
type PostIntent = "greeting-only" | "greeting-branding" | "greeting-offer";
type LayoutKey =
  | "classic-greeting"
  | "premium-festive-brand"
  | "elegant-ceremonial"
  | "modern-celebration"
  | "decorative-traditional";
type FormatKey = "instagram-post" | "instagram-story" | "flyer-portrait";

type FestivalPalette = {
  title: string;
  greeting: string;
  motif: "diwali" | "eid" | "holi" | "christmas" | "patriotic" | "generic";
  colors: [string, string, string];
  accent: string;
  ornament: string;
};

const FESTIVALS: Record<FestivalKey, FestivalPalette> = {
  diwali: {
    title: "Diwali",
    greeting: "Wishing you prosperity, joy, and a radiant Diwali.",
    motif: "diwali",
    colors: ["#2b1040", "#6b1d7f", "#f59e0b"],
    accent: "#fcd34d",
    ornament: "#fde68a",
  },
  holi: {
    title: "Holi",
    greeting: "May your days be filled with color, joy, and celebration.",
    motif: "holi",
    colors: ["#7e22ce", "#ec4899", "#22c55e"],
    accent: "#67e8f9",
    ornament: "#fde047",
  },
  eid: {
    title: "Eid",
    greeting: "Eid Mubarak. May peace, blessings, and happiness stay with you.",
    motif: "eid",
    colors: ["#033c37", "#0f766e", "#164e63"],
    accent: "#fef08a",
    ornament: "#99f6e4",
  },
  christmas: {
    title: "Christmas",
    greeting: "Merry Christmas and warm wishes for a joyful season.",
    motif: "christmas",
    colors: ["#14532d", "#b91c1c", "#991b1b"],
    accent: "#facc15",
    ornament: "#dcfce7",
  },
  "new-year": {
    title: "New Year",
    greeting: "Cheers to new beginnings, growth, and success this year.",
    motif: "generic",
    colors: ["#0f172a", "#1d4ed8", "#0ea5e9"],
    accent: "#93c5fd",
    ornament: "#e0f2fe",
  },
  "independence-day": {
    title: "Independence Day",
    greeting: "Celebrating freedom, unity, and the spirit of our nation.",
    motif: "patriotic",
    colors: ["#ea580c", "#f8fafc", "#15803d"],
    accent: "#2563eb",
    ornament: "#fed7aa",
  },
  "republic-day": {
    title: "Republic Day",
    greeting: "Honoring our constitution and the pride of our republic.",
    motif: "patriotic",
    colors: ["#f97316", "#f1f5f9", "#22c55e"],
    accent: "#1d4ed8",
    ornament: "#bfdbfe",
  },
};

const FORMAT_DIMENSIONS: Record<FormatKey, { width: number; height: number; label: string; ratio: string }> = {
  "instagram-post": { width: 1080, height: 1080, label: "Instagram Post (1:1)", ratio: "1 / 1" },
  "instagram-story": { width: 1080, height: 1920, label: "Instagram Story (9:16)", ratio: "9 / 16" },
  "flyer-portrait": { width: 1240, height: 1754, label: "Flyer Portrait", ratio: "1240 / 1754" },
};

const LAYOUTS: Record<LayoutKey, { title: string; panelOpacity: number; headingFont: string; ctaDark: boolean }> = {
  "classic-greeting": { title: "Classic Greeting Layout", panelOpacity: 0.16, headingFont: "700", ctaDark: true },
  "premium-festive-brand": { title: "Premium Festive Brand Layout", panelOpacity: 0.26, headingFont: "800", ctaDark: false },
  "elegant-ceremonial": { title: "Elegant Ceremonial Layout", panelOpacity: 0.32, headingFont: "700", ctaDark: true },
  "modern-celebration": { title: "Modern Celebration Layout", panelOpacity: 0.22, headingFont: "800", ctaDark: false },
  "decorative-traditional": { title: "Decorative Traditional Layout", panelOpacity: 0.28, headingFont: "700", ctaDark: true },
};

const FESTIVAL_KEYS = Object.keys(FESTIVALS) as FestivalKey[];
const FORMAT_KEYS = Object.keys(FORMAT_DIMENSIONS) as FormatKey[];

function inferCustomFestival(name: string): FestivalPalette {
  const lower = name.toLowerCase();
  if (/diwali|deepawali/.test(lower)) return { ...FESTIVALS.diwali, title: name };
  if (/eid|ramadan|ramzan/.test(lower)) return { ...FESTIVALS.eid, title: name };
  if (/holi|color/.test(lower)) return { ...FESTIVALS.holi, title: name };
  if (/christmas|xmas/.test(lower)) return { ...FESTIVALS.christmas, title: name };
  if (/independence|republic|nation|tricolor/.test(lower)) return { ...FESTIVALS["independence-day"], title: name };

  return {
    title: name || "Custom Occasion",
    greeting: `Warm wishes for ${name || "your special occasion"}.`,
    motif: "generic",
    colors: ["#0f172a", "#334155", "#4338ca"],
    accent: "#c4b5fd",
    ornament: "#dbeafe",
  };
}

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
  maxLines = 3,
) {
  const words = text.split(/\s+/).filter(Boolean);
  if (words.length === 0) return 0;
  const lines: string[] = [];
  let line = words[0] ?? "";
  for (let i = 1; i < words.length; i += 1) {
    const test = `${line} ${words[i]}`;
    if (ctx.measureText(test).width <= maxWidth) line = test;
    else {
      lines.push(line);
      line = words[i] ?? "";
    }
  }
  lines.push(line);
  const finalLines = lines.slice(0, maxLines);
  if (lines.length > maxLines && finalLines.length > 0) {
    finalLines[finalLines.length - 1] = `${finalLines[finalLines.length - 1]}...`;
  }
  finalLines.forEach((item, index) => ctx.fillText(item, x, y + index * lineHeight));
  return finalLines.length * lineHeight;
}

function drawMotifs(ctx: CanvasRenderingContext2D, width: number, height: number, palette: FestivalPalette) {
  ctx.save();
  if (palette.motif === "diwali") {
    for (const x of [width * 0.16, width * 0.5, width * 0.84]) {
      ctx.fillStyle = "rgba(254,240,138,0.85)";
      ctx.beginPath();
      ctx.ellipse(x, height * 0.14, width * 0.035, height * 0.018, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "rgba(251,191,36,0.98)";
      ctx.beginPath();
      ctx.moveTo(x, height * 0.095);
      ctx.quadraticCurveTo(x - 10, height * 0.125, x, height * 0.135);
      ctx.quadraticCurveTo(x + 10, height * 0.125, x, height * 0.095);
      ctx.fill();
    }
    ctx.strokeStyle = "rgba(251,191,36,0.45)";
    ctx.lineWidth = 2;
    for (let i = 0; i < 8; i += 1) {
      ctx.beginPath();
      ctx.arc(width * 0.5, height * 0.9, 38 + i * 22, Math.PI, Math.PI * 2);
      ctx.stroke();
    }
  } else if (palette.motif === "eid") {
    ctx.strokeStyle = "rgba(153,246,228,0.9)";
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.arc(width * 0.82, height * 0.16, width * 0.07, 0.6, Math.PI * 1.8);
    ctx.stroke();
    ctx.fillStyle = "rgba(254,240,138,0.9)";
    for (const point of [
      [width * 0.75, height * 0.1],
      [width * 0.79, height * 0.085],
      [width * 0.73, height * 0.145],
    ]) {
      ctx.beginPath();
      ctx.arc(point[0], point[1], 5, 0, Math.PI * 2);
      ctx.fill();
    }
  } else if (palette.motif === "holi") {
    for (let i = 0; i < 16; i += 1) {
      ctx.fillStyle = i % 2 ? "rgba(103,232,249,0.45)" : "rgba(244,114,182,0.45)";
      ctx.beginPath();
      ctx.arc(width * (0.05 + (i % 8) * 0.12), height * (0.1 + Math.floor(i / 8) * 0.8), 16 + (i % 3) * 8, 0, Math.PI * 2);
      ctx.fill();
    }
  } else if (palette.motif === "christmas") {
    ctx.strokeStyle = "rgba(220,252,231,0.9)";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(width * 0.1, height * 0.12);
    ctx.lineTo(width * 0.9, height * 0.12);
    ctx.stroke();
    for (let i = 0; i < 10; i += 1) {
      ctx.fillStyle = i % 2 ? "#facc15" : "#dcfce7";
      ctx.beginPath();
      ctx.arc(width * (0.12 + i * 0.085), height * 0.12, 8, 0, Math.PI * 2);
      ctx.fill();
    }
  } else if (palette.motif === "patriotic") {
    ctx.fillStyle = "rgba(255,255,255,0.26)";
    ctx.fillRect(width * 0.08, height * 0.1, width * 0.84, 28);
    ctx.fillStyle = "#f97316";
    ctx.fillRect(width * 0.08, height * 0.1, width * 0.84, 9);
    ctx.fillStyle = "#22c55e";
    ctx.fillRect(width * 0.08, height * 0.119, width * 0.84, 9);
    ctx.strokeStyle = "#2563eb";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(width * 0.5, height * 0.114, 8, 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.restore();
}

export function FestivalPostGeneratorTool() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const logoRef = useRef<HTMLImageElement | null>(null);

  const [occasionMode, setOccasionMode] = useState<OccasionMode>("preset");
  const [festival, setFestival] = useState<FestivalKey>("diwali");
  const [customOccasionName, setCustomOccasionName] = useState("Store Anniversary");
  const [layout, setLayout] = useState<LayoutKey>("premium-festive-brand");
  const [postIntent, setPostIntent] = useState<PostIntent>("greeting-branding");
  const [format, setFormat] = useState<FormatKey>("instagram-post");

  const [businessName, setBusinessName] = useState("Your Business Name");
  const [phone, setPhone] = useState("+91 90000 00000");
  const [website, setWebsite] = useState("@yourbrand • yourstore.com");
  const [tagline, setTagline] = useState("Celebrating moments with quality and trust");
  const [headline, setHeadline] = useState("Warm Festive Greetings");
  const [greetingMessage, setGreetingMessage] = useState("");
  const [ctaLine, setCtaLine] = useState("Visit us today");
  const [offerLine, setOfferLine] = useState("");
  const [footerLine, setFooterLine] = useState("Wishing your family joy, prosperity, and peace.");
  const [logoDataUrl, setLogoDataUrl] = useState("");

  const palette = useMemo(
    () => (occasionMode === "custom" ? inferCustomFestival(customOccasionName.trim()) : FESTIVALS[festival]),
    [occasionMode, customOccasionName, festival],
  );

  const occasionName = useMemo(
    () => (occasionMode === "custom" ? customOccasionName.trim() || "Custom Occasion" : palette.title),
    [occasionMode, customOccasionName, palette.title],
  );

  const greeting = useMemo(() => greetingMessage.trim() || palette.greeting, [greetingMessage, palette.greeting]);
  const style = LAYOUTS[layout];
  const showBrandBlock = postIntent !== "greeting-only";
  const showOffer = postIntent === "greeting-offer" && offerLine.trim().length > 0;

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

    const { width, height } = FORMAT_DIMENSIONS[format];
    const scale = 3;
    canvas.width = width * scale;
    canvas.height = height * scale;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(scale, scale);

    const bg = ctx.createLinearGradient(0, 0, width, height);
    bg.addColorStop(0, palette.colors[0]);
    bg.addColorStop(0.52, palette.colors[1]);
    bg.addColorStop(1, palette.colors[2]);
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, width, height);

    ctx.fillStyle = "rgba(10, 10, 18, 0.22)";
    ctx.fillRect(0, 0, width, height);

    ctx.globalAlpha = 0.24;
    ctx.fillStyle = palette.ornament;
    ctx.beginPath();
    ctx.arc(width * 0.14, height * 0.2, width * 0.14, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(width * 0.89, height * 0.36, width * 0.16, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(width * 0.18, height * 0.88, width * 0.18, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;

    drawMotifs(ctx, width, height, palette);

    const panelX = width * 0.07;
    const panelY = format === "instagram-story" ? height * 0.15 : height * 0.17;
    const panelWidth = width * 0.86;
    const panelHeight = format === "instagram-story" ? height * 0.72 : height * 0.72;

    ctx.fillStyle = `rgba(15, 23, 42, ${style.panelOpacity})`;
    ctx.beginPath();
    ctx.roundRect(panelX, panelY, panelWidth, panelHeight, 36);
    ctx.fill();

    ctx.strokeStyle = "rgba(255,255,255,0.32)";
    ctx.lineWidth = 2;
    ctx.strokeRect(panelX + 18, panelY + 18, panelWidth - 36, panelHeight - 36);

    const textX = panelX + 52;
    const textWidth = panelWidth - 104;
    let y = panelY + 82;

    ctx.fillStyle = palette.ornament;
    ctx.font = "600 30px Inter, system-ui, sans-serif";
    ctx.fillText(occasionName, textX, y);

    y += 62;
    ctx.fillStyle = "#ffffff";
    ctx.font = `${style.headingFont} 64px Inter, system-ui, sans-serif`;
    y += wrapText(ctx, headline, textX, y, textWidth, 70, 2);

    y += 18;
    ctx.fillStyle = "#e2e8f0";
    ctx.font = "500 34px Inter, system-ui, sans-serif";
    y += wrapText(ctx, greeting, textX, y, textWidth, 44, 4);

    if (showOffer) {
      y += 22;
      ctx.fillStyle = "rgba(15,23,42,0.66)";
      ctx.beginPath();
      ctx.roundRect(textX, y, textWidth, 74, 16);
      ctx.fill();
      ctx.fillStyle = palette.accent;
      ctx.font = "700 36px Inter, system-ui, sans-serif";
      wrapText(ctx, offerLine, textX + 20, y + 48, textWidth - 30, 42, 2);
      y += 86;
    }

    if (ctaLine.trim()) {
      y += 14;
      ctx.fillStyle = style.ctaDark ? "rgba(15,23,42,0.82)" : "rgba(251,191,36,0.95)";
      const ctaWidth = Math.min(textWidth, ctx.measureText(ctaLine).width + 54);
      ctx.beginPath();
      ctx.roundRect(textX, y, ctaWidth, 56, 999);
      ctx.fill();
      ctx.fillStyle = style.ctaDark ? "#f8fafc" : "#111827";
      ctx.font = "600 27px Inter, system-ui, sans-serif";
      ctx.fillText(ctaLine, textX + 20, y + 36);
    }

    if (showBrandBlock) {
      const brandY = panelY + panelHeight - 148;
      ctx.fillStyle = "rgba(255,255,255,0.24)";
      ctx.fillRect(panelX + 40, brandY, panelWidth - 80, 2);

      ctx.fillStyle = "#ffffff";
      ctx.font = "700 34px Inter, system-ui, sans-serif";
      ctx.fillText(businessName || "Your Business", textX, brandY + 50);

      ctx.fillStyle = "#dbeafe";
      ctx.font = "500 22px Inter, system-ui, sans-serif";
      const details = [phone, website, tagline].filter((value) => value.trim());
      wrapText(ctx, details.join(" • "), textX, brandY + 88, textWidth, 30, 2);
    }

    if (footerLine.trim()) {
      ctx.fillStyle = "rgba(255,255,255,0.88)";
      ctx.font = "500 19px Inter, system-ui, sans-serif";
      wrapText(ctx, footerLine, panelX + 44, panelY + panelHeight + 34, panelWidth - 88, 26, 2);
    }

    const logo = logoRef.current;
    if (logo && showBrandBlock) {
      const logoSize = 120;
      const logoX = panelX + panelWidth - logoSize - 44;
      const logoY = panelY + 34;
      ctx.fillStyle = "rgba(255,255,255,0.95)";
      ctx.beginPath();
      ctx.roundRect(logoX, logoY, logoSize, logoSize, 18);
      ctx.fill();

      const ratio = logo.width / logo.height;
      let drawW = logoSize - 22;
      let drawH = logoSize - 22;
      if (ratio > 1) drawH = drawW / ratio;
      else drawW = drawH * ratio;
      ctx.drawImage(logo, logoX + (logoSize - drawW) / 2, logoY + (logoSize - drawH) / 2, drawW, drawH);
    }
  };

  useEffect(() => {
    drawPreview();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [palette, layout, postIntent, format, occasionName, headline, greeting, offerLine, ctaLine, footerLine, businessName, phone, website, tagline]);

  const onUploadLogo = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setLogoDataUrl(String(reader.result ?? ""));
    reader.readAsDataURL(file);
  };

  const download = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement("a");
    link.href = canvas.toDataURL("image/png", 1);
    link.download = `toolhub-festival-${occasionName.replace(/\s+/g, "-").toLowerCase()}-${format}.png`;
    link.click();
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 lg:grid-cols-[1.06fr_1fr]">
        <section className="premium-card card space-y-4 rounded-2xl p-4 sm:p-5">
          <h3 className="text-base font-semibold">Festive post setup</h3>

          <div className="rounded-xl border p-3 text-sm" style={{ borderColor: "var(--border)" }}>
            <p className="font-medium">Post purpose</p>
            <div className="mt-2 flex flex-wrap gap-2">
              <button type="button" className={`btn ${postIntent === "greeting-only" ? "btn-primary" : "btn-secondary"}`} onClick={() => setPostIntent("greeting-only")}>Greeting only</button>
              <button type="button" className={`btn ${postIntent === "greeting-branding" ? "btn-primary" : "btn-secondary"}`} onClick={() => setPostIntent("greeting-branding")}>Greeting + brand</button>
              <button type="button" className={`btn ${postIntent === "greeting-offer" ? "btn-primary" : "btn-secondary"}`} onClick={() => setPostIntent("greeting-offer")}>Greeting + optional offer</button>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <label className="space-y-1 text-sm">
              <span className="muted">Occasion mode</span>
              <select className="select" value={occasionMode} onChange={(e) => setOccasionMode(e.target.value as OccasionMode)}>
                <option value="preset">Preset festival</option>
                <option value="custom">Custom occasion</option>
              </select>
            </label>

            {occasionMode === "preset" ? (
              <label className="space-y-1 text-sm">
                <span className="muted">Festival</span>
                <select className="select" value={festival} onChange={(e) => setFestival(e.target.value as FestivalKey)}>
                  {FESTIVAL_KEYS.map((key) => (
                    <option key={key} value={key}>{FESTIVALS[key].title}</option>
                  ))}
                </select>
              </label>
            ) : (
              <label className="space-y-1 text-sm">
                <span className="muted">Custom occasion name</span>
                <input className="field" value={customOccasionName} onChange={(e) => setCustomOccasionName(e.target.value)} placeholder="Store Anniversary / Wedding Season / Local Event" />
              </label>
            )}
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <label className="space-y-1 text-sm">
              <span className="muted">Template style</span>
              <select className="select" value={layout} onChange={(e) => setLayout(e.target.value as LayoutKey)}>
                {(Object.keys(LAYOUTS) as LayoutKey[]).map((key) => (
                  <option key={key} value={key}>{LAYOUTS[key].title}</option>
                ))}
              </select>
            </label>
            <label className="space-y-1 text-sm">
              <span className="muted">Post format</span>
              <select className="select" value={format} onChange={(e) => setFormat(e.target.value as FormatKey)}>
                {FORMAT_KEYS.map((key) => (
                  <option key={key} value={key}>{FORMAT_DIMENSIONS[key].label}</option>
                ))}
              </select>
            </label>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <input className="field" value={businessName} onChange={(e) => setBusinessName(e.target.value)} placeholder="Business/store name" />
            <input className="field" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone" />
            <input className="field" value={website} onChange={(e) => setWebsite(e.target.value)} placeholder="Website / handle" />
            <input className="field" value={tagline} onChange={(e) => setTagline(e.target.value)} placeholder="Tagline" />
          </div>

          <input className="field" value={headline} onChange={(e) => setHeadline(e.target.value)} placeholder="Greeting headline" />
          <textarea className="textarea" value={greetingMessage} onChange={(e) => setGreetingMessage(e.target.value)} placeholder="Greeting message" />
          <input className="field" value={ctaLine} onChange={(e) => setCtaLine(e.target.value)} placeholder="Optional CTA" />
          <input className="field" value={offerLine} onChange={(e) => setOfferLine(e.target.value)} placeholder="Optional offer line (shown only in greeting + offer mode)" />
          <input className="field" value={footerLine} onChange={(e) => setFooterLine(e.target.value)} placeholder="Optional footer line" />

          <div className="grid gap-3 sm:grid-cols-[1fr_auto_auto] sm:items-end">
            <input type="file" accept="image/*" onChange={onUploadLogo} className="w-full rounded-xl border p-3 text-sm" style={{ borderColor: "var(--border)" }} />
            <button type="button" className="btn btn-secondary" onClick={() => setLogoDataUrl("")}>Remove logo</button>
            <button type="button" className="btn btn-primary" onClick={download}>Download PNG</button>
          </div>
        </section>

        <section className="space-y-3">
          <p className="text-sm font-medium">Live preview</p>
          <div className="card premium-card rounded-2xl border p-2 sm:p-3" style={{ borderColor: "var(--border)" }}>
            <canvas
              ref={canvasRef}
              className="mx-auto block h-auto w-full rounded-xl"
              style={{ aspectRatio: FORMAT_DIMENSIONS[format].ratio, maxHeight: "78vh", background: "#0f172a" }}
            />
          </div>
        </section>
      </div>
    </div>
  );
}
