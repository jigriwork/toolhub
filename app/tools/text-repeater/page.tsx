import type { Metadata } from "next";
import { ToolLayout } from "@/components/tool-layout";
import { TextRepeaterTool } from "@/components/tools/text-repeater-tool";
import { getToolBySlug } from "@/data/tools";

const tool = getToolBySlug("text-repeater");

export const metadata: Metadata = {
  title: tool?.name,
  description: tool?.seoDescription,
};

export default function TextRepeaterPage() {
  return (
    <ToolLayout
      slug="text-repeater"
      title="Text Repeater"
      description="Repeat words or phrases in bulk for formatting, testing, and content workflows."
    >
      <TextRepeaterTool />
    </ToolLayout>
  );
}
