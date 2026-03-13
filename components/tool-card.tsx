import Link from "next/link";
import type { Tool } from "@/data/tools";

export function ToolCard({ tool }: { tool: Tool }) {
  return (
    <Link
      href={`/tools/${tool.slug}`}
      className="card block p-5 transition hover:-translate-y-0.5 hover:shadow-md"
    >
      <h3 className="text-lg font-semibold">{tool.name}</h3>
      <p className="mt-2 text-sm" style={{ color: "var(--muted)" }}>
        {tool.description}
      </p>
      <span className="mt-4 inline-block text-sm font-semibold text-blue-600">
        Open Tool →
      </span>
    </Link>
  );
}
