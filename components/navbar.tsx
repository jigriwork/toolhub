"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
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
  const [isOpen, setIsOpen] = useState(false);

  const closeMenu = () => setIsOpen(false);

  return (
    <header className="sticky top-0 z-40 border-b backdrop-blur" style={{ borderColor: "var(--border)", background: "color-mix(in oklab, var(--background) 88%, transparent)" }}>
      <div className="container flex items-center justify-between gap-3 py-3">
        <Link href="/" className="inline-flex items-center gap-2 text-lg font-bold tracking-tight sm:text-xl" onClick={closeMenu}>
          <span
            aria-hidden
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-sm font-extrabold text-white"
          >
            TS
          </span>
          <span>toolhubsite</span>
        </Link>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button
            type="button"
            className="inline-flex min-h-11 items-center justify-center rounded-lg border px-3 text-sm font-medium md:hidden"
            style={{ borderColor: "var(--border)" }}
            aria-expanded={isOpen}
            aria-label="Toggle menu"
            onClick={() => setIsOpen((value) => !value)}
          >
            Menu
          </button>
        </div>

        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => {
            const active = pathname === link.href;

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-lg px-3 py-2 text-sm font-medium ${
                  active
                    ? "bg-blue-600 text-white"
                    : "hover:bg-gray-200/50 dark:hover:bg-gray-800"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>

      {isOpen ? (
        <nav className="container pb-4 md:hidden">
          <div className="card grid gap-1 p-2">
            {navLinks.map((link) => {
              const active = pathname === link.href;

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={closeMenu}
                  className={`min-h-11 rounded-lg px-3 py-2 text-sm font-medium ${
                    active
                      ? "bg-blue-600 text-white"
                      : "hover:bg-gray-200/50 dark:hover:bg-gray-800"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
        </nav>
      ) : null}
    </header>
  );
}
