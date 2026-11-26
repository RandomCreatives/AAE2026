import Link from "next/link";
import { notFound } from "next/navigation";

import { WorkCard } from "@/components/work-card";
import { ADDIS, brandMoney, quoteFor } from "@/lib/brand";
import { findOption } from "@/lib/pricing";
import { getArtistBySlug, getCatalogueOptions } from "@/lib/queries";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const data = await getArtistBySlug(slug, "addis");
  if (!data) return { title: "Not found — Addis Art Editions" };
  return {
    title: `${data.artist.name} — Addis Art Editions`,
    description: data.artist.bio,
  };
}

export default async function AddisArtistPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [data, options] = await Promise.all([
    getArtistBySlug(slug, "addis"),
    getCatalogueOptions(),
  ]);
  if (!data) notFound();

  const { artist, works: artistWorks } = data;
  const live = artistWorks.filter((row) => row.work.status !== "sold-out");
  const paper = findOption(options, "paper", "cotton-matt") ?? options[0];
  const money = (cents: number) => brandMoney(ADDIS, cents);

  const cheapest = live.reduce<(typeof live)[number] | null>(
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
  const sample = cheapest
    ? quoteFor(ADDIS, {
        basePriceCents: cheapest.work.basePriceCents,
        royaltyRate: artist.royaltyRate,
        size: "a2",
        paper,
      })
    : null;

  return (
    <div>
      <section className="border-b border-line bg-ink-2">
        <div className="mx-auto grid max-w-[1400px] gap-10 px-5 py-12 md:grid-cols-12 md:px-10 md:py-16">
          <div className="md:col-span-8">
            <Link
              href="/artists"
              className="mono text-[10px] tracking-[0.18em] text-ash hover:text-bone"
            >
              ← THE ROSTER
            </Link>
            <div className="mt-6 flex items-center gap-6">
              <div className="flex h-20 w-20 items-center justify-center border border-line bg-ink">
                <span className="display text-3xl text-oxide">{artist.monogram}</span>
              </div>
              <div>
                <p className="eyebrow text-oxide">{artist.role}</p>
                <h1 className="display mt-2 text-5xl text-bone md:text-6xl">
                  {artist.name}
                </h1>
              </div>
            </div>
            <p className="mt-8 max-w-2xl text-lg leading-relaxed text-ash">
              {artist.bio}
            </p>
            <p className="mono mt-6 text-ash">
              {artist.practice} · {artist.location}
            </p>
          </div>

          <div className="md:col-span-4">
            <div className="border border-line bg-ink">
              <div className="border-b border-line p-5">
                <p className="eyebrow">Terms of this shelf</p>
              </div>
              <div className="divide-y divide-line">
                {[
                  ["Copyright", "Stays with the artist"],
                  ["Royalty", `${artist.royaltyRate}% of gross margin`],
                  [
                    "Entry price",
                    entry && cheapest
                      ? `from ${cheapest.work.title} at A4 · ${money(entry.retailCents)}`
                      : "On request",
                  ],
                  ["Upfront cost", "None"],
                  [
                    "Prints claimed",
                    `${artistWorks.reduce((n, r) => n + r.work.editionSold, 0)}`,
                  ],
                ].map(([label, value]) => (
                  <div key={label} className="flex items-baseline justify-between p-4">
                    <span className="mono text-ash">{label.toUpperCase()}</span>
                    <span className="text-sm text-bone">{value}</span>
                  </div>
                ))}
              </div>
            </div>
            {sample ? (
              <p className="mono mt-4 text-ash">
                An unframed A2 on house paper pays{" "}
                <span className="text-oxide">{money(sample.royaltyCents)}</span> per
                print.
              </p>
            ) : null}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1400px] px-5 py-12 md:px-10 md:py-16">
        <div className="flex items-baseline justify-between border-t border-line pt-6">
          <h2 className="display text-3xl text-bone md:text-4xl">
            {artistWorks.length} works
          </h2>
          <p className="mono text-ash">{live.length} STILL OPEN</p>
        </div>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {artistWorks.map((row, i) => (
            <WorkCard
              key={row.work.id}
              work={row.work}
              artist={row.artist}
              options={options}
              brand={ADDIS}
              href={`/works/${row.work.slug}`}
              priority={i < 2}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
