"use server";

type SubmissionState = {
  ok: boolean;
  error?: string;
};

function getValue(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

export async function submitFeedbackAction(formData: FormData): Promise<SubmissionState> {
  const type = getValue(formData, "type");
  const message = getValue(formData, "message");

  if (!type) {
    return { ok: false, error: "Please select feedback type." };
  }

  if (!message || message.length < 10) {
    return {
      ok: false,
      error: "Please enter at least 10 characters so we can understand your feedback.",
    };
  }

  // Foundation-safe no-op handler for production readiness until DB wiring is added.
  return { ok: true };
}

export async function submitToolRequestAction(formData: FormData): Promise<SubmissionState> {
  const toolName = getValue(formData, "toolName");
  const useCase = getValue(formData, "useCase");

  if (!toolName) {
    return { ok: false, error: "Please enter a tool name." };
  }

  if (!useCase || useCase.length < 10) {
    return {
      ok: false,
      error: "Please describe your use case in at least 10 characters.",
    };
  }

  // Foundation-safe no-op handler for production readiness until DB wiring is added.
  return { ok: true };
}
