import { sql } from "@vercel/postgres";
import { resources } from "@/data/resources";
import { tools, toolCategories } from "@/data/tools";

type FeedbackStatus = "new" | "in_progress" | "resolved";
type RequestStatus = "new" | "planned" | "in_progress" | "completed" | "rejected";

let schemaReadyPromise: Promise<void> | null = null;

export function isPostgresConfigured() {
  return Boolean(process.env.POSTGRES_URL);
}

function getTodayDate() {
  return new Date().toISOString().slice(0, 10);
}

async function seedInitialContentIfNeeded() {
  const toolsCount = await sql<{ count: string }>`SELECT COUNT(*)::text AS count FROM admin_tools`;
  if (Number(toolsCount.rows[0]?.count ?? "0") === 0) {
    for (const tool of tools) {
      await sql`
        INSERT INTO admin_tools (
          slug,
          name,
          category,
          description,
          seo_description,
          featured,
          related_json,
          faqs_json
        )
        VALUES (
          ${tool.slug},
          ${tool.name},
          ${tool.category},
          ${tool.description},
          ${tool.seoDescription},
          ${Boolean(tool.featured)},
          ${JSON.stringify(tool.related)},
          ${JSON.stringify(tool.faqs)}
        )
      `;
    }
  }

  const resourcesCount = await sql<{ count: string }>`SELECT COUNT(*)::text AS count FROM admin_resources`;
  if (Number(resourcesCount.rows[0]?.count ?? "0") === 0) {
    for (const article of resources) {
      await sql`
        INSERT INTO admin_resources (
          slug,
          title,
          description,
          excerpt,
          published_at,
          tool_slugs_json,
          content_json
        )
        VALUES (
          ${article.slug},
          ${article.title},
          ${article.description},
          ${article.excerpt},
          ${article.publishedAt},
          ${JSON.stringify(article.toolSlugs)},
          ${JSON.stringify(article.sections)}
        )
      `;
    }
  }
}

export async function ensureAdminSchema() {
  if (!isPostgresConfigured()) {
    throw new Error("POSTGRES_URL is not configured.");
  }

  if (!schemaReadyPromise) {
    schemaReadyPromise = (async () => {
      await sql`
        CREATE TABLE IF NOT EXISTS feedback_submissions (
          id BIGSERIAL PRIMARY KEY,
          type TEXT NOT NULL,
          message TEXT NOT NULL,
          email TEXT,
          status TEXT NOT NULL DEFAULT 'new',
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
      `;

      await sql`
        CREATE TABLE IF NOT EXISTS tool_requests (
          id BIGSERIAL PRIMARY KEY,
          tool_name TEXT NOT NULL,
          use_case TEXT NOT NULL,
          email TEXT,
          status TEXT NOT NULL DEFAULT 'new',
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
      `;

      await sql`
        CREATE TABLE IF NOT EXISTS analytics_events (
          id BIGSERIAL PRIMARY KEY,
          event_type TEXT NOT NULL,
          slug TEXT,
          term TEXT,
          metadata_json JSONB,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
      `;

      await sql`
        CREATE TABLE IF NOT EXISTS admin_tools (
          id BIGSERIAL PRIMARY KEY,
          slug TEXT NOT NULL UNIQUE,
          name TEXT NOT NULL,
          category TEXT NOT NULL,
          description TEXT NOT NULL,
          seo_description TEXT NOT NULL,
          featured BOOLEAN NOT NULL DEFAULT FALSE,
          related_json JSONB NOT NULL DEFAULT '[]'::jsonb,
          faqs_json JSONB NOT NULL DEFAULT '[]'::jsonb,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
      `;

      await sql`
        CREATE TABLE IF NOT EXISTS admin_resources (
          id BIGSERIAL PRIMARY KEY,
          slug TEXT NOT NULL UNIQUE,
          title TEXT NOT NULL,
          description TEXT NOT NULL,
          excerpt TEXT NOT NULL,
          published_at DATE NOT NULL,
          tool_slugs_json JSONB NOT NULL DEFAULT '[]'::jsonb,
          content_json JSONB NOT NULL DEFAULT '[]'::jsonb,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
      `;

      await seedInitialContentIfNeeded();
    })();
  }

  await schemaReadyPromise;
}

export async function createFeedbackSubmission(input: {
  type: string;
  message: string;
  email?: string;
}) {
  await ensureAdminSchema();
  await sql`
    INSERT INTO feedback_submissions (type, message, email)
    VALUES (${input.type}, ${input.message}, ${input.email ?? null})
  `;
}

export async function createToolRequest(input: {
  toolName: string;
  useCase: string;
  email?: string;
}) {
  await ensureAdminSchema();
  await sql`
    INSERT INTO tool_requests (tool_name, use_case, email)
    VALUES (${input.toolName}, ${input.useCase}, ${input.email ?? null})
  `;
}

export async function createAnalyticsEvent(input: {
  eventType: string;
  slug?: string;
  term?: string;
  metadata?: Record<string, unknown>;
}) {
  await ensureAdminSchema();
  await sql`
    INSERT INTO analytics_events (event_type, slug, term, metadata_json)
    VALUES (
      ${input.eventType},
      ${input.slug ?? null},
      ${input.term ?? null},
      ${JSON.stringify(input.metadata ?? {})}
    )
  `;
}

export async function getAdminDashboardData() {
  await ensureAdminSchema();

  const [
    feedbackRows,
    requestRows,
    toolRows,
    resourceRows,
    recentAnalyticsRows,
    analyticsDaily,
    topTools,
    topSearchTerms,
  ] = await Promise.all([
    sql<{
      id: number;
      type: string;
      message: string;
      email: string | null;
      status: FeedbackStatus;
      created_at: string;
    }>`
      SELECT id, type, message, email, status, created_at
      FROM feedback_submissions
      ORDER BY created_at DESC
      LIMIT 50
    `,
    sql<{
      id: number;
      tool_name: string;
      use_case: string;
      email: string | null;
      status: RequestStatus;
      created_at: string;
    }>`
      SELECT id, tool_name, use_case, email, status, created_at
      FROM tool_requests
      ORDER BY created_at DESC
      LIMIT 50
    `,
    sql<{
      id: number;
      slug: string;
      name: string;
      category: string;
      featured: boolean;
      description: string;
      seo_description: string;
      updated_at: string;
    }>`
      SELECT id, slug, name, category, featured, description, seo_description, updated_at
      FROM admin_tools
      ORDER BY updated_at DESC
      LIMIT 100
    `,
    sql<{
      id: number;
      slug: string;
      title: string;
      excerpt: string;
      published_at: string;
      updated_at: string;
    }>`
      SELECT id, slug, title, excerpt, published_at, updated_at
      FROM admin_resources
      ORDER BY updated_at DESC
      LIMIT 100
    `,
    sql<{
      id: number;
      event_type: string;
      slug: string | null;
      term: string | null;
      created_at: string;
    }>`
      SELECT id, event_type, slug, term, created_at
      FROM analytics_events
      ORDER BY created_at DESC
      LIMIT 100
    `,
    sql<{ date: string; count: string }>`
      SELECT DATE(created_at)::text AS date, COUNT(*)::text AS count
      FROM analytics_events
      WHERE created_at >= NOW() - INTERVAL '30 days'
      GROUP BY DATE(created_at)
      ORDER BY DATE(created_at) DESC
      LIMIT 30
    `,
    sql<{ slug: string; count: string }>`
      SELECT slug, COUNT(*)::text AS count
      FROM analytics_events
      WHERE event_type = 'tool_visit' AND slug IS NOT NULL
      GROUP BY slug
      ORDER BY COUNT(*) DESC
      LIMIT 10
    `,
    sql<{ term: string; count: string }>`
      SELECT term, COUNT(*)::text AS count
      FROM analytics_events
      WHERE event_type = 'search' AND term IS NOT NULL
      GROUP BY term
      ORDER BY COUNT(*) DESC
      LIMIT 10
    `,
  ]);

  const [feedbackCount, requestCount, todayEventsCount] = await Promise.all([
    sql<{ count: string }>`SELECT COUNT(*)::text AS count FROM feedback_submissions`,
    sql<{ count: string }>`SELECT COUNT(*)::text AS count FROM tool_requests`,
    sql<{ count: string }>`
      SELECT COUNT(*)::text AS count
      FROM analytics_events
      WHERE DATE(created_at) = ${getTodayDate()}
    `,
  ]);

  return {
    feedback: feedbackRows.rows,
    requests: requestRows.rows,
    tools: toolRows.rows,
    resources: resourceRows.rows,
    analytics: {
      recentEvents: recentAnalyticsRows.rows,
      daily: analyticsDaily.rows.map((row) => ({ date: row.date, count: Number(row.count) })),
      topTools: topTools.rows.map((row) => ({ slug: row.slug, count: Number(row.count) })),
      topSearchTerms: topSearchTerms.rows.map((row) => ({ term: row.term, count: Number(row.count) })),
      todayEvents: Number(todayEventsCount.rows[0]?.count ?? "0"),
    },
    totals: {
      feedback: Number(feedbackCount.rows[0]?.count ?? "0"),
      requests: Number(requestCount.rows[0]?.count ?? "0"),
      tools: toolRows.rows.length,
      resources: resourceRows.rows.length,
    },
  };
}

export async function updateFeedbackStatus(id: number, status: FeedbackStatus) {
  await ensureAdminSchema();
  await sql`
    UPDATE feedback_submissions
    SET status = ${status}, updated_at = NOW()
    WHERE id = ${id}
  `;
}

export async function updateRequestStatus(id: number, status: RequestStatus) {
  await ensureAdminSchema();
  await sql`
    UPDATE tool_requests
    SET status = ${status}, updated_at = NOW()
    WHERE id = ${id}
  `;
}

export async function upsertAdminTool(input: {
  slug: string;
  name: string;
  category: string;
  description: string;
  seoDescription: string;
  featured: boolean;
}) {
  await ensureAdminSchema();
  await sql`
    INSERT INTO admin_tools (slug, name, category, description, seo_description, featured)
    VALUES (
      ${input.slug},
      ${input.name},
      ${input.category},
      ${input.description},
      ${input.seoDescription},
      ${input.featured}
    )
    ON CONFLICT (slug)
    DO UPDATE SET
      name = EXCLUDED.name,
      category = EXCLUDED.category,
      description = EXCLUDED.description,
      seo_description = EXCLUDED.seo_description,
      featured = EXCLUDED.featured,
      updated_at = NOW()
  `;
}

export async function upsertAdminResource(input: {
  slug: string;
  title: string;
  description: string;
  excerpt: string;
  publishedAt: string;
}) {
  await ensureAdminSchema();
  await sql`
    INSERT INTO admin_resources (slug, title, description, excerpt, published_at)
    VALUES (
      ${input.slug},
      ${input.title},
      ${input.description},
      ${input.excerpt},
      ${input.publishedAt}
    )
    ON CONFLICT (slug)
    DO UPDATE SET
      title = EXCLUDED.title,
      description = EXCLUDED.description,
      excerpt = EXCLUDED.excerpt,
      published_at = EXCLUDED.published_at,
      updated_at = NOW()
  `;
}

export async function deleteAdminTool(slug: string) {
  await ensureAdminSchema();
  await sql`DELETE FROM admin_tools WHERE slug = ${slug}`;
}

export async function deleteAdminResource(slug: string) {
  await ensureAdminSchema();
  await sql`DELETE FROM admin_resources WHERE slug = ${slug}`;
}

export function getToolCategoryOptions() {
  return [...toolCategories];
}
