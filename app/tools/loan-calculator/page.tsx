import type { Metadata } from "next";
import { ToolLayout } from "@/components/tool-layout";
import { LoanCalculatorTool } from "@/components/tools/loan-calculator-tool";
import { getToolBySlug } from "@/data/tools";

const tool = getToolBySlug("loan-calculator");

export const metadata: Metadata = {
  title: tool?.name,
  description: tool?.seoDescription,
};

export default function LoanCalculatorPage() {
  return (
    <ToolLayout
      slug="loan-calculator"
      title="Loan Calculator"
      description="Analyze loan payment, total interest, and overall payoff with flexible inputs."
    >
      <LoanCalculatorTool />
    </ToolLayout>
  );
}
