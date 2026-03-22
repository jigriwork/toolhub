import type { Metadata } from "next";
import { ToolLayout } from "@/components/tool-layout";
import { ProfitPricingCalculatorTool } from "@/components/tools/profit-pricing-calculator-tool";
import { buildToolMetadata } from "@/lib/tool-metadata";

export const metadata: Metadata = buildToolMetadata("profit-pricing-calculator");

export default function ProfitPricingCalculatorPage() {
  return (
    <ToolLayout
      slug="profit-pricing-calculator"
      title="Profit & Pricing Calculator"
      description="Calculate selling price from cost using margin/markup with GST and discount simulation."
    >
      <ProfitPricingCalculatorTool />
    </ToolLayout>
  );
}
