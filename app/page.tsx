import { AdPlaceholder } from "@/components/ad-placeholder";
import { InstallAppPrompt } from "@/components/install-app-prompt";
import { ToolSearch } from "@/components/tool-search";
import Link from "next/link";

export default function HomePage() {
  return (
    <main>
      <section className="container section-y">
        <div className="hero-surface premium-card mx-auto max-w-6xl p-6 sm:p-10">
          <div className="mt-2 grid gap-8 lg:grid-cols-[1.3fr_0.9fr] lg:items-end">
            <div>
              <h1 className="text-3xl font-bold tracking-tight sm:text-5xl">
                Run business operations and creative campaigns faster with ToolHub
              </h1>
              <p
                className="mt-4 max-w-2xl text-sm sm:text-lg"
                style={{ color: "var(--muted)" }}
              >
                ToolHub gives you practical business workflows, premium creative generators,
                essential image/PDF utilities, and fast daily tools in one trusted browser-based platform.
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <Link href="/tools/invoice-generator" className="btn btn-primary">
                  Start with Business Suite
                </Link>
                <Link href="/tools/festival-post-generator" className="btn btn-secondary">
                  Explore Creative Studio
                </Link>
              </div>
            </div>
            <div className="card space-y-3 p-4 sm:p-5">
              <p className="text-sm font-semibold">Built to convert work into output</p>
              <div className="space-y-2 text-sm" style={{ color: "var(--muted)" }}>
                <p>• Business Suite: invoicing, quotations, receipts, POS, and payment tools</p>
                <p>• Creative Studio: festival posts, retail offers, and social copy generation</p>
                <p>• Image & PDF + Essentials: fast file workflows and daily utility tools</p>
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

      <section className="container py-2 sm:py-4">
        <div className="card premium-card p-4 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-semibold">Business Suite</h2>
              <p className="mt-1 text-sm" style={{ color: "var(--muted)" }}>
                The strongest ToolHub layer for billing, operations, and customer-ready outputs.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link href="/tools/invoice-generator" className="btn btn-secondary">Invoice</Link>
              <Link href="/tools/quotation-generator" className="btn btn-secondary">Quotation</Link>
              <Link href="/tools/receipt-generator" className="btn btn-secondary">Receipt</Link>
              <Link href="/tools/pos-mvp" className="btn btn-secondary">POS</Link>
              <Link href="/tools/upi-qr-generator" className="btn btn-secondary">UPI QR</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="container py-2 sm:py-4">
        <div className="card premium-card p-4 sm:p-8">
          <h2 className="text-2xl font-semibold">Why ToolHub?</h2>
          <ul
            className="mt-4 grid gap-3 text-sm sm:grid-cols-2"
            style={{ color: "var(--muted)" }}
          >
            <li>⚡ Fast browser-based tools with no setup or learning overhead</li>
            <li>
              🔒 Privacy-first by design: most processing happens locally in your browser
            </li>
            <li>📱 Responsive workflows built for mobile and desktop operations</li>
            <li>💼 Clear, professional UI focused on trust and conversion</li>
          </ul>
        </div>
      </section>

      <section className="container py-2 sm:py-4">
        <div className="card premium-card p-4 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-semibold">Creative Studio</h2>
              <p className="mt-1 text-sm" style={{ color: "var(--muted)" }}>
                Premium creative outputs for business marketing campaigns and festive promotions.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link href="/tools/festival-post-generator" className="btn btn-secondary">Festival Post</Link>
              <Link href="/tools/offer-poster-generator" className="btn btn-secondary">Offer Poster</Link>
              <Link href="/tools/instagram-caption-generator" className="btn btn-secondary">Caption Generator</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="container py-2 sm:py-4">
        <div className="card premium-card p-4 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-semibold">Image & PDF Tools</h2>
              <p className="mt-1 text-sm" style={{ color: "var(--muted)" }}>
                Essential file workflows for compression, conversion, merge, and split tasks.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link href="/tools/image-compressor" className="btn btn-secondary">Image Compressor</Link>
              <Link href="/tools/image-to-pdf-converter" className="btn btn-secondary">Image to PDF</Link>
              <Link href="/tools/pdf-merge" className="btn btn-secondary">PDF Merge</Link>
              <Link href="/tools/compress-pdf" className="btn btn-secondary">Compress PDF</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="container py-4">
        <div className="card p-4 sm:p-8">
          <h2 className="text-2xl font-semibold">Built for trust and production-grade use</h2>
          <p className="mt-3 text-sm sm:text-base" style={{ color: "var(--muted)" }}>
            ToolHub is built as a reliable utility platform with lightweight pages,
            practical descriptions, structured content, and mobile-first usability.
            This trust-first product quality helps improve confidence, retention,
            and conversion.
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

      <section className="container py-6">
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
