import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  areAdminCredentialsValid,
  createAdminSessionToken,
  getAdminCookieName,
  getAdminCookieOptions,
  hasAdminCredentialsConfigured,
  sanitizeAdminNextPath,
  verifyAdminSessionToken,
} from "@/lib/admin-auth";

type LoginPageProps = {
  searchParams?: Promise<{
    error?: string;
    next?: string;
  }>;
};

export default async function AdminLoginPage({ searchParams }: LoginPageProps) {
  const resolvedSearchParams = (await searchParams) ?? {};
  const cookieStore = await cookies();
  const existingToken = cookieStore.get(getAdminCookieName())?.value;

  if (await verifyAdminSessionToken(existingToken)) {
    redirect("/admin");
  }

  const nextPath = sanitizeAdminNextPath(resolvedSearchParams.next);
  const showInvalidCredentials = resolvedSearchParams.error === "invalid";
  const showConfigError = !hasAdminCredentialsConfigured();

  async function loginAction(formData: FormData) {
    "use server";

    const email = String(formData.get("email") ?? "");
    const password = String(formData.get("password") ?? "");
    const next = sanitizeAdminNextPath(String(formData.get("next") ?? ""));

    if (!areAdminCredentialsValid(email, password)) {
      redirect(`/admin/login?error=invalid&next=${encodeURIComponent(next)}`);
    }

    const token = await createAdminSessionToken(email.trim().toLowerCase());
    if (!token) {
      redirect(`/admin/login?error=invalid&next=${encodeURIComponent(next)}`);
    }

    const store = await cookies();
    store.set(getAdminCookieName(), token, getAdminCookieOptions());
    redirect(next);
  }

  return (
    <main className="container section-y">
      <div className="mx-auto max-w-md card p-4 sm:p-6" style={{ borderColor: "var(--border)" }}>
        <h1 className="text-2xl font-bold">Admin Login</h1>
        <p className="mt-2 text-sm leading-6" style={{ color: "var(--muted)" }}>
          Sign in to access ToolHub admin routes.
        </p>

        {showConfigError ? (
          <p className="mt-4 rounded-md border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-200">
            Admin authentication is not configured. Please set ADMIN_EMAIL,
            ADMIN_PASSWORD, and ADMIN_AUTH_SECRET.
          </p>
        ) : null}

        {!showConfigError && showInvalidCredentials ? (
          <p className="mt-4 rounded-md border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-200">
            Invalid email or password.
          </p>
        ) : null}

        <form action={loginAction} className="mt-6 space-y-4">
          <input type="hidden" name="next" value={nextPath} />

          <div>
            <label htmlFor="email" className="mb-1 block text-sm font-medium">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="username"
              className="field text-sm outline-none"
              style={{ borderColor: "var(--border)" }}
            />
          </div>

          <div>
            <label htmlFor="password" className="mb-1 block text-sm font-medium">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              className="field text-sm outline-none"
              style={{ borderColor: "var(--border)" }}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary w-full"
            disabled={showConfigError}
          >
            Sign in
          </button>
        </form>
      </div>
    </main>
  );
}
