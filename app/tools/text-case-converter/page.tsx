import type { Metadata } from "next";
import { ToolLayout } from "@/components/tool-layout";
import { TextCaseConverterTool } from "@/components/tools/text-case-converter-tool";

export const metadata: Metadata = {
  title: "Text Case Converter",
  description:
    "Convert text between lowercase, uppercase, sentence case, and capitalize words.",
};

export default function TextCaseConverterPage() {
  return (
    <ToolLayout
      title="Text Case Converter"
      description="Transform text format instantly for writing, SEO, and editing workflows."
    >
      <TextCaseConverterTool />
    </ToolLayout>
  );
}
