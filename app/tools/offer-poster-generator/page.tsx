import type { Metadata } from "next";
import { ToolLayout } from "@/components/tool-layout";
import { OfferPosterGeneratorTool } from "@/components/tools/offer-poster-generator-tool";
import { getToolBySlug } from "@/data/tools";

const tool = getToolBySlug("offer-poster-generator");

export const metadata: Metadata = {
  title: tool?.name,
  description: tool?.seoDescription,
};

export default function OfferPosterGeneratorPage() {
  return (
    <ToolLayout
      slug="offer-poster-generator"
      title="Offer Poster Generator"
      description="Build premium promotional posters for retail and local business campaigns with logo, offer hierarchy, and clean high-quality image export."
    >
      <OfferPosterGeneratorTool />
    </ToolLayout>
  );
}
