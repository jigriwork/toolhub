import type { Metadata } from "next";
import { ToolLayout } from "@/components/tool-layout";
import { QrCodeGeneratorTool } from "@/components/tools/qr-code-generator-tool";
import { getToolBySlug } from "@/data/tools";

const tool = getToolBySlug("qr-code-generator");

export const metadata: Metadata = {
  title: tool?.name,
  description: tool?.seoDescription,
};

export default function QrCodeGeneratorPage() {
  return (
    <ToolLayout
      slug="qr-code-generator"
      title="QR Code Generator"
      description="Create downloadable QR codes from any text or URL."
    >
      <QrCodeGeneratorTool />
    </ToolLayout>
  );
}
