import type { Metadata } from "next";
import { ToolLayout } from "@/components/tool-layout";
import { UrlShortenerTool } from "@/components/tools/url-shortener-tool";
import { getToolBySlug } from "@/data/tools";

const tool = getToolBySlug("url-shortener");

export const metadata: Metadata = {
  title: tool?.name,
  description: tool?.seoDescription,
};

export default function UrlShortenerPage() {
  return (
    <ToolLayout
      slug="url-shortener"
      title="URL Shortener"
      description="Paste a long URL, generate a compact short link, and copy it instantly for sharing."
    >
      <UrlShortenerTool />
    </ToolLayout>
  );
}
