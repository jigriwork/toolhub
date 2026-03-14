import type { Metadata } from "next";
import { submitFeedbackAction } from "@/app/actions/public-submissions";
import { FeedbackForm } from "@/components/feedback-form";

export const metadata: Metadata = {
  title: "Feedback & Report Issue",
  description:
    "Send product feedback or report issues to help improve toolhubsite quality and reliability.",
};

export default function FeedbackPage() {
  return (
    <main className="container py-10">
      <h1 className="text-3xl font-bold">Feedback & Report Issue</h1>
      <p className="mt-2 text-sm" style={{ color: "var(--muted)" }}>
        Share bugs, UX improvements, or feature ideas. Your input drives product quality.
      </p>
      <FeedbackForm action={submitFeedbackAction} />
    </main>
  );
}
