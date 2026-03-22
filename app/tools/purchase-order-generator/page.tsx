import type { Metadata } from "next";
import { ToolLayout } from "@/components/tool-layout";
import { PurchaseOrderGeneratorTool } from "@/components/tools/purchase-order-generator-tool";
import { buildToolMetadata } from "@/lib/tool-metadata";

export const metadata: Metadata = buildToolMetadata("purchase-order-generator");

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
