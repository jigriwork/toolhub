import { NextResponse } from "next/server";

function isValidHttpUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { url?: string };
    const longUrl = body.url?.trim() ?? "";

    if (!isValidHttpUrl(longUrl)) {
      return NextResponse.json({ ok: false, error: "Invalid URL" }, { status: 400 });
    }

    const response = await fetch(
      `https://tinyurl.com/api-create.php?url=${encodeURIComponent(longUrl)}`,
      { cache: "no-store" },
    );

    const shortUrl = (await response.text()).trim();

    if (!response.ok || !shortUrl.startsWith("http")) {
      return NextResponse.json(
        { ok: false, error: "Unable to shorten URL" },
        { status: 502 },
      );
    }

    return NextResponse.json({ ok: true, shortUrl });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Unable to shorten URL" },
      { status: 500 },
    );
  }
}
