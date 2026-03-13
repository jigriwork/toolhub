import type { ReactNode } from "react";
import { AdPlaceholder } from "@/components/ad-placeholder";

export function ToolLayout({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <main className="container py-10">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
        <p className="mt-2 text-sm sm:text-base" style={{ color: "var(--muted)" }}>
          {description}
        </p>
      </header>

      <div className="card p-6">{children}</div>

      <AdPlaceholder label="Tool Page Ad Slot" />
    </main>
  );
}
