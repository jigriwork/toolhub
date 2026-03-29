import type { ToolCategory } from "@/data/tools";

type BadgeVariant = ToolCategory | "Pro Tool" | "Quick Tool";

const badgeStyles: Record<BadgeVariant, { borderColor: string; color: string; background: string }> = {
  Business: {
    borderColor: "color-mix(in oklab, #f59e0b 55%, var(--border))",
    color: "#b45309",
    background: "color-mix(in oklab, #fef3c7 72%, transparent)",
  },
  Creative: {
    borderColor: "color-mix(in oklab, #8b5cf6 50%, var(--border))",
    color: "#6d28d9",
    background: "color-mix(in oklab, #ede9fe 72%, transparent)",
  },
  "Image & PDF": {
    borderColor: "color-mix(in oklab, #0ea5e9 52%, var(--border))",
    color: "#0369a1",
    background: "color-mix(in oklab, #e0f2fe 74%, transparent)",
  },
  Essentials: {
    borderColor: "color-mix(in oklab, #64748b 45%, var(--border))",
    color: "#475569",
    background: "color-mix(in oklab, #e2e8f0 68%, transparent)",
  },
  "Pro Tool": {
    borderColor: "color-mix(in oklab, #8b5cf6 60%, var(--border))",
    color: "#6d28d9",
    background: "color-mix(in oklab, #ede9fe 75%, transparent)",
  },
  "Quick Tool": {
    borderColor: "color-mix(in oklab, #0891b2 52%, var(--border))",
    color: "#155e75",
    background: "color-mix(in oklab, #cffafe 72%, transparent)",
  },
};

export function ToolBadge({ label }: { label: BadgeVariant }) {
  return (
    <span
      className="rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide"
      style={badgeStyles[label]}
    >
      {label}
    </span>
  );
}
