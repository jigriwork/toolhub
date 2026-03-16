"use client";

import { ChangeEvent, useEffect, useMemo, useRef, useState } from "react";

type OfferTheme =
  | "luxury-sale"
  | "festive-offer"
  | "premium-fashion"
  | "grand-opening"
  | "clearance-sale"
  | "wedding-collection"
  | "limited-time";
type ColorStyle = "gold" | "sunset" | "ocean" | "royal" | "mono";
type PosterFormat = "instagram-post" | "instagram-story" | "poster-portrait";

const THEME_STYLES: Record<
  OfferTheme,
  {
    title: string;
    panelOpacity: number;
    titleCase: "upper" | "normal";
    accent: string;
    deco: "frame" | "burst" | "ornament";
    eyebrow: string;
  }
> = {
  "luxury-sale": { title: "Luxury Sale", panelOpacity: 0.3, titleCase: "upper", accent: "#fbbf24", deco: "frame", eyebrow: "Exclusive Edit" },
  "festive-offer": { title: "Festive Offer", panelOpacity: 0.22, titleCase: "normal", accent: "#f472b6", deco: "ornament", eyebrow: "Season Special" },
  "premium-fashion": { title: "Premium Fashion", panelOpacity: 0.25, titleCase: "normal", accent: "#22d3ee", deco: "frame", eyebrow: "New Arrival Campaign" },
  "grand-opening": { title: "Grand Opening", panelOpacity: 0.2, titleCase: "upper", accent: "#f59e0b", deco: "burst", eyebrow: "Launch Week" },
  "clearance-sale": { title: "Clearance Sale", panelOpacity: 0.18, titleCase: "upper", accent: "#fb7185", deco: "burst", eyebrow: "Final Days" },
  "wedding-collection": { title: "Wedding Collection", panelOpacity: 0.3, titleCase: "normal", accent: "#f9a8d4", deco: "ornament", eyebrow: "Bridal Season" },
  "limited-time": { title: "Limited Time Promotion", panelOpacity: 0.2, titleCase: "upper", accent: "#60a5fa", deco: "burst", eyebrow: "Ends Soon" },
};

const COLOR_STYLES: Record<ColorStyle, [string, string, string]> = {
  gold: ["#0f172a", "#7c2d12", "#f59e0b"],
  sunset: ["#7f1d1d", "#f97316", "#fb7185"],
  ocean: ["#0f172a", "#0e7490", "#38bdf8"],
  royal: ["#1e1b4b", "#4338ca", "#a855f7"],
  mono: ["#0f172a", "#374151", "#9ca3af"],
};

const FORMAT_DIMENSIONS: Record<PosterFormat, { width: number; height: number; label: string; ratio: string }> = {
  "instagram-post": { width: 1080, height: 1080, label: "Instagram Post (1:1)", ratio: "1 / 1" },
  "instagram-story": { width: 1080, height: 1920, label: "Instagram Story (9:16)", ratio: "9 / 16" },
  "poster-portrait": { width: 1080, height: 1350, label: "Poster Portrait (4:5)", ratio: "4 / 5" },
};

const FORMAT_KEYS = Object.keys(FORMAT_DIMENSIONS) as PosterFormat[];

function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number, maxLines = 3) {
  const words = text.split(/\s+/).filter(Boolean);
  if (words.length === 0) return [""];
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
  return finalLines;
}

export function OfferPosterGeneratorTool() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const logoRef = useRef<HTMLImageElement | null>(null);

  const [logoDataUrl, setLogoDataUrl] = useState("");
  const [businessName, setBusinessName] = useState("Your Store Name");
  const [headline, setHeadline] = useState("Mega Festive Sale");
  const [subheadline, setSubheadline] = useState("Premium styles. Better prices.");
  const [offerText, setOfferText] = useState("Flat 40% OFF + Extra 10% on selected collection");
  const [priceHighlight, setPriceHighlight] = useState("Starting ₹499");
  const [footerText, setFooterText] = useState("Limited period offer");
  const [ctaText, setCtaText] = useState("Shop now • Visit store today");
  const [contactInfo, setContactInfo] = useState("+91 90000 00000  •  www.yourstore.com  •  Your City");
  const [theme, setTheme] = useState<OfferTheme>("luxury-sale");
  const [colorStyle, setColorStyle] = useState<ColorStyle>("gold");
  const [format, setFormat] = useState<PosterFormat>("poster-portrait");

  const style = useMemo(() => THEME_STYLES[theme], [theme]);

  useEffect(() => {
    if (!logoDataUrl) {
      logoRef.current = null;
      return;
    }
    const image = new Image();
    image.onload = () => {
      logoRef.current = image;
      drawPoster();
    };
    image.src = logoDataUrl;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [logoDataUrl]);

  const drawPoster = () => {
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

    const [c1, c2, c3] = COLOR_STYLES[colorStyle];
    const bg = ctx.createLinearGradient(0, 0, width, height);
    bg.addColorStop(0, c1);
    bg.addColorStop(0.55, c2);
    bg.addColorStop(1, c3);
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, width, height);

    ctx.globalAlpha = 0.2;
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.arc(width * 0.15, height * 0.18, 170, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(width * 0.9, height * 0.38, 230, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;

    ctx.fillStyle = `rgba(15, 23, 42, ${style.panelOpacity})`;
    ctx.beginPath();
    ctx.roundRect(62, 70, width - 124, height - 140, 44);
    ctx.fill();

    if (style.deco === "frame") {
      ctx.strokeStyle = `${style.accent}bb`;
      ctx.lineWidth = 4;
      ctx.strokeRect(84, 92, width - 168, height - 184);
    } else if (style.deco === "burst") {
      ctx.globalAlpha = 0.25;
      ctx.fillStyle = style.accent;
      ctx.beginPath();
      ctx.arc(width - 120, 180, 118, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(124, height - 190, 102, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
    } else {
      ctx.globalAlpha = 0.2;
      ctx.strokeStyle = style.accent;
      ctx.lineWidth = 3;
      for (const y of [140, 190, 240]) {
        ctx.beginPath();
        ctx.arc(width * 0.83, y, 24 + (y % 20), 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
    }

    const logo = logoRef.current;
    if (logo) {
      ctx.fillStyle = "rgba(255,255,255,0.95)";
      ctx.beginPath();
      ctx.roundRect(90, 100, 112, 112, 18);
      ctx.fill();

      const ratio = logo.width / logo.height;
      let drawW = 84;
      let drawH = 84;
      if (ratio > 1) drawH = drawW / ratio;
      else drawW = drawH * ratio;
      ctx.drawImage(logo, 146 - drawW / 2, 156 - drawH / 2, drawW, drawH);
    }

    ctx.fillStyle = "#f8fafc";
    ctx.font = "700 30px Inter, system-ui, sans-serif";
    ctx.fillText(style.titleCase === "upper" ? businessName.toUpperCase() : businessName, 226, 154);

    ctx.fillStyle = style.accent;
    ctx.font = "600 20px Inter, system-ui, sans-serif";
    ctx.fillText(`${style.title} • ${style.eyebrow}`, 226, 186);

    const contentX = 108;
    const contentW = width - 216;

    ctx.fillStyle = "#ffffff";
    ctx.font = "800 84px Inter, system-ui, sans-serif";
    const headlineLines = wrapText(ctx, headline, contentW, 2);
    headlineLines.forEach((line, index) => {
      ctx.fillText(style.titleCase === "upper" ? line.toUpperCase() : line, contentX, 382 + index * 92);
    });

    ctx.fillStyle = "#dbeafe";
    ctx.font = "500 33px Inter, system-ui, sans-serif";
    const subLines = wrapText(ctx, subheadline, contentW, 2);
    subLines.forEach((line, index) => {
      ctx.fillText(line, contentX, 516 + headlineLines.length * 60 + index * 40);
    });

    const offerY = 610 + headlineLines.length * 68 + subLines.length * 36;
    ctx.fillStyle = "rgba(15,23,42,0.82)";
    ctx.beginPath();
    ctx.roundRect(contentX, offerY, contentW, 220, 24);
    ctx.fill();

    ctx.fillStyle = style.accent;
    ctx.font = "800 28px Inter, system-ui, sans-serif";
    ctx.fillText("LIMITED TIME OFFER", contentX + 30, offerY + 48);

    ctx.fillStyle = "#f8fafc";
    ctx.font = "700 44px Inter, system-ui, sans-serif";
    wrapText(ctx, offerText, contentW - 56, 3).forEach((line, index) => {
      ctx.fillText(line, contentX + 30, offerY + 104 + index * 48);
    });

    if (priceHighlight.trim()) {
      const badgeW = Math.min(contentW * 0.66, ctx.measureText(priceHighlight).width + 54);
      ctx.fillStyle = `${style.accent}dd`;
      ctx.beginPath();
      ctx.roundRect(contentX, offerY + 162, badgeW, 44, 999);
      ctx.fill();
      ctx.fillStyle = "#0f172a";
      ctx.font = "700 24px Inter, system-ui, sans-serif";
      ctx.fillText(priceHighlight, contentX + 20, offerY + 191);
    }

    const ctaY = height - 300;
    if (ctaText.trim()) {
      ctx.fillStyle = `${style.accent}e0`;
      ctx.beginPath();
      ctx.roundRect(contentX, ctaY, contentW, 62, 16);
      ctx.fill();
      ctx.fillStyle = "#111827";
      ctx.font = "700 28px Inter, system-ui, sans-serif";
      wrapText(ctx, ctaText, contentW - 40, 1).forEach((line) => {
        ctx.fillText(line, contentX + 20, ctaY + 40);
      });
    }

    if (footerText.trim()) {
      ctx.fillStyle = "#fef3c7";
      ctx.font = "700 34px Inter, system-ui, sans-serif";
      ctx.fillText(footerText, contentX, height - 212);
    }

    ctx.fillStyle = "rgba(255,255,255,0.3)";
    ctx.fillRect(contentX, height - 188, contentW, 2);

    ctx.fillStyle = "#e2e8f0";
    ctx.font = "500 22px Inter, system-ui, sans-serif";
    wrapText(ctx, contactInfo, contentW, 2).forEach((line, index) => {
      ctx.fillText(line, contentX, height - 152 + index * 30);
    });
  };

  useEffect(() => {
    drawPoster();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [businessName, headline, subheadline, offerText, priceHighlight, footerText, ctaText, contactInfo, theme, colorStyle, format]);

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
    link.download = `toolhub-offer-poster-${theme}-${format}.png`;
    link.click();
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 lg:grid-cols-[1.05fr_1fr]">
        <section className="premium-card card space-y-4 rounded-2xl p-4 sm:p-5">
          <h3 className="text-base font-semibold">Retail poster setup</h3>

          <div className="grid gap-3 sm:grid-cols-2">
            <label className="space-y-1 text-sm">
              <span className="muted">Poster format</span>
              <select className="select" value={format} onChange={(e) => setFormat(e.target.value as PosterFormat)}>
                {FORMAT_KEYS.map((key) => (
                  <option key={key} value={key}>{FORMAT_DIMENSIONS[key].label}</option>
                ))}
              </select>
            </label>

            <label className="space-y-1 text-sm">
              <span className="muted">Theme pack</span>
              <select className="select" value={theme} onChange={(e) => setTheme(e.target.value as OfferTheme)}>
                <option value="luxury-sale">Luxury Sale</option>
                <option value="festive-offer">Festive Offer</option>
                <option value="premium-fashion">Premium Fashion Retail</option>
                <option value="grand-opening">Grand Opening</option>
                <option value="clearance-sale">Clearance Sale</option>
                <option value="wedding-collection">Wedding Collection</option>
                <option value="limited-time">Limited-time Promotion</option>
              </select>
            </label>

            <label className="space-y-1 text-sm">
              <span className="muted">Color style</span>
              <select className="select" value={colorStyle} onChange={(e) => setColorStyle(e.target.value as ColorStyle)}>
                <option value="gold">Gold Accent</option>
                <option value="sunset">Sunset</option>
                <option value="ocean">Ocean</option>
                <option value="royal">Royal Purple</option>
                <option value="mono">Monochrome</option>
              </select>
            </label>
          </div>

          <input className="field" value={businessName} onChange={(e) => setBusinessName(e.target.value)} placeholder="Business/store name" />
          <input className="field" value={headline} onChange={(e) => setHeadline(e.target.value)} placeholder="Main campaign headline" />
          <input className="field" value={subheadline} onChange={(e) => setSubheadline(e.target.value)} placeholder="Subheadline" />
          <textarea className="textarea" value={offerText} onChange={(e) => setOfferText(e.target.value)} placeholder="Offer block" />
          <input className="field" value={priceHighlight} onChange={(e) => setPriceHighlight(e.target.value)} placeholder="Price highlight (e.g. Starting ₹499)" />
          <input className="field" value={ctaText} onChange={(e) => setCtaText(e.target.value)} placeholder="CTA line" />
          <input className="field" value={footerText} onChange={(e) => setFooterText(e.target.value)} placeholder="Footer line" />
          <textarea className="textarea" value={contactInfo} onChange={(e) => setContactInfo(e.target.value)} placeholder="Phone / website / address" />

          <div className="grid gap-3 sm:grid-cols-[1fr_auto_auto] sm:items-end">
            <input type="file" accept="image/*" onChange={onUploadLogo} className="w-full rounded-xl border p-3 text-sm" style={{ borderColor: "var(--border)" }} />
            <button type="button" className="btn btn-secondary" onClick={() => setLogoDataUrl("")}>Remove logo</button>
            <button type="button" className="btn btn-primary" onClick={download}>Download Poster</button>
          </div>
        </section>

        <section className="space-y-3">
          <p className="text-sm font-medium">Live poster preview</p>
          <div
            className="card premium-card rounded-2xl border p-2 sm:p-3"
            style={{ borderColor: "var(--border)" }}
          >
            <canvas
              ref={canvasRef}
              className="mx-auto block h-auto w-full rounded-xl"
              style={{
                aspectRatio: FORMAT_DIMENSIONS[format].ratio,
                maxHeight: "78vh",
                background: "#0f172a",
              }}
            />
          </div>
        </section>
      </div>
    </div>
  );
}
