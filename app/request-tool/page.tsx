import type { Metadata } from "next";
import { submitToolRequestAction } from "@/app/actions/public-submissions";
import { RequestToolForm } from "@/components/request-tool-form";

export const metadata: Metadata = {
  title: "Request a Tool",
  description:
    "Submit a tool request and help shape the next set of utilities on toolhubsite.",
};

export default function RequestToolPage() {
  return (
    <main className="container py-10">
      <h1 className="text-3xl font-bold">Request a Tool</h1>
      <p className="mt-2 text-sm" style={{ color: "var(--muted)" }}>
        Tell us what utility you need. We prioritize requests with strong practical value.
      </p>
      <RequestToolForm action={submitToolRequestAction} />
    </main>
  );
}
