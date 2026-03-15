import type { Metadata } from "next";
import { ToolLayout } from "@/components/tool-layout";
import { InvoiceGeneratorTool } from "@/components/tools/invoice-generator-tool";
import { getToolBySlug } from "@/data/tools";

const tool = getToolBySlug("invoice-generator");

export const metadata: Metadata = {
  title: tool?.name,
  description: tool?.seoDescription,
};

export default function InvoiceGeneratorPage() {
  return (
    <ToolLayout
      slug="invoice-generator"
      title="Invoice Generator"
      description="Create clean professional invoices with business details, customer details, editable items, GST, and instant PDF download."
    >
      <InvoiceGeneratorTool />
    </ToolLayout>
  );
}
