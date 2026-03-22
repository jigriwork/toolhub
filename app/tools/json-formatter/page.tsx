import type { Metadata } from "next";
import { ToolLayout } from "@/components/tool-layout";
import { JsonFormatterTool } from "@/components/tools/json-formatter-tool";
import { getToolBySlug } from "@/data/tools";

const tool = getToolBySlug("json-formatter");

export const metadata: Metadata = {
  title: tool?.name,
  description: tool?.seoDescription,
};

export default function JsonFormatterPage() {
  return (
    <ToolLayout
      slug="json-formatter"
      title="JSON Formatter"
      description="Format, validate, and minify JSON payloads for cleaner debugging and development."
    >
      <JsonFormatterTool />
    </ToolLayout>
  );
}
