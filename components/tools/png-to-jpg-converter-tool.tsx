"use client";

import { useState } from "react";

export function PngToJpgConverterTool() {
  const [quality, setQuality] = useState(90);
  const [output, setOutput] = useState("");

  const convert = (file: File) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
      setOutput(canvas.toDataURL("image/jpeg", quality / 100));
    };
    img.src = URL.createObjectURL(file);
  };

  return (
    <div className="space-y-4">
      <label className="block text-sm" style={{ color: "var(--muted)" }}>
        JPG Quality: {quality}%
      </label>
      <input
        type="range"
        min={10}
        max={100}
        step={5}
        value={quality}
        onChange={(event) => setQuality(Number(event.target.value))}
        className="w-full"
      />

      <input
        type="file"
        accept="image/png"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) convert(file);
        }}
        className="w-full rounded-xl border p-3"
        style={{ borderColor: "var(--border)" }}
      />

      <button type="button" className="btn btn-secondary" onClick={() => setOutput("")}>Clear</button>

      {output ? (
        <a href={output} download="toolhub-converted.jpg" className="btn btn-primary">
          Download JPG
        </a>
      ) : null}
    </div>
  );
}
