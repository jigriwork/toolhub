import type { Metadata } from "next";
import { ToolLayout } from "@/components/tool-layout";
import { PdfSplitTool } from "@/components/tools/pdf-split-tool";
import { buildToolMetadata } from "@/lib/tool-metadata";

export const metadata: Metadata = buildToolMetadata("pdf-split");

export default function PdfSplitPage() {
  return (
    <ToolLayout
      slug="pdf-split"
      title="PDF Split"
      description="Upload a PDF, choose page ranges, and export each selected range as a separate file."
    >
      <PdfSplitTool />
    </ToolLayout>
  );
}
