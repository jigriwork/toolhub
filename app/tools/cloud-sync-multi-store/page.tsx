import type { Metadata } from "next";
import { ToolLayout } from "@/components/tool-layout";
import { CloudSyncMultiStoreTool } from "@/components/tools/cloud-sync-multi-store-tool";
import { getToolBySlug } from "@/data/tools";

const tool = getToolBySlug("cloud-sync-multi-store");

export const metadata: Metadata = {
  title: tool?.name,
  description: tool?.seoDescription,
};

export default function CloudSyncMultiStorePage() {
  return (
    <ToolLayout
      slug="cloud-sync-multi-store"
      title="Cloud Sync & Multi-store"
      description="Understand cloud backup + multi-branch operations and configure store structure without any demo data."
    >
      <CloudSyncMultiStoreTool />
    </ToolLayout>
  );
}
