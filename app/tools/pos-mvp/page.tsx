import type { Metadata } from "next";
import { ToolLayout } from "@/components/tool-layout";
import { PosMvpTool } from "@/components/tools/pos-mvp-tool";
import { getToolBySlug } from "@/data/tools";

const tool = getToolBySlug("pos-mvp");

export const metadata: Metadata = {
  title: tool?.name,
  description: tool?.seoDescription,
};

export default function PosMvpPage() {
  return (
    <ToolLayout
      slug="pos-mvp"
      title="POS"
      description="All-in-one POS with inventory add/manage, billing, returns, split payments, cashier roles, close report, and print."
    >
      <PosMvpTool />
    </ToolLayout>
  );
}
