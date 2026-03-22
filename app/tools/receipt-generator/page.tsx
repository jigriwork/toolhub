import type { Metadata } from "next";
import { ToolLayout } from "@/components/tool-layout";
import { ReceiptGeneratorTool } from "@/components/tools/receipt-generator-tool";
import { buildToolMetadata } from "@/lib/tool-metadata";

export const metadata: Metadata = buildToolMetadata("receipt-generator");

export default function ReceiptGeneratorPage() {
  return (
    <ToolLayout
      slug="receipt-generator"
      title="Receipt Generator"
      description="Create payment receipts for cash, UPI, bank transfer, and print/download instantly."
    >
      <ReceiptGeneratorTool />
    </ToolLayout>
  );
}
