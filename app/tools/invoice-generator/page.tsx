import type { Metadata } from "next";
import { ToolLayout } from "@/components/tool-layout";
import { InvoiceGeneratorTool } from "@/components/tools/invoice-generator-tool";
import { buildToolMetadata } from "@/lib/tool-metadata";

export const metadata: Metadata = buildToolMetadata("invoice-generator");

export default function InvoiceGeneratorPage() {
  return (
    <ToolLayout
      slug="invoice-generator"
      title="Invoice Generator"
      description="Create polished GST-ready invoices with logo branding, tax controls, line items, and clean PDF export."
    >
      <InvoiceGeneratorTool />
    </ToolLayout>
  );
}
