"use client";

import { useState } from "react";

export function RequestToolForm() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <form
      className="card mt-6 max-w-2xl space-y-4 p-6"
      onSubmit={(event) => {
        event.preventDefault();
        setSubmitted(true);
      }}
    >
      <input className="w-full rounded-xl border bg-transparent px-4 py-3" style={{ borderColor: "var(--border)" }} placeholder="Tool name" required />
      <textarea className="h-36 w-full rounded-xl border bg-transparent p-4" style={{ borderColor: "var(--border)" }} placeholder="Describe your use case" required />
      <input className="w-full rounded-xl border bg-transparent px-4 py-3" style={{ borderColor: "var(--border)" }} type="email" placeholder="Your email (optional)" />
      <button type="submit" className="btn btn-primary">Submit Request</button>
      {submitted ? <p className="text-sm text-green-600">Thanks! Your request has been recorded.</p> : null}
    </form>
  );
}
