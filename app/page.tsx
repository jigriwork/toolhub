import { AdPlaceholder } from "@/components/ad-placeholder";
import { ToolSearch } from "@/components/tool-search";

export default function HomePage() {
  return (
    <main>
      <section className="container py-14">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            All Essential Online Tools in One Premium Hub
          </h1>
          <p
            className="mx-auto mt-4 max-w-2xl text-base sm:text-lg"
            style={{ color: "var(--muted)" }}
          >
            ToolHub helps you work faster with practical, accurate, and
            lightweight tools designed for everyday productivity.
          </p>
        </div>
      </section>

      <section className="container pb-8">
        <ToolSearch />
      </section>

      <section className="container">
        <AdPlaceholder label="Homepage Top Ad Slot" />
      </section>

      <section className="container py-8">
        <div className="card p-6 sm:p-8">
          <h2 className="text-2xl font-semibold">Why ToolHub?</h2>
          <ul
            className="mt-4 grid gap-3 text-sm sm:grid-cols-2"
            style={{ color: "var(--muted)" }}
          >
            <li>⚡ Fast, browser-based tools with no complex setup</li>
            <li>
              🔒 Privacy-first: most processing happens directly in your browser
            </li>
            <li>📱 Fully responsive experience across mobile and desktop</li>
            <li>💼 Clean professional design for a trustworthy experience</li>
          </ul>
        </div>
      </section>

      <section className="container">
        <AdPlaceholder label="Homepage Bottom Ad Slot" />
      </section>
    </main>
  );
}
