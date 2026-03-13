import type { Metadata } from "next";
import { ToolLayout } from "@/components/tool-layout";
import { WordCounterTool } from "@/components/tools/word-counter-tool";
import { getToolBySlug } from "@/data/tools";

const tool = getToolBySlug("word-counter");

export const metadata: Metadata = {
  title: tool?.name,
  description: tool?.seoDescription,
};

export default function WordCounterPage() {
  return (
    <ToolLayout
      slug="word-counter"
      title="Word Counter"
      description="Analyze text instantly with detailed writing statistics."
    >
      <WordCounterTool />
    </ToolLayout>
  );
}
