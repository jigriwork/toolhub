"use client";

import { useState } from "react";

export function WebpConverterTool() {
  const [quality, setQuality] = useState(85);
  const [output, setOutput] = useState("");

  const convert = (file: File) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.drawImage(img, 0, 0);
      setOutput(canvas.toDataURL("image/webp", quality / 100));
    };
    img.src = URL.createObjectURL(file);
  };

  return (
    <div className="space-y-4">
      <label className="block text-sm" style={{ color: "var(--muted)" }}>WebP Quality: {quality}%</label>
      <input type="range" min={10} max={100} step={5} value={quality} onChange={(e) => setQuality(Number(e.target.value))} className="w-full" />
      <input type="file" accept="image/*" onChange={(e) => { const file = e.target.files?.[0]; if (file) convert(file); }} className="w-full rounded-xl border p-3" style={{ borderColor: "var(--border)" }} />
      {output ? <a href={output} download="toolhub-converted.webp" className="btn btn-primary">Download WebP</a> : null}
    </div>
  );
}
