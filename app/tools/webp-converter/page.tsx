import type { Metadata } from "next";
import { ToolLayout } from "@/components/tool-layout";
import { WebpConverterTool } from "@/components/tools/webp-converter-tool";
import { getToolBySlug } from "@/data/tools";

const tool = getToolBySlug("webp-converter");

export const metadata: Metadata = {
  title: tool?.name,
  description: tool?.seoDescription,
};

export default function WebpConverterPage() {
  return (
    <ToolLayout
      slug="webp-converter"
      title="WebP Converter"
      description="Convert images to modern WebP format for smaller size and faster page delivery."
    >
      <WebpConverterTool />
    </ToolLayout>
  );
}
