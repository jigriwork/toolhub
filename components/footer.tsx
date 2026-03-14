import Link from "next/link";
import { tools } from "@/data/tools";

export function Footer() {
  const featured = tools.filter((tool) => tool.featured).slice(0, 6);

  return (
    <footer className="mt-16 border-t" style={{ borderColor: "var(--border)" }}>
      <div className="container py-10">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <h2 className="text-lg font-semibold">toolhubsite</h2>
            <p className="mt-2 text-sm" style={{ color: "var(--muted)" }}>
              Fast, modern, and practical online tools for creators, students,
              and professionals at www.toolhubsite.in.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 text-sm">
            <Link href="/about">About</Link>
            <Link href="/privacy-policy">Privacy Policy</Link>
            <Link href="/terms">Terms</Link>
            <Link href="/contact">Contact</Link>
            <Link href="/resources">Resources</Link>
            <Link href="/feedback">Feedback</Link>
            <Link href="/admin/stats">Admin Stats</Link>
          </div>
          <div>
            <h3 className="text-sm font-semibold">Popular Tools</h3>
            <div className="mt-2 flex flex-wrap gap-2 text-xs" style={{ color: "var(--muted)" }}>
              {featured.map((tool) => (
                <Link key={tool.slug} href={`/tools/${tool.slug}`} className="rounded-full border px-2.5 py-1" style={{ borderColor: "var(--border)" }}>
                  {tool.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
        <p className="mt-8 text-xs" style={{ color: "var(--muted)" }}>
          © {new Date().getFullYear()} toolhubsite. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
