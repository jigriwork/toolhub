export function AdPlaceholder({
  label = "Sponsored",
}: {
  label?: string;
}) {
  return (
    <section className="card my-6 p-4 text-center sm:my-8 sm:p-6">
      <p
        className="text-xs uppercase tracking-widest"
        style={{ color: "var(--muted)" }}
      >
        {label}
      </p>
      <p className="mt-2 text-sm" style={{ color: "var(--muted)" }}>
        Reserved ad placement
      </p>
      <div
        className="mx-auto mt-4 h-24 w-full max-w-3xl rounded-lg border border-dashed sm:h-28"
        style={{ borderColor: "var(--border)" }}
      />
    </section>
  );
}
