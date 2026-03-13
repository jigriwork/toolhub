import type { Metadata } from "next";
import { ToolLayout } from "@/components/tool-layout";
import { AgeCalculatorTool } from "@/components/tools/age-calculator-tool";

export const metadata: Metadata = {
  title: "Age Calculator",
  description: "Calculate your exact age in years, months, and days.",
};

export default function AgeCalculatorPage() {
  return (
    <ToolLayout
      title="Age Calculator"
      description="Get your exact age from your date of birth in one click."
    >
      <AgeCalculatorTool />
    </ToolLayout>
  );
}
