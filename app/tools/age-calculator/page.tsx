import type { Metadata } from "next";
import { ToolLayout } from "@/components/tool-layout";
import { AgeCalculatorTool } from "@/components/tools/age-calculator-tool";
import { getToolBySlug } from "@/data/tools";

const tool = getToolBySlug("age-calculator");

export const metadata: Metadata = {
  title: tool?.name,
  description: tool?.seoDescription,
};

export default function AgeCalculatorPage() {
  return (
    <ToolLayout
      slug="age-calculator"
      title="Age Calculator"
      description="Get your exact age from your date of birth in one click."
    >
      <AgeCalculatorTool />
    </ToolLayout>
  );
}
