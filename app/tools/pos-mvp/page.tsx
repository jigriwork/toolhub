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
      description="All-in-one POS with inventory add/manage, billing, returns, split payments, cashier roles, close report, and print."
    >
      <PosMvpTool />
    </ToolLayout>
  );
}
