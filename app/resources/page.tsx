import type { Metadata } from "next";
import Link from "next/link";
import { resources } from "@/data/resources";
import { getToolBySlug } from "@/data/tools";

export const metadata: Metadata = {
  title: "Resources",
  description:
    "ToolHub resources with practical guides on SEO, text formatting, image optimization, and developer workflows.",
};

export default function ResourcesPage() {
  return (
    <main className="container py-10">
      <h1 className="text-3xl font-bold tracking-tight">Resources</h1>
      <p className="mt-2 text-sm sm:text-base" style={{ color: "var(--muted)" }}>
        Practical guides and tutorials to help you get more value from ToolHub.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {resources.map((article) => (
          <article key={article.slug} className="card p-5">
            <p className="text-xs" style={{ color: "var(--muted)" }}>
              {new Date(article.publishedAt).toLocaleDateString()}
            </p>
            <h2 className="mt-2 text-xl font-semibold">{article.title}</h2>
            <p className="mt-2 text-sm" style={{ color: "var(--muted)" }}>
              {article.excerpt}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {article.toolSlugs.slice(0, 3).map((slug) => {
                const tool = getToolBySlug(slug);
                if (!tool) return null;
                return (
                  <Link
                    key={slug}
                    href={`/tools/${slug}`}
                    className="rounded-full border px-2 py-1 text-xs"
                    style={{ borderColor: "var(--border)", color: "var(--muted)" }}
                  >
                    {tool.name}
                  </Link>
                );
              })}
            </div>
            <Link href={`/resources/${article.slug}`} className="mt-4 inline-block text-sm font-semibold text-blue-600">
              Read article →
            </Link>
          </article>
        ))}
      </div>
    </main>
  );
}
