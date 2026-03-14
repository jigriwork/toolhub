"use client";

import { useActionState } from "react";

type FeedbackFormState = {
  ok: boolean;
  error?: string;
};

type FeedbackFormProps = {
  action: (formData: FormData) => Promise<FeedbackFormState>;
};

const initialState: FeedbackFormState = { ok: false };

export function FeedbackForm({ action }: FeedbackFormProps) {
  const [state, formAction] = useActionState(
    async (_prevState: FeedbackFormState, formData: FormData) => action(formData),
    initialState,
  );

  return (
    <form className="card mt-6 max-w-2xl space-y-4 p-6" action={formAction}>
      <select
        name="type"
        className="w-full rounded-xl border bg-transparent px-4 py-3"
        style={{ borderColor: "var(--border)" }}
        defaultValue="feedback"
      >
        <option value="feedback">General feedback</option>
        <option value="bug">Report bug</option>
        <option value="improvement">Improvement idea</option>
      </select>
      <textarea
        name="message"
        className="h-36 w-full rounded-xl border bg-transparent p-4"
        style={{ borderColor: "var(--border)" }}
        placeholder="Describe your feedback"
        required
      />
      <input
        name="email"
        className="w-full rounded-xl border bg-transparent px-4 py-3"
        style={{ borderColor: "var(--border)" }}
        type="email"
        placeholder="Your email (optional)"
      />
      <button type="submit" className="btn btn-primary">Send</button>
      {state.ok ? <p className="text-sm text-green-600">Thanks! Your feedback has been submitted.</p> : null}
      {!state.ok && state.error ? <p className="text-sm text-red-500">{state.error}</p> : null}
    </form>
  );
}
