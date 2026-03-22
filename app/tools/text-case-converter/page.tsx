import type { Metadata } from "next";
import { ToolLayout } from "@/components/tool-layout";
import { TextCaseConverterTool } from "@/components/tools/text-case-converter-tool";
import { getToolBySlug } from "@/data/tools";

const tool = getToolBySlug("text-case-converter");

export const metadata: Metadata = {
  title: tool?.name,
  description: tool?.seoDescription,
};

export default function TextCaseConverterPage() {
  return (
    <ToolLayout
      slug="text-case-converter"
      title="Text Case Converter"
      description="Transform text format instantly for writing, SEO, and editing workflows."
    >
      <TextCaseConverterTool />
    </ToolLayout>
  );
}
