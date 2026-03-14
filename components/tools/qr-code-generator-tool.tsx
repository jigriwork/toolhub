"use client";

import Image from "next/image";
import QRCode from "qrcode";
import { useState } from "react";
import { TextToolActions } from "@/components/text-tool-actions";

const SAMPLE_VALUE = "https://www.toolhubsite.in";

export function QrCodeGeneratorTool() {
  const [value, setValue] = useState(SAMPLE_VALUE);
  const [qrDataUrl, setQrDataUrl] = useState("");
  const [error, setError] = useState("");

  const generateQr = async () => {
    if (!value.trim()) {
      setError("Please enter text or URL.");
      return;
    }

    try {
      const dataUrl = await QRCode.toDataURL(value.trim(), {
        width: 320,
        margin: 2,
      });
      setQrDataUrl(dataUrl);
      setError("");
    } catch {
      setError("Unable to generate QR code. Please try again.");
    }
  };

  return (
    <div className="space-y-4">
      <input
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder="Enter text or URL"
        className="w-full rounded-xl border bg-transparent px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
        style={{ borderColor: "var(--border)" }}
      />

      <TextToolActions
        onSample={() => setValue(SAMPLE_VALUE)}
        onClear={() => {
          setValue("");
          setQrDataUrl("");
          setError("");
        }}
        onReset={() => {
          setValue(SAMPLE_VALUE);
          setQrDataUrl("");
          setError("");
        }}
      />

      <button type="button" className="btn btn-primary" onClick={generateQr}>
        Generate QR Code
      </button>

      {error && <p className="text-sm text-red-500">{error}</p>}

      {qrDataUrl && (
        <div className="space-y-4">
          <Image
            src={qrDataUrl}
            alt="Generated QR code"
            width={220}
            height={220}
            unoptimized
            className="rounded-xl border p-2"
            style={{ borderColor: "var(--border)" }}
          />
          <a
            href={qrDataUrl}
            download="toolhub-qr-code.png"
            className="btn btn-secondary"
          >
            Download QR Code
          </a>
        </div>
      )}
    </div>
  );
}
