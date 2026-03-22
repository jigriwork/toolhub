import { AdPlaceholder } from "@/components/ad-placeholder";
import { InstallAppPrompt } from "@/components/install-app-prompt";
import { ToolSearch } from "@/components/tool-search";
import Link from "next/link";

export default function HomePage() {
  return (
    <main>
      <section className="container section-y">
        <div className="hero-surface premium-card mx-auto max-w-6xl p-6 sm:p-10">
          <div className="flex flex-wrap gap-2">
            <span className="chip">Fast browser tools</span>
            <span className="chip">Business creative suite</span>
            <span className="chip">Mobile-first experience</span>
          </div>
          <div className="mt-5 grid gap-8 lg:grid-cols-[1.3fr_0.9fr] lg:items-end">
            <div>
              <h1 className="text-3xl font-bold tracking-tight sm:text-5xl">
                Canva-Lite Business Creative + Utility Suite for Everyday Workflows
              </h1>
              <p
                className="mt-4 max-w-2xl text-sm sm:text-lg"
                style={{ color: "var(--muted)" }}
              >
                Design festive greetings and offer posters with a live mini-editor,
                drag controls, format presets, and real high-resolution exports — plus
                fast utility tools for daily work.
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <Link href="/tools/festival-post-generator" className="btn btn-primary">
                  Start Creating
                </Link>
                <Link href="/tools/offer-poster-generator" className="btn btn-secondary">
                  Explore Business Suite
                </Link>
              </div>
            </div>
            <div className="card space-y-3 p-4 sm:p-5">
              <p className="text-sm font-semibold">Now live in Creative Suite</p>
              <div className="space-y-2 text-sm" style={{ color: "var(--muted)" }}>
                <p>• Canva-like Festival Post editor: drag blocks, customize styles, export in post/story/flyer sizes</p>
                <p>• Offer Poster editor: premium retail templates with movable logo/headline/offer/CTA</p>
                <p>• No-login unlocks: PWA install rewards, share unlocks, and watermark control</p>
              </div>
            </div>
          </div>
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
        <div className="card premium-card p-4 sm:p-8">
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

      <section className="container py-2 sm:py-4">
        <div className="card premium-card p-4 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-semibold">Business Creative Suite</h2>
              <p className="mt-1 text-sm" style={{ color: "var(--muted)" }}>
                Build invoices, festive creatives, offer posters, and social captions from one unified business workflow.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link href="/tools/invoice-generator" className="btn btn-secondary">Invoice</Link>
              <Link href="/tools/festival-post-generator" className="btn btn-secondary">Festival Post</Link>
              <Link href="/tools/offer-poster-generator" className="btn btn-secondary">Offer Poster</Link>
              <Link href="/tools/instagram-caption-generator" className="btn btn-secondary">Captions</Link>
            </div>
          </div>
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
        <div className="card premium-card flex flex-wrap items-center justify-between gap-4 p-4 sm:p-6">
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
