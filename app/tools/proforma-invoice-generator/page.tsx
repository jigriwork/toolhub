import type { Metadata } from "next";
import { ToolLayout } from "@/components/tool-layout";
import { ProformaInvoiceGeneratorTool } from "@/components/tools/proforma-invoice-generator-tool";
import { buildToolMetadata } from "@/lib/tool-metadata";

export const metadata: Metadata = buildToolMetadata("proforma-invoice-generator");

export default function ProformaInvoiceGeneratorPage() {
  return (
    <ToolLayout
      slug="proforma-invoice-generator"
      title="Proforma Invoice Generator"
      description="Generate pre-sales proforma invoices with itemized totals, GST, and print/PDF options."
    >
      <ProformaInvoiceGeneratorTool />
    </ToolLayout>
  );
}
