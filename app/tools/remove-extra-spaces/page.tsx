import type { Metadata } from "next";
import { ToolLayout } from "@/components/tool-layout";
import { RemoveExtraSpacesTool } from "@/components/tools/remove-extra-spaces-tool";
import { getToolBySlug } from "@/data/tools";

const tool = getToolBySlug("remove-extra-spaces");

export const metadata: Metadata = {
  title: tool?.name,
  description: tool?.seoDescription,
};

export default function RemoveExtraSpacesPage() {
  return (
    <ToolLayout
      slug="remove-extra-spaces"
      title="Remove Extra Spaces"
      description="Clean spacing noise from copied text and produce polished, readable content."
    >
      <RemoveExtraSpacesTool />
    </ToolLayout>
  );
}
