import type { ReactNode } from "react";

export function ToolResultCard({
  icon,
  label,
  value,
  helpText,
}: {
  icon?: string;
  label: string;
  value: ReactNode;
  helpText?: string;
}) {
  return (
    <div className="rounded-2xl border p-4 shadow-sm" style={{ borderColor: "var(--border)", background: "color-mix(in oklab, var(--card) 92%, transparent)" }}>
      <p className="text-xs uppercase tracking-[0.16em]" style={{ color: "var(--muted)" }}>
        {icon ? `${icon} ` : ""}
        {label}
      </p>
      <p className="mt-1 text-xl font-semibold sm:text-2xl break-words">{value}</p>
      {helpText ? (
        <p className="mt-1 text-xs leading-5" style={{ color: "var(--muted)" }}>
          {helpText}
        </p>
      ) : null}
    </div>
  );
}
