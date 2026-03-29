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

function checksumMod10(value: string, evenWeight = 3) {
  const digits = value.split("").map((digit) => Number(digit));
  const sum = digits.reduce((acc, digit, index) => {
    const fromRight = digits.length - index;
    const weight = fromRight % 2 === 0 ? evenWeight : 1;
    return acc + digit * weight;
  }, 0);
  return (10 - (sum % 10)) % 10;
}

function normalizeBarcodeValue(format: BarcodeFormat, rawValue: string) {
  const cleaned = rawValue.replace(/\s+/g, "");

  if (format === "CODE128") {
    if (!cleaned) return { ok: false as const, error: "Enter a value for CODE128." };
    return { ok: true as const, value: cleaned };
  }

  if (!/^\d+$/.test(cleaned)) {
    return { ok: false as const, error: `${format} supports digits only.` };
  }

  if (format === "EAN13") {
    if (cleaned.length === 12) return { ok: true as const, value: cleaned };
    if (cleaned.length === 13) {
      const base = cleaned.slice(0, 12);
      const checkDigit = checksumMod10(base, 3);
      if (Number(cleaned[12]) !== checkDigit) {
        return { ok: false as const, error: "Invalid EAN13 check digit. Please verify the last digit." };
      }
      return { ok: true as const, value: base };
    }
    return { ok: false as const, error: "EAN13 accepts 12 digits (auto checksum) or 13 digits (with valid checksum)." };
  }

  if (format === "EAN8") {
    if (cleaned.length === 7) return { ok: true as const, value: cleaned };
    if (cleaned.length === 8) {
      const base = cleaned.slice(0, 7);
      const checkDigit = checksumMod10(base, 3);
      if (Number(cleaned[7]) !== checkDigit) {
        return { ok: false as const, error: "Invalid EAN8 check digit. Please verify the last digit." };
      }
      return { ok: true as const, value: base };
    }
    return { ok: false as const, error: "EAN8 accepts 7 digits (auto checksum) or 8 digits (with valid checksum)." };
  }

  if (format === "UPC") {
    if (cleaned.length === 11) return { ok: true as const, value: cleaned };
    if (cleaned.length === 12) {
      const base = cleaned.slice(0, 11);
      const checkDigit = checksumMod10(base, 3);
      if (Number(cleaned[11]) !== checkDigit) {
        return { ok: false as const, error: "Invalid UPC check digit. Please verify the last digit." };
      }
      return { ok: true as const, value: base };
    }
    return { ok: false as const, error: "UPC accepts 11 digits (auto checksum) or 12 digits (with valid checksum)." };
  }

  if (format === "ITF14") {
    if (cleaned.length === 13) return { ok: true as const, value: cleaned };
    if (cleaned.length === 14) {
      const base = cleaned.slice(0, 13);
      const checkDigit = checksumMod10(base, 3);
      if (Number(cleaned[13]) !== checkDigit) {
        return { ok: false as const, error: "Invalid ITF14 check digit. Please verify the last digit." };
      }
      return { ok: true as const, value: base };
    }
    return { ok: false as const, error: "ITF14 accepts 13 digits (auto checksum) or 14 digits (with valid checksum)." };
  }

  return { ok: true as const, value: cleaned };
}

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

    const normalized = normalizeBarcodeValue(format, value.trim());
    if (!normalized.ok) {
      setGenerated(false);
      setError(normalized.error);
      return;
    }

    try {
      JsBarcode(svg, normalized.value, {
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
      setError("Invalid value for this format. Check number rules and try again.");
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
