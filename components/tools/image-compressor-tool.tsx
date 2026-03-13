"use client";

import imageCompression from "browser-image-compression";
import { useEffect, useMemo, useState } from "react";

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

  useEffect(() => {
    return () => {
      if (downloadUrl) URL.revokeObjectURL(downloadUrl);
    };
  }, [downloadUrl]);

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

      {isCompressing && <p className="text-sm">Compressing image...</p>}
      {error && <p className="text-sm text-red-500">{error}</p>}

      {originalFile && (
        <div className="rounded-xl border p-4" style={{ borderColor: "var(--border)" }}>
          <p>
            <strong>Original size:</strong> {formatSize(originalFile.size)}
          </p>
          <p>
            <strong>Compressed size:</strong>{" "}
            {compressedFile ? formatSize(compressedFile.size) : "-"}
          </p>

          {compressedFile && downloadUrl && (
            <a
              href={downloadUrl}
              download={compressedFile.name}
              className="btn btn-primary mt-4"
            >
              Download Compressed Image
            </a>
          )}
        </div>
      )}
    </div>
  );
}
