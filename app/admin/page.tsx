import {
  deleteResourceAction,
  deleteToolAction,
  updateFeedbackStatusAction,
  updateRequestStatusAction,
  upsertResourceAction,
  upsertToolAction,
} from "@/app/actions/admin-dashboard";
import { getAdminDashboardData, getToolCategoryOptions, isPostgresConfigured } from "@/lib/admin-db";

export const dynamic = "force-dynamic";

export default async function AdminIndexPage() {
  const postgresReady = isPostgresConfigured();

  if (!postgresReady) {
    return (
      <main className="container py-10">
        <div className="flex items-center justify-between gap-3">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <form action="/admin/logout" method="post">
            <button
              type="submit"
              className="rounded-md border px-3 py-1.5 text-sm font-medium"
              style={{ borderColor: "var(--border)" }}
            >
              Logout
            </button>
          </form>
        </div>
        <div className="mt-6 rounded-xl border p-5" style={{ borderColor: "var(--border)" }}>
          <h2 className="text-lg font-semibold">Database setup required</h2>
          <p className="mt-2 text-sm" style={{ color: "var(--muted)" }}>
            Connect Vercel Postgres and set <code>POSTGRES_URL</code> to enable
            dashboard persistence for analytics, feedback, requests, and content management.
          </p>
        </div>
      </main>
    );
  }

  const dashboard = await getAdminDashboardData();
  const categories = getToolCategoryOptions();

  return (
    <main className="container py-10 space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <form action="/admin/logout" method="post">
          <button
            type="submit"
            className="rounded-md border px-3 py-1.5 text-sm font-medium"
            style={{ borderColor: "var(--border)" }}
          >
            Logout
          </button>
        </form>
      </div>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <MetricCard label="Feedback" value={dashboard.totals.feedback} />
        <MetricCard label="Tool requests" value={dashboard.totals.requests} />
        <MetricCard label="Tracked tools" value={dashboard.totals.tools} />
        <MetricCard label="Tracked resources" value={dashboard.totals.resources} />
        <MetricCard label="Events today" value={dashboard.analytics.todayEvents} />
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border p-5" style={{ borderColor: "var(--border)" }}>
          <h2 className="text-xl font-semibold">Top tools</h2>
          <ul className="mt-4 space-y-2 text-sm">
            {dashboard.analytics.topTools.length === 0 ? (
              <li style={{ color: "var(--muted)" }}>No tool visits yet.</li>
            ) : (
              dashboard.analytics.topTools.map((row) => (
                <li key={row.slug} className="flex items-center justify-between rounded-md border px-3 py-2" style={{ borderColor: "var(--border)" }}>
                  <span>{row.slug}</span>
                  <span className="font-semibold">{row.count}</span>
                </li>
              ))
            )}
          </ul>
        </div>

        <div className="rounded-xl border p-5" style={{ borderColor: "var(--border)" }}>
          <h2 className="text-xl font-semibold">Top search terms</h2>
          <ul className="mt-4 space-y-2 text-sm">
            {dashboard.analytics.topSearchTerms.length === 0 ? (
              <li style={{ color: "var(--muted)" }}>No searches yet.</li>
            ) : (
              dashboard.analytics.topSearchTerms.map((row) => (
                <li key={row.term} className="flex items-center justify-between rounded-md border px-3 py-2" style={{ borderColor: "var(--border)" }}>
                  <span>{row.term}</span>
                  <span className="font-semibold">{row.count}</span>
                </li>
              ))
            )}
          </ul>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <div className="rounded-xl border p-5" style={{ borderColor: "var(--border)" }}>
          <h2 className="text-xl font-semibold">Feedback management</h2>
          <ul className="mt-4 space-y-3 text-sm">
            {dashboard.feedback.length === 0 ? (
              <li style={{ color: "var(--muted)" }}>No feedback yet.</li>
            ) : (
              dashboard.feedback.map((item) => (
                <li key={item.id} className="rounded-md border p-3" style={{ borderColor: "var(--border)" }}>
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-medium">{item.type}</p>
                    <span style={{ color: "var(--muted)" }}>{new Date(item.created_at).toLocaleString()}</span>
                  </div>
                  <p className="mt-2">{item.message}</p>
                  {item.email ? (
                    <p className="mt-1 text-xs" style={{ color: "var(--muted)" }}>
                      {item.email}
                    </p>
                  ) : null}
                  <form action={updateFeedbackStatusAction} className="mt-3 flex items-center gap-2">
                    <input type="hidden" name="id" value={item.id} />
                    <select name="status" defaultValue={item.status} className="rounded-md border px-2 py-1" style={{ borderColor: "var(--border)" }}>
                      <option value="new">new</option>
                      <option value="in_progress">in progress</option>
                      <option value="resolved">resolved</option>
                    </select>
                    <button className="rounded-md border px-3 py-1" style={{ borderColor: "var(--border)" }} type="submit">
                      Update
                    </button>
                  </form>
                </li>
              ))
            )}
          </ul>
        </div>

        <div className="rounded-xl border p-5" style={{ borderColor: "var(--border)" }}>
          <h2 className="text-xl font-semibold">Tool request management</h2>
          <ul className="mt-4 space-y-3 text-sm">
            {dashboard.requests.length === 0 ? (
              <li style={{ color: "var(--muted)" }}>No tool requests yet.</li>
            ) : (
              dashboard.requests.map((item) => (
                <li key={item.id} className="rounded-md border p-3" style={{ borderColor: "var(--border)" }}>
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-medium">{item.tool_name}</p>
                    <span style={{ color: "var(--muted)" }}>{new Date(item.created_at).toLocaleString()}</span>
                  </div>
                  <p className="mt-2">{item.use_case}</p>
                  {item.email ? (
                    <p className="mt-1 text-xs" style={{ color: "var(--muted)" }}>
                      {item.email}
                    </p>
                  ) : null}
                  <form action={updateRequestStatusAction} className="mt-3 flex items-center gap-2">
                    <input type="hidden" name="id" value={item.id} />
                    <select name="status" defaultValue={item.status} className="rounded-md border px-2 py-1" style={{ borderColor: "var(--border)" }}>
                      <option value="new">new</option>
                      <option value="planned">planned</option>
                      <option value="in_progress">in progress</option>
                      <option value="completed">completed</option>
                      <option value="rejected">rejected</option>
                    </select>
                    <button className="rounded-md border px-3 py-1" style={{ borderColor: "var(--border)" }} type="submit">
                      Update
                    </button>
                  </form>
                </li>
              ))
            )}
          </ul>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <div className="rounded-xl border p-5" style={{ borderColor: "var(--border)" }}>
          <h2 className="text-xl font-semibold">Tool controls (create/update)</h2>
          <form action={upsertToolAction} className="mt-4 space-y-3 text-sm">
            <input name="slug" placeholder="slug" className="w-full rounded-md border px-3 py-2" style={{ borderColor: "var(--border)" }} required />
            <input name="name" placeholder="name" className="w-full rounded-md border px-3 py-2" style={{ borderColor: "var(--border)" }} required />
            <select name="category" className="w-full rounded-md border px-3 py-2" style={{ borderColor: "var(--border)" }} required>
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <textarea name="description" placeholder="description" className="w-full rounded-md border px-3 py-2" style={{ borderColor: "var(--border)" }} required />
            <textarea name="seoDescription" placeholder="seo description" className="w-full rounded-md border px-3 py-2" style={{ borderColor: "var(--border)" }} required />
            <label className="inline-flex items-center gap-2"><input type="checkbox" name="featured" /> featured</label>
            <button type="submit" className="rounded-md border px-3 py-1.5" style={{ borderColor: "var(--border)" }}>Save tool</button>
          </form>

          <ul className="mt-5 space-y-2 text-sm">
            {dashboard.tools.slice(0, 20).map((tool) => (
              <li key={tool.slug} className="flex items-center justify-between rounded-md border px-3 py-2" style={{ borderColor: "var(--border)" }}>
                <span>{tool.name} ({tool.slug})</span>
                <form action={deleteToolAction}>
                  <input type="hidden" name="slug" value={tool.slug} />
                  <button type="submit" className="text-red-500">Delete</button>
                </form>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-xl border p-5" style={{ borderColor: "var(--border)" }}>
          <h2 className="text-xl font-semibold">Resource controls (create/update)</h2>
          <form action={upsertResourceAction} className="mt-4 space-y-3 text-sm">
            <input name="slug" placeholder="slug" className="w-full rounded-md border px-3 py-2" style={{ borderColor: "var(--border)" }} required />
            <input name="title" placeholder="title" className="w-full rounded-md border px-3 py-2" style={{ borderColor: "var(--border)" }} required />
            <textarea name="description" placeholder="description" className="w-full rounded-md border px-3 py-2" style={{ borderColor: "var(--border)" }} required />
            <textarea name="excerpt" placeholder="excerpt" className="w-full rounded-md border px-3 py-2" style={{ borderColor: "var(--border)" }} required />
            <input name="publishedAt" type="date" className="w-full rounded-md border px-3 py-2" style={{ borderColor: "var(--border)" }} required />
            <button type="submit" className="rounded-md border px-3 py-1.5" style={{ borderColor: "var(--border)" }}>Save resource</button>
          </form>

          <ul className="mt-5 space-y-2 text-sm">
            {dashboard.resources.slice(0, 20).map((item) => (
              <li key={item.slug} className="flex items-center justify-between rounded-md border px-3 py-2" style={{ borderColor: "var(--border)" }}>
                <span>{item.title}</span>
                <form action={deleteResourceAction}>
                  <input type="hidden" name="slug" value={item.slug} />
                  <button type="submit" className="text-red-500">Delete</button>
                </form>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
}

function MetricCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border p-4" style={{ borderColor: "var(--border)" }}>
      <p className="text-xs uppercase" style={{ color: "var(--muted)" }}>{label}</p>
      <p className="mt-1 text-2xl font-semibold">{value}</p>
    </div>
  );
}
