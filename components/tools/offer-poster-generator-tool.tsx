"use client";

import { ChangeEvent, PointerEvent, useEffect, useMemo, useRef, useState } from "react";
import { useCreativeUnlocks } from "@/lib/use-creative-unlocks";

type OfferTheme = "luxury-sale" | "festive-offer" | "premium-fashion" | "grand-opening" | "clearance-sale" | "wedding-collection" | "limited-time";
type EditorMode = "normal" | "advanced";
type PosterFormat = "instagram-post" | "instagram-story" | "poster-portrait" | "landscape";
type Align = "left" | "center" | "right";
type BgMode = "template" | "upload" | "plain" | "gradient";

type BlockStyle = {
  visible: boolean;
  size: number;
  color: string;
  align: Align;
  weight: "500" | "600" | "700" | "800";
  x: number;
  y: number;
};

const THEME_STYLES: Record<OfferTheme, { title: string; accent: string; colors: [string, string, string]; deco: "frame" | "burst" | "ornament" }> = {
  "luxury-sale": { title: "Luxury Sale", accent: "#fbbf24", colors: ["#0f172a", "#7c2d12", "#f59e0b"], deco: "frame" },
  "festive-offer": { title: "Festive Offer", accent: "#f472b6", colors: ["#7e22ce", "#ec4899", "#fb7185"], deco: "ornament" },
  "premium-fashion": { title: "Premium Fashion", accent: "#22d3ee", colors: ["#0f172a", "#0e7490", "#38bdf8"], deco: "frame" },
  "grand-opening": { title: "Grand Opening", accent: "#f59e0b", colors: ["#422006", "#b45309", "#f59e0b"], deco: "burst" },
  "clearance-sale": { title: "Clearance Sale", accent: "#fb7185", colors: ["#4c0519", "#be123c", "#fb7185"], deco: "burst" },
  "wedding-collection": { title: "Wedding Collection", accent: "#f9a8d4", colors: ["#3f1d2e", "#9d174d", "#f472b6"], deco: "ornament" },
  "limited-time": { title: "Limited Time", accent: "#60a5fa", colors: ["#172554", "#1d4ed8", "#60a5fa"], deco: "burst" },
};

const FORMAT_DIMENSIONS: Record<PosterFormat, { width: number; height: number; label: string; ratio: string }> = {
  "instagram-post": { width: 1080, height: 1080, label: "Instagram Post (1:1)", ratio: "1 / 1" },
  "instagram-story": { width: 1080, height: 1920, label: "Instagram Story (9:16)", ratio: "9 / 16" },
  "poster-portrait": { width: 1080, height: 1350, label: "Poster Portrait (4:5)", ratio: "4 / 5" },
  landscape: { width: 1920, height: 1080, label: "Landscape (16:9)", ratio: "16 / 9" },
};

const FORMAT_KEYS = Object.keys(FORMAT_DIMENSIONS) as PosterFormat[];

function wrap(ctx: CanvasRenderingContext2D, text: string, maxWidth: number, maxLines = 3) {
  const words = text.split(/\s+/).filter(Boolean);
  if (!words.length) return [""];
  const lines: string[] = [];
  let line = words[0] || "";
  for (let i = 1; i < words.length; i += 1) {
    const test = `${line} ${words[i]}`;
    if (ctx.measureText(test).width <= maxWidth) line = test;
    else {
      lines.push(line);
      line = words[i] || "";
    }
  }
  lines.push(line);
  return lines.slice(0, maxLines);
}

function drawTextBlock(ctx: CanvasRenderingContext2D, text: string, width: number, height: number, style: BlockStyle, maxWidth = 0.78, maxLines = 2) {
  if (!style.visible || !text.trim()) return;
  const x = style.x * width;
  const y = style.y * height;
  ctx.fillStyle = style.color;
  ctx.font = `${style.weight} ${style.size}px Inter, system-ui, sans-serif`;
  const lines = wrap(ctx, text, width * maxWidth, maxLines);
  const lh = style.size * 1.2;
  lines.forEach((line, i) => {
    const m = ctx.measureText(line).width;
    let dx = x;
    if (style.align === "center") dx = x - m / 2;
    if (style.align === "right") dx = x - m;
    ctx.fillText(line, dx, y + i * lh);
  });
}

type DragTarget = "logo" | "headline" | "subheadline" | "offer" | "badge" | "cta" | "business" | "footer" | "contact";

export function OfferPosterGeneratorTool() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const previewWrapRef = useRef<HTMLDivElement | null>(null);
  const logoRef = useRef<HTMLImageElement | null>(null);
  const bgRef = useRef<HTMLImageElement | null>(null);

  const [theme, setTheme] = useState<OfferTheme>("luxury-sale");
  const [editorMode, setEditorMode] = useState<EditorMode>("normal");
  const [format, setFormat] = useState<PosterFormat>("poster-portrait");
  const [bgMode, setBgMode] = useState<BgMode>("template");
  const [overlayOpacity, setOverlayOpacity] = useState(16);
  const [plainColor, setPlainColor] = useState("#111827");
  const [gradientA, setGradientA] = useState("#1d4ed8");
  const [gradientB, setGradientB] = useState("#7c3aed");
  const [uploadedBg, setUploadedBg] = useState("");

  const [logoDataUrl, setLogoDataUrl] = useState("");
  const [logoSize, setLogoSize] = useState(100);
  const [logoVisible, setLogoVisible] = useState(true);

  const [businessName, setBusinessName] = useState("Your Store Name");
  const [headline, setHeadline] = useState("Mega Festive Sale");
  const [subheadline, setSubheadline] = useState("Premium styles. Better prices.");
  const [offerText, setOfferText] = useState("Flat 40% OFF + Extra 10% on selected collection");
  const [badgeText, setBadgeText] = useState("Starting ₹499");
  const [ctaText, setCtaText] = useState("Shop now • Visit store today");
  const [footerText, setFooterText] = useState("Limited period offer");
  const [contactDetails, setContactDetails] = useState("+91 90000 00000 • yourstore.com • Your City");

  const [headlineStyle, setHeadlineStyle] = useState<BlockStyle>({ visible: true, size: 76, color: "#ffffff", align: "left", weight: "800", x: 0.1, y: 0.34 });
  const [subStyle, setSubStyle] = useState<BlockStyle>({ visible: true, size: 34, color: "#dbeafe", align: "left", weight: "600", x: 0.1, y: 0.5 });
  const [offerStyle, setOfferStyle] = useState<BlockStyle>({ visible: true, size: 42, color: "#f8fafc", align: "left", weight: "700", x: 0.12, y: 0.66 });
  const [badgeStyle, setBadgeStyle] = useState<BlockStyle>({ visible: true, size: 27, color: "#111827", align: "left", weight: "700", x: 0.12, y: 0.74 });
  const [ctaStyle, setCtaStyle] = useState<BlockStyle>({ visible: true, size: 28, color: "#111827", align: "left", weight: "700", x: 0.1, y: 0.83 });
  const [businessStyle, setBusinessStyle] = useState<BlockStyle>({ visible: true, size: 29, color: "#f8fafc", align: "left", weight: "700", x: 0.24, y: 0.105 });
  const [footerStyle, setFooterStyle] = useState<BlockStyle>({ visible: true, size: 32, color: "#fef3c7", align: "left", weight: "700", x: 0.1, y: 0.91 });
  const [contactStyle, setContactStyle] = useState<BlockStyle>({ visible: true, size: 22, color: "#e2e8f0", align: "left", weight: "500", x: 0.1, y: 0.955 });

  const [logoPos, setLogoPos] = useState({ x: 0.12, y: 0.1 });
  const [dragging, setDragging] = useState<DragTarget | null>(null);
  const [shareStatus, setShareStatus] = useState("");

  const {
    pwaInstalled,
    premiumUnlocked,
    hdUnlocked,
    watermarkEnabled,
    watermarkRemovable,
    shareCount,
    referralVisits,
    handleShare,
    toggleWatermarkDisabled,
  } = useCreativeUnlocks();

  const style = useMemo(() => THEME_STYLES[theme], [theme]);

  const updatePos = (event: PointerEvent<HTMLDivElement>, target: DragTarget) => {
    const rect = previewWrapRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = Math.max(0.05, Math.min(0.95, (event.clientX - rect.left) / rect.width));
    const y = Math.max(0.05, Math.min(0.95, (event.clientY - rect.top) / rect.height));
    if (target === "logo") setLogoPos({ x, y });
    if (target === "headline") setHeadlineStyle((s) => ({ ...s, x, y }));
    if (target === "subheadline") setSubStyle((s) => ({ ...s, x, y }));
    if (target === "offer") setOfferStyle((s) => ({ ...s, x, y }));
    if (target === "badge") setBadgeStyle((s) => ({ ...s, x, y }));
    if (target === "cta") setCtaStyle((s) => ({ ...s, x, y }));
    if (target === "business") setBusinessStyle((s) => ({ ...s, x, y }));
    if (target === "footer") setFooterStyle((s) => ({ ...s, x, y }));
    if (target === "contact") setContactStyle((s) => ({ ...s, x, y }));
  };

  useEffect(() => {
    if (!logoDataUrl) {
      logoRef.current = null;
      return;
    }
    const img = new Image();
    img.onload = () => {
      logoRef.current = img;
      draw();
    };
    img.src = logoDataUrl;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [logoDataUrl]);

  useEffect(() => {
    if (!uploadedBg) {
      bgRef.current = null;
      return;
    }
    const img = new Image();
    img.onload = () => {
      bgRef.current = img;
      draw();
    };
    img.src = uploadedBg;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uploadedBg]);

  const draw = (forExport = false) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const { width, height } = FORMAT_DIMENSIONS[format];
    const scale = forExport ? (hdUnlocked ? 3 : 2) : 1;
    canvas.width = width * scale;
    canvas.height = height * scale;
    ctx.setTransform(scale, 0, 0, scale, 0, 0);

    if (bgMode === "upload" && bgRef.current) {
      ctx.drawImage(bgRef.current, 0, 0, width, height);
    } else if (bgMode === "plain") {
      ctx.fillStyle = plainColor;
      ctx.fillRect(0, 0, width, height);
    } else if (bgMode === "gradient") {
      const g = ctx.createLinearGradient(0, 0, width, height);
      g.addColorStop(0, gradientA);
      g.addColorStop(1, gradientB);
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, width, height);
    } else {
      const g = ctx.createLinearGradient(0, 0, width, height);
      g.addColorStop(0, style.colors[0]);
      g.addColorStop(0.5, style.colors[1]);
      g.addColorStop(1, style.colors[2]);
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, width, height);
    }

    ctx.fillStyle = `rgba(6,10,20,${overlayOpacity / 100})`;
    ctx.fillRect(0, 0, width, height);

    ctx.fillStyle = "rgba(15,23,42,0.2)";
    ctx.beginPath();
    ctx.roundRect(width * 0.05, height * 0.06, width * 0.9, height * 0.88, 30);
    ctx.fill();

    if (style.deco === "frame") {
      ctx.strokeStyle = `${style.accent}bb`;
      ctx.lineWidth = 4;
      ctx.strokeRect(width * 0.07, height * 0.08, width * 0.86, height * 0.84);
    } else if (style.deco === "burst") {
      ctx.globalAlpha = 0.2;
      ctx.fillStyle = style.accent;
      ctx.beginPath();
      ctx.arc(width * 0.9, height * 0.16, width * 0.13, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(width * 0.12, height * 0.84, width * 0.1, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
    } else {
      ctx.globalAlpha = 0.22;
      ctx.strokeStyle = style.accent;
      ctx.lineWidth = 2;
      for (let i = 0; i < 5; i += 1) {
        ctx.beginPath();
        ctx.arc(width * 0.86, height * (0.18 + i * 0.07), 18 + i * 7, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
    }

    if (logoVisible && logoRef.current) {
      const size = logoSize;
      const lx = width * logoPos.x - size / 2;
      const ly = height * logoPos.y - size / 2;
      ctx.fillStyle = "rgba(255,255,255,0.95)";
      ctx.beginPath();
      ctx.roundRect(lx, ly, size, size, 16);
      ctx.fill();
      const ratio = logoRef.current.width / logoRef.current.height;
      let dw = size - 18;
      let dh = size - 18;
      if (ratio > 1) dh = dw / ratio;
      else dw = dh * ratio;
      ctx.drawImage(logoRef.current, lx + (size - dw) / 2, ly + (size - dh) / 2, dw, dh);
    }

    if (editorMode === "normal") {
      const left = width * 0.1;
      const maxW = width * 0.8;
      let y = height * 0.14;

      ctx.fillStyle = "#f8fafc";
      ctx.font = `700 ${Math.max(24, Math.round(height * 0.024))}px Inter, system-ui, sans-serif`;
      wrap(ctx, businessName, maxW * 0.75, 1).forEach((line) => ctx.fillText(line, left, y));
      ctx.fillStyle = style.accent;
      ctx.font = `600 ${Math.max(18, Math.round(height * 0.016))}px Inter, system-ui, sans-serif`;
      wrap(ctx, style.title, maxW * 0.75, 1).forEach((line) => ctx.fillText(line, left, y + Math.max(28, Math.round(height * 0.03))));

      y = height * 0.28;
      ctx.fillStyle = "#ffffff";
      ctx.font = `800 ${Math.max(44, Math.round(height * 0.062))}px Inter, system-ui, sans-serif`;
      wrap(ctx, headline, maxW, 2).forEach((line, i) => ctx.fillText(line, left, y + i * Math.max(56, Math.round(height * 0.06))));

      y += Math.max(130, Math.round(height * 0.14));
      ctx.fillStyle = "#dbeafe";
      ctx.font = `600 ${Math.max(24, Math.round(height * 0.03))}px Inter, system-ui, sans-serif`;
      wrap(ctx, subheadline, maxW, 2).forEach((line, i) => ctx.fillText(line, left, y + i * Math.max(35, Math.round(height * 0.035))));

      y += Math.max(95, Math.round(height * 0.1));
      ctx.fillStyle = "rgba(15,23,42,0.82)";
      ctx.beginPath();
      ctx.roundRect(left, y - 42, width * 0.76, Math.max(160, Math.round(height * 0.17)), 22);
      ctx.fill();
      ctx.fillStyle = style.accent;
      ctx.font = `700 ${Math.max(21, Math.round(height * 0.019))}px Inter, system-ui, sans-serif`;
      ctx.fillText("LIMITED TIME OFFER", left + 18, y - 12);
      ctx.fillStyle = "#f8fafc";
      ctx.font = `700 ${Math.max(30, Math.round(height * 0.038))}px Inter, system-ui, sans-serif`;
      wrap(ctx, offerText, width * 0.7, 3).forEach((line, i) => ctx.fillText(line, left + 18, y + 34 + i * Math.max(40, Math.round(height * 0.04))));

      if (badgeText.trim()) {
        const by = y + Math.max(128, Math.round(height * 0.135));
        ctx.fillStyle = `${style.accent}ee`;
        ctx.beginPath();
        ctx.roundRect(left, by - 24, width * 0.42, 48, 999);
        ctx.fill();
        ctx.fillStyle = "#111827";
        ctx.font = `700 ${Math.max(20, Math.round(height * 0.021))}px Inter, system-ui, sans-serif`;
        wrap(ctx, badgeText, width * 0.36, 1).forEach((line) => ctx.fillText(line, left + 16, by + 7));
      }

      if (ctaText.trim()) {
        const cy = height * (format === "instagram-story" ? 0.84 : 0.82);
        ctx.fillStyle = `${style.accent}e5`;
        ctx.beginPath();
        ctx.roundRect(left, cy - 34, width * 0.62, 62, 18);
        ctx.fill();
        ctx.fillStyle = "#111827";
        ctx.font = `700 ${Math.max(22, Math.round(height * 0.025))}px Inter, system-ui, sans-serif`;
        wrap(ctx, ctaText, width * 0.56, 1).forEach((line) => ctx.fillText(line, left + 16, cy + 6));
      }

      if (footerText.trim()) {
        ctx.fillStyle = "#fef3c7";
        ctx.font = `700 ${Math.max(24, Math.round(height * 0.024))}px Inter, system-ui, sans-serif`;
        wrap(ctx, footerText, maxW, 1).forEach((line) => ctx.fillText(line, left, height * 0.91));
      }

      ctx.fillStyle = "rgba(255,255,255,0.32)";
      ctx.fillRect(width * 0.1, height * 0.925, width * 0.8, 2);
      ctx.fillStyle = "#e2e8f0";
      ctx.font = `500 ${Math.max(16, Math.round(height * 0.016))}px Inter, system-ui, sans-serif`;
      wrap(ctx, contactDetails, width * 0.8, 2).forEach((line, i) => {
        ctx.fillText(line, width * 0.1, height * (0.955 + i * 0.022));
      });
    } else {
      drawTextBlock(ctx, businessName, width, height, businessStyle, 0.7, 1);
      ctx.fillStyle = style.accent;
      ctx.font = `600 ${Math.max(18, Math.round(height * 0.016))}px Inter, system-ui, sans-serif`;
      wrap(ctx, style.title, width * 0.6, 1).forEach((line) => ctx.fillText(line, width * 0.24, height * 0.135));

      drawTextBlock(ctx, headline, width, height, headlineStyle, 0.78, 2);
      drawTextBlock(ctx, subheadline, width, height, subStyle, 0.78, 2);

      if (offerStyle.visible && offerText.trim()) {
        const ox = width * (offerStyle.align === "center" ? offerStyle.x - 0.24 : offerStyle.align === "right" ? offerStyle.x - 0.48 : offerStyle.x);
        const oy = height * offerStyle.y;
        ctx.fillStyle = "rgba(15,23,42,0.8)";
        ctx.beginPath();
        ctx.roundRect(ox, oy - 50, width * 0.48, 170, 22);
        ctx.fill();
        ctx.fillStyle = style.accent;
        ctx.font = "700 25px Inter, system-ui, sans-serif";
        ctx.fillText("LIMITED TIME OFFER", ox + 18, oy - 18);
        drawTextBlock(ctx, offerText, width, height, offerStyle, 0.42, 3);

        if (badgeStyle.visible && badgeText.trim()) {
          const bx = width * (badgeStyle.align === "center" ? badgeStyle.x - 0.16 : badgeStyle.align === "right" ? badgeStyle.x - 0.32 : badgeStyle.x);
          const by = height * badgeStyle.y;
          ctx.fillStyle = `${style.accent}ee`;
          ctx.beginPath();
          ctx.roundRect(bx, by - 28, width * 0.32, 50, 999);
          ctx.fill();
          drawTextBlock(ctx, badgeText, width, height, badgeStyle, 0.28, 1);
        }
      }

      if (ctaStyle.visible && ctaText.trim()) {
        const cx = width * (ctaStyle.align === "center" ? ctaStyle.x - 0.2 : ctaStyle.align === "right" ? ctaStyle.x - 0.4 : ctaStyle.x);
        const cy = height * ctaStyle.y;
        ctx.fillStyle = `${style.accent}e5`;
        ctx.beginPath();
        ctx.roundRect(cx, cy - 36, width * 0.4, 64, 18);
        ctx.fill();
        drawTextBlock(ctx, ctaText, width, height, ctaStyle, 0.36, 1);
      }

      if (footerText.trim()) {
        drawTextBlock(ctx, footerText, width, height, footerStyle, 0.8, 1);
      }

      ctx.fillStyle = "rgba(255,255,255,0.32)";
      ctx.fillRect(width * 0.1, height * 0.925, width * 0.8, 2);
      drawTextBlock(ctx, contactDetails, width, height, contactStyle, 0.8, 2);
    }

    if (watermarkEnabled) {
      ctx.fillStyle = "rgba(255,255,255,0.72)";
      ctx.font = "500 17px Inter, system-ui, sans-serif";
      ctx.textAlign = "right";
      ctx.fillText("Create your own at ToolHubsite.in", width - 22, height - 18);
      ctx.textAlign = "left";
    }
  };

  useEffect(() => {
    draw(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [style, format, bgMode, overlayOpacity, plainColor, gradientA, gradientB, businessName, headline, subheadline, offerText, badgeText, ctaText, footerText, contactDetails, logoVisible, logoSize, logoPos, headlineStyle, subStyle, offerStyle, badgeStyle, ctaStyle, businessStyle, footerStyle, contactStyle, editorMode, watermarkEnabled]);

  const upload = (event: ChangeEvent<HTMLInputElement>, setter: (v: string) => void) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setter(String(reader.result || ""));
    reader.readAsDataURL(file);
  };

  const download = () => {
    draw(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement("a");
    link.href = canvas.toDataURL("image/png", 1);
    link.download = `toolhub-offer-${theme}-${format}.png`;
    link.click();
    draw(false);
  };

  const TextControl = ({ label, style, setStyle }: { label: string; style: BlockStyle; setStyle: (next: BlockStyle) => void }) => (
    <div className="rounded-xl border p-3" style={{ borderColor: "var(--border)" }}>
      <div className="mb-2 flex items-center justify-between">
        <p className="text-sm font-semibold">{label}</p>
        <label className="text-xs"><input type="checkbox" checked={style.visible} onChange={(e) => setStyle({ ...style, visible: e.target.checked })} /> Show</label>
      </div>
      <div className="grid gap-2 sm:grid-cols-2">
        <label className="text-xs">Size<input type="range" min={18} max={90} value={style.size} onChange={(e) => setStyle({ ...style, size: Number(e.target.value) })} className="w-full" /></label>
        <label className="text-xs">Color<input type="color" value={style.color} onChange={(e) => setStyle({ ...style, color: e.target.value })} className="h-9 w-full rounded" /></label>
        <label className="text-xs">Align
          <select className="select" value={style.align} onChange={(e) => setStyle({ ...style, align: e.target.value as Align })}>
            <option value="left">Left</option><option value="center">Center</option><option value="right">Right</option>
          </select>
        </label>
        <label className="text-xs">Weight
          <select className="select" value={style.weight} onChange={(e) => setStyle({ ...style, weight: e.target.value as BlockStyle["weight"] })}>
            <option value="500">Medium</option><option value="600">Semi Bold</option><option value="700">Bold</option><option value="800">Extra Bold</option>
          </select>
        </label>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="grid gap-4 xl:grid-cols-[1.05fr_1fr]">
        <section className="space-y-4 rounded-2xl border p-4" style={{ borderColor: "var(--border)" }}>
          <h3 className="text-base font-semibold">Offer poster editor controls</h3>
          <div className="flex gap-2">
            <button className={`btn ${editorMode === "normal" ? "btn-primary" : "btn-secondary"}`} onClick={() => setEditorMode("normal")}>Normal</button>
            <button className={`btn ${editorMode === "advanced" ? "btn-primary" : "btn-secondary"}`} onClick={() => setEditorMode("advanced")}>Advanced</button>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="text-sm">Theme
              <select className="select" value={theme} onChange={(e) => setTheme(e.target.value as OfferTheme)}>
                <option value="luxury-sale">Luxury Sale</option>
                <option value="festive-offer">Festive Offer</option>
                <option value="premium-fashion">Fashion Retail</option>
                <option value="grand-opening">Grand Opening</option>
                <option value="clearance-sale">Clearance Sale</option>
                <option value="wedding-collection">Wedding Collection</option>
                <option value="limited-time">Limited-time Promotion</option>
              </select>
            </label>
            <label className="text-sm">Format
              <select className="select" value={format} onChange={(e) => setFormat(e.target.value as PosterFormat)}>
                {FORMAT_KEYS.map((k) => <option key={k} value={k}>{FORMAT_DIMENSIONS[k].label}</option>)}
              </select>
            </label>
          </div>

          <div className="rounded-xl border p-3" style={{ borderColor: "var(--border)" }}>
            <p className="mb-2 text-sm font-semibold">Background customization</p>
            <div className="grid gap-2 sm:grid-cols-2">
              <select className="select" value={bgMode} onChange={(e) => setBgMode(e.target.value as BgMode)}>
                <option value="template">Template background</option>
                <option value="upload">Upload background</option>
                <option value="plain">Plain background</option>
                <option value="gradient">Custom gradient</option>
              </select>
              {bgMode === "upload" && <input type="file" accept="image/*" onChange={(e) => upload(e, setUploadedBg)} className="field" />}
              {bgMode === "plain" && <input type="color" value={plainColor} onChange={(e) => setPlainColor(e.target.value)} className="h-11 w-full rounded" />}
              {bgMode === "gradient" && (
                <>
                  <label className="text-xs">Color A<input type="color" value={gradientA} onChange={(e) => setGradientA(e.target.value)} className="h-10 w-full rounded" /></label>
                  <label className="text-xs">Color B<input type="color" value={gradientB} onChange={(e) => setGradientB(e.target.value)} className="h-10 w-full rounded" /></label>
                </>
              )}
            </div>
            <label className="mt-2 block text-xs">Overlay tint/opacity ({overlayOpacity}%)
              <input type="range" min={0} max={60} value={overlayOpacity} onChange={(e) => setOverlayOpacity(Number(e.target.value))} className="w-full" />
            </label>
          </div>

          <div className="grid gap-2">
            <input className="field" value={businessName} onChange={(e) => setBusinessName(e.target.value)} placeholder="Business/store name" />
            <input className="field" value={headline} onChange={(e) => setHeadline(e.target.value)} placeholder="Main headline" />
            <input className="field" value={subheadline} onChange={(e) => setSubheadline(e.target.value)} placeholder="Subheadline" />
            <textarea className="textarea" value={offerText} onChange={(e) => setOfferText(e.target.value)} placeholder="Offer text" />
            <input className="field" value={badgeText} onChange={(e) => setBadgeText(e.target.value)} placeholder="Price / discount badge text" />
            <input className="field" value={ctaText} onChange={(e) => setCtaText(e.target.value)} placeholder="CTA text" />
            <input className="field" value={footerText} onChange={(e) => setFooterText(e.target.value)} placeholder="Footer text" />
            <input className="field" value={contactDetails} onChange={(e) => setContactDetails(e.target.value)} placeholder="Contact details" />
          </div>

          {editorMode === "advanced" ? (
            <div className="grid gap-3 sm:grid-cols-2">
              <TextControl label="Headline" style={headlineStyle} setStyle={setHeadlineStyle} />
              <TextControl label="Subheadline" style={subStyle} setStyle={setSubStyle} />
              <TextControl label="Offer" style={offerStyle} setStyle={setOfferStyle} />
              <TextControl label="Price badge" style={badgeStyle} setStyle={setBadgeStyle} />
              <TextControl label="CTA" style={ctaStyle} setStyle={setCtaStyle} />
              <TextControl label="Business name" style={businessStyle} setStyle={setBusinessStyle} />
              <TextControl label="Footer" style={footerStyle} setStyle={setFooterStyle} />
              <TextControl label="Contact" style={contactStyle} setStyle={setContactStyle} />
            </div>
          ) : null}

          <div className="rounded-xl border p-3" style={{ borderColor: "var(--border)" }}>
            <p className="text-sm font-semibold">Logo controls</p>
            <div className="mt-2 grid gap-2 sm:grid-cols-2">
              <input type="file" accept="image/*" onChange={(e) => upload(e, setLogoDataUrl)} className="field" />
              <label className="text-xs">Logo size ({logoSize}px)
                <input type="range" min={64} max={160} value={logoSize} onChange={(e) => setLogoSize(Number(e.target.value))} className="w-full" />
              </label>
              <label className="text-xs"><input type="checkbox" checked={logoVisible} onChange={(e) => setLogoVisible(e.target.checked)} /> Show logo</label>
              <div className="flex gap-2 text-xs">
                <button className="btn btn-secondary" onClick={() => setLogoPos({ x: 0.1, y: 0.1 })}>Top Left</button>
                <button className="btn btn-secondary" onClick={() => setLogoPos({ x: 0.5, y: 0.1 })}>Top Center</button>
                <button className="btn btn-secondary" onClick={() => setLogoPos({ x: 0.88, y: 0.88 })}>Bottom Right</button>
              </div>
            </div>
          </div>

          <div className="rounded-xl border p-3 text-sm" style={{ borderColor: "var(--border)" }}>
            <p className="font-semibold">Unlocks (no login)</p>
            <p className="muted text-xs">Install PWA or share ToolHub to unlock premium templates, HD export, and watermark control.</p>
            <p className="mt-1 text-xs">PWA: {pwaInstalled ? "Installed ✅" : "Not installed"} · Shares: {shareCount} · Ref visits: {referralVisits}</p>
            <div className="mt-2 flex flex-wrap gap-2">
              <button className="btn btn-secondary" onClick={async () => {
                const result = await handleShare();
                setShareStatus(result.message);
              }}>Share & unlock</button>
              <label className="text-xs"><input type="checkbox" disabled={!watermarkRemovable} checked={!watermarkEnabled} onChange={(e) => toggleWatermarkDisabled(e.target.checked)} /> Remove watermark (unlock)</label>
              <span className="text-xs muted">Premium templates: {premiumUnlocked ? "Unlocked" : "Locked"} · HD export: {hdUnlocked ? "Unlocked" : "Locked"}</span>
            </div>
            {shareStatus ? <p className="mt-1 text-xs">{shareStatus}</p> : null}
          </div>

          <button className="btn btn-primary w-full" onClick={download}>Download Poster</button>
        </section>

        <section className="space-y-3">
          <p className="text-sm font-medium">Live editor preview {editorMode === "advanced" ? "(drag enabled for key blocks)" : "(stable normal layout)"}</p>
          <div className="rounded-2xl border p-2" style={{ borderColor: "var(--border)" }}>
            <div
              ref={previewWrapRef}
              className="relative mx-auto w-full max-w-2xl overflow-hidden rounded-xl bg-slate-950"
              style={{ aspectRatio: FORMAT_DIMENSIONS[format].ratio }}
              onPointerMove={(e) => {
                if (!dragging) return;
                updatePos(e, dragging);
              }}
              onPointerUp={() => setDragging(null)}
              onPointerLeave={() => setDragging(null)}
            >
              <canvas ref={canvasRef} className="block h-full w-full" style={{ aspectRatio: FORMAT_DIMENSIONS[format].ratio }} />
              {editorMode === "advanced" ? ([
                ["headline", headlineStyle],
                ["subheadline", subStyle],
                ["offer", offerStyle],
                ["badge", badgeStyle],
                ["cta", ctaStyle],
                ["business", businessStyle],
                ["footer", footerStyle],
                ["contact", contactStyle],
              ] as [DragTarget, BlockStyle][]).map(([key, current]) => (
                current.visible ? (
                  <button
                    key={key}
                    type="button"
                    className="absolute h-7 w-7 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/70 bg-black/50 text-[10px] text-white"
                    style={{ left: `${current.x * 100}%`, top: `${current.y * 100}%` }}
                    onPointerDown={(e) => {
                      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
                      setDragging(key);
                    }}
                  >
                    {key[0].toUpperCase()}
                  </button>
                ) : null
              )) : null}
              {editorMode === "advanced" && logoVisible ? (
                <button
                  type="button"
                  className="absolute h-8 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full border border-amber-300 bg-black/60 text-[10px] text-amber-200"
                  style={{ left: `${logoPos.x * 100}%`, top: `${logoPos.y * 100}%` }}
                  onPointerDown={(e) => {
                    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
                    setDragging("logo");
                  }}
                >
                  LOGO
                </button>
              ) : null}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
