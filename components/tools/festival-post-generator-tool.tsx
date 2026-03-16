"use client";

import { ChangeEvent, PointerEvent, useEffect, useMemo, useRef, useState } from "react";
import { useCreativeUnlocks } from "@/lib/use-creative-unlocks";

type FestivalKey = "diwali" | "holi" | "eid" | "christmas" | "new-year" | "independence-day" | "republic-day";
type OccasionMode = "preset" | "custom";
type PostIntent = "greeting-only" | "greeting-branding" | "greeting-offer";
type LayoutKey = "elegant" | "decorative" | "modern" | "premium";
type EditorMode = "normal" | "advanced";
type FormatKey = "instagram-post" | "instagram-story" | "flyer-portrait" | "landscape";
type BackgroundMode = "template" | "upload" | "plain" | "gradient";
type Align = "left" | "center" | "right";

type BlockStyle = {
  visible: boolean;
  size: number;
  color: string;
  align: Align;
  weight: "400" | "500" | "600" | "700" | "800";
  letterSpacing: number;
  lineHeight: number;
  x: number;
  y: number;
};

type FestivalPalette = {
  title: string;
  greeting: string;
  colors: [string, string, string];
  accent: string;
};

const FESTIVALS: Record<FestivalKey, FestivalPalette> = {
  diwali: { title: "Diwali", greeting: "Wishing you prosperity and light this Diwali.", colors: ["#2b1040", "#6b1d7f", "#f59e0b"], accent: "#fde68a" },
  holi: { title: "Holi", greeting: "May your business and life bloom in colors.", colors: ["#7e22ce", "#ec4899", "#22c55e"], accent: "#67e8f9" },
  eid: { title: "Eid", greeting: "Eid Mubarak. Peace and prosperity to your family.", colors: ["#033c37", "#0f766e", "#164e63"], accent: "#fef08a" },
  christmas: { title: "Christmas", greeting: "Merry Christmas and joyful holiday wishes.", colors: ["#14532d", "#b91c1c", "#991b1b"], accent: "#dcfce7" },
  "new-year": { title: "New Year", greeting: "Cheers to growth and success this year.", colors: ["#0f172a", "#1d4ed8", "#0ea5e9"], accent: "#dbeafe" },
  "independence-day": { title: "Independence Day", greeting: "Celebrating freedom and enterprise spirit.", colors: ["#ea580c", "#f8fafc", "#15803d"], accent: "#bfdbfe" },
  "republic-day": { title: "Republic Day", greeting: "Proudly celebrating our republic values.", colors: ["#f97316", "#f1f5f9", "#22c55e"], accent: "#93c5fd" },
};

const FORMAT_DIMENSIONS: Record<FormatKey, { width: number; height: number; label: string; ratio: string }> = {
  "instagram-post": { width: 1080, height: 1080, label: "Instagram Post (1:1)", ratio: "1 / 1" },
  "instagram-story": { width: 1080, height: 1920, label: "Instagram Story (9:16)", ratio: "9 / 16" },
  "flyer-portrait": { width: 1240, height: 1754, label: "Poster/Flyer Portrait", ratio: "1240 / 1754" },
  landscape: { width: 1920, height: 1080, label: "Landscape (16:9)", ratio: "16 / 9" },
};

const FESTIVAL_KEYS = Object.keys(FESTIVALS) as FestivalKey[];
const FORMAT_KEYS = Object.keys(FORMAT_DIMENSIONS) as FormatKey[];

const layoutOptions: Record<LayoutKey, { title: string; panelOpacity: number; decorative: "mandala" | "ornament" | "minimal" }> = {
  elegant: { title: "Elegant Greeting", panelOpacity: 0.14, decorative: "minimal" },
  decorative: { title: "Decorative Festive", panelOpacity: 0.22, decorative: "mandala" },
  modern: { title: "Modern Celebration", panelOpacity: 0.18, decorative: "ornament" },
  premium: { title: "Premium Ceremonial", panelOpacity: 0.3, decorative: "ornament" },
};

const PREMIUM_LAYOUTS: LayoutKey[] = ["premium"];

function fillTextWithLetterSpacing(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, letterSpacing: number) {
  if (!letterSpacing) {
    ctx.fillText(text, x, y);
    return;
  }
  let cursor = x;
  for (const char of text) {
    ctx.fillText(char, cursor, y);
    cursor += ctx.measureText(char).width + letterSpacing;
  }
}

function customFestival(name: string): FestivalPalette {
  const n = name.toLowerCase();
  if (/diwali|deepawali/.test(n)) return { ...FESTIVALS.diwali, title: name };
  if (/eid|ramadan|ramzan/.test(n)) return { ...FESTIVALS.eid, title: name };
  if (/holi/.test(n)) return { ...FESTIVALS.holi, title: name };
  return { title: name || "Special Occasion", greeting: `Warm wishes for ${name || "your special day"}.`, colors: ["#0f172a", "#334155", "#4338ca"], accent: "#c4b5fd" };
}

function wrap(ctx: CanvasRenderingContext2D, text: string, maxWidth: number, maxLines = 3) {
  const words = text.split(/\s+/).filter(Boolean);
  if (!words.length) return [""];
  const lines: string[] = [];
  let line = words[0] || "";
  for (let i = 1; i < words.length; i += 1) {
    const t = `${line} ${words[i]}`;
    if (ctx.measureText(t).width <= maxWidth) line = t;
    else {
      lines.push(line);
      line = words[i] || "";
    }
  }
  lines.push(line);
  return lines.slice(0, maxLines);
}

function drawTextBlock(
  ctx: CanvasRenderingContext2D,
  text: string,
  width: number,
  height: number,
  style: BlockStyle,
  maxWidthFactor = 0.8,
  maxLines = 2,
) {
  if (!style.visible || !text.trim()) return;
  const x = width * style.x;
  const y = height * style.y;
  ctx.fillStyle = style.color;
  ctx.font = `${style.weight} ${style.size}px Inter, system-ui, sans-serif`;
  const lines = wrap(ctx, text, width * maxWidthFactor, maxLines);
  const lh = style.size * style.lineHeight;
  lines.forEach((line, i) => {
    const measured = ctx.measureText(line).width;
    let dx = x;
    if (style.align === "center") dx = x - measured / 2;
    if (style.align === "right") dx = x - measured;
    fillTextWithLetterSpacing(ctx, line, dx, y + i * lh, style.letterSpacing);
  });
}

type DragTarget = "logo" | "headline" | "subheadline" | "greeting" | "offer" | "cta" | "business" | "contact" | "footer";

export function FestivalPostGeneratorTool() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const previewWrapRef = useRef<HTMLDivElement | null>(null);
  const logoRef = useRef<HTMLImageElement | null>(null);

  const [occasionMode, setOccasionMode] = useState<OccasionMode>("preset");
  const [festival, setFestival] = useState<FestivalKey>("diwali");
  const [customOccasionName, setCustomOccasionName] = useState("Store Anniversary");
  const [layout, setLayout] = useState<LayoutKey>("premium");
  const [editorMode, setEditorMode] = useState<EditorMode>("normal");
  const [postIntent, setPostIntent] = useState<PostIntent>("greeting-branding");
  const [format, setFormat] = useState<FormatKey>("instagram-post");
  const [backgroundMode, setBackgroundMode] = useState<BackgroundMode>("template");

  const [businessName, setBusinessName] = useState("Your Business Name");
  const [contactLine, setContactLine] = useState("@yourbrand • yourstore.com • +91 90000 00000");
  const [headline, setHeadline] = useState("Warm Festive Greetings");
  const [subheadline, setSubheadline] = useState("From our family to yours");
  const [greetingText, setGreetingText] = useState("");
  const [offerText, setOfferText] = useState("Festive offer up to 40% OFF");
  const [ctaText, setCtaText] = useState("Visit us today");
  const [footerText, setFooterText] = useState("Wishing joy, health, and prosperity.");

  const [logoDataUrl, setLogoDataUrl] = useState("");
  const [uploadedBg, setUploadedBg] = useState("");
  const bgImageRef = useRef<HTMLImageElement | null>(null);
  const [plainColor, setPlainColor] = useState("#111827");
  const [gradientA, setGradientA] = useState("#1d4ed8");
  const [gradientB, setGradientB] = useState("#a855f7");
  const [overlayOpacity, setOverlayOpacity] = useState(22);

  const [logoSize, setLogoSize] = useState(112);
  const [logoVisible, setLogoVisible] = useState(true);

  const [headlineStyle, setHeadlineStyle] = useState<BlockStyle>({ visible: true, size: 64, color: "#ffffff", align: "left", weight: "800", letterSpacing: 0, lineHeight: 1.2, x: 0.12, y: 0.3 });
  const [subheadlineStyle, setSubheadlineStyle] = useState<BlockStyle>({ visible: true, size: 36, color: "#e2e8f0", align: "left", weight: "600", letterSpacing: 0, lineHeight: 1.2, x: 0.12, y: 0.42 });
  const [greetingStyle, setGreetingStyle] = useState<BlockStyle>({ visible: true, size: 32, color: "#f8fafc", align: "left", weight: "500", letterSpacing: 0, lineHeight: 1.2, x: 0.12, y: 0.52 });
  const [offerStyle, setOfferStyle] = useState<BlockStyle>({ visible: true, size: 34, color: "#fde68a", align: "left", weight: "700", letterSpacing: 0, lineHeight: 1.2, x: 0.12, y: 0.65 });
  const [ctaStyle, setCtaStyle] = useState<BlockStyle>({ visible: true, size: 30, color: "#111827", align: "left", weight: "700", letterSpacing: 0, lineHeight: 1.2, x: 0.12, y: 0.76 });
  const [businessStyle, setBusinessStyle] = useState<BlockStyle>({ visible: true, size: 30, color: "#ffffff", align: "left", weight: "700", letterSpacing: 0, lineHeight: 1.2, x: 0.1, y: 0.9 });
  const [contactStyle, setContactStyle] = useState<BlockStyle>({ visible: true, size: 21, color: "#dbeafe", align: "left", weight: "500", letterSpacing: 0, lineHeight: 1.2, x: 0.1, y: 0.935 });
  const [footerStyle, setFooterStyle] = useState<BlockStyle>({ visible: true, size: 20, color: "#f8fafc", align: "left", weight: "500", letterSpacing: 0, lineHeight: 1.2, x: 0.08, y: 0.975 });

  const [logoPos, setLogoPos] = useState({ x: 0.84, y: 0.14 });
  const [dragging, setDragging] = useState<DragTarget | null>(null);
  const [status, setStatus] = useState("");

  const {
    premiumUnlocked,
    hdUnlocked,
    watermarkEnabled,
    watermarkRemovable,
    pwaInstalled,
    shareCount,
    referralVisits,
    handleShare,
    toggleWatermarkDisabled,
  } = useCreativeUnlocks();

  const palette = useMemo(
    () => (occasionMode === "custom" ? customFestival(customOccasionName.trim()) : FESTIVALS[festival]),
    [occasionMode, customOccasionName, festival],
  );
  const layoutStyle = layoutOptions[layout];
  const occasionName = occasionMode === "custom" ? customOccasionName || "Special Occasion" : palette.title;
  const greeting = greetingText.trim() || palette.greeting;

  const setPosFromPointer = (event: PointerEvent<HTMLDivElement>, target: DragTarget) => {
    const rect = previewWrapRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = Math.max(0.05, Math.min(0.95, (event.clientX - rect.left) / rect.width));
    const y = Math.max(0.06, Math.min(0.94, (event.clientY - rect.top) / rect.height));
    if (target === "logo") setLogoPos({ x, y });
    if (target === "headline") setHeadlineStyle((s) => ({ ...s, x, y }));
    if (target === "subheadline") setSubheadlineStyle((s) => ({ ...s, x, y }));
    if (target === "greeting") setGreetingStyle((s) => ({ ...s, x, y }));
    if (target === "offer") setOfferStyle((s) => ({ ...s, x, y }));
    if (target === "cta") setCtaStyle((s) => ({ ...s, x, y }));
    if (target === "business") setBusinessStyle((s) => ({ ...s, x, y }));
    if (target === "contact") setContactStyle((s) => ({ ...s, x, y }));
    if (target === "footer") setFooterStyle((s) => ({ ...s, x, y }));
  };

  const drawBlockWithBackground = (
    ctx: CanvasRenderingContext2D,
    text: string,
    width: number,
    height: number,
    style: BlockStyle,
    blockWidthRatio: number,
    blockHeight: number,
  ) => {
    const ox = width * (style.align === "center" ? style.x - blockWidthRatio / 2 : style.align === "right" ? style.x - blockWidthRatio : style.x);
    const oy = height * style.y;
    ctx.fillStyle = "rgba(15,23,42,0.72)";
    ctx.beginPath();
    ctx.roundRect(ox, oy - blockHeight / 2, width * blockWidthRatio, blockHeight, 18);
    ctx.fill();
    drawTextBlock(ctx, text, width, height, style, blockWidthRatio - 0.04, 2);
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
      bgImageRef.current = null;
      return;
    }
    const img = new Image();
    img.onload = () => {
      bgImageRef.current = img;
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

    if (backgroundMode === "upload" && bgImageRef.current) {
      ctx.drawImage(bgImageRef.current, 0, 0, width, height);
    } else if (backgroundMode === "plain") {
      ctx.fillStyle = plainColor;
      ctx.fillRect(0, 0, width, height);
    } else if (backgroundMode === "gradient") {
      const g = ctx.createLinearGradient(0, 0, width, height);
      g.addColorStop(0, gradientA);
      g.addColorStop(1, gradientB);
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, width, height);
    } else {
      const g = ctx.createLinearGradient(0, 0, width, height);
      g.addColorStop(0, palette.colors[0]);
      g.addColorStop(0.5, palette.colors[1]);
      g.addColorStop(1, palette.colors[2]);
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, width, height);
    }

    ctx.fillStyle = `rgba(8,12,24,${overlayOpacity / 100})`;
    ctx.fillRect(0, 0, width, height);

    if (layoutStyle.decorative !== "minimal") {
      ctx.globalAlpha = 0.15;
      ctx.fillStyle = palette.accent;
      ctx.beginPath();
      ctx.arc(width * 0.12, height * 0.17, width * 0.14, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(width * 0.9, height * 0.3, width * 0.16, 0, Math.PI * 2);
      ctx.fill();
      if (layoutStyle.decorative === "mandala") {
        ctx.strokeStyle = `${palette.accent}99`;
        ctx.lineWidth = 2;
        for (let i = 1; i < 8; i += 1) {
          ctx.beginPath();
          ctx.arc(width * 0.86, height * 0.8, i * 22, 0, Math.PI * 2);
          ctx.stroke();
        }
      }
      ctx.globalAlpha = 1;
    }

    if (layout === "elegant") {
      ctx.globalAlpha = 0.22;
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 2;
      ctx.strokeRect(width * 0.07, height * 0.09, width * 0.86, height * 0.82);
      ctx.globalAlpha = 1;
    }

    if (layout === "modern") {
      ctx.fillStyle = "rgba(255,255,255,0.16)";
      ctx.fillRect(width * 0.08, height * 0.16, width * 0.84, 2);
      ctx.fillRect(width * 0.08, height * 0.86, width * 0.84, 2);
    }

    ctx.fillStyle = `rgba(15,23,42,${layoutStyle.panelOpacity})`;
    ctx.beginPath();
    ctx.roundRect(width * 0.06, height * 0.08, width * 0.88, height * 0.84, 28);
    ctx.fill();

    const showOffer = postIntent === "greeting-offer";

    if (editorMode === "normal") {
      const leftX = width * 0.1;
      const maxWidth = width * 0.78;
      let y = height * 0.19;

      ctx.fillStyle = palette.accent;
      ctx.font = `700 ${Math.max(24, Math.round(height * 0.028))}px Inter, system-ui, sans-serif`;
      wrap(ctx, occasionName, maxWidth, 1).forEach((line) => {
        ctx.fillText(line, leftX, y);
      });

      y += Math.max(56, Math.round(height * 0.06));
      ctx.fillStyle = "#ffffff";
      ctx.font = `800 ${Math.max(42, Math.round(height * 0.06))}px Inter, system-ui, sans-serif`;
      wrap(ctx, headline, maxWidth, 2).forEach((line, i) => {
        ctx.fillText(line, leftX, y + i * Math.max(52, Math.round(height * 0.055)));
      });

      y += Math.max(120, Math.round(height * 0.13));
      ctx.fillStyle = "#e2e8f0";
      ctx.font = `600 ${Math.max(26, Math.round(height * 0.034))}px Inter, system-ui, sans-serif`;
      wrap(ctx, subheadline, maxWidth, 2).forEach((line, i) => {
        ctx.fillText(line, leftX, y + i * Math.max(36, Math.round(height * 0.036)));
      });

      y += Math.max(90, Math.round(height * 0.1));
      ctx.fillStyle = "#f8fafc";
      ctx.font = `500 ${Math.max(24, Math.round(height * 0.03))}px Inter, system-ui, sans-serif`;
      wrap(ctx, greeting, maxWidth, 3).forEach((line, i) => {
        ctx.fillText(line, leftX, y + i * Math.max(34, Math.round(height * 0.034)));
      });

      if (showOffer && offerText.trim()) {
        const offerY = y + Math.max(110, Math.round(height * 0.12));
        ctx.fillStyle = "rgba(15,23,42,0.72)";
        ctx.beginPath();
        ctx.roundRect(leftX, offerY - 34, width * 0.54, 78, 16);
        ctx.fill();
        ctx.fillStyle = "#fde68a";
        ctx.font = `700 ${Math.max(24, Math.round(height * 0.03))}px Inter, system-ui, sans-serif`;
        wrap(ctx, offerText, width * 0.5, 2).forEach((line, i) => ctx.fillText(line, leftX + 20, offerY + i * 30));
      }

      if (ctaText.trim()) {
        const ctaY = height * (format === "instagram-story" ? 0.77 : 0.74);
        ctx.fillStyle = "rgba(251,191,36,0.95)";
        ctx.beginPath();
        ctx.roundRect(leftX, ctaY - 30, width * 0.28, 56, 999);
        ctx.fill();
        ctx.fillStyle = "#111827";
        ctx.font = `700 ${Math.max(22, Math.round(height * 0.026))}px Inter, system-ui, sans-serif`;
        wrap(ctx, ctaText, width * 0.24, 1).forEach((line) => ctx.fillText(line, leftX + 18, ctaY + 6));
      }

      if (postIntent !== "greeting-only") {
        ctx.fillStyle = "rgba(255,255,255,0.35)";
        ctx.fillRect(width * 0.1, height * 0.86, width * 0.8, 2);
        ctx.fillStyle = "#ffffff";
        ctx.font = `700 ${Math.max(24, Math.round(height * 0.028))}px Inter, system-ui, sans-serif`;
        ctx.fillText(businessName, width * 0.1, height * 0.9);
        ctx.fillStyle = "#dbeafe";
        ctx.font = `500 ${Math.max(18, Math.round(height * 0.02))}px Inter, system-ui, sans-serif`;
        wrap(ctx, contactLine, width * 0.8, 2).forEach((line, i) => ctx.fillText(line, width * 0.1, height * (0.935 + i * 0.02)));
      }

      if (footerText.trim()) {
        ctx.fillStyle = "rgba(255,255,255,0.9)";
        ctx.font = `500 ${Math.max(16, Math.round(height * 0.017))}px Inter, system-ui, sans-serif`;
        wrap(ctx, footerText, width * 0.82, 1).forEach((line) => ctx.fillText(line, width * 0.08, height * 0.975));
      }
    } else {
      drawTextBlock(ctx, occasionName, width, height, { ...subheadlineStyle, size: Math.max(24, subheadlineStyle.size - 6), color: palette.accent, y: subheadlineStyle.y - 0.1 }, 0.5, 1);
      drawTextBlock(ctx, headline, width, height, headlineStyle, 0.76, 2);
      drawTextBlock(ctx, subheadline, width, height, subheadlineStyle, 0.76, 2);
      drawTextBlock(ctx, greeting, width, height, greetingStyle, 0.76, 3);

      if (showOffer && offerStyle.visible && offerText.trim()) {
        drawBlockWithBackground(ctx, offerText, width, height, offerStyle, 0.44, 74);
      }

      if (ctaStyle.visible && ctaText.trim()) {
        const ctaX = width * (ctaStyle.align === "center" ? ctaStyle.x - 0.12 : ctaStyle.align === "right" ? ctaStyle.x - 0.24 : ctaStyle.x);
        const ctaY = height * ctaStyle.y;
        ctx.fillStyle = "rgba(251,191,36,0.95)";
        ctx.beginPath();
        ctx.roundRect(ctaX, ctaY - 34, width * 0.24, 58, 999);
        ctx.fill();
        drawTextBlock(ctx, ctaText, width, height, ctaStyle, 0.2, 1);
      }

      if (postIntent !== "greeting-only") {
        ctx.fillStyle = "rgba(255,255,255,0.35)";
        ctx.fillRect(width * 0.1, height * 0.86, width * 0.8, 2);
        drawTextBlock(ctx, businessName, width, height, businessStyle, 0.8, 1);
        drawTextBlock(ctx, contactLine, width, height, contactStyle, 0.8, 2);
      }

      if (footerText.trim()) {
        drawTextBlock(ctx, footerText, width, height, footerStyle, 0.82, 1);
      }
    }

    if (logoVisible && logoRef.current) {
      const size = logoSize;
      const lx = width * logoPos.x - size / 2;
      const ly = height * logoPos.y - size / 2;
      ctx.fillStyle = "rgba(255,255,255,0.96)";
      ctx.beginPath();
      ctx.roundRect(lx, ly, size, size, 14);
      ctx.fill();
      const ratio = logoRef.current.width / logoRef.current.height;
      let dw = size - 20;
      let dh = size - 20;
      if (ratio > 1) dh = dw / ratio;
      else dw = dh * ratio;
      ctx.drawImage(logoRef.current, lx + (size - dw) / 2, ly + (size - dh) / 2, dw, dh);
    }

    if (watermarkEnabled) {
      ctx.fillStyle = "rgba(255,255,255,0.72)";
      ctx.font = "500 17px Inter, system-ui, sans-serif";
      ctx.textAlign = "right";
      ctx.fillText("Made with ToolHubsite.in", width - 24, height - 20);
      ctx.textAlign = "left";
    }
  };

  useEffect(() => {
    draw(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [palette, layout, postIntent, format, backgroundMode, plainColor, gradientA, gradientB, overlayOpacity, businessName, contactLine, headline, subheadline, greeting, offerText, ctaText, footerText, logoSize, logoVisible, logoPos, headlineStyle, subheadlineStyle, greetingStyle, offerStyle, ctaStyle, businessStyle, contactStyle, footerStyle, editorMode, watermarkEnabled]);

  const uploadImage = (event: ChangeEvent<HTMLInputElement>, setter: (v: string) => void) => {
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
    link.download = `toolhub-festival-${occasionName.replace(/\s+/g, "-").toLowerCase()}-${format}.png`;
    link.click();
    draw(false);
  };

  const Control = ({ label, style, setStyle }: { label: string; style: BlockStyle; setStyle: (next: BlockStyle) => void }) => (
    <div className="rounded-xl border p-3" style={{ borderColor: "var(--border)" }}>
      <div className="mb-2 flex items-center justify-between">
        <p className="text-sm font-semibold">{label}</p>
        <label className="text-xs muted"><input type="checkbox" checked={style.visible} onChange={(e) => setStyle({ ...style, visible: e.target.checked })} /> Show</label>
      </div>
      <div className="grid gap-2 sm:grid-cols-2">
        <label className="text-xs">Size <input type="range" min={18} max={86} value={style.size} onChange={(e) => setStyle({ ...style, size: Number(e.target.value) })} className="w-full" /></label>
        <label className="text-xs">Color <input type="color" value={style.color} onChange={(e) => setStyle({ ...style, color: e.target.value })} className="h-9 w-full rounded" /></label>
        <label className="text-xs">Align
          <select className="select" value={style.align} onChange={(e) => setStyle({ ...style, align: e.target.value as Align })}>
            <option value="left">Left</option><option value="center">Center</option><option value="right">Right</option>
          </select>
        </label>
        <label className="text-xs">Weight
          <select className="select" value={style.weight} onChange={(e) => setStyle({ ...style, weight: e.target.value as BlockStyle["weight"] })}>
            <option value="400">Regular</option><option value="500">Medium</option><option value="600">Semi Bold</option><option value="700">Bold</option><option value="800">Extra Bold</option>
          </select>
        </label>
        <label className="text-xs">Letter spacing
          <input type="range" min={0} max={8} step={0.5} value={style.letterSpacing} onChange={(e) => setStyle({ ...style, letterSpacing: Number(e.target.value) })} className="w-full" />
        </label>
        <label className="text-xs">Line spacing
          <input type="range" min={1} max={2} step={0.05} value={style.lineHeight} onChange={(e) => setStyle({ ...style, lineHeight: Number(e.target.value) })} className="w-full" />
        </label>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="grid gap-4 xl:grid-cols-[1.05fr_1fr]">
        <section className="space-y-4 rounded-2xl border p-4" style={{ borderColor: "var(--border)" }}>
          <h3 className="text-base font-semibold">Festival editor controls</h3>
          <div className="flex gap-2">
            <button className={`btn ${editorMode === "normal" ? "btn-primary" : "btn-secondary"}`} onClick={() => setEditorMode("normal")}>Normal</button>
            <button className={`btn ${editorMode === "advanced" ? "btn-primary" : "btn-secondary"}`} onClick={() => setEditorMode("advanced")}>Advanced</button>
          </div>
          <div className="flex flex-wrap gap-2">
            <button className={`btn ${postIntent === "greeting-only" ? "btn-primary" : "btn-secondary"}`} onClick={() => setPostIntent("greeting-only")}>Greeting only</button>
            <button className={`btn ${postIntent === "greeting-branding" ? "btn-primary" : "btn-secondary"}`} onClick={() => setPostIntent("greeting-branding")}>Greeting + branding</button>
            <button className={`btn ${postIntent === "greeting-offer" ? "btn-primary" : "btn-secondary"}`} onClick={() => setPostIntent("greeting-offer")}>Greeting + optional offer</button>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <label className="text-sm">Occasion
              <select className="select" value={occasionMode} onChange={(e) => setOccasionMode(e.target.value as OccasionMode)}>
                <option value="preset">Preset Festival</option>
                <option value="custom">Custom Occasion</option>
              </select>
            </label>
            {occasionMode === "preset" ? (
              <label className="text-sm">Festival
                <select className="select" value={festival} onChange={(e) => setFestival(e.target.value as FestivalKey)}>
                  {FESTIVAL_KEYS.map((k) => <option key={k} value={k}>{FESTIVALS[k].title}</option>)}
                </select>
              </label>
            ) : (
              <label className="text-sm">Occasion name<input className="field" value={customOccasionName} onChange={(e) => setCustomOccasionName(e.target.value)} /></label>
            )}
            <label className="text-sm">Layout
              <select
                className="select"
                value={layout}
                onChange={(e) => {
                  const next = e.target.value as LayoutKey;
                  if (PREMIUM_LAYOUTS.includes(next) && !premiumUnlocked) return;
                  setLayout(next);
                }}
              >
                {(Object.keys(layoutOptions) as LayoutKey[]).map((k) => (
                  <option key={k} value={k} disabled={PREMIUM_LAYOUTS.includes(k) && !premiumUnlocked}>
                    {layoutOptions[k].title}{PREMIUM_LAYOUTS.includes(k) ? " (Premium)" : ""}
                  </option>
                ))}
              </select>
            </label>
            <label className="text-sm">Format
              <select className="select" value={format} onChange={(e) => setFormat(e.target.value as FormatKey)}>
                {FORMAT_KEYS.map((k) => <option key={k} value={k}>{FORMAT_DIMENSIONS[k].label}</option>)}
              </select>
            </label>
          </div>

          <div className="rounded-xl border p-3" style={{ borderColor: "var(--border)" }}>
            <p className="mb-2 text-sm font-semibold">Background customization</p>
            <div className="grid gap-2 sm:grid-cols-2">
              <select className="select" value={backgroundMode} onChange={(e) => setBackgroundMode(e.target.value as BackgroundMode)}>
                <option value="template">Festive template background</option>
                <option value="upload">Upload background</option>
                <option value="plain">Plain color</option>
                <option value="gradient">Custom gradient</option>
              </select>
              {backgroundMode === "upload" && <input type="file" accept="image/*" onChange={(e) => uploadImage(e, setUploadedBg)} className="field" />}
              {backgroundMode === "plain" && <input type="color" value={plainColor} onChange={(e) => setPlainColor(e.target.value)} className="h-11 w-full rounded" />}
              {backgroundMode === "gradient" && (
                <>
                  <label className="text-xs">Color A <input type="color" value={gradientA} onChange={(e) => setGradientA(e.target.value)} className="h-10 w-full rounded" /></label>
                  <label className="text-xs">Color B <input type="color" value={gradientB} onChange={(e) => setGradientB(e.target.value)} className="h-10 w-full rounded" /></label>
                </>
              )}
            </div>
            <label className="mt-2 block text-xs">Overlay tint/opacity ({overlayOpacity}%)
              <input type="range" min={0} max={60} value={overlayOpacity} onChange={(e) => setOverlayOpacity(Number(e.target.value))} className="w-full" />
            </label>
          </div>

          <div className="grid gap-2">
            <input className="field" value={headline} onChange={(e) => setHeadline(e.target.value)} placeholder="Headline" />
            <input className="field" value={subheadline} onChange={(e) => setSubheadline(e.target.value)} placeholder="Subheadline" />
            <textarea className="textarea" value={greetingText} onChange={(e) => setGreetingText(e.target.value)} placeholder="Greeting text" />
            <input className="field" value={offerText} onChange={(e) => setOfferText(e.target.value)} placeholder="Optional offer" />
            <input className="field" value={ctaText} onChange={(e) => setCtaText(e.target.value)} placeholder="CTA" />
            <input className="field" value={footerText} onChange={(e) => setFooterText(e.target.value)} placeholder="Footer text" />
            <input className="field" value={businessName} onChange={(e) => setBusinessName(e.target.value)} placeholder="Business/store name" />
            <input className="field" value={contactLine} onChange={(e) => setContactLine(e.target.value)} placeholder="Handle/website/phone/tagline" />
          </div>

          {editorMode === "advanced" ? (
            <div className="grid gap-3 sm:grid-cols-2">
              <Control label="Headline style" style={headlineStyle} setStyle={setHeadlineStyle} />
              <Control label="Subheadline style" style={subheadlineStyle} setStyle={setSubheadlineStyle} />
              <Control label="Greeting style" style={greetingStyle} setStyle={setGreetingStyle} />
              <Control label="Offer style" style={offerStyle} setStyle={setOfferStyle} />
              <Control label="CTA style" style={ctaStyle} setStyle={setCtaStyle} />
              <Control label="Business name style" style={businessStyle} setStyle={setBusinessStyle} />
              <Control label="Contact style" style={contactStyle} setStyle={setContactStyle} />
              <Control label="Footer style" style={footerStyle} setStyle={setFooterStyle} />
            </div>
          ) : null}

          <div className="rounded-xl border p-3" style={{ borderColor: "var(--border)" }}>
            <p className="text-sm font-semibold">Logo controls</p>
            <div className="mt-2 grid gap-2 sm:grid-cols-2">
              <input type="file" accept="image/*" onChange={(e) => uploadImage(e, setLogoDataUrl)} className="field" />
              <label className="text-xs">Logo size ({logoSize}px)
                <input type="range" min={64} max={180} value={logoSize} onChange={(e) => setLogoSize(Number(e.target.value))} className="w-full" />
              </label>
              <label className="text-xs"><input type="checkbox" checked={logoVisible} onChange={(e) => setLogoVisible(e.target.checked)} /> Show logo</label>
              <div className="flex gap-2 text-xs">
                <button className="btn btn-secondary" onClick={() => setLogoPos({ x: 0.14, y: 0.14 })}>Top Left</button>
                <button className="btn btn-secondary" onClick={() => setLogoPos({ x: 0.5, y: 0.14 })}>Top Center</button>
                <button className="btn btn-secondary" onClick={() => setLogoPos({ x: 0.86, y: 0.86 })}>Bottom Right</button>
              </div>
            </div>
          </div>

          <div className="rounded-xl border p-3 text-sm" style={{ borderColor: "var(--border)" }}>
            <p className="font-semibold">Unlocks (no login)</p>
            <p className="muted text-xs">Install PWA or share to unlock premium templates, HD export, and watermark controls.</p>
            <p className="mt-1 text-xs">PWA: {pwaInstalled ? "Installed ✅" : "Not installed"} · Shares: {shareCount} · Ref visits: {referralVisits}</p>
            <div className="mt-2 flex flex-wrap gap-2">
              <button className="btn btn-secondary" onClick={async () => {
                const result = await handleShare();
                setStatus(result.message);
              }}>Share & unlock</button>
              <label className="text-xs"><input type="checkbox" disabled={!watermarkRemovable} checked={!watermarkEnabled} onChange={(e) => toggleWatermarkDisabled(e.target.checked)} /> Remove watermark (unlock)</label>
              <span className="text-xs muted">Premium templates: {premiumUnlocked ? "Unlocked" : "Locked"} · HD export: {hdUnlocked ? "Unlocked" : "Locked"}</span>
            </div>
            {status ? <p className="mt-1 text-xs">{status}</p> : null}
          </div>

          <button className="btn btn-primary w-full" onClick={download}>Download PNG</button>
        </section>

        <section className="space-y-3">
          <p className="text-sm font-medium">Live canvas editor {editorMode === "advanced" ? "(drag enabled for all major text/logo)" : "(stable normal layout)"}</p>
          <div className="rounded-2xl border p-2" style={{ borderColor: "var(--border)" }}>
            <div
              ref={previewWrapRef}
              className="relative mx-auto w-full max-w-2xl overflow-hidden rounded-xl bg-slate-950"
              style={{ aspectRatio: FORMAT_DIMENSIONS[format].ratio }}
              onPointerMove={(e) => {
                if (!dragging) return;
                setPosFromPointer(e, dragging);
              }}
              onPointerUp={() => setDragging(null)}
              onPointerLeave={() => setDragging(null)}
            >
              <canvas ref={canvasRef} className="block h-full w-full" style={{ aspectRatio: FORMAT_DIMENSIONS[format].ratio }} />
              {editorMode === "advanced" ? ([
                ["headline", headlineStyle],
                ["subheadline", subheadlineStyle],
                ["greeting", greetingStyle],
                ["offer", offerStyle],
                ["cta", ctaStyle],
                ["business", businessStyle],
                ["contact", contactStyle],
                ["footer", footerStyle],
              ] as [DragTarget, BlockStyle][]).map(([key, style]) => (
                style.visible ? (
                  <button
                    key={key}
                    type="button"
                    className="absolute h-7 w-7 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/70 bg-black/50 text-[10px] text-white"
                    style={{ left: `${style.x * 100}%`, top: `${style.y * 100}%` }}
                    onPointerDown={(e) => {
                      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
                      setDragging(key);
                    }}
                    title={`Drag ${key}`}
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
                  title="Drag logo"
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
