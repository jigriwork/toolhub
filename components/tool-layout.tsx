import type { ReactNode } from "react";
import Link from "next/link";
import { AdPlaceholder } from "@/components/ad-placeholder";
import { ToolBadge } from "@/components/tool-badge";
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

  const trustByCategory: Record<string, string> = {
    Business:
      "Built for practical business workflows with clear outputs you can use in operations immediately.",
    Creative:
      "Designed for premium-ready campaign assets with clean visuals and fast export control.",
    "Image & PDF":
      "Optimized for secure browser-side processing so your files stay private and downloadable quickly.",
    Essentials:
      "Focused on quick daily utility with clear inputs, accurate output, and copy-ready results.",
  };

  const introText = tool?.description ?? description;
  const trustLine = tool ? trustByCategory[tool.category] : "";

  return (
    <main className="container section-y">
      <header className="mb-6 space-y-4 sm:mb-8">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <h1 className="page-title font-bold">{title}</h1>
          <ToolPageActions slug={slug} />
        </div>

        {tool ? (
          <div className="flex flex-wrap gap-2">
            <ToolBadge label={tool.category} />
            {tool.badges?.map((badge) => <ToolBadge key={badge} label={badge} />)}
          </div>
        ) : null}

        <div className="card rounded-2xl p-4 sm:p-5">
          <p className="text-sm font-semibold sm:text-base">What this tool does</p>
          <p className="mt-1 text-sm leading-6 sm:text-base" style={{ color: "var(--muted)" }}>
            {introText}
          </p>
          {trustLine ? (
            <p className="mt-2 text-xs sm:text-sm" style={{ color: "var(--muted)" }}>
              {trustLine}
            </p>
          ) : null}
        </div>
      </header>

      <div className="card premium-card p-4 sm:p-6">{children}</div>

      {relatedTools.length > 0 && (
        <section className="mt-8">
          <h2 className="text-xl font-semibold">Related Tools</h2>
          <p className="mt-1 text-sm" style={{ color: "var(--muted)" }}>
            Continue your workflow with these relevant tools.
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {relatedTools.map((relatedTool) => (
              <Link
                key={relatedTool.slug}
                href={`/tools/${relatedTool.slug}`}
                className="rounded-xl border p-4 transition hover:-translate-y-0.5 hover:shadow-md"
                style={{ borderColor: "var(--border)", background: "color-mix(in oklab, var(--card) 90%, transparent)" }}
              >
                <div className="mb-2 flex flex-wrap gap-2">
                  <ToolBadge label={relatedTool.category} />
                  {relatedTool.badges?.map((badge) => (
                    <ToolBadge key={`${relatedTool.slug}-${badge}`} label={badge} />
                  ))}
                </div>
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
        <section className="mt-8 card premium-card p-4 sm:p-6">
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
