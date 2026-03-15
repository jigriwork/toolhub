"use client";

import { useActionState } from "react";

type RequestToolState = {
  ok: boolean;
  error?: string;
};

type RequestToolFormProps = {
  action: (formData: FormData) => Promise<RequestToolState>;
};

const initialState: RequestToolState = { ok: false };

export function RequestToolForm({ action }: RequestToolFormProps) {
  const [state, formAction] = useActionState(
    async (_prevState: RequestToolState, formData: FormData) => action(formData),
    initialState,
  );

  return (
    <form className="card mt-6 max-w-2xl space-y-4 p-4 sm:p-6" action={formAction}>
      <input
        name="toolName"
        className="field"
        style={{ borderColor: "var(--border)" }}
        placeholder="Tool name"
        required
      />
      <textarea
        name="useCase"
        className="textarea"
        style={{ borderColor: "var(--border)" }}
        placeholder="Describe your use case"
        required
      />
      <input
        name="email"
        className="field"
        style={{ borderColor: "var(--border)" }}
        type="email"
        placeholder="Your email (optional)"
      />
      <button type="submit" className="btn btn-primary">Submit Request</button>
      {state.ok ? <p className="text-sm text-green-600">Thanks! Your request has been recorded.</p> : null}
      {!state.ok && state.error ? <p className="text-sm text-red-500">{state.error}</p> : null}
    </form>
  );
}
