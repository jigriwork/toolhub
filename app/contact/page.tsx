import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact ToolHub for support and partnerships.",
};

export default function ContactPage() {
  return (
    <main className="container py-10">
      <h1 className="text-3xl font-bold">Contact</h1>
      <p className="mt-4 max-w-3xl" style={{ color: "var(--muted)" }}>
        For support, feedback, or business queries, email us at{" "}
        <a className="text-blue-600" href="mailto:hello@toolhub.site">
          hello@toolhub.site
        </a>
        .
      </p>
    </main>
  );
}
