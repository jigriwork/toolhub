import type { Metadata } from "next";
import { ToolLayout } from "@/components/tool-layout";
import { ReceiptGeneratorTool } from "@/components/tools/receipt-generator-tool";
import { getToolBySlug } from "@/data/tools";

const tool = getToolBySlug("receipt-generator");

export const metadata: Metadata = {
  title: tool?.name,
  description: tool?.seoDescription,
};

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
