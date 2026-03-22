import type { Metadata } from "next";
import { ToolLayout } from "@/components/tool-layout";
import { GstBillingHelperTool } from "@/components/tools/gst-billing-helper-tool";
import { buildToolMetadata } from "@/lib/tool-metadata";

export const metadata: Metadata = buildToolMetadata("gst-billing-helper");

export default function GstBillingHelperPage() {
  return (
    <ToolLayout
      slug="gst-billing-helper"
      title="GST Billing Helper"
      description="Compute CGST/SGST/IGST split with HSN/SAC hints and tax-summary ready output."
    >
      <GstBillingHelperTool />
    </ToolLayout>
  );
}
