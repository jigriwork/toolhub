"use client";

import { useState } from "react";

export function FeedbackForm() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <form
      className="card mt-6 max-w-2xl space-y-4 p-6"
      onSubmit={(event) => {
        event.preventDefault();
        setSubmitted(true);
      }}
    >
      <select className="w-full rounded-xl border bg-transparent px-4 py-3" style={{ borderColor: "var(--border)" }} defaultValue="feedback">
        <option value="feedback">General feedback</option>
        <option value="bug">Report bug</option>
        <option value="improvement">Improvement idea</option>
      </select>
      <textarea className="h-36 w-full rounded-xl border bg-transparent p-4" style={{ borderColor: "var(--border)" }} placeholder="Describe your feedback" required />
      <input className="w-full rounded-xl border bg-transparent px-4 py-3" style={{ borderColor: "var(--border)" }} type="email" placeholder="Your email (optional)" />
      <button type="submit" className="btn btn-primary">Send</button>
      {submitted ? <p className="text-sm text-green-600">Thanks! Your feedback has been submitted.</p> : null}
    </form>
  );
}
