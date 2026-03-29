import type { Metadata } from "next";
import { ToolLayout } from "@/components/tool-layout";
import { ImageWatermarkTool } from "@/components/tools/image-watermark-tool";
import { buildToolMetadata } from "@/lib/tool-metadata";

export const metadata: Metadata = buildToolMetadata("image-watermark-tool");

export default function ImageWatermarkToolPage() {
  return (
    <ToolLayout
      slug="image-watermark-tool"
      title="Image Watermark Tool"
      description="Add text or logo watermarks with precise position, opacity, and size controls before download."
    >
      <ImageWatermarkTool />
    </ToolLayout>
  );
}
