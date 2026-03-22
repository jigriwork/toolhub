import type { Metadata } from "next";
import { ToolLayout } from "@/components/tool-layout";
import { CloudSyncMultiStoreTool } from "@/components/tools/cloud-sync-multi-store-tool";
import { buildToolMetadata } from "@/lib/tool-metadata";

export const metadata: Metadata = buildToolMetadata("cloud-sync-multi-store");

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
