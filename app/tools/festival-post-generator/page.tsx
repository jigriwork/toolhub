import type { Metadata } from "next";
import { ToolLayout } from "@/components/tool-layout";
import { FestivalPostGeneratorTool } from "@/components/tools/festival-post-generator-tool";
import { buildToolMetadata } from "@/lib/tool-metadata";

export const metadata: Metadata = buildToolMetadata("festival-post-generator");

export default function FestivalPostGeneratorPage() {
  return (
    <ToolLayout
      slug="festival-post-generator"
      title="Festival Post Generator"
      description="Create festive business creatives with custom occasions, richer design styles, brand fields, and high-resolution export for posts, stories, and portrait flyers."
    >
      <FestivalPostGeneratorTool />
    </ToolLayout>
  );
}
