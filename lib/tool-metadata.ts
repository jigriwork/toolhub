import type { Metadata } from "next";
import { getToolBySlug } from "@/data/tools";

export function buildToolMetadata(slug: string): Metadata {
  const tool = getToolBySlug(slug);

  if (!tool) {
    return {
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  return {
    title: tool.name,
    description: tool.seoDescription,
    alternates: {
      canonical: `/tools/${tool.slug}`,
    },
    openGraph: {
      title: `${tool.name} | toolhubsite`,
      description: tool.seoDescription,
      url: `https://www.toolhubsite.in/tools/${tool.slug}`,
      type: "website",
    },
  };
}
