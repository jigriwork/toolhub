import Link from "next/link";

export default function OfflinePage() {
  return (
    <main className="container section-y">
      <div className="card mx-auto max-w-2xl p-5 text-center sm:p-8">
        <h1 className="text-2xl font-bold sm:text-3xl">You are offline</h1>
        <p className="mt-3 text-sm sm:text-base" style={{ color: "var(--muted)" }}>
          toolhubsite could not reach the internet right now. You can still access cached
          pages and reconnect to continue using online tools.
        </p>
        <Link href="/" className="btn btn-primary mt-6">
          Try homepage again
        </Link>
      </div>
    </main>
  );
}
