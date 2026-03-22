import type { Metadata } from "next";
import { ToolLayout } from "@/components/tool-layout";
import { BmiCalculatorTool } from "@/components/tools/bmi-calculator-tool";
import { getToolBySlug } from "@/data/tools";

const tool = getToolBySlug("bmi-calculator");

export const metadata: Metadata = {
  title: tool?.name,
  description: tool?.seoDescription,
};

export default function BmiCalculatorPage() {
  return (
    <ToolLayout
      slug="bmi-calculator"
      title="BMI Calculator"
      description="Check your body mass index quickly and view the standard weight category range."
    >
      <BmiCalculatorTool />
    </ToolLayout>
  );
}
