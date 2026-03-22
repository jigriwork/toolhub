import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { getAdminCookieName } from "@/lib/admin-auth";

function clearAdminSessionCookie(response: NextResponse) {
  response.cookies.set(getAdminCookieName(), "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}

export async function GET(request: Request) {
  const url = new URL("/admin/login", request.url);
  const response = NextResponse.redirect(url);
  clearAdminSessionCookie(response);
  return response;
}

export async function POST(request: Request) {
  const store = await cookies();
  store.delete(getAdminCookieName());

  const url = new URL("/admin/login", request.url);
  const response = NextResponse.redirect(url);
  clearAdminSessionCookie(response);
  return response;
}
