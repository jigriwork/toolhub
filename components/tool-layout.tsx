import type { ReactNode } from "react";
import Link from "next/link";
import { AdPlaceholder } from "@/components/ad-placeholder";
import { ToolPageActions } from "@/components/tool-page-actions";
import { getToolBySlug, tools } from "@/data/tools";

export function ToolLayout({
  slug,
  title,
  description,
  children,
}: {
  slug: string;
  title: string;
  description: string;
  children: ReactNode;
}) {
  const tool = getToolBySlug(slug);
  const relatedTools = tool
    ? tool.related
      .map((relatedSlug) => getToolBySlug(relatedSlug))
      .filter((item): item is NonNullable<typeof item> => Boolean(item))
    : tools.slice(0, 3);
  const businessSuiteTools =
    tool?.category === "Business"
      ? tools.filter(
        (item) =>
          item.category === "Business" &&
          item.slug !== slug &&
          !relatedTools.some((related) => related.slug === item.slug),
      )
      : [];

  return (
    <main className="container section-y">
      <header className="mb-6 space-y-3 sm:mb-8">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <h1 className="page-title font-bold">{title}</h1>
          <ToolPageActions slug={slug} />
        </div>
        <p className="page-lead w-full">
          {description}
        </p>
      </header>

      <div className="card p-4 sm:p-6">{children}</div>

      {relatedTools.length > 0 && (
        <section className="mt-8">
          <h2 className="text-xl font-semibold">Related Tools</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {relatedTools.map((relatedTool) => (
              <Link
                key={relatedTool.slug}
                href={`/tools/${relatedTool.slug}`}
                className="rounded-xl border p-4 transition hover:-translate-y-0.5 hover:shadow-md"
                style={{ borderColor: "var(--border)", background: "color-mix(in oklab, var(--card) 90%, transparent)" }}
              >
                <p className="font-semibold">{relatedTool.name}</p>
                <p className="mt-1 text-sm leading-6" style={{ color: "var(--muted)" }}>
                  {relatedTool.description}
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {businessSuiteTools.length > 0 && (
        <section className="mt-8">
          <h2 className="text-xl font-semibold">Business Suite</h2>
          <p className="mt-1 text-sm" style={{ color: "var(--muted)" }}>
            Pair this tool with other business-focused creators in ToolHub.
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {businessSuiteTools.map((suiteTool) => (
              <Link
                key={suiteTool.slug}
                href={`/tools/${suiteTool.slug}`}
                className="rounded-xl border p-4 transition hover:-translate-y-0.5 hover:shadow-md"
                style={{ borderColor: "var(--border)", background: "color-mix(in oklab, var(--card) 90%, transparent)" }}
              >
                <p className="font-semibold">{suiteTool.name}</p>
                <p className="mt-1 text-sm leading-6" style={{ color: "var(--muted)" }}>
                  {suiteTool.description}
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {tool && tool.faqs.length > 0 && (
        <section className="mt-8 card p-4 sm:p-6">
          <h2 className="text-xl font-semibold">Frequently Asked Questions</h2>
          <div className="mt-4 space-y-4">
            {tool.faqs.map((faq) => (
              <details
                key={faq.question}
                className="rounded-xl border p-4"
                style={{ borderColor: "var(--border)" }}
              >
                <summary className="cursor-pointer list-none font-medium">
                  {faq.question}
                </summary>
                <p className="mt-2 text-sm leading-6" style={{ color: "var(--muted)" }}>
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "FAQPage",
                mainEntity: tool.faqs.map((faq) => ({
                  "@type": "Question",
                  name: faq.question,
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: faq.answer,
                  },
                })),
              }),
            }}
          />
        </section>
      )}

      <AdPlaceholder label="Tool Page Ad Slot" />
    </main>
  );
}
