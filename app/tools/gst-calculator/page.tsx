import type { Metadata } from "next";
import { ToolLayout } from "@/components/tool-layout";
import { GstCalculatorTool } from "@/components/tools/gst-calculator-tool";
import { getToolBySlug } from "@/data/tools";

const tool = getToolBySlug("gst-calculator");

export const metadata: Metadata = {
  title: tool?.name,
  description: tool?.seoDescription,
};

export default function GstCalculatorPage() {
  return (
    <ToolLayout
      slug="gst-calculator"
      title="GST Calculator"
      description="Calculate GST-exclusive and GST-inclusive values with instant breakdown."
    >
      <GstCalculatorTool />
    </ToolLayout>
  );
}
