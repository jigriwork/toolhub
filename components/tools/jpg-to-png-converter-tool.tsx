"use client";

import { useState } from "react";

export function JpgToPngConverterTool() {
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
      setOutput(canvas.toDataURL("image/png"));
    };
    img.src = URL.createObjectURL(file);
  };

  return (
    <div className="space-y-4">
      <input
        type="file"
        accept="image/jpeg,image/jpg"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) convert(file);
        }}
        className="w-full rounded-xl border p-3"
        style={{ borderColor: "var(--border)" }}
      />

      <button type="button" className="btn btn-secondary" onClick={() => setOutput("")}>Clear</button>

      {output ? (
        <a href={output} download="toolhub-converted.png" className="btn btn-primary">
          Download PNG
        </a>
      ) : null}
    </div>
  );
}
