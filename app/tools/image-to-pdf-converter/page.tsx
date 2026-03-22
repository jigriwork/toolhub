import type { Metadata } from "next";
import { ToolLayout } from "@/components/tool-layout";
import { ImageToPdfConverterTool } from "@/components/tools/image-to-pdf-converter-tool";
import { getToolBySlug } from "@/data/tools";

const tool = getToolBySlug("image-to-pdf-converter");

export const metadata: Metadata = {
  title: tool?.name,
  description: tool?.seoDescription,
};

export default function ImageToPdfConverterPage() {
  return (
    <ToolLayout
      slug="image-to-pdf-converter"
      title="Image to PDF Converter"
      description="Upload multiple images, reorder pages with drag-and-drop, preview them, and merge into one downloadable PDF."
    >
      <ImageToPdfConverterTool />
    </ToolLayout>
  );
}
