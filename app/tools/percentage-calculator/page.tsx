import type { Metadata } from "next";
import { ToolLayout } from "@/components/tool-layout";
import { PercentageCalculatorTool } from "@/components/tools/percentage-calculator-tool";
import { getToolBySlug } from "@/data/tools";

const tool = getToolBySlug("percentage-calculator");

export const metadata: Metadata = {
  title: tool?.name,
  description: tool?.seoDescription,
};

export default function PercentageCalculatorPage() {
  return (
    <ToolLayout
      slug="percentage-calculator"
      title="Percentage Calculator"
      description="Calculate percentage values and percentage change with fast, accurate formulas."
    >
      <PercentageCalculatorTool />
    </ToolLayout>
  );
}
