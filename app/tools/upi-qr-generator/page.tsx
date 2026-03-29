import type { Metadata } from "next";
import { ToolLayout } from "@/components/tool-layout";
import { UpiQrGeneratorTool } from "@/components/tools/upi-qr-generator-tool";
import { buildToolMetadata } from "@/lib/tool-metadata";

export const metadata: Metadata = buildToolMetadata("upi-qr-generator");

export default function UpiQrGeneratorPage() {
  return (
    <ToolLayout
      slug="upi-qr-generator"
      title="UPI QR Generator"
      description="Generate UPI payment QR codes with payee details, optional amount, and optional transaction note."
    >
      <UpiQrGeneratorTool />
    </ToolLayout>
  );
}
