import type { Metadata } from "next";
import { ToolLayout } from "@/components/tool-layout";
import { OfferPosterGeneratorTool } from "@/components/tools/offer-poster-generator-tool";
import { buildToolMetadata } from "@/lib/tool-metadata";

export const metadata: Metadata = buildToolMetadata("offer-poster-generator");

export default function OfferPosterGeneratorPage() {
  return (
    <ToolLayout
      slug="offer-poster-generator"
      title="Offer Poster Generator"
      description="Design premium retail offer posters with stronger hierarchy, brand-ready layouts, modern themes, and sharper export."
    >
      <OfferPosterGeneratorTool />
    </ToolLayout>
  );
}
