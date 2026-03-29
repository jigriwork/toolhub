import type { Metadata } from "next";
import { ToolLayout } from "@/components/tool-layout";
import { PdfMergeTool } from "@/components/tools/pdf-merge-tool";
import { buildToolMetadata } from "@/lib/tool-metadata";

export const metadata: Metadata = buildToolMetadata("pdf-merge");

export default function PdfMergePage() {
  return (
    <ToolLayout
      slug="pdf-merge"
      title="PDF Merge"
      description="Combine multiple PDF files in your preferred order and download a single merged file."
    >
      <PdfMergeTool />
    </ToolLayout>
  );
}
