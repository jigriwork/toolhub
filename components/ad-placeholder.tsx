export function AdPlaceholder({
  label = "Advertisement",
}: {
  label?: string;
}) {
  return (
    <section className="card my-8 p-6 text-center">
      <p
        className="text-xs uppercase tracking-widest"
        style={{ color: "var(--muted)" }}
      >
        {label}
      </p>
      <p className="mt-2 text-sm" style={{ color: "var(--muted)" }}>
        AdSense-ready ad slot placeholder
      </p>
      <div
        className="mx-auto mt-4 h-28 w-full max-w-3xl rounded-lg border border-dashed"
        style={{ borderColor: "var(--border)" }}
      />
    </section>
  );
}
