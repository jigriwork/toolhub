import type { Metadata } from "next";
import { ToolLayout } from "@/components/tool-layout";
import { WhatsappLinkGeneratorTool } from "@/components/tools/whatsapp-link-generator-tool";
import { buildToolMetadata } from "@/lib/tool-metadata";

export const metadata: Metadata = buildToolMetadata("whatsapp-link-generator");

export default function WhatsappLinkGeneratorPage() {
  return (
    <ToolLayout
      slug="whatsapp-link-generator"
      title="WhatsApp Link Generator"
      description="Create a direct wa.me chat link using a phone number and optional prefilled message."
    >
      <WhatsappLinkGeneratorTool />
    </ToolLayout>
  );
}
