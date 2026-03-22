import type { Metadata } from "next";
import { ToolLayout } from "@/components/tool-layout";
import { EmiCalculatorTool } from "@/components/tools/emi-calculator-tool";
import { getToolBySlug } from "@/data/tools";

const tool = getToolBySlug("emi-calculator");

export const metadata: Metadata = {
  title: tool?.name,
  description: tool?.seoDescription,
};

export default function EmiCalculatorPage() {
  return (
    <ToolLayout
      slug="emi-calculator"
      title="EMI Calculator"
      description="Estimate monthly EMI, total interest, and total loan repayment in seconds."
    >
      <EmiCalculatorTool />
    </ToolLayout>
  );
}
