import { NextResponse } from "next/server";
import { createAnalyticsEvent, isPostgresConfigured } from "@/lib/admin-db";

const ALLOWED_EVENTS = new Set([
  "tool_visit",
  "search",
  "favorite_toggle",
  "recent_interaction",
]);

export async function POST(request: Request) {
  if (!isPostgresConfigured()) {
    return NextResponse.json({ ok: true, skipped: true });
  }

  try {
    const body = (await request.json()) as {
      eventType?: string;
      slug?: string;
      term?: string;
      metadata?: Record<string, unknown>;
    };

    const eventType = body.eventType?.trim();
    if (!eventType || !ALLOWED_EVENTS.has(eventType)) {
      return NextResponse.json({ ok: false, error: "Invalid event type" }, { status: 400 });
    }

    await createAnalyticsEvent({
      eventType,
      slug: body.slug?.trim() || undefined,
      term: body.term?.trim().toLowerCase() || undefined,
      metadata: body.metadata ?? {},
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
