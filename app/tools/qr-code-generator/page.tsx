import type { Metadata } from "next";
import { ToolLayout } from "@/components/tool-layout";
import { QrCodeGeneratorTool } from "@/components/tools/qr-code-generator-tool";

export const metadata: Metadata = {
  title: "QR Code Generator",
  description: "Generate and download QR codes for text and URLs.",
};

export default function QrCodeGeneratorPage() {
  return (
    <ToolLayout
      title="QR Code Generator"
      description="Create downloadable QR codes from any text or URL."
    >
      <QrCodeGeneratorTool />
    </ToolLayout>
  );
}
