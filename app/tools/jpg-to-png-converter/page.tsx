import type { Metadata } from "next";
import { ToolLayout } from "@/components/tool-layout";
import { JpgToPngConverterTool } from "@/components/tools/jpg-to-png-converter-tool";
import { getToolBySlug } from "@/data/tools";

const tool = getToolBySlug("jpg-to-png-converter");

export const metadata: Metadata = {
  title: tool?.name,
  description: tool?.seoDescription,
};

export default function JpgToPngConverterPage() {
  return (
    <ToolLayout
      slug="jpg-to-png-converter"
      title="JPG to PNG Converter"
      description="Convert JPG images to PNG format instantly with local browser-based processing."
    >
      <JpgToPngConverterTool />
    </ToolLayout>
  );
}
