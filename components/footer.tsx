import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-16 border-t" style={{ borderColor: "var(--border)" }}>
      <div className="container py-10">
        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <h2 className="text-lg font-semibold">ToolHub</h2>
            <p className="mt-2 text-sm" style={{ color: "var(--muted)" }}>
              Fast, modern, and practical online tools for creators, students,
              and professionals.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 text-sm">
            <Link href="/about">About</Link>
            <Link href="/privacy-policy">Privacy Policy</Link>
            <Link href="/terms">Terms</Link>
            <Link href="/contact">Contact</Link>
          </div>
        </div>
        <p className="mt-8 text-xs" style={{ color: "var(--muted)" }}>
          © {new Date().getFullYear()} ToolHub. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
