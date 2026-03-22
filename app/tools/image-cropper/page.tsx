import type { Metadata } from "next";
import { ToolLayout } from "@/components/tool-layout";
import { ImageCropperTool } from "@/components/tools/image-cropper-tool";
import { getToolBySlug } from "@/data/tools";

const tool = getToolBySlug("image-cropper");

export const metadata: Metadata = {
  title: tool?.name,
  description: tool?.seoDescription,
};

export default function ImageCropperPage() {
  return (
    <ToolLayout
      slug="image-cropper"
      title="Image Cropper"
      description="Upload an image, drag crop area, choose preset ratios, and download your cropped output in seconds."
    >
      <ImageCropperTool />
    </ToolLayout>
  );
}
