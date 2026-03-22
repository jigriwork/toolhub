import type { Metadata } from "next";
import { ToolLayout } from "@/components/tool-layout";
import { AiBackgroundRemoverTool } from "@/components/tools/ai-background-remover-tool";
import { getToolBySlug } from "@/data/tools";

const tool = getToolBySlug("ai-background-remover");

export const metadata: Metadata = {
  title: tool?.name,
  description: tool?.seoDescription,
};

export default function AiBackgroundRemoverPage() {
  return (
    <ToolLayout
      slug="ai-background-remover"
      title="AI Background Remover"
      description="Upload any photo, remove background in one click, preview before/after, and download transparent PNG instantly."
    >
      <AiBackgroundRemoverTool />
    </ToolLayout>
  );
}
