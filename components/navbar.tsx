"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/theme-toggle";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/resources", label: "Resources" },
  { href: "/about", label: "About" },
  { href: "/request-tool", label: "Request Tool" },
  { href: "/contact", label: "Contact" },
  { href: "/privacy-policy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <header className="border-b" style={{ borderColor: "var(--border)" }}>
      <div className="container flex flex-wrap items-center justify-between gap-3 py-4">
        <Link href="/" className="inline-flex items-center gap-2 text-xl font-bold tracking-tight">
          <span
            aria-hidden
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-sm font-extrabold text-white"
          >
            TH
          </span>
          <span>ToolHub</span>
        </Link>
        <nav className="flex items-center gap-2 sm:gap-3">
          {navLinks.map((link) => {
            const active = pathname === link.href;

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-lg px-3 py-2 text-sm ${
                  active
                    ? "bg-blue-600 text-white"
                    : "hover:bg-gray-200/50 dark:hover:bg-gray-800"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
