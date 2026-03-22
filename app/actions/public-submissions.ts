"use server";

import { createFeedbackSubmission, createToolRequest } from "@/lib/admin-db";

export async function submitFeedbackAction(formData: FormData) {
  const type = String(formData.get("type") ?? "feedback").trim();
  const message = String(formData.get("message") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();

  if (!message) {
    return { ok: false, error: "Message is required." } as const;
  }

  try {
    await createFeedbackSubmission({
      type: type || "feedback",
      message,
      email: email || undefined,
    });
  } catch {
    return { ok: false, error: "Submission service is temporarily unavailable." } as const;
  }

  return { ok: true } as const;
}

export async function submitToolRequestAction(formData: FormData) {
  const toolName = String(formData.get("toolName") ?? "").trim();
  const useCase = String(formData.get("useCase") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();

  if (!toolName || !useCase) {
    return { ok: false, error: "Tool name and use case are required." } as const;
  }

  try {
    await createToolRequest({
      toolName,
      useCase,
      email: email || undefined,
    });
  } catch {
    return { ok: false, error: "Request service is temporarily unavailable." } as const;
  }

  return { ok: true } as const;
}
