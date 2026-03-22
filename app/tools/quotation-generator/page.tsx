import type { Metadata } from "next";
import { ToolLayout } from "@/components/tool-layout";
import { QuotationGeneratorTool } from "@/components/tools/quotation-generator-tool";
import { buildToolMetadata } from "@/lib/tool-metadata";

export const metadata: Metadata = buildToolMetadata("quotation-generator");

export default function QuotationGeneratorPage() {
  return (
    <ToolLayout
      slug="quotation-generator"
      title="Quotation Generator"
      description="Create clean business quotations/estimates with logo branding, itemized pricing, discount + GST controls, and instant PDF/print output."
    >
      <QuotationGeneratorTool />
    </ToolLayout>
  );
}
