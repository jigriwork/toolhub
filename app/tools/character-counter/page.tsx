import type { Metadata } from "next";
import { ToolLayout } from "@/components/tool-layout";
import { CharacterCounterTool } from "@/components/tools/character-counter-tool";
import { getToolBySlug } from "@/data/tools";

const tool = getToolBySlug("character-counter");

export const metadata: Metadata = {
  title: tool?.name,
  description: tool?.seoDescription,
};

export default function CharacterCounterPage() {
  return (
    <ToolLayout
      slug="character-counter"
      title="Character Counter"
      description="Count characters instantly for SEO snippets, social captions, and copywriting limits."
    >
      <CharacterCounterTool />
    </ToolLayout>
  );
}
