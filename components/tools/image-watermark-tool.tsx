"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

type WatermarkPosition =
  | "top-left"
  | "top-center"
  | "top-right"
  | "center-left"
  | "center"
  | "center-right"
  | "bottom-left"
  | "bottom-center"
  | "bottom-right";

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new window.Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("Unable to load image"));
    image.src = src;
  });
}

function getPositionCoordinates(
  position: WatermarkPosition,
  width: number,
  height: number,
  markWidth: number,
  markHeight: number,
) {
  const pad = 28;
  const xMap = {
    left: pad,
    center: (width - markWidth) / 2,
    right: width - markWidth - pad,
  };
  const yMap = {
    top: pad,
    center: (height - markHeight) / 2,
    bottom: height - markHeight - pad,
  };

  const [vertical, horizontal] = position.split("-") as ["top" | "center" | "bottom", "left" | "center" | "right"];
  return {
    x: xMap[horizontal],
    y: yMap[vertical],
  };
}

export function ImageWatermarkTool() {
  const [baseImageUrl, setBaseImageUrl] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [mode, setMode] = useState<"text" | "logo">("text");
  const [text, setText] = useState("© ToolHub");
  const [position, setPosition] = useState<WatermarkPosition>("bottom-right");
  const [opacity, setOpacity] = useState(0.45);
  const [sizePercent, setSizePercent] = useState(26);
  const [outputUrl, setOutputUrl] = useState("");
  const [outputSize, setOutputSize] = useState({ width: 1200, height: 800 });
  const [isRendering, setIsRendering] = useState(false);
  const [error, setError] = useState("");

  const hasSource = useMemo(() => Boolean(baseImageUrl), [baseImageUrl]);

  useEffect(() => {
    return () => {
      if (outputUrl) URL.revokeObjectURL(outputUrl);
    };
  }, [outputUrl]);

  useEffect(() => {
    const render = async () => {
      if (!baseImageUrl) {
        setOutputUrl("");
        return;
      }

      setIsRendering(true);
      setError("");

      try {
        const base = await loadImage(baseImageUrl);
        setOutputSize({ width: base.width, height: base.height });
        const canvas = document.createElement("canvas");
        canvas.width = base.width;
        canvas.height = base.height;
        const ctx = canvas.getContext("2d");

        if (!ctx) {
          setError("Unable to initialize canvas rendering.");
          setIsRendering(false);
          return;
        }

        ctx.drawImage(base, 0, 0, canvas.width, canvas.height);
        ctx.globalAlpha = opacity;

        if (mode === "logo" && logoUrl) {
          const logo = await loadImage(logoUrl);
          const desiredWidth = Math.max(80, (canvas.width * sizePercent) / 100);
          const logoRatio = logo.height / logo.width;
          const drawWidth = desiredWidth;
          const drawHeight = desiredWidth * logoRatio;
          const { x, y } = getPositionCoordinates(position, canvas.width, canvas.height, drawWidth, drawHeight);
          ctx.drawImage(logo, x, y, drawWidth, drawHeight);
        } else {
          const fontSize = Math.max(16, Math.round((canvas.width * sizePercent) / 100 / 3));
          ctx.font = `700 ${fontSize}px Inter, Arial, sans-serif`;
          ctx.fillStyle = "#ffffff";
          ctx.strokeStyle = "rgba(15, 23, 42, 0.35)";
          ctx.lineWidth = Math.max(2, Math.round(fontSize / 9));
          const content = text.trim() || "Watermark";
          const metrics = ctx.measureText(content);
          const markWidth = metrics.width;
          const markHeight = fontSize;
          const { x, y } = getPositionCoordinates(position, canvas.width, canvas.height, markWidth, markHeight);
          ctx.strokeText(content, x, y + markHeight);
          ctx.fillText(content, x, y + markHeight);
        }

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              setError("Unable to generate final image.");
              setIsRendering(false);
              return;
            }
            if (outputUrl) URL.revokeObjectURL(outputUrl);
            setOutputUrl(URL.createObjectURL(blob));
            setIsRendering(false);
          },
          "image/png",
          0.95,
        );
      } catch {
        setError("Unable to process watermark. Please try another file.");
        setIsRendering(false);
      }
    };

    void render();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [baseImageUrl, logoUrl, mode, text, position, opacity, sizePercent]);

  return (
    <div className="space-y-5">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border p-4" style={{ borderColor: "var(--border)" }}>
          <label htmlFor="watermark-source" className="mb-2 block text-sm font-medium">
            Upload image
          </label>
          <input
            id="watermark-source"
            type="file"
            accept="image/*"
            className="w-full rounded-xl border p-3"
            style={{ borderColor: "var(--border)" }}
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (!file) return;
              const reader = new FileReader();
              reader.onload = () => setBaseImageUrl(String(reader.result ?? ""));
              reader.readAsDataURL(file);
            }}
          />
        </div>

        <div className="rounded-xl border p-4" style={{ borderColor: "var(--border)" }}>
          <p className="mb-2 text-sm font-medium">Watermark type</p>
          <div className="flex flex-wrap gap-2">
            <button type="button" className={`btn ${mode === "text" ? "btn-primary" : "btn-secondary"}`} onClick={() => setMode("text")}>
              Text watermark
            </button>
            <button type="button" className={`btn ${mode === "logo" ? "btn-primary" : "btn-secondary"}`} onClick={() => setMode("logo")}>
              Logo watermark
            </button>
          </div>
          {mode === "logo" ? (
            <div className="mt-3">
              <label htmlFor="watermark-logo" className="mb-1 block text-sm font-medium">
                Upload logo
              </label>
              <input
                id="watermark-logo"
                type="file"
                accept="image/*"
                className="w-full rounded-xl border p-3"
                style={{ borderColor: "var(--border)" }}
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (!file) return;
                  const reader = new FileReader();
                  reader.onload = () => setLogoUrl(String(reader.result ?? ""));
                  reader.readAsDataURL(file);
                }}
              />
            </div>
          ) : null}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {mode === "text" ? (
          <label className="text-sm font-medium">
            Watermark text
            <input className="field mt-1" value={text} onChange={(event) => setText(event.target.value)} placeholder="Enter your brand text" />
          </label>
        ) : (
          <div className="rounded-xl border border-dashed p-4 text-sm" style={{ borderColor: "var(--border)", color: "var(--muted)" }}>
            Upload a transparent PNG logo for best results.
          </div>
        )}

        <label className="text-sm font-medium">
          Position
          <select className="select mt-1" value={position} onChange={(event) => setPosition(event.target.value as WatermarkPosition)}>
            <option value="top-left">Top Left</option>
            <option value="top-center">Top Center</option>
            <option value="top-right">Top Right</option>
            <option value="center-left">Center Left</option>
            <option value="center">Center</option>
            <option value="center-right">Center Right</option>
            <option value="bottom-left">Bottom Left</option>
            <option value="bottom-center">Bottom Center</option>
            <option value="bottom-right">Bottom Right</option>
          </select>
        </label>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="text-sm font-medium">
          Opacity ({Math.round(opacity * 100)}%)
          <input
            type="range"
            min={0.1}
            max={1}
            step={0.05}
            value={opacity}
            onChange={(event) => setOpacity(Number(event.target.value))}
            className="mt-2 w-full"
          />
        </label>

        <label className="text-sm font-medium">
          Size ({sizePercent}%)
          <input
            type="range"
            min={10}
            max={60}
            step={1}
            value={sizePercent}
            onChange={(event) => setSizePercent(Number(event.target.value))}
            className="mt-2 w-full"
          />
        </label>
      </div>

      {error ? <p className="text-sm text-red-500">{error}</p> : null}

      {!hasSource ? (
        <div className="rounded-xl border border-dashed p-5 text-sm" style={{ borderColor: "var(--border)", color: "var(--muted)" }}>
          Upload an image to preview and download your watermarked result.
        </div>
      ) : (
        <div className="space-y-3">
          <p className="text-sm font-semibold">Preview output</p>
          <div className="rounded-xl border p-3" style={{ borderColor: "var(--border)" }}>
            {isRendering ? (
              <p className="text-sm" style={{ color: "var(--muted)" }}>
                Rendering watermark preview...
              </p>
            ) : outputUrl ? (
              <Image
                src={outputUrl}
                alt="Watermarked output"
                width={outputSize.width}
                height={outputSize.height}
                unoptimized
                className="max-h-[420px] w-full rounded-lg object-contain"
              />
            ) : null}
          </div>
          {outputUrl ? (
            <a href={outputUrl} download="toolhub-watermarked-image.png" className="btn btn-primary">
              Download watermarked image
            </a>
          ) : null}
        </div>
      )}
    </div>
  );
}
