import type { Metadata } from "next";
import { ToolLayout } from "@/components/tool-layout";
import { UnitConverterTool } from "@/components/tools/unit-converter-tool";
import { getToolBySlug } from "@/data/tools";

const tool = getToolBySlug("unit-converter");

export const metadata: Metadata = {
  title: tool?.name,
  description: tool?.seoDescription,
};

export default function UnitConverterPage() {
  return (
    <ToolLayout
      slug="unit-converter"
      title="Unit Converter"
      description="Convert length, weight, and temperature values with fast precision."
    >
      <UnitConverterTool />
    </ToolLayout>
  );
}
