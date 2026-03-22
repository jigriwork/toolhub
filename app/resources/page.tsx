import type { Metadata } from "next";
import Link from "next/link";
import {
  resources,
  type ResourceArticle,
} from "../../data/resources";
import { getToolBySlug } from "@/data/tools";

export const metadata: Metadata = {
  title: "Resources",
  description:
    "Actionable business guides for invoicing, quotations, GST billing, festival creatives, and daily operations on toolhubsite.",
  alternates: {
    canonical: "/resources",
  },
};

export default function ResourcesPage() {
  return (
    <main className="container section-y">
      <h1 className="page-title font-bold tracking-tight">Resources</h1>
      <p className="page-lead text-sm sm:text-base">
        Practical guides and tutorials to help you get more value from toolhubsite.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {resources.map((article: ResourceArticle) => (
          <article key={article.slug} className="card p-4 sm:p-5">
            <p className="text-xs" style={{ color: "var(--muted)" }}>
              {new Date(article.publishedAt).toLocaleDateString()}
            </p>
            <h2 className="mt-2 text-lg font-semibold sm:text-xl">{article.title}</h2>
            <p className="mt-2 text-sm leading-6" style={{ color: "var(--muted)" }}>
              {article.excerpt}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {article.toolSlugs.slice(0, 3).map((slug: string) => {
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
