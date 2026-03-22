import type { Metadata } from "next";
import { ToolLayout } from "@/components/tool-layout";
import { ProformaInvoiceGeneratorTool } from "@/components/tools/proforma-invoice-generator-tool";
import { getToolBySlug } from "@/data/tools";

const tool = getToolBySlug("proforma-invoice-generator");

export const metadata: Metadata = {
  title: tool?.name,
  description: tool?.seoDescription,
};

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
