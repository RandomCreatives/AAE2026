"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { ThemeToggle } from "@/components/theme-toggle";

const LINKS = [
  { href: "/", label: "The House" },
  { href: "/works", label: "Editions" },
  { href: "/artists", label: "Artists" },
  { href: "/craft", label: "Print & Frame" },
  { href: "/journal", label: "Journal" },
  { href: "/register", label: "Register" },
  { href: "/about", label: "The Model" },
];

export function AddisNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-ink/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-6 px-5 py-4 md:px-10">
        <Link href="/" className="flex items-baseline gap-3" onClick={() => setOpen(false)}>
          <span className="display text-xl tracking-[0.14em] text-bone md:text-2xl">
            ADDIS
          </span>
          <span className="hidden text-[10px] font-mono tracking-[0.2em] text-ash md:inline">
            ART EDITIONS
          </span>
        </Link>

        <nav className="hidden items-center gap-6 lg:flex">
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`mono uppercase transition-colors ${
                isActive(link.href) ? "text-oxide" : "text-ash hover:text-bone"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <ThemeToggle className="mono uppercase text-ash hover:text-bone" />
          <Link
            href="/submit"
            className="border border-oxide px-3 py-2 mono uppercase text-oxide transition-colors hover:bg-oxide hover:text-white"
          >
            Submit
          </Link>
        </nav>

        <div className="flex items-center gap-5 lg:hidden">
          <ThemeToggle className="mono uppercase text-ash hover:text-bone" />
          <button
            type="button"
            aria-label="Menu"
            onClick={() => setOpen((v) => !v)}
            className="mono text-bone"
          >
            {open ? "CLOSE" : "MENU"}
          </button>
        </div>
      </div>

      {open ? (
        <nav className="flex flex-col gap-4 border-t border-line bg-ink px-5 py-6 lg:hidden">
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className={`display text-3xl ${isActive(link.href) ? "text-oxide" : "text-bone"}`}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/submit"
            onClick={() => setOpen(false)}
            className="display text-3xl text-oxide"
          >
            Submit
          </Link>
        </nav>
      ) : null}
    </header>
  );
}
