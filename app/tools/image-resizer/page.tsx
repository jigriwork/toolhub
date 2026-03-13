import type { Metadata } from "next";
import { ToolLayout } from "@/components/tool-layout";
import { ImageResizerTool } from "@/components/tools/image-resizer-tool";
import { getToolBySlug } from "@/data/tools";

const tool = getToolBySlug("image-resizer");

export const metadata: Metadata = {
  title: tool?.name,
  description: tool?.seoDescription,
};

export default function ImageResizerPage() {
  return (
    <ToolLayout
      slug="image-resizer"
      title="Image Resizer"
      description="Resize images to exact dimensions for websites, social media, and lightweight workflows."
    >
      <ImageResizerTool />
    </ToolLayout>
  );
}
