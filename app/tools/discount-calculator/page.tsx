import type { Metadata } from "next";
import { ToolLayout } from "@/components/tool-layout";
import { DiscountCalculatorTool } from "@/components/tools/discount-calculator-tool";
import { getToolBySlug } from "@/data/tools";

const tool = getToolBySlug("discount-calculator");

export const metadata: Metadata = {
  title: tool?.name,
  description: tool?.seoDescription,
};

export default function DiscountCalculatorPage() {
  return (
    <ToolLayout
      slug="discount-calculator"
      title="Discount Calculator"
      description="Get exact discount savings and final payable price for offers and sales."
    >
      <DiscountCalculatorTool />
    </ToolLayout>
  );
}
