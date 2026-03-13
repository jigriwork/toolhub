import type { Metadata } from "next";
import { ToolLayout } from "@/components/tool-layout";
import { PngToJpgConverterTool } from "@/components/tools/png-to-jpg-converter-tool";
import { getToolBySlug } from "@/data/tools";

const tool = getToolBySlug("png-to-jpg-converter");

export const metadata: Metadata = {
  title: tool?.name,
  description: tool?.seoDescription,
};

export default function PngToJpgConverterPage() {
  return (
    <ToolLayout
      slug="png-to-jpg-converter"
      title="PNG to JPG Converter"
      description="Convert PNG images to JPG and tune quality for smaller file sizes."
    >
      <PngToJpgConverterTool />
    </ToolLayout>
  );
}
