"use client";

import jsPDF from "jspdf";
import { useEffect, useMemo, useState } from "react";

type PdfImageItem = {
  id: string;
  file: File;
  previewUrl: string;
};

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function readFileAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result ?? ""));
    reader.onerror = () => reject(new Error("Unable to read image"));
    reader.readAsDataURL(file);
  });
}

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("Unable to load preview"));
    image.src = src;
  });
}

export function ImageToPdfConverterTool() {
  const [items, setItems] = useState<PdfImageItem[]>([]);
  const [dragId, setDragId] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState("");
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);

  const pdfUrl = useMemo(() => (pdfBlob ? URL.createObjectURL(pdfBlob) : ""), [pdfBlob]);

  useEffect(() => {
    return () => {
      items.forEach((item) => URL.revokeObjectURL(item.previewUrl));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    return () => {
      if (pdfUrl) URL.revokeObjectURL(pdfUrl);
    };
  }, [pdfUrl]);

  const handleAddImages = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const added = Array.from(files)
      .filter((file) => file.type.startsWith("image/"))
      .map((file) => ({
        id: `${file.name}-${file.size}-${Math.random().toString(36).slice(2)}`,
        file,
        previewUrl: URL.createObjectURL(file),
      }));

    setItems((current) => [...current, ...added]);
    setPdfBlob(null);
    setError("");
  };

  const clearItems = () => {
    items.forEach((item) => URL.revokeObjectURL(item.previewUrl));
    setItems([]);
    setPdfBlob(null);
    setError("");
  };

  const moveItem = (fromId: string, toId: string) => {
    if (fromId === toId) return;
    setItems((current) => {
      const fromIndex = current.findIndex((item) => item.id === fromId);
      const toIndex = current.findIndex((item) => item.id === toId);
      if (fromIndex < 0 || toIndex < 0) return current;

      const clone = [...current];
      const [moved] = clone.splice(fromIndex, 1);
      clone.splice(toIndex, 0, moved);
      return clone;
    });
  };

  const generatePdf = async () => {
    if (items.length === 0) return;
    setIsGenerating(true);
    setError("");
    setPdfBlob(null);

    try {
      const pdf = new jsPDF({ orientation: "portrait", unit: "pt", format: "a4", compress: true });
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 24;

      for (let index = 0; index < items.length; index += 1) {
        const item = items[index];
        const dataUrl = await readFileAsDataUrl(item.file);
        const image = await loadImage(dataUrl);

        if (index > 0) {
          pdf.addPage();
        }

        const maxWidth = pageWidth - margin * 2;
        const maxHeight = pageHeight - margin * 2;
        const scale = Math.min(maxWidth / image.width, maxHeight / image.height);
        const drawWidth = image.width * scale;
        const drawHeight = image.height * scale;
        const x = (pageWidth - drawWidth) / 2;
        const y = (pageHeight - drawHeight) / 2;

        const imageType = item.file.type.includes("png") ? "PNG" : "JPEG";
        pdf.addImage(dataUrl, imageType, x, y, drawWidth, drawHeight);
      }

      setPdfBlob(pdf.output("blob"));
    } catch {
      setError("Failed to generate PDF. Please try different images.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-4">
      <input
        type="file"
        accept="image/*"
        multiple
        onChange={(event) => handleAddImages(event.target.files)}
        className="w-full rounded-xl border p-3"
        style={{ borderColor: "var(--border)" }}
      />

      <div className="flex flex-wrap gap-2">
        <button type="button" className="btn btn-secondary" onClick={clearItems}>
          Clear images
        </button>
        <button
          type="button"
          className="btn btn-primary"
          disabled={items.length === 0 || isGenerating}
          onClick={() => void generatePdf()}
        >
          {isGenerating ? "Generating PDF..." : "Merge into PDF"}
        </button>
      </div>

      {error ? <p className="text-sm text-red-500">{error}</p> : null}

      <div className="space-y-3">
        <p className="text-sm" style={{ color: "var(--muted)" }}>
          Drag and reorder pages before merging.
        </p>
        {items.length === 0 ? (
          <p className="rounded-xl border p-4 text-sm" style={{ borderColor: "var(--border)", color: "var(--muted)" }}>
            Upload two or more images to create a multi-page PDF.
          </p>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item, index) => (
              <div
                key={item.id}
                draggable
                onDragStart={() => setDragId(item.id)}
                onDragOver={(event) => event.preventDefault()}
                onDrop={(event) => {
                  event.preventDefault();
                  if (dragId) moveItem(dragId, item.id);
                  setDragId(null);
                }}
                className="rounded-xl border p-3"
                style={{ borderColor: "var(--border)" }}
              >
                <p className="mb-2 text-xs font-medium" style={{ color: "var(--muted)" }}>
                  Page {index + 1}
                </p>
                <img src={item.previewUrl} alt={`Preview ${index + 1}`} className="h-36 w-full rounded-lg object-cover" />
                <p className="mt-2 truncate text-xs" style={{ color: "var(--muted)" }}>
                  {item.file.name} • {formatSize(item.file.size)}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {pdfBlob && pdfUrl ? (
        <a href={pdfUrl} download="toolhub-merged-images.pdf" className="btn btn-primary">
          Download PDF ({formatSize(pdfBlob.size)})
        </a>
      ) : null}
    </div>
  );
}
