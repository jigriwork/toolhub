"use client";

import { ChangeEvent, useMemo, useState } from "react";
import { ToolResultCard } from "@/components/tool-result-card";

function estimateDataUrlBytes(dataUrl: string) {
  const base64 = dataUrl.split(",")[1] ?? "";
  return Math.ceil((base64.length * 3) / 4);
}

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export function ImageResizerTool() {
  const [file, setFile] = useState<File | null>(null);
  const [width, setWidth] = useState(800);
  const [height, setHeight] = useState(600);
  const [keepRatio, setKeepRatio] = useState(true);
  const [ratio, setRatio] = useState(4 / 3);
  const [downloadUrl, setDownloadUrl] = useState("");

  const fileUrl = useMemo(() => (file ? URL.createObjectURL(file) : ""), [file]);

  const resizedBytes = useMemo(
    () => (downloadUrl ? estimateDataUrlBytes(downloadUrl) : 0),
    [downloadUrl],
  );

  const reduction =
    file && resizedBytes > 0 ? ((file.size - resizedBytes) / file.size) * 100 : 0;

  const onFile = (event: ChangeEvent<HTMLInputElement>) => {
    const selected = event.target.files?.[0];
    if (!selected) return;
    setFile(selected);
    const img = new Image();
    img.onload = () => {
      const nextRatio = img.width / img.height;
      setRatio(nextRatio);
      setWidth(img.width);
      setHeight(img.height);
    };
    img.src = URL.createObjectURL(selected);
  };

  const resizeImage = async () => {
    if (!file) return;
    const bitmap = await createImageBitmap(file);
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(bitmap, 0, 0, width, height);
    const dataUrl = canvas.toDataURL("image/png");
    setDownloadUrl(dataUrl);
  };

  return (
    <div className="space-y-4">
      <input
        type="file"
        accept="image/*"
        onChange={onFile}
        className="w-full rounded-xl border p-3"
        style={{ borderColor: "var(--border)" }}
      />

      <div className="grid gap-3 sm:grid-cols-2">
        <label className="space-y-1">
          <span className="text-sm" style={{ color: "var(--muted)" }}>
            Width
          </span>
          <input
            type="number"
            value={width}
            onChange={(event) => {
              const nextWidth = Number(event.target.value);
              setWidth(nextWidth);
              if (keepRatio) setHeight(Math.max(1, Math.round(nextWidth / ratio)));
            }}
            className="w-full rounded-xl border bg-transparent px-4 py-2"
            style={{ borderColor: "var(--border)" }}
          />
        </label>
        <label className="space-y-1">
          <span className="text-sm" style={{ color: "var(--muted)" }}>
            Height
          </span>
          <input
            type="number"
            value={height}
            onChange={(event) => {
              const nextHeight = Number(event.target.value);
              setHeight(nextHeight);
              if (keepRatio) setWidth(Math.max(1, Math.round(nextHeight * ratio)));
            }}
            className="w-full rounded-xl border bg-transparent px-4 py-2"
            style={{ borderColor: "var(--border)" }}
          />
        </label>
      </div>

      <label className="flex items-center gap-2 text-sm" style={{ color: "var(--muted)" }}>
        <input
          type="checkbox"
          checked={keepRatio}
          onChange={(event) => setKeepRatio(event.target.checked)}
        />
        Maintain aspect ratio
      </label>

      <div className="flex flex-wrap gap-2">
        <button type="button" className="btn btn-primary" onClick={() => void resizeImage()}>
          Resize Image
        </button>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => {
            setFile(null);
            setDownloadUrl("");
          }}
        >
          Clear
        </button>
      </div>

      {fileUrl ? (
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <p className="mb-2 text-sm font-medium" style={{ color: "var(--muted)" }}>
              Before
            </p>
            <img src={fileUrl} alt="Original preview" className="max-h-52 w-full rounded-xl border object-contain" style={{ borderColor: "var(--border)" }} />
          </div>
          {downloadUrl ? (
            <div>
              <p className="mb-2 text-sm font-medium" style={{ color: "var(--muted)" }}>
                After
              </p>
              <img src={downloadUrl} alt="Resized preview" className="max-h-52 w-full rounded-xl border object-contain" style={{ borderColor: "var(--border)" }} />
            </div>
          ) : null}
        </div>
      ) : null}

      {file ? (
        <div className="grid gap-3 sm:grid-cols-3">
          <ToolResultCard icon="📦" label="Original size" value={formatSize(file.size)} />
          <ToolResultCard icon="📐" label="Resized size" value={downloadUrl ? formatSize(resizedBytes) : "-"} />
          <ToolResultCard icon="📉" label="Size reduction" value={downloadUrl ? `${reduction.toFixed(2)}%` : "-"} />
        </div>
      ) : null}

      {downloadUrl ? (
        <a href={downloadUrl} download="toolhub-resized.png" className="btn btn-secondary">
          Download Resized Image ({formatSize(resizedBytes)})
        </a>
      ) : null}
    </div>
  );
}
