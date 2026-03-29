"use client";

import { PDFDocument } from "pdf-lib";
import { useEffect, useMemo, useState } from "react";

type PdfItem = {
  id: string;
  file: File;
};

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export function PdfMergeTool() {
  const [files, setFiles] = useState<PdfItem[]>([]);
  const [dragId, setDragId] = useState<string | null>(null);
  const [isMerging, setIsMerging] = useState(false);
  const [error, setError] = useState("");
  const [mergedPdf, setMergedPdf] = useState<Blob | null>(null);

  const mergedUrl = useMemo(() => (mergedPdf ? URL.createObjectURL(mergedPdf) : ""), [mergedPdf]);

  useEffect(() => {
    return () => {
      if (mergedUrl) URL.revokeObjectURL(mergedUrl);
    };
  }, [mergedUrl]);

  const addFiles = (incoming: FileList | null) => {
    if (!incoming) return;
    const valid = Array.from(incoming)
      .filter((file) => file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf"))
      .map((file) => ({ id: `${file.name}-${file.size}-${crypto.randomUUID()}`, file }));

    if (valid.length === 0) {
      setError("Please upload valid PDF files.");
      return;
    }

    setFiles((current) => [...current, ...valid]);
    setMergedPdf(null);
    setError("");
  };

  const moveFile = (fromId: string, toId: string) => {
    if (fromId === toId) return;
    setFiles((current) => {
      const fromIndex = current.findIndex((item) => item.id === fromId);
      const toIndex = current.findIndex((item) => item.id === toId);
      if (fromIndex < 0 || toIndex < 0) return current;
      const copy = [...current];
      const [moved] = copy.splice(fromIndex, 1);
      copy.splice(toIndex, 0, moved);
      return copy;
    });
  };

  const merge = async () => {
    if (files.length < 2) {
      setError("Upload at least two PDFs to merge.");
      return;
    }

    setIsMerging(true);
    setError("");
    setMergedPdf(null);

    try {
      const out = await PDFDocument.create();
      for (const item of files) {
        const bytes = await item.file.arrayBuffer();
        const doc = await PDFDocument.load(bytes);
        const pages = await out.copyPages(doc, doc.getPageIndices());
        pages.forEach((page) => out.addPage(page));
      }
      const merged = await out.save({ useObjectStreams: true });
      setMergedPdf(new Blob([new Uint8Array(merged)], { type: "application/pdf" }));
    } catch {
      setError("Unable to merge these PDFs. Please try different files.");
    } finally {
      setIsMerging(false);
    }
  };

  const clearAll = () => {
    setFiles([]);
    setMergedPdf(null);
    setError("");
  };

  return (
    <div className="space-y-5">
      <div className="rounded-xl border p-4" style={{ borderColor: "var(--border)" }}>
        <label htmlFor="pdf-merge-upload" className="mb-2 block text-sm font-medium">
          Upload PDF files
        </label>
        <input
          id="pdf-merge-upload"
          type="file"
          accept="application/pdf"
          multiple
          onChange={(event) => addFiles(event.target.files)}
          className="w-full rounded-xl border p-3"
          style={{ borderColor: "var(--border)" }}
        />
        <p className="mt-2 text-xs" style={{ color: "var(--muted)" }}>
          Tip: Drag cards below to reorder before merging.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        <button type="button" className="btn btn-primary" onClick={() => void merge()} disabled={files.length < 2 || isMerging}>
          {isMerging ? "Merging PDFs..." : "Merge PDFs"}
        </button>
        <button type="button" className="btn btn-secondary" onClick={clearAll}>
          Clear
        </button>
      </div>

      {error ? <p className="text-sm text-red-500">{error}</p> : null}

      {files.length === 0 ? (
        <div className="rounded-xl border border-dashed p-5 text-sm" style={{ borderColor: "var(--border)", color: "var(--muted)" }}>
          No files added yet. Upload PDFs to start building a merged document.
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {files.map((item, index) => (
            <div
              key={item.id}
              draggable
              onDragStart={() => setDragId(item.id)}
              onDragOver={(event) => event.preventDefault()}
              onDrop={(event) => {
                event.preventDefault();
                if (dragId) moveFile(dragId, item.id);
                setDragId(null);
              }}
              className="rounded-xl border p-3"
              style={{ borderColor: "var(--border)" }}
            >
              <p className="text-xs" style={{ color: "var(--muted)" }}>
                Position {index + 1}
              </p>
              <p className="mt-1 truncate text-sm font-semibold">{item.file.name}</p>
              <p className="text-xs" style={{ color: "var(--muted)" }}>
                {formatSize(item.file.size)}
              </p>
            </div>
          ))}
        </div>
      )}

      {mergedPdf && mergedUrl ? (
        <a href={mergedUrl} download="toolhub-merged.pdf" className="btn btn-primary">
          Download merged PDF ({formatSize(mergedPdf.size)})
        </a>
      ) : null}
    </div>
  );
}
