"use client";

import Image from "next/image";
import QRCode from "qrcode";
import { useState } from "react";

function sanitizeAmount(value: string) {
  const amount = Number(value);
  if (!Number.isFinite(amount) || amount <= 0) return "";
  return amount.toFixed(2);
}

export function UpiQrGeneratorTool() {
  const [name, setName] = useState("ToolHub Store");
  const [upiId, setUpiId] = useState("payments@upi");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [qrUrl, setQrUrl] = useState("");
  const [error, setError] = useState("");

  const generate = async () => {
    if (!name.trim() || !upiId.trim()) {
      setError("Name and UPI ID are required.");
      return;
    }

    try {
      const params = new URLSearchParams({
        pa: upiId.trim(),
        pn: name.trim(),
      });

      const normalizedAmount = sanitizeAmount(amount);
      if (normalizedAmount) params.set("am", normalizedAmount);
      if (note.trim()) params.set("tn", note.trim());

      const intent = `upi://pay?${params.toString()}`;
      const dataUrl = await QRCode.toDataURL(intent, {
        width: 420,
        margin: 2,
      });

      setQrUrl(dataUrl);
      setError("");
    } catch {
      setError("Unable to generate UPI QR. Please verify details and try again.");
    }
  };

  return (
    <div className="space-y-5">
      <div className="grid gap-4 md:grid-cols-2">
        <label className="text-sm font-medium">
          Payee name
          <input className="field mt-1" value={name} onChange={(event) => setName(event.target.value)} placeholder="Your business name" />
        </label>
        <label className="text-sm font-medium">
          UPI ID
          <input className="field mt-1" value={upiId} onChange={(event) => setUpiId(event.target.value)} placeholder="example@upi" />
        </label>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="text-sm font-medium">
          Amount (optional)
          <input className="field mt-1" type="number" min="0" step="0.01" value={amount} onChange={(event) => setAmount(event.target.value)} placeholder="Leave blank for flexible payment" />
        </label>
        <label className="text-sm font-medium">
          Note (optional)
          <input className="field mt-1" value={note} onChange={(event) => setNote(event.target.value)} placeholder="Order #, bill number, etc." />
        </label>
      </div>

      <div className="flex flex-wrap gap-2">
        <button type="button" className="btn btn-primary" onClick={() => void generate()}>
          Generate UPI QR
        </button>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => {
            setQrUrl("");
            setError("");
          }}
        >
          Clear output
        </button>
      </div>

      {error ? <p className="text-sm text-red-500">{error}</p> : null}

      {!qrUrl ? (
        <div className="rounded-xl border border-dashed p-5 text-sm" style={{ borderColor: "var(--border)", color: "var(--muted)" }}>
          UPI payment QR preview will appear here.
        </div>
      ) : (
        <div className="space-y-3 rounded-xl border p-4" style={{ borderColor: "var(--border)" }}>
          <Image src={qrUrl} alt="Generated UPI QR" width={260} height={260} unoptimized className="rounded-xl border p-2" style={{ borderColor: "var(--border)" }} />
          <a href={qrUrl} download="toolhub-upi-qr.png" className="btn btn-primary">
            Download UPI QR
          </a>
        </div>
      )}
    </div>
  );
}
