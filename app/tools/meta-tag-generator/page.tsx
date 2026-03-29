import type { Metadata } from "next";
import { ToolLayout } from "@/components/tool-layout";
import { MetaTagGeneratorTool } from "@/components/tools/meta-tag-generator-tool";
import { buildToolMetadata } from "@/lib/tool-metadata";

export const metadata: Metadata = buildToolMetadata("meta-tag-generator");

export default function MetaTagGeneratorPage() {
  return (
    <ToolLayout
      slug="meta-tag-generator"
      title="Meta Tag Generator"
      description="Generate ready-to-paste HTML meta tags for SEO, Open Graph, robots, and canonical URLs."
    >
      <MetaTagGeneratorTool />
    </ToolLayout>
  );
}
