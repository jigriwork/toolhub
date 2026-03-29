import type { Metadata } from "next";
import { ToolLayout } from "@/components/tool-layout";
import { BarcodeGeneratorTool } from "@/components/tools/barcode-generator-tool";
import { buildToolMetadata } from "@/lib/tool-metadata";

export const metadata: Metadata = buildToolMetadata("barcode-generator");

export default function BarcodeGeneratorPage() {
  return (
    <ToolLayout
      slug="barcode-generator"
      title="Barcode Generator"
      description="Generate barcode images in common formats for products, inventory, and retail operations."
    >
      <BarcodeGeneratorTool />
    </ToolLayout>
  );
}
