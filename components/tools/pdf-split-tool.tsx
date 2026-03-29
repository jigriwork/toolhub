"use client";

import { PDFDocument } from "pdf-lib";
import { useEffect, useMemo, useState } from "react";

type SplitResult = {
  id: string;
  label: string;
  blob: Blob;
};

function parseRanges(input: string, maxPages: number) {
  const chunks = input
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);

  const ranges: Array<{ start: number; end: number }> = [];
  for (const chunk of chunks) {
    if (chunk.includes("-")) {
      const [startRaw, endRaw] = chunk.split("-").map((v) => Number(v.trim()));
      if (!Number.isInteger(startRaw) || !Number.isInteger(endRaw)) return null;
      const start = Math.max(1, Math.min(startRaw, endRaw));
      const end = Math.min(maxPages, Math.max(startRaw, endRaw));
      ranges.push({ start, end });
      continue;
    }

    const page = Number(chunk);
    if (!Number.isInteger(page)) return null;
    ranges.push({ start: page, end: page });
  }

  return ranges.filter((range) => range.start >= 1 && range.end <= maxPages);
}

export function PdfSplitTool() {
  const [file, setFile] = useState<File | null>(null);
  const [totalPages, setTotalPages] = useState(0);
  const [rangesInput, setRangesInput] = useState("1-2, 3-4");
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");
  const [results, setResults] = useState<SplitResult[]>([]);

  const downloads = useMemo(
    () =>
      results.map((result) => ({
        ...result,
        url: URL.createObjectURL(result.blob),
      })),
    [results],
  );

  useEffect(() => {
    return () => {
      downloads.forEach((item) => URL.revokeObjectURL(item.url));
    };
  }, [downloads]);

  const loadFile = async (next: File) => {
    setFile(next);
    setResults([]);
    setError("");
    try {
      const bytes = await next.arrayBuffer();
      const pdf = await PDFDocument.load(bytes);
      setTotalPages(pdf.getPageCount());
    } catch {
      setError("Could not read this PDF file.");
      setFile(null);
      setTotalPages(0);
    }
  };

  const splitPdf = async () => {
    if (!file || totalPages === 0) {
      setError("Please upload a PDF first.");
      return;
    }

    const ranges = parseRanges(rangesInput, totalPages);
    if (!ranges || ranges.length === 0) {
      setError(`Enter valid ranges like 1-2, 5, 7-9 (max page ${totalPages}).`);
      return;
    }

    setIsProcessing(true);
    setError("");
    setResults([]);

    try {
      const source = await PDFDocument.load(await file.arrayBuffer());
      const parts: SplitResult[] = [];

      for (const [index, range] of ranges.entries()) {
        const out = await PDFDocument.create();
        const pageIndexes: number[] = [];
        for (let i = range.start; i <= range.end; i += 1) {
          pageIndexes.push(i - 1);
        }
        const copied = await out.copyPages(source, pageIndexes);
        copied.forEach((page) => out.addPage(page));

        const bytes = await out.save({ useObjectStreams: true });
        parts.push({
          id: `${range.start}-${range.end}-${index}`,
          label: range.start === range.end ? `Page ${range.start}` : `Pages ${range.start}-${range.end}`,
          blob: new Blob([new Uint8Array(bytes)], { type: "application/pdf" }),
        });
      }

      setResults(parts);
    } catch {
      setError("Unable to split this PDF. Please try another file.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-5">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border p-4" style={{ borderColor: "var(--border)" }}>
          <label htmlFor="pdf-split-upload" className="mb-2 block text-sm font-medium">
            Upload PDF
          </label>
          <input
            id="pdf-split-upload"
            type="file"
            accept="application/pdf"
            className="w-full rounded-xl border p-3"
            style={{ borderColor: "var(--border)" }}
            onChange={(event) => {
              const selected = event.target.files?.[0];
              if (selected) void loadFile(selected);
            }}
          />
          <p className="mt-2 text-xs" style={{ color: "var(--muted)" }}>
            {file ? `${file.name} · ${totalPages} page(s)` : "Upload a PDF and choose page ranges to export."}
          </p>
        </div>

        <div className="rounded-xl border p-4" style={{ borderColor: "var(--border)" }}>
          <label htmlFor="pdf-ranges" className="mb-2 block text-sm font-medium">
            Page ranges
          </label>
          <input
            id="pdf-ranges"
            className="field"
            value={rangesInput}
            onChange={(event) => setRangesInput(event.target.value)}
            placeholder="Example: 1-2, 5, 7-9"
          />
          <p className="mt-2 text-xs" style={{ color: "var(--muted)" }}>
            Separate ranges with commas. Single pages are also supported.
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <button type="button" className="btn btn-primary" onClick={() => void splitPdf()} disabled={!file || isProcessing}>
          {isProcessing ? "Splitting PDF..." : "Split PDF"}
        </button>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => {
            setFile(null);
            setTotalPages(0);
            setResults([]);
            setError("");
          }}
        >
          Clear
        </button>
      </div>

      {error ? <p className="text-sm text-red-500">{error}</p> : null}

      {results.length === 0 ? (
        <div className="rounded-xl border border-dashed p-5 text-sm" style={{ borderColor: "var(--border)", color: "var(--muted)" }}>
          Split results will appear here after processing.
        </div>
      ) : (
        <div className="space-y-3">
          <p className="text-sm font-semibold">Split files</p>
          <div className="grid gap-3 sm:grid-cols-2">
            {downloads.map((part) => (
              <a
                key={part.id}
                href={part.url}
                download={`toolhub-${part.label.toLowerCase().replace(/\s+/g, "-")}.pdf`}
                className="rounded-xl border p-4 text-sm transition hover:-translate-y-0.5"
                style={{ borderColor: "var(--border)" }}
              >
                <p className="font-semibold">{part.label}</p>
                <p className="mt-1" style={{ color: "var(--muted)" }}>
                  Download PDF part
                </p>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
