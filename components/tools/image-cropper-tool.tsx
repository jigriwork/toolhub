"use client";

import Cropper, { type Area } from "react-easy-crop";
import "react-easy-crop/react-easy-crop.css";
import { useEffect, useMemo, useState } from "react";

type AspectPreset = "free" | "1:1" | "4:3" | "16:9" | "3:4";

function aspectValue(preset: AspectPreset) {
  switch (preset) {
    case "1:1":
      return 1;
    case "4:3":
      return 4 / 3;
    case "16:9":
      return 16 / 9;
    case "3:4":
      return 3 / 4;
    default:
      return undefined;
  }
}

function fileToDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result ?? ""));
    reader.onerror = () => reject(new Error("Unable to read file"));
    reader.readAsDataURL(file);
  });
}

function loadImage(url: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("Unable to load image"));
    image.src = url;
  });
}

async function getCroppedBlob(imageSrc: string, area: Area) {
  const image = await loadImage(imageSrc);
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(area.width));
  canvas.height = Math.max(1, Math.round(area.height));
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas unavailable");

  ctx.drawImage(
    image,
    area.x,
    area.y,
    area.width,
    area.height,
    0,
    0,
    canvas.width,
    canvas.height,
  );

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob((value) => resolve(value), "image/png"),
  );
  if (!blob) throw new Error("Unable to export crop");
  return blob;
}

export function ImageCropperTool() {
  const [imageSrc, setImageSrc] = useState("");
  const [zoom, setZoom] = useState(1);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [aspectPreset, setAspectPreset] = useState<AspectPreset>("1:1");
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [outputBlob, setOutputBlob] = useState<Blob | null>(null);
  const [isCropping, setIsCropping] = useState(false);
  const [error, setError] = useState("");

  const outputUrl = useMemo(
    () => (outputBlob ? URL.createObjectURL(outputBlob) : ""),
    [outputBlob],
  );

  useEffect(() => {
    return () => {
      if (outputUrl) URL.revokeObjectURL(outputUrl);
    };
  }, [outputUrl]);

  const handleFile = async (file: File) => {
    setError("");
    setOutputBlob(null);
    setZoom(1);
    setCrop({ x: 0, y: 0 });
    try {
      const url = await fileToDataUrl(file);
      setImageSrc(url);
    } catch {
      setError("Could not load image. Please try another file.");
    }
  };

  const exportCrop = async () => {
    if (!imageSrc || !croppedAreaPixels) return;
    setIsCropping(true);
    setError("");
    setOutputBlob(null);

    try {
      const blob = await getCroppedBlob(imageSrc, croppedAreaPixels);
      setOutputBlob(blob);
    } catch {
      setError("Failed to crop this image. Please adjust and try again.");
    } finally {
      setIsCropping(false);
    }
  };

  return (
    <div className="space-y-4">
      <input
        type="file"
        accept="image/*"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) void handleFile(file);
        }}
        className="w-full rounded-xl border p-3"
        style={{ borderColor: "var(--border)" }}
      />

      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label htmlFor="ratio" className="mb-2 block text-sm font-medium">
            Preset ratio
          </label>
          <select
            id="ratio"
            value={aspectPreset}
            onChange={(event) => setAspectPreset(event.target.value as AspectPreset)}
            className="w-full rounded-xl border bg-transparent px-3 py-2"
            style={{ borderColor: "var(--border)" }}
          >
            <option value="free">Free</option>
            <option value="1:1">1:1</option>
            <option value="4:3">4:3</option>
            <option value="16:9">16:9</option>
            <option value="3:4">3:4</option>
          </select>
        </div>
        <div>
          <label htmlFor="zoom" className="mb-2 block text-sm font-medium">
            Zoom: {zoom.toFixed(1)}x
          </label>
          <input
            id="zoom"
            type="range"
            min={1}
            max={3}
            step={0.1}
            value={zoom}
            onChange={(event) => setZoom(Number(event.target.value))}
            className="w-full"
          />
        </div>
      </div>

      {imageSrc ? (
        <div className="relative h-72 w-full overflow-hidden rounded-xl border sm:h-96" style={{ borderColor: "var(--border)" }}>
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={aspectValue(aspectPreset)}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={(_, areaPixels) => setCroppedAreaPixels(areaPixels)}
          />
        </div>
      ) : (
        <p className="rounded-xl border p-4 text-sm" style={{ borderColor: "var(--border)", color: "var(--muted)" }}>
          Upload an image to start cropping.
        </p>
      )}

      <div className="flex flex-wrap gap-2">
        <button type="button" className="btn btn-secondary" onClick={() => setImageSrc("")}>
          Clear
        </button>
        <button
          type="button"
          className="btn btn-primary"
          disabled={!imageSrc || !croppedAreaPixels || isCropping}
          onClick={() => void exportCrop()}
        >
          {isCropping ? "Cropping..." : "Download cropped image"}
        </button>
      </div>

      {error ? <p className="text-sm text-red-500">{error}</p> : null}

      {outputUrl ? (
        <a className="btn btn-primary" href={outputUrl} download="toolhub-cropped.png">
          Save Cropped PNG
        </a>
      ) : null}
    </div>
  );
}
