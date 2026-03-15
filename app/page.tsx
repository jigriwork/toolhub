import { AdPlaceholder } from "@/components/ad-placeholder";
import { InstallAppPrompt } from "@/components/install-app-prompt";
import { ToolSearch } from "@/components/tool-search";
import Link from "next/link";

export default function HomePage() {
  return (
    <main>
      <section className="container section-y">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-3xl font-bold tracking-tight sm:text-5xl">
            All Essential Online Tools in One Premium Hub
          </h1>
          <p
            className="mx-auto mt-4 max-w-2xl text-sm sm:text-lg"
            style={{ color: "var(--muted)" }}
          >
            toolhubsite helps you work faster with practical, accurate, and
            lightweight tools designed for everyday productivity.
          </p>
        </div>
      </section>

      <section className="container pb-8">
        <InstallAppPrompt />
        <ToolSearch />
      </section>

      <section className="container">
        <AdPlaceholder label="Homepage Top Ad Slot" />
      </section>

      <section className="container py-6 sm:py-8">
        <div className="card p-4 sm:p-8">
          <h2 className="text-2xl font-semibold">Why toolhubsite?</h2>
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

      <section className="container py-4">
        <div className="card p-4 sm:p-8">
          <h2 className="text-2xl font-semibold">Built for trust and production use</h2>
          <p className="mt-3 text-sm sm:text-base" style={{ color: "var(--muted)" }}>
            toolhubsite is designed as a reliable utility platform with lightweight pages,
            practical tool descriptions, structured FAQ content, and mobile-first
            usability. This quality-first foundation helps improve user confidence,
            retention, and AdSense readiness over time.
          </p>
          <p className="mt-3 text-sm sm:text-base" style={{ color: "var(--muted)" }}>
            We do not store your tool input data on our servers. Most processing
            is done directly in your browser.
          </p>
        </div>
      </section>

      <section className="container">
        <AdPlaceholder label="Homepage Bottom Ad Slot" />
      </section>

      <section className="container py-4">
        <div className="card flex flex-wrap items-center justify-between gap-4 p-4 sm:p-6">
          <div className="max-w-xl">
            <h2 className="text-xl font-semibold">Help us grow toolhubsite</h2>
            <p className="mt-1 text-sm" style={{ color: "var(--muted)" }}>
              Request a tool, send feedback, or report issues in a minute.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link href="/request-tool" className="btn btn-primary">
              Request a Tool
            </Link>
            <Link href="/feedback" className="btn btn-secondary">
              Send Feedback
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
