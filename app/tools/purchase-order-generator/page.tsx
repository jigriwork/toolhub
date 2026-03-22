import type { Metadata } from "next";
import { ToolLayout } from "@/components/tool-layout";
import { PurchaseOrderGeneratorTool } from "@/components/tools/purchase-order-generator-tool";
import { getToolBySlug } from "@/data/tools";

const tool = getToolBySlug("purchase-order-generator");

export const metadata: Metadata = {
  title: tool?.name,
  description: tool?.seoDescription,
};

export default function PurchaseOrderGeneratorPage() {
  return (
    <ToolLayout
      slug="purchase-order-generator"
      title="Purchase Order Generator"
      description="Create supplier purchase orders with expected delivery and draft/sent/received status."
    >
      <PurchaseOrderGeneratorTool />
    </ToolLayout>
  );
}
