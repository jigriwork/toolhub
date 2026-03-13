import type { Metadata } from "next";
import { ToolLayout } from "@/components/tool-layout";
import { WordCounterTool } from "@/components/tools/word-counter-tool";

export const metadata: Metadata = {
  title: "Word Counter",
  description:
    "Count words, characters, characters without spaces, sentences, paragraphs, and reading time instantly.",
};

export default function WordCounterPage() {
  return (
    <ToolLayout
      title="Word Counter"
      description="Analyze text instantly with detailed writing statistics."
    >
      <WordCounterTool />
    </ToolLayout>
  );
}
