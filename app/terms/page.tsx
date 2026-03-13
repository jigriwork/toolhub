import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms",
  description: "Read ToolHub terms of use.",
};

export default function TermsPage() {
  return (
    <main className="container py-10">
      <h1 className="text-3xl font-bold">Terms of Use</h1>
      <div className="mt-4 max-w-3xl space-y-3" style={{ color: "var(--muted)" }}>
        <p>ToolHub tools are provided &quot;as is&quot; without warranties.</p>
        <p>
          You are responsible for how you use generated outputs and data.
        </p>
        <p>We may update these terms at any time to improve the platform.</p>
      </div>
    </main>
  );
}
