import type { Metadata } from "next";
import { ToolLayout } from "@/components/tool-layout";
import { ImageCompressorTool } from "@/components/tools/image-compressor-tool";

export const metadata: Metadata = {
  title: "Image Compressor",
  description:
    "Compress image files in-browser, compare sizes, and download optimized output.",
};

export default function ImageCompressorPage() {
  return (
    <ToolLayout
      title="Image Compressor"
      description="Reduce image file size in your browser while preserving visual quality."
    >
      <ImageCompressorTool />
    </ToolLayout>
  );
}
