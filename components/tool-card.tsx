import Link from "next/link";
import type { ReactNode } from "react";
import type { Tool } from "@/data/tools";

export function ToolCard({
  tool,
  rightSlot,
}: {
  tool: Tool;
  rightSlot?: ReactNode;
}) {
  const isBusiness = tool.category === "Business";
  const isProTool = tool.slug === "pos-mvp";

  return (
    <article className="card group premium-card relative overflow-hidden p-4 transition duration-200 hover:-translate-y-1 hover:shadow-xl">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-blue-500 via-cyan-400 to-violet-500 opacity-80" />
      <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-blue-500/10 blur-2xl" />
      <div className="mb-3 flex items-start justify-between gap-2">
        <div className="flex flex-wrap gap-2">
          <span
            className="rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide"
            style={
              isBusiness
                ? {
                  borderColor: "color-mix(in oklab, #f59e0b 60%, var(--border))",
                  color: "#b45309",
                  background: "color-mix(in oklab, #fef3c7 70%, transparent)",
                }
                : { borderColor: "var(--border)", color: "var(--muted)" }
            }
          >
            {tool.category}
          </span>
          {isProTool ? (
            <span
              className="rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide"
              style={{
                borderColor: "color-mix(in oklab, #8b5cf6 60%, var(--border))",
                color: "#6d28d9",
                background: "color-mix(in oklab, #ede9fe 75%, transparent)",
              }}
            >
              Pro Tool
            </span>
          ) : null}
        </div>
        {rightSlot}
      </div>
      <Link href={`/tools/${tool.slug}`} className="block">
        <h3 className="text-base font-semibold sm:text-lg">{tool.name}</h3>
        <p className="mt-2 text-sm leading-6" style={{ color: "var(--muted)" }}>
          {tool.description}
        </p>
        <span className="mt-4 inline-block text-sm font-semibold text-blue-600 transition group-hover:translate-x-0.5 dark:text-blue-400">
          Open Tool →
        </span>
      </Link>
    </article>
  );
}
