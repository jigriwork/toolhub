import type { Metadata } from "next";
import { ToolLayout } from "@/components/tool-layout";
import { UuidGeneratorTool } from "@/components/tools/uuid-generator-tool";
import { getToolBySlug } from "@/data/tools";

const tool = getToolBySlug("uuid-generator");

export const metadata: Metadata = {
  title: tool?.name,
  description: tool?.seoDescription,
};

export default function UuidGeneratorPage() {
  return (
    <ToolLayout
      slug="uuid-generator"
      title="UUID Generator"
      description="Generate random UUID v4 identifiers for APIs, systems, and database records."
    >
      <UuidGeneratorTool />
    </ToolLayout>
  );
}
