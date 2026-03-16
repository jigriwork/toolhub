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
    <header
      className="sticky top-0 z-40 border-b backdrop-blur"
      style={{
        borderColor: "var(--border)",
        background:
          "color-mix(in oklab, var(--background) 84%, transparent)",
      }}
    >
      <div className="container py-3">
        <div className="flex items-center justify-between gap-3 rounded-2xl border px-3 py-2.5 sm:px-4"
          style={{
            borderColor: "color-mix(in oklab, var(--border) 82%, var(--primary))",
            background: "color-mix(in oklab, var(--card) 88%, transparent)",
          }}
        >
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-lg font-bold tracking-tight sm:text-xl"
          onClick={closeMenu}
        >
          <span
            aria-hidden
            className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-sm font-extrabold text-white shadow-sm"
          >
            TH
          </span>
          <span className="leading-none">
            toolhubsite
            <span className="block text-[11px] font-semibold tracking-wide text-blue-600 dark:text-blue-400">
              Premium utility suite
            </span>
          </span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => {
            const active = pathname === link.href;

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-xl px-3 py-2 text-sm font-medium transition ${
                  active
                    ? "bg-blue-600 text-white shadow-sm"
                    : "btn-ghost"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden rounded-xl border p-1 md:block" style={{ borderColor: "var(--border)" }}>
            <ThemeToggle />
          </div>
          <button
            type="button"
            className="inline-flex min-h-11 items-center justify-center rounded-xl border px-3 text-sm font-medium md:hidden"
            style={{ borderColor: "var(--border)" }}
            aria-expanded={isOpen}
            aria-label="Toggle menu"
            onClick={() => setIsOpen((value) => !value)}
          >
            Menu
          </button>
        </div>
        </div>
      </div>

      {isOpen ? (
        <nav className="container pb-4 md:hidden">
          <div className="card grid gap-1 p-2">
            <div className="mb-1 flex items-center justify-between rounded-xl border px-3 py-2" style={{ borderColor: "var(--border)" }}>
              <span className="text-xs font-semibold tracking-wide muted">Theme</span>
              <ThemeToggle />
            </div>
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
