"use client";

import Image from "next/image";
import QRCode from "qrcode";
import { useMemo, useState } from "react";

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

  const normalizedAmount = useMemo(() => sanitizeAmount(amount), [amount]);

  const generate = async () => {
    if (!name.trim() || !upiId.trim()) {
      setError("Name and UPI ID are required.");
      return;
    }

    try {
      const params = new URLSearchParams({
        pa: upiId.trim(),
        pn: name.trim(),
        cu: "INR",
      });

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
        <div className="space-y-4 rounded-xl border p-4" style={{ borderColor: "var(--border)" }}>
          <div className="grid gap-4 md:grid-cols-[280px_1fr] md:items-start">
            <Image src={qrUrl} alt="Generated UPI QR" width={260} height={260} unoptimized className="rounded-xl border p-2" style={{ borderColor: "var(--border)" }} />
            <div className="rounded-xl border p-3 text-sm" style={{ borderColor: "var(--border)" }}>
              <p className="font-semibold">Payment details</p>
              <div className="mt-2 space-y-1" style={{ color: "var(--muted)" }}>
                <p><span className="font-medium" style={{ color: "var(--foreground)" }}>Name:</span> {name.trim() || "-"}</p>
                <p><span className="font-medium" style={{ color: "var(--foreground)" }}>UPI ID:</span> {upiId.trim() || "-"}</p>
                <p><span className="font-medium" style={{ color: "var(--foreground)" }}>Amount:</span> {normalizedAmount ? `₹${normalizedAmount}` : "Customer enters amount"}</p>
                <p><span className="font-medium" style={{ color: "var(--foreground)" }}>Note:</span> {note.trim() || "-"}</p>
              </div>
              <p className="mt-3 text-xs" style={{ color: "var(--muted)" }}>
                Share this QR with customers along with these payment details.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <a href={qrUrl} download="toolhub-upi-qr.png" className="btn btn-primary">
              Download UPI QR
            </a>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => {
                const details = [
                  `Name: ${name.trim()}`,
                  `UPI ID: ${upiId.trim()}`,
                  `Amount: ${normalizedAmount ? `₹${normalizedAmount}` : "As per bill"}`,
                  `Note: ${note.trim() || "-"}`,
                ].join("\n");
                void navigator.clipboard.writeText(details);
              }}
            >
              Copy payment details
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
