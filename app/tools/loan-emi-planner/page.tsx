import type { Metadata } from "next";
import { ToolLayout } from "@/components/tool-layout";
import { LoanEmiPlannerTool } from "@/components/tools/loan-emi-planner-tool";
import { buildToolMetadata } from "@/lib/tool-metadata";

export const metadata: Metadata = buildToolMetadata("loan-emi-planner");

export default function LoanEmiPlannerPage() {
  return (
    <ToolLayout
      slug="loan-emi-planner"
      title="Loan & EMI Planner"
      description="Plan monthly EMI, total interest, principal-vs-interest mix, and compare two loan options in one workflow."
    >
      <LoanEmiPlannerTool />
    </ToolLayout>
  );
}