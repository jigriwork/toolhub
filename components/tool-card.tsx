import Link from "next/link";
import type { ReactNode } from "react";
import type { Tool } from "@/data/tools";
import { ToolBadge } from "@/components/tool-badge";

export function ToolCard({
  tool,
  rightSlot,
}: {
  tool: Tool;
  rightSlot?: ReactNode;
}) {
  return (
    <article className="card group premium-card relative overflow-hidden p-4 transition duration-200 hover:-translate-y-1 hover:shadow-xl">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-blue-500 via-cyan-400 to-violet-500 opacity-80" />
      <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-blue-500/10 blur-2xl" />
      <div className="mb-3 flex items-start justify-between gap-2">
        <div className="flex flex-wrap gap-2">
          <ToolBadge label={tool.category} />
          {tool.badges?.map((badge) => <ToolBadge key={badge} label={badge} />)}
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
