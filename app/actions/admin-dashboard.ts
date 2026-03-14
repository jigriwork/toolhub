"use server";

import { revalidatePath } from "next/cache";
import {
  deleteAdminResource,
  deleteAdminTool,
  getToolCategoryOptions,
  updateFeedbackStatus,
  updateRequestStatus,
  upsertAdminResource,
  upsertAdminTool,
} from "@/lib/admin-db";

const FEEDBACK_STATUSES = new Set(["new", "in_progress", "resolved"]);
const REQUEST_STATUSES = new Set([
  "new",
  "planned",
  "in_progress",
  "completed",
  "rejected",
]);

export async function updateFeedbackStatusAction(formData: FormData) {
  const id = Number(formData.get("id"));
  const status = String(formData.get("status") ?? "");

  if (!Number.isFinite(id) || !FEEDBACK_STATUSES.has(status)) {
    return;
  }

  await updateFeedbackStatus(id, status as "new" | "in_progress" | "resolved");
  revalidatePath("/admin");
}

export async function updateRequestStatusAction(formData: FormData) {
  const id = Number(formData.get("id"));
  const status = String(formData.get("status") ?? "");

  if (!Number.isFinite(id) || !REQUEST_STATUSES.has(status)) {
    return;
  }

  await updateRequestStatus(
    id,
    status as "new" | "planned" | "in_progress" | "completed" | "rejected",
  );
  revalidatePath("/admin");
}

export async function upsertToolAction(formData: FormData) {
  const slug = String(formData.get("slug") ?? "").trim();
  const name = String(formData.get("name") ?? "").trim();
  const category = String(formData.get("category") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const seoDescription = String(formData.get("seoDescription") ?? "").trim();
  const featured = String(formData.get("featured") ?? "") === "on";

  if (!slug || !name || !description || !seoDescription) return;

  const categories = getToolCategoryOptions();
  if (!categories.includes(category as (typeof categories)[number])) {
    return;
  }

  await upsertAdminTool({
    slug,
    name,
    category,
    description,
    seoDescription,
    featured,
  });
  revalidatePath("/admin");
}

export async function upsertResourceAction(formData: FormData) {
  const slug = String(formData.get("slug") ?? "").trim();
  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const excerpt = String(formData.get("excerpt") ?? "").trim();
  const publishedAt = String(formData.get("publishedAt") ?? "").trim();

  if (!slug || !title || !description || !excerpt || !publishedAt) return;

  await upsertAdminResource({
    slug,
    title,
    description,
    excerpt,
    publishedAt,
  });
  revalidatePath("/admin");
}

export async function deleteToolAction(formData: FormData) {
  const slug = String(formData.get("slug") ?? "").trim();
  if (!slug) return;
  await deleteAdminTool(slug);
  revalidatePath("/admin");
}

export async function deleteResourceAction(formData: FormData) {
  const slug = String(formData.get("slug") ?? "").trim();
  if (!slug) return;
  await deleteAdminResource(slug);
  revalidatePath("/admin");
}
