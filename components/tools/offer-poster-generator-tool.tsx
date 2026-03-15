"use client";

import { ChangeEvent, useEffect, useRef, useState } from "react";

type OfferTheme = "luxury" | "festive" | "modern-retail" | "bold-sale" | "minimal-premium";
type ColorStyle = "gold" | "sunset" | "ocean" | "royal" | "mono";

const THEME_STYLES: Record<OfferTheme, { title: string; panelOpacity: number; titleCase: "upper" | "normal" }> = {
  luxury: { title: "Luxury", panelOpacity: 0.26, titleCase: "upper" },
  festive: { title: "Festive", panelOpacity: 0.22, titleCase: "normal" },
  "modern-retail": { title: "Modern Retail", panelOpacity: 0.3, titleCase: "normal" },
  "bold-sale": { title: "Bold Sale", panelOpacity: 0.16, titleCase: "upper" },
  "minimal-premium": { title: "Minimal Premium", panelOpacity: 0.4, titleCase: "normal" },
};

const COLOR_STYLES: Record<ColorStyle, [string, string, string]> = {
  gold: ["#0f172a", "#7c2d12", "#f59e0b"],
  sunset: ["#7f1d1d", "#f97316", "#fb7185"],
  ocean: ["#0f172a", "#0e7490", "#38bdf8"],
  royal: ["#1e1b4b", "#4338ca", "#a855f7"],
  mono: ["#111827", "#374151", "#9ca3af"],
};

function wrapLines(ctx: CanvasRenderingContext2D, text: string, maxWidth: number, maxLines = 3) {
  const words = text.split(/\s+/).filter(Boolean);
  if (words.length === 0) return [""];
  const lines: string[] = [];
  let line = words[0] ?? "";

  for (let i = 1; i < words.length; i += 1) {
    const test = `${line} ${words[i]}`;
    if (ctx.measureText(test).width <= maxWidth) {
      line = test;
    } else {
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
  const [footerText, setFooterText] = useState("Limited period offer");
  const [contactInfo, setContactInfo] = useState("+91 90000 00000  •  www.yourstore.com  •  Your City");
  const [theme, setTheme] = useState<OfferTheme>("luxury");
  const [colorStyle, setColorStyle] = useState<ColorStyle>("gold");

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

    const width = 1080;
    const height = 1350;
    canvas.width = width;
    canvas.height = height;

    const gradientColors = COLOR_STYLES[colorStyle];
    const themeStyle = THEME_STYLES[theme];

    const bg = ctx.createLinearGradient(0, 0, width, height);
    bg.addColorStop(0, gradientColors[0]);
    bg.addColorStop(0.5, gradientColors[1]);
    bg.addColorStop(1, gradientColors[2]);
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, width, height);

    ctx.globalAlpha = 0.18;
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.arc(150, 180, 180, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(width - 120, 420, 220, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;

    ctx.fillStyle = `rgba(15, 23, 42, ${themeStyle.panelOpacity})`;
    ctx.beginPath();
    ctx.roundRect(70, 80, width - 140, height - 160, 40);
    ctx.fill();

    const logo = logoRef.current;
    if (logo) {
      ctx.fillStyle = "rgba(255,255,255,0.95)";
      ctx.beginPath();
      ctx.roundRect(90, 100, 112, 112, 20);
      ctx.fill();

      const ratio = logo.width / logo.height;
      let drawW = 84;
      let drawH = 84;
      if (ratio > 1) {
        drawH = drawW / ratio;
      } else {
        drawW = drawH * ratio;
      }
      ctx.drawImage(logo, 146 - drawW / 2, 156 - drawH / 2, drawW, drawH);
    }

    ctx.fillStyle = "#f8fafc";
    ctx.font = "700 30px Inter, system-ui, sans-serif";
    ctx.fillText(themeStyle.titleCase === "upper" ? businessName.toUpperCase() : businessName, 226, 158);

    ctx.font = "500 20px Inter, system-ui, sans-serif";
    ctx.fillStyle = "#cbd5e1";
    ctx.fillText(`${THEME_STYLES[theme].title} Collection`, 226, 192);

    const contentX = 110;
    const contentWidth = width - 220;

    ctx.fillStyle = "#ffffff";
    ctx.font = "800 88px Inter, system-ui, sans-serif";
    const headlineLines = wrapLines(ctx, headline, contentWidth, 2);
    headlineLines.forEach((line, index) => {
      ctx.fillText(themeStyle.titleCase === "upper" ? line.toUpperCase() : line, contentX, 390 + index * 94);
    });

    ctx.fillStyle = "#dbeafe";
    ctx.font = "500 34px Inter, system-ui, sans-serif";
    const subLines = wrapLines(ctx, subheadline, contentWidth, 2);
    subLines.forEach((line, index) => {
      ctx.fillText(line, contentX, 520 + headlineLines.length * 66 + index * 42);
    });

    const offerY = 610 + headlineLines.length * 64 + subLines.length * 32;
    ctx.fillStyle = "rgba(15,23,42,0.8)";
    ctx.beginPath();
    ctx.roundRect(contentX, offerY, contentWidth, 200, 24);
    ctx.fill();

    ctx.fillStyle = "#fbbf24";
    ctx.font = "800 30px Inter, system-ui, sans-serif";
    ctx.fillText("EXCLUSIVE OFFER", contentX + 34, offerY + 52);

    ctx.fillStyle = "#f8fafc";
    ctx.font = "700 44px Inter, system-ui, sans-serif";
    const offerLines = wrapLines(ctx, offerText, contentWidth - 68, 3);
    offerLines.forEach((line, index) => {
      ctx.fillText(line, contentX + 34, offerY + 112 + index * 50);
    });

    const footerY = height - 252;
    if (footerText.trim()) {
      ctx.fillStyle = "#fef3c7";
      ctx.font = "700 36px Inter, system-ui, sans-serif";
      ctx.fillText(footerText, contentX, footerY);
    }

    ctx.fillStyle = "rgba(255,255,255,0.3)";
    ctx.fillRect(contentX, footerY + 28, contentWidth, 2);

    ctx.fillStyle = "#e2e8f0";
    ctx.font = "500 24px Inter, system-ui, sans-serif";
    wrapLines(ctx, contactInfo, contentWidth, 2).forEach((line, index) => {
      ctx.fillText(line, contentX, footerY + 68 + index * 30);
    });
  };

  useEffect(() => {
    drawPoster();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [businessName, headline, subheadline, offerText, footerText, contactInfo, theme, colorStyle]);

  const onUploadLogo = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setLogoDataUrl(String(reader.result ?? ""));
    reader.readAsDataURL(file);
  };

  const downloadPoster = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement("a");
    link.href = canvas.toDataURL("image/png", 1);
    link.download = `toolhub-offer-poster-${theme}.png`;
    link.click();
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 lg:grid-cols-[1.05fr_1fr]">
        <section className="space-y-4 rounded-2xl border p-4 sm:p-5" style={{ borderColor: "var(--border)" }}>
          <h3 className="text-base font-semibold">Poster details</h3>

          <div className="grid gap-3 sm:grid-cols-2">
            <label className="space-y-1 text-sm">
              <span className="muted">Theme</span>
              <select className="select" value={theme} onChange={(e) => setTheme(e.target.value as OfferTheme)}>
                <option value="luxury">Luxury</option>
                <option value="festive">Festive</option>
                <option value="modern-retail">Modern Retail</option>
                <option value="bold-sale">Bold Sale</option>
                <option value="minimal-premium">Minimal Premium</option>
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
          <input className="field" value={headline} onChange={(e) => setHeadline(e.target.value)} placeholder="Main headline" />
          <input className="field" value={subheadline} onChange={(e) => setSubheadline(e.target.value)} placeholder="Subheadline" />
          <textarea className="textarea" value={offerText} onChange={(e) => setOfferText(e.target.value)} placeholder="Offer text" />
          <input className="field" value={footerText} onChange={(e) => setFooterText(e.target.value)} placeholder="Optional footer text" />
          <textarea className="textarea" value={contactInfo} onChange={(e) => setContactInfo(e.target.value)} placeholder="Phone / website / address" />

          <div className="grid gap-3 sm:grid-cols-[1fr_auto_auto] sm:items-end">
            <input type="file" accept="image/*" onChange={onUploadLogo} className="w-full rounded-xl border p-3 text-sm" style={{ borderColor: "var(--border)" }} />
            <button type="button" className="btn btn-secondary" onClick={() => setLogoDataUrl("")}>
              Remove logo
            </button>
            <button type="button" className="btn btn-primary" onClick={downloadPoster}>
              Download Poster
            </button>
          </div>
        </section>

        <section className="space-y-3">
          <p className="text-sm font-medium">Live poster preview</p>
          <div className="rounded-2xl border p-2 sm:p-3" style={{ borderColor: "var(--border)" }}>
            <canvas
              ref={canvasRef}
              className="mx-auto block h-auto w-full rounded-xl"
              style={{ aspectRatio: "4 / 5", maxHeight: "78vh", background: "#111827" }}
            />
          </div>
        </section>
      </div>
    </div>
  );
}
