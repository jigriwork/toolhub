import type { Metadata } from "next";
import { ToolLayout } from "@/components/tool-layout";
import { ImageCompressorTool } from "@/components/tools/image-compressor-tool";
import { getToolBySlug } from "@/data/tools";

const tool = getToolBySlug("image-compressor");

export const metadata: Metadata = {
  title: tool?.name,
  description: tool?.seoDescription,
};

export default function ImageCompressorPage() {
  return (
    <ToolLayout
      slug="image-compressor"
      title="Image Compressor"
      description="Reduce image file size in your browser while preserving visual quality."
    >
      <ImageCompressorTool />
    </ToolLayout>
  );
}
