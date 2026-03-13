import Link from "next/link";

export default function OfflinePage() {
  return (
    <main className="container py-16">
      <div className="card mx-auto max-w-2xl p-8 text-center">
        <h1 className="text-3xl font-bold">You are offline</h1>
        <p className="mt-3 text-sm sm:text-base" style={{ color: "var(--muted)" }}>
          ToolHub could not reach the internet right now. You can still access cached
          pages and reconnect to continue using online tools.
        </p>
        <Link href="/" className="btn btn-primary mt-6">
          Try homepage again
        </Link>
      </div>
    </main>
  );
}
