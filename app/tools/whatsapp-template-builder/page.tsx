import type { Metadata } from "next";
import { ToolLayout } from "@/components/tool-layout";
import { WhatsappTemplateBuilderTool } from "@/components/tools/whatsapp-template-builder-tool";
import { getToolBySlug } from "@/data/tools";

const tool = getToolBySlug("whatsapp-template-builder");

export const metadata: Metadata = {
  title: tool?.name,
  description: tool?.seoDescription,
};

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
