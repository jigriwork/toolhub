import type { Metadata } from "next";
import { ToolLayout } from "@/components/tool-layout";
import { PasswordGeneratorTool } from "@/components/tools/password-generator-tool";
import { getToolBySlug } from "@/data/tools";

const tool = getToolBySlug("password-generator");

export const metadata: Metadata = {
  title: tool?.name,
  description: tool?.seoDescription,
};

export default function PasswordGeneratorPage() {
  return (
    <ToolLayout
      slug="password-generator"
      title="Password Generator"
      description="Create strong random passwords with full control over character rules."
    >
      <PasswordGeneratorTool />
    </ToolLayout>
  );
}
