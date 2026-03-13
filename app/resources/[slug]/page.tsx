import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getResourceBySlug, resources } from "@/data/resources";
import { getToolBySlug } from "@/data/tools";

export async function generateStaticParams() {
  return resources.map((resource) => ({ slug: resource.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = getResourceBySlug(slug);
  if (!article) return {};
  return {
    title: article.title,
    description: article.description,
  };
}

export default async function ResourceArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = getResourceBySlug(slug);

  if (!article) {
    notFound();
  }

  const relatedArticles = resources.filter((item) => item.slug !== article.slug).slice(0, 3);

  return (
    <main className="container py-10">
      <article className="mx-auto max-w-3xl">
        <p className="text-xs" style={{ color: "var(--muted)" }}>
          {new Date(article.publishedAt).toLocaleDateString()}
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight">{article.title}</h1>
        <p className="mt-3 text-base" style={{ color: "var(--muted)" }}>
          {article.description}
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          {article.toolSlugs.map((slugValue) => {
            const tool = getToolBySlug(slugValue);
            if (!tool) return null;
            return (
              <Link
                key={slugValue}
                href={`/tools/${slugValue}`}
                className="rounded-full border px-2.5 py-1 text-xs"
                style={{ borderColor: "var(--border)", color: "var(--muted)" }}
              >
                {tool.name}
              </Link>
            );
          })}
        </div>

        <div className="mt-8 space-y-4 text-base leading-7">
          {article.content.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </article>

      <section className="mx-auto mt-10 max-w-3xl">
        <h2 className="text-xl font-semibold">Related resources</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {relatedArticles.map((related) => (
            <Link
              key={related.slug}
              href={`/resources/${related.slug}`}
              className="rounded-xl border p-4 text-sm transition hover:-translate-y-0.5 hover:shadow-md"
              style={{ borderColor: "var(--border)" }}
            >
              {related.title}
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
