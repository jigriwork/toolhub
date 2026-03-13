import type { Metadata } from "next";
import { ToolLayout } from "@/components/tool-layout";
import { CurrencyConverterTool } from "@/components/tools/currency-converter-tool";
import { getToolBySlug } from "@/data/tools";

const tool = getToolBySlug("currency-converter");

export const metadata: Metadata = {
  title: tool?.name,
  description: tool?.seoDescription,
};

export default function CurrencyConverterPage() {
  return (
    <ToolLayout
      slug="currency-converter"
      title="Currency Converter"
      description="Convert between major currencies quickly with a lightweight exchange calculator."
    >
      <CurrencyConverterTool />
    </ToolLayout>
  );
}
