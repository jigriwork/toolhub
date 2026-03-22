import type { Metadata } from "next";
import { ToolLayout } from "@/components/tool-layout";
import { WhatsappTemplateBuilderTool } from "@/components/tools/whatsapp-template-builder-tool";
import { buildToolMetadata } from "@/lib/tool-metadata";

export const metadata: Metadata = buildToolMetadata("whatsapp-template-builder");

export default function WhatsappTemplateBuilderPage() {
  return (
    <ToolLayout
      slug="whatsapp-template-builder"
      title="WhatsApp Template Builder"
      description="Create ready-to-send WhatsApp business templates with variables and one-click copy/send."
    >
      <WhatsappTemplateBuilderTool />
    </ToolLayout>
  );
}
