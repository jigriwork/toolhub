"use client";

import JsBarcode from "jsbarcode";
import { useMemo, useRef, useState } from "react";

type BarcodeFormat = "CODE128" | "EAN13" | "EAN8" | "UPC" | "ITF14";

const formatHints: Record<BarcodeFormat, string> = {
  CODE128: "Best for mixed text and numbers (most flexible).",
  EAN13: "13-digit retail barcode format.",
  EAN8: "8-digit compact retail barcode.",
  UPC: "12-digit UPC barcode for products.",
  ITF14: "14-digit carton/shipping barcode.",
};

const sampleByFormat: Record<BarcodeFormat, string> = {
  CODE128: "INV-100235-AB",
  EAN13: "8901234567892",
  EAN8: "55123457",
  UPC: "725272730706",
  ITF14: "12345678901231",
};

export function BarcodeGeneratorTool() {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [format, setFormat] = useState<BarcodeFormat>("CODE128");
  const [value, setValue] = useState(sampleByFormat.CODE128);
  const [error, setError] = useState("");
  const [generated, setGenerated] = useState(false);

  const helperText = useMemo(() => formatHints[format], [format]);

  const generate = () => {
    const svg = svgRef.current;
    if (!svg) return;

    try {
      JsBarcode(svg, value.trim(), {
        format,
        width: 2,
        height: 90,
        margin: 8,
        displayValue: true,
        background: "#ffffff",
        lineColor: "#0f172a",
      });
      setGenerated(true);
      setError("");
    } catch {
      setGenerated(false);
      setError("Invalid value for this format. Check digit length and try again.");
    }
  };

  const download = () => {
    const svgNode = svgRef.current;
    if (!svgNode || !generated) return;
    const svgData = new XMLSerializer().serializeToString(svgNode);
    const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(svgBlob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `toolhub-barcode-${format.toLowerCase()}.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-5">
      <div className="grid gap-4 md:grid-cols-2">
        <label className="text-sm font-medium">
          Barcode format
          <select
            value={format}
            onChange={(event) => {
              const next = event.target.value as BarcodeFormat;
              setFormat(next);
              setValue(sampleByFormat[next]);
              setGenerated(false);
              setError("");
            }}
            className="select mt-1"
          >
            <option value="CODE128">CODE128</option>
            <option value="EAN13">EAN13</option>
            <option value="EAN8">EAN8</option>
            <option value="UPC">UPC</option>
            <option value="ITF14">ITF14</option>
          </select>
          <span className="mt-1 block text-xs" style={{ color: "var(--muted)" }}>
            {helperText}
          </span>
        </label>

        <label className="text-sm font-medium">
          Barcode value
          <input
            className="field mt-1"
            value={value}
            onChange={(event) => setValue(event.target.value)}
            placeholder="Enter product code or identifier"
          />
        </label>
      </div>

      <div className="flex flex-wrap gap-2">
        <button type="button" className="btn btn-primary" onClick={generate}>
          Generate barcode
        </button>
        <button type="button" className="btn btn-secondary" onClick={download} disabled={!generated}>
          Download barcode image
        </button>
      </div>

      {error ? <p className="text-sm text-red-500">{error}</p> : null}

      <div className="rounded-xl border p-4" style={{ borderColor: "var(--border)", background: "#fff" }}>
        {!generated ? (
          <p className="text-sm" style={{ color: "var(--muted)" }}>
            Your generated barcode preview will appear here.
          </p>
        ) : null}
        <svg ref={svgRef} className="max-w-full" />
      </div>
    </div>
  );
}
