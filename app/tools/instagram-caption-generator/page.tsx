import type { Metadata } from "next";
import { ToolLayout } from "@/components/tool-layout";
import { InstagramCaptionGeneratorTool } from "@/components/tools/instagram-caption-generator-tool";
import { getToolBySlug } from "@/data/tools";

const tool = getToolBySlug("instagram-caption-generator");

export const metadata: Metadata = {
  title: tool?.name,
  description: tool?.seoDescription,
};

export default function InstagramCaptionGeneratorPage() {
  return (
    <ToolLayout
      slug="instagram-caption-generator"
      title="Instagram Caption Generator"
      description="Generate high-quality Instagram captions for product launches, sales, festive posts, and promotions with tone control, hashtags, and one-click copy."
    >
      <InstagramCaptionGeneratorTool />
    </ToolLayout>
  );
}
