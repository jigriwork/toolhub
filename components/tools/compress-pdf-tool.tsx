"use client";

import { PDFDocument } from "pdf-lib";
import { useEffect, useMemo, useState } from "react";

type CompressionLevel = "low" | "medium" | "high";

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export function CompressPdfTool() {
  const [file, setFile] = useState<File | null>(null);
  const [compressedBlob, setCompressedBlob] = useState<Blob | null>(null);
  const [isCompressing, setIsCompressing] = useState(false);
  const [error, setError] = useState("");
  const [level, setLevel] = useState<CompressionLevel>("medium");

  const downloadUrl = useMemo(
    () => (compressedBlob ? URL.createObjectURL(compressedBlob) : ""),
    [compressedBlob],
  );

  useEffect(() => {
    return () => {
      if (downloadUrl) URL.revokeObjectURL(downloadUrl);
    };
  }, [downloadUrl]);

  const reduction =
    file && compressedBlob ? ((file.size - compressedBlob.size) / file.size) * 100 : 0;

  const compress = async (selectedFile: File) => {
    setFile(selectedFile);
    setCompressedBlob(null);
    setError("");
    setIsCompressing(true);

    try {
      const bytes = await selectedFile.arrayBuffer();
      const src = await PDFDocument.load(bytes, { updateMetadata: false });
      const out = await PDFDocument.create();
      const copiedPages = await out.copyPages(src, src.getPageIndices());
      copiedPages.forEach((page) => out.addPage(page));

      if (level === "high") {
        out.setProducer("ToolHub PDF Compressor");
      }

      const compressedBytes = await out.save({
        useObjectStreams: true,
        addDefaultPage: false,
        objectsPerTick: level === "low" ? 120 : level === "medium" ? 60 : 20,
      });

      const normalizedBytes = new Uint8Array(compressedBytes);
      setCompressedBlob(new Blob([normalizedBytes], { type: "application/pdf" }));
    } catch {
      setError("Unable to compress this PDF. Please try another file.");
    } finally {
      setIsCompressing(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="pdf-compression" className="mb-2 block text-sm font-medium">
          Compression level
        </label>
        <select
          id="pdf-compression"
          value={level}
          onChange={(event) => setLevel(event.target.value as CompressionLevel)}
          className="w-full rounded-xl border bg-transparent px-3 py-2"
          style={{ borderColor: "var(--border)" }}
        >
          <option value="low">Low (faster)</option>
          <option value="medium">Medium</option>
          <option value="high">High (smaller size)</option>
        </select>
      </div>

      <input
        type="file"
        accept="application/pdf"
        onChange={(event) => {
          const nextFile = event.target.files?.[0];
          if (nextFile) void compress(nextFile);
        }}
        className="w-full rounded-xl border p-3"
        style={{ borderColor: "var(--border)" }}
      />

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => {
            setFile(null);
            setCompressedBlob(null);
            setError("");
          }}
        >
          Clear
        </button>
        <button
          type="button"
          className="btn btn-secondary"
          disabled={!file || isCompressing}
          onClick={() => {
            if (file) void compress(file);
          }}
        >
          Recompress
        </button>
      </div>

      {isCompressing ? <p className="text-sm">Compressing PDF...</p> : null}
      {error ? <p className="text-sm text-red-500">{error}</p> : null}

      {file ? (
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl border p-4" style={{ borderColor: "var(--border)" }}>
            <p className="text-sm" style={{ color: "var(--muted)" }}>
              Original size
            </p>
            <p className="mt-1 text-xl font-semibold">{formatSize(file.size)}</p>
          </div>
          <div className="rounded-xl border p-4" style={{ borderColor: "var(--border)" }}>
            <p className="text-sm" style={{ color: "var(--muted)" }}>
              Compressed size
            </p>
            <p className="mt-1 text-xl font-semibold">
              {compressedBlob ? formatSize(compressedBlob.size) : "-"}
            </p>
          </div>
        </div>
      ) : null}

      {file && compressedBlob ? (
        <p className="text-sm" style={{ color: "var(--muted)" }}>
          {reduction >= 0
            ? `Reduced by ${reduction.toFixed(2)}%`
            : `Compressed file is ${Math.abs(reduction).toFixed(2)}% larger due to document structure.`}
        </p>
      ) : null}

      {compressedBlob && downloadUrl ? (
        <a href={downloadUrl} download="toolhub-compressed.pdf" className="btn btn-primary">
          Download Compressed PDF ({formatSize(compressedBlob.size)})
        </a>
      ) : null}
    </div>
  );
}
