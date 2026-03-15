import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact toolhubsite for support and partnerships.",
};

export default function ContactPage() {
  return (
    <main className="container section-y">
      <h1 className="page-title font-bold">Contact</h1>
      <p className="page-lead mt-4 max-w-3xl">
        For support, feedback, or business queries, email us at{" "}
        <a className="text-blue-600" href="mailto:hello@toolhubsite.in">
          hello@toolhubsite.in
        </a>
        .
      </p>
    </main>
  );
}
