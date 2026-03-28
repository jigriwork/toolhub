import type { Metadata } from "next";
import { ToolLayout } from "@/components/tool-layout";
import { PosMvpTool } from "@/components/tools/pos-mvp-tool";
import { buildToolMetadata } from "@/lib/tool-metadata";

export const metadata: Metadata = buildToolMetadata("pos-mvp");

export default function PosMvpPage() {
  return (
    <ToolLayout
      slug="pos-mvp"
      title="POS"
      description="Advanced Tool · Runs locally in your browser (no cloud). Manage inventory, bill customers, process returns, split payments, and print invoices from one POS workspace."
    >
      <PosMvpTool />
    </ToolLayout>
  );
}
