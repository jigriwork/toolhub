import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getResourceBySlug,
  resources,
  type ResourceArticle,
} from "../../../data/resources";
import { getToolBySlug } from "@/data/tools";

export async function generateStaticParams() {
  return resources.map((resource: ResourceArticle) => ({ slug: resource.slug }));
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
    alternates: {
      canonical: `/resources/${article.slug}`,
    },
    openGraph: {
      title: `${article.title} | toolhubsite`,
      description: article.description,
      url: `https://www.toolhubsite.in/resources/${article.slug}`,
      type: "article",
    },
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

  const relatedArticles = resources
    .filter((item: ResourceArticle) => item.slug !== article.slug)
    .slice(0, 3);

  return (
    <main className="container section-y">
      <article className="mx-auto max-w-3xl">
        <p className="text-xs" style={{ color: "var(--muted)" }}>
          {new Date(article.publishedAt).toLocaleDateString()}
        </p>
        <h1 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">{article.title}</h1>
        <p className="mt-3 text-sm sm:text-base" style={{ color: "var(--muted)" }}>
          {article.description}
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          {article.toolSlugs.map((slugValue: string) => {
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

        <div className="mt-8 space-y-8 text-[15px] leading-7 sm:text-base">
          {article.sections.map((section: ResourceArticle["sections"][number]) => (
            <section key={section.heading} className="space-y-3">
              <h2 className="text-lg font-semibold sm:text-xl">{section.heading}</h2>
              {section.paragraphs.map((paragraph: string) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </section>
          ))}
        </div>
      </article>

      <section className="mx-auto mt-10 max-w-3xl">
        <h2 className="text-xl font-semibold">Related resources</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {relatedArticles.map((related: ResourceArticle) => (
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
