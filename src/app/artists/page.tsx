import Link from "next/link";

import { ADDIS, brandMoney, quoteFor } from "@/lib/brand";
import { findOption } from "@/lib/pricing";
import { getArtistsWithCounts, getCatalogueOptions, getWorks } from "@/lib/queries";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Artists — Addis Art Editions",
  description:
    "The Addis roster: where each artist works, what they make, and the exact share of margin they take.",
};

export default async function AddisArtistsPage() {
  const [artists, options, rows] = await Promise.all([
    getArtistsWithCounts("addis"),
    getCatalogueOptions(),
    getWorks({ brand: "addis" }),
  ]);

  const money = (cents: number) => brandMoney(ADDIS, cents);
  const paper = findOption(options, "paper", "cotton-matt") ?? options[0];

  return (
    <div>
      <section className="border-b border-line">
        <div className="mx-auto max-w-[1400px] px-5 py-12 md:px-10 md:py-16">
          <p className="eyebrow text-oxide">The roster</p>
          <h1 className="display mt-4 text-5xl text-bone md:text-7xl">
            Four hands,
            <span className="italic text-ash"> one press.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ash">
            Addis, Gondar, Nairobi and Khartoum. None of them has to run a website, hold
            framing stock or chase a courier — and every one of them sees the same
            numbers the house sees.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-[1400px] px-5 py-12 md:px-10 md:py-16">
        <div className="grid gap-6 lg:grid-cols-3">
          {artists.map((artist) => {
            const artistWorks = rows.filter((r) => r.artist.slug === artist.slug);
            const cheapest = artistWorks.reduce<(typeof artistWorks)[number] | null>(
              (best, row) =>
                !best || row.work.basePriceCents < best.work.basePriceCents ? row : best,
              null,
            );
            const entry = cheapest
              ? quoteFor(ADDIS, {
                  basePriceCents: cheapest.work.basePriceCents,
                  royaltyRate: artist.royaltyRate,
                  size: "a4",
                  paper,
                })
              : null;
            return (
              <Link
                key={artist.slug}
                href={`/artists/${artist.slug}`}
                className="group flex flex-col justify-between border border-line bg-ink-2 p-7 transition-colors hover:border-oxide/60"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div className="flex h-16 w-16 items-center justify-center border border-line bg-ink">
                      <span className="display text-2xl text-oxide">
                        {artist.monogram}
                      </span>
                    </div>
                    {artist.isFounding ? (
                      <span className="border border-oxide/60 px-2 py-1 mono text-[10px] tracking-[0.16em] text-oxide">
                        FOUNDING
                      </span>
                    ) : (
                      <span className="border border-line px-2 py-1 mono text-[10px] tracking-[0.16em] text-ash">
                        INVITED
                      </span>
                    )}
                  </div>
                  <h2 className="display mt-6 text-3xl text-bone">{artist.name}</h2>
                  <p className="mono mt-2 text-ash">
                    {artist.role} · {artist.location}
                  </p>
                  <p className="mt-5 text-sm leading-relaxed text-ash">{artist.bio}</p>
                </div>
                <div className="mt-8 grid grid-cols-3 gap-px border border-line bg-line">
                  <div className="bg-ink p-4">
                    <p className="display text-2xl text-bone">{artist.workCount}</p>
                    <p className="mono mt-1 text-ash">WORKS</p>
                  </div>
                  <div className="bg-ink p-4">
                    <p className="display text-2xl text-bone">{artist.editionsSold}</p>
                    <p className="mono mt-1 text-ash">PRINTS OUT</p>
                  </div>
                  <div className="bg-ink p-4">
                    <p className="display text-2xl text-oxide">{artist.royaltyRate}%</p>
                    <p className="mono mt-1 text-ash">OF MARGIN</p>
                  </div>
                </div>
                {entry && cheapest ? (
                  <p className="mono mt-4 text-ash">
                    FROM {cheapest.work.title} AT A4 · {money(entry.retailCents)} ·
                    ARTIST TAKES{" "}
                    <span className="text-oxide">{money(entry.royaltyCents)}</span> PER
                    PRINT
                  </p>
                ) : null}
              </Link>
            );
          })}

          <div className="flex flex-col justify-between border border-dashed border-line p-7">
            <div>
              <p className="eyebrow text-oxide">The open slot</p>
              <h2 className="display mt-6 text-3xl text-bone">Your name here</h2>
              <p className="mt-5 text-sm leading-relaxed text-ash">
                The shelf is closed, not full. We review submissions in batches so the
                curation stays honest — and so every artist already here keeps their
                share of attention.
              </p>
              <p className="mono mt-5 border-t border-line pt-5 text-ash">
                NO UPFRONT COST · NO EXCLUSIVITY ON ORIGINALS · 60-DAY EXIT
              </p>
            </div>
            <Link href="/submit" className="btn mt-8">
              Submit a work
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
