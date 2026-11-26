import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";

import { AddisNav } from "@/components/addis-nav";
import { ADDIS } from "@/lib/brand";

import "./globals.css";

export const metadata: Metadata = {
  title: "Addis Art Editions — editions from the highlands, printed to order",
  description:
    "An East African print publishing house based in Addis Ababa. Artists keep copyright and take a published share of gross margin; the house captures, prints, mounts, frames and ships worldwide.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  const brand = ADDIS;

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html:
              "try{if(localStorage.getItem('addis-theme')==='light')document.documentElement.classList.add('light')}catch(e){}",
          }}
        />
      </head>
      <body className="grain bg-ink text-bone antialiased">
        <div className={brand.scope}>
          <AddisNav />
          <main className="min-h-[70vh]">{children}</main>

          <footer className="border-t border-line bg-ink-2">
            <div className="mx-auto grid max-w-[1400px] gap-10 px-5 py-14 md:grid-cols-4 md:px-10">
              <div className="md:col-span-2">
                <p className="display text-3xl tracking-[0.12em] text-bone">
                  ADDIS ART EDITIONS
                </p>
                <p className="mt-4 max-w-sm text-sm leading-relaxed text-ash">
                  {brand.tagline} One press in Addis Ababa, artists across the region, and
                  a register that says exactly which print went to whom.
                </p>
                <p className="mono mt-5 text-ash">{brand.city}</p>
              </div>
              <div>
                <p className="eyebrow">The house</p>
                <ul className="mt-4 space-y-2 text-sm text-ash">
                  <li>
                    <Link className="link hover:text-bone" href="/">
                      The house
                    </Link>
                  </li>
                  <li>
                    <Link className="link hover:text-bone" href="/about">
                      The model &amp; the split
                    </Link>
                  </li>
                  <li>
                    <Link className="link hover:text-bone" href="/craft">
                      Papers, mounts &amp; frames
                    </Link>
                  </li>
                  <li>
                    <Link className="link hover:text-bone" href="/journal">
                      The journal
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <p className="eyebrow">Catalogue</p>
                <ul className="mt-4 space-y-2 text-sm text-ash">
                  <li>
                    <Link className="link hover:text-bone" href="/works">
                      All editions
                    </Link>
                  </li>
                  <li>
                    <Link className="link hover:text-bone" href="/artists">
                      The artists
                    </Link>
                  </li>
                  <li>
                    <Link className="link hover:text-bone" href="/register">
                      The register
                    </Link>
                  </li>
                  <li>
                    <Link className="link hover:text-bone" href="/submit">
                      Submit a work
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
            <div className="border-t border-line">
              <div className="mx-auto flex max-w-[1400px] flex-col gap-2 px-5 py-5 mono text-[10px] tracking-[0.2em] text-ash md:flex-row md:items-center md:justify-between md:px-10">
                <span>
                  {brand.legal} ·{" "}
                  <a className="link text-oxide" href={`mailto:${brand.email}`}>
                    {brand.email}
                  </a>
                </span>
                <span>
                  <Link className="link hover:text-bone" href="/status">
                    Check a submission
                  </Link>{" "}
                  · COPYRIGHT STAYS WITH THE ARTIST
                </span>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
