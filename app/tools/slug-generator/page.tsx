import type { Metadata } from "next";
import { ToolLayout } from "@/components/tool-layout";
import { SlugGeneratorTool } from "@/components/tools/slug-generator-tool";
import { getToolBySlug } from "@/data/tools";

const tool = getToolBySlug("slug-generator");

export const metadata: Metadata = {
  title: tool?.name,
  description: tool?.seoDescription,
};

export default function SlugGeneratorPage() {
  return (
    <ToolLayout
      slug="slug-generator"
      title="Slug Generator"
      description="Create clean, SEO-friendly URL slugs from titles and content phrases instantly."
    >
      <SlugGeneratorTool />
    </ToolLayout>
  );
}
