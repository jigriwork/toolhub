import Link from "next/link";
import { tools } from "@/data/tools";

export function Footer() {
  const featured = tools.filter((tool) => tool.featured).slice(0, 6);

  return (
    <footer className="mt-14 border-t" style={{ borderColor: "var(--border)" }}>
      <div className="container py-8 sm:py-10">
        <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <h2 className="text-lg font-semibold">toolhubsite</h2>
            <p className="mt-2 max-w-sm text-sm leading-6" style={{ color: "var(--muted)" }}>
              Fast, modern, and practical online tools for creators, students,
              and professionals at www.toolhubsite.in.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-x-3 gap-y-2 text-sm sm:max-w-xs">
            <Link href="/about" className="rounded-md py-1 hover:underline">About</Link>
            <Link href="/privacy-policy" className="rounded-md py-1 hover:underline">Privacy Policy</Link>
            <Link href="/terms" className="rounded-md py-1 hover:underline">Terms</Link>
            <Link href="/contact" className="rounded-md py-1 hover:underline">Contact</Link>
            <Link href="/resources" className="rounded-md py-1 hover:underline">Resources</Link>
            <Link href="/feedback" className="rounded-md py-1 hover:underline">Feedback</Link>
          </div>
          <div>
            <h3 className="text-sm font-semibold">Popular Tools</h3>
            <div className="mt-2 flex flex-wrap gap-2 text-xs" style={{ color: "var(--muted)" }}>
              {featured.map((tool) => (
                <Link key={tool.slug} href={`/tools/${tool.slug}`} className="rounded-full border px-2.5 py-1.5" style={{ borderColor: "var(--border)" }}>
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
