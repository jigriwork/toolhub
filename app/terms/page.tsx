import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms",
  description: "Read toolhubsite terms of use.",
};

export default function TermsPage() {
  return (
    <main className="container py-10">
      <h1 className="text-3xl font-bold">Terms of Use</h1>
      <div className="mt-4 max-w-3xl space-y-3" style={{ color: "var(--muted)" }}>
        <p>
          toolhubsite tools are provided &quot;as is&quot; without warranties.
        </p>
        <p>
          You are responsible for how you use tool outputs and results.
        </p>
        <p>
          We do not guarantee uninterrupted availability, and we may update,
          improve, or remove features at any time.
        </p>
        <p>
          By using www.toolhubsite.in, you agree to these terms and any future
          updates posted on this page.
        </p>
      </div>
    </main>
  );
}
