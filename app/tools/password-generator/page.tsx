import type { Metadata } from "next";
import { ToolLayout } from "@/components/tool-layout";
import { PasswordGeneratorTool } from "@/components/tools/password-generator-tool";

export const metadata: Metadata = {
  title: "Password Generator",
  description:
    "Generate secure passwords with length slider, toggles, and one-click copy.",
};

export default function PasswordGeneratorPage() {
  return (
    <ToolLayout
      title="Password Generator"
      description="Create strong random passwords with full control over character rules."
    >
      <PasswordGeneratorTool />
    </ToolLayout>
  );
}
