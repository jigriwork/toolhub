import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description: "Learn about ToolHub and our mission.",
};

export default function AboutPage() {
  return (
    <main className="container py-10">
      <h1 className="text-3xl font-bold">About ToolHub</h1>
      <div className="mt-4 max-w-3xl space-y-3" style={{ color: "var(--muted)" }}>
        <p>
          ToolHub is a modern multi-tools web app built to help users complete
          everyday tasks quickly and reliably.
        </p>
        <p>
          Our focus is speed, clarity, and quality—offering useful tools in a
          clean experience that works across mobile and desktop.
        </p>
      </div>
    </main>
  );
}
