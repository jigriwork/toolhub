import type { Metadata } from "next";
import { ToolLayout } from "@/components/tool-layout";
import { CompressPdfTool } from "@/components/tools/compress-pdf-tool";
import { getToolBySlug } from "@/data/tools";

const tool = getToolBySlug("compress-pdf");

export const metadata: Metadata = {
  title: tool?.name,
  description: tool?.seoDescription,
};

export default function CompressPdfPage() {
  return (
    <ToolLayout
      slug="compress-pdf"
      title="Compress PDF"
      description="Upload a PDF, reduce its file size, compare original vs compressed size, and download the optimized document."
    >
      <CompressPdfTool />
    </ToolLayout>
  );
}
