"use client";

import { removeBackground } from "@imgly/background-removal";
import { useEffect, useState } from "react";

type BgMode = "transparent" | "white" | "black" | "custom";

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function loadImage(url: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("Unable to load image"));
    image.src = url;
  });
}

async function applyBackgroundColor(blob: Blob, color: string) {
  const url = URL.createObjectURL(blob);
  try {
    const image = await loadImage(url);
    const canvas = document.createElement("canvas");
    canvas.width = image.width;
    canvas.height = image.height;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      throw new Error("Canvas not available");
    }
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(image, 0, 0);

    const outBlob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob((value) => resolve(value), "image/png"),
    );

    if (!outBlob) throw new Error("Unable to generate output");
    return outBlob;
  } finally {
    URL.revokeObjectURL(url);
  }
}

export function AiBackgroundRemoverTool() {
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");
  const [bgMode, setBgMode] = useState<BgMode>("transparent");
  const [customColor, setCustomColor] = useState("#1d4ed8");
  const [originalUrl, setOriginalUrl] = useState("");
  const [outputUrl, setOutputUrl] = useState("");

  useEffect(() => {
    if (!originalFile) {
      setOriginalUrl("");
      return;
    }

    const nextUrl = URL.createObjectURL(originalFile);
    setOriginalUrl(nextUrl);

    return () => {
      URL.revokeObjectURL(nextUrl);
    };
  }, [originalFile]);

  useEffect(() => {
    if (!resultBlob) {
      setOutputUrl("");
      return;
    }

    const nextUrl = URL.createObjectURL(resultBlob);
    setOutputUrl(nextUrl);

    return () => {
      URL.revokeObjectURL(nextUrl);
    };
  }, [resultBlob]);

  const outputColor =
    bgMode === "white"
      ? "#ffffff"
      : bgMode === "black"
        ? "#000000"
        : customColor;

  const handleRemove = async (file: File) => {
    setOriginalFile(file);
    setResultBlob(null);
    setError("");
    setIsProcessing(true);

    try {
      const transparentBlob = await removeBackground(file);
      const finalBlob =
        bgMode === "transparent"
          ? transparentBlob
          : await applyBackgroundColor(transparentBlob, outputColor);
      setResultBlob(finalBlob);
    } catch {
      setError(
        "Background removal failed. Please try a different image or try again in a moment.",
      );
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-4">
      <input
        type="file"
        accept="image/*"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) void handleRemove(file);
        }}
        className="w-full rounded-xl border p-3"
        style={{ borderColor: "var(--border)" }}
      />

      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label htmlFor="bg-mode" className="mb-2 block text-sm font-medium">
            Optional background
          </label>
          <select
            id="bg-mode"
            value={bgMode}
            onChange={(event) => setBgMode(event.target.value as BgMode)}
            className="w-full rounded-xl border bg-transparent px-3 py-2"
            style={{ borderColor: "var(--border)" }}
          >
            <option value="transparent">Transparent PNG</option>
            <option value="white">White</option>
            <option value="black">Black</option>
            <option value="custom">Custom color</option>
          </select>
        </div>
        <div>
          <label htmlFor="custom-color" className="mb-2 block text-sm font-medium">
            Background color
          </label>
          <input
            id="custom-color"
            type="color"
            value={customColor}
            disabled={bgMode !== "custom"}
            onChange={(event) => setCustomColor(event.target.value)}
            className="h-10 w-full rounded-xl border bg-transparent px-2"
            style={{ borderColor: "var(--border)" }}
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => {
            setOriginalFile(null);
            setResultBlob(null);
            setError("");
          }}
        >
          Clear
        </button>
        <button
          type="button"
          className="btn btn-secondary"
          disabled={!originalFile || isProcessing}
          onClick={() => {
            if (originalFile) {
              void handleRemove(originalFile);
            }
          }}
        >
          Reprocess
        </button>
      </div>

      {isProcessing ? <p className="text-sm">Removing background...</p> : null}
      {error ? <p className="text-sm text-red-500">{error}</p> : null}

      {originalUrl ? (
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <p className="mb-2 text-sm font-medium" style={{ color: "var(--muted)" }}>
              Before
            </p>
            <img
              src={originalUrl}
              alt="Original"
              className="max-h-64 w-full rounded-xl border object-contain"
              style={{ borderColor: "var(--border)" }}
            />
          </div>
          <div>
            <p className="mb-2 text-sm font-medium" style={{ color: "var(--muted)" }}>
              After
            </p>
            {outputUrl ? (
              <div
                className="rounded-xl border p-2"
                style={{
                  borderColor: "var(--border)",
                  background:
                    bgMode === "transparent"
                      ? "repeating-conic-gradient(#d1d5db 0% 25%, #f3f4f6 0% 50%) 50% / 20px 20px"
                      : outputColor,
                }}
              >
                <img
                  src={outputUrl}
                  alt="Background removed output"
                  className="max-h-64 w-full object-contain"
                />
              </div>
            ) : (
              <p className="rounded-xl border p-4 text-sm" style={{ borderColor: "var(--border)", color: "var(--muted)" }}>
                Process image to see output preview.
              </p>
            )}
          </div>
        </div>
      ) : null}

      {resultBlob && outputUrl ? (
        <a href={outputUrl} download="toolhub-background-removed.png" className="btn btn-primary">
          Download PNG ({formatSize(resultBlob.size)})
        </a>
      ) : null}
    </div>
  );
}
