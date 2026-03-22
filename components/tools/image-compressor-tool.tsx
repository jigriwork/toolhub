"use client";

import imageCompression from "browser-image-compression";
import { useEffect, useMemo, useState } from "react";
import { ToolResultCard } from "@/components/tool-result-card";

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export function ImageCompressorTool() {
  const [quality, setQuality] = useState(70);
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [compressedFile, setCompressedFile] = useState<File | null>(null);
  const [isCompressing, setIsCompressing] = useState(false);
  const [error, setError] = useState("");

  const downloadUrl = useMemo(() => {
    if (!compressedFile) return "";
    return URL.createObjectURL(compressedFile);
  }, [compressedFile]);

  const originalPreviewUrl = useMemo(() => {
    if (!originalFile) return "";
    return URL.createObjectURL(originalFile);
  }, [originalFile]);

  useEffect(() => {
    return () => {
      if (downloadUrl) URL.revokeObjectURL(downloadUrl);
    };
  }, [downloadUrl]);

  useEffect(() => {
    return () => {
      if (originalPreviewUrl) URL.revokeObjectURL(originalPreviewUrl);
    };
  }, [originalPreviewUrl]);

  const reduction =
    originalFile && compressedFile
      ? ((originalFile.size - compressedFile.size) / originalFile.size) * 100
      : 0;

  const handleFile = async (file: File) => {
    setOriginalFile(file);
    setCompressedFile(null);
    setError("");
    setIsCompressing(true);

    try {
      const compressedBlob = await imageCompression(file, {
        maxSizeMB: 1,
        maxWidthOrHeight: 1920,
        initialQuality: quality / 100,
        useWebWorker: true,
      });

      const fileName = file.name.replace(/\.(\w+)$/, "-compressed.$1");
      const outFile = new File([compressedBlob], fileName, {
        type: compressedBlob.type,
      });
      setCompressedFile(outFile);
    } catch {
      setError("Unable to compress this image. Try another image file.");
    } finally {
      setIsCompressing(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="quality" className="mb-2 block font-medium">
          Compression Quality: {quality}%
        </label>
        <input
          id="quality"
          type="range"
          min={10}
          max={100}
          step={5}
          value={quality}
          onChange={(event) => setQuality(Number(event.target.value))}
          className="w-full"
        />
      </div>

      <input
        type="file"
        accept="image/*"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) void handleFile(file);
        }}
        className="w-full rounded-xl border p-3"
        style={{ borderColor: "var(--border)" }}
      />

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => {
            setOriginalFile(null);
            setCompressedFile(null);
            setError("");
          }}
        >
          Clear
        </button>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => {
            setQuality(70);
            setOriginalFile(null);
            setCompressedFile(null);
            setError("");
          }}
        >
          Reset
        </button>
      </div>

      {isCompressing && <p className="text-sm">Compressing image...</p>}
      {error && <p className="text-sm text-red-500">{error}</p>}

      {originalFile && (
        <div className="grid gap-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <ToolResultCard
              icon="📦"
              label="Original size"
              value={formatSize(originalFile.size)}
            />
            <ToolResultCard
              icon="🗜"
              label="Compressed size"
              value={compressedFile ? formatSize(compressedFile.size) : "-"}
            />
          </div>

          {compressedFile ? (
            <ToolResultCard
              icon="📉"
              label="Size reduction"
              value={`${reduction.toFixed(2)}%`}
            />
          ) : null}

          {originalPreviewUrl && compressedFile && downloadUrl ? (
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <p className="mb-2 text-sm font-medium" style={{ color: "var(--muted)" }}>
                  Before
                </p>
                <img
                  src={originalPreviewUrl}
                  alt="Original preview"
                  className="max-h-56 w-full rounded-xl border object-contain"
                  style={{ borderColor: "var(--border)" }}
                />
              </div>
              <div>
                <p className="mb-2 text-sm font-medium" style={{ color: "var(--muted)" }}>
                  After
                </p>
                <img
                  src={downloadUrl}
                  alt="Compressed preview"
                  className="max-h-56 w-full rounded-xl border object-contain"
                  style={{ borderColor: "var(--border)" }}
                />
              </div>
            </div>
          ) : null}

          {compressedFile && downloadUrl && (
            <a
              href={downloadUrl}
              download={compressedFile.name}
              className="btn btn-primary mt-4"
            >
              Download Compressed Image ({formatSize(compressedFile.size)})
            </a>
          )}
        </div>
      )}
    </div>
  );
}
