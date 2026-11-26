"use client";

import { useState } from "react";

import { ADDIS, brandMoney, quoteFor, type Brand } from "@/lib/brand";
import { computeQuote, SIZES, type CatalogueOption, type SizeKey } from "@/lib/pricing";

export type CalculatorWork = {
  slug: string;
  title: string;
  artistName: string;
  basePriceCents: number;
  royaltyRate: number;
};

export function RoyaltyCalculator({
  works,
  options,
  brand = ADDIS,
}: {
  works: CalculatorWork[];
  options: CatalogueOption[];
  brand?: Brand;
}) {
  const money = (cents: number) => brandMoney(brand, cents);
  const papers = options.filter((o) => o.kind === "paper");
  const frames = options.filter((o) => o.kind === "frame");
  const mounts = options.filter((o) => o.kind === "mount");

  const [workSlug, setWorkSlug] = useState(works[0]?.slug ?? "");
  const [size, setSize] = useState<SizeKey>("a2");
  const [paperSlug, setPaperSlug] = useState(papers[0]?.slug ?? "");
  const [frameSlug, setFrameSlug] = useState("frame-oak");
  const [mountSlug, setMountSlug] = useState("mount-8ply");
  const [rate, setRate] = useState<number | null>(null);
  const [printsPerMonth, setPrintsPerMonth] = useState(4);
  const [artists, setArtists] = useState(8);

  const work = works.find((w) => w.slug === workSlug) ?? works[0];
  const paper = papers.find((p) => p.slug === paperSlug) ?? papers[0];
  const frame = frames.find((f) => f.slug === frameSlug) ?? frames[0];
  const mount = mounts.find((m) => m.slug === mountSlug) ?? null;

  const quote =
    work && paper
      ? quoteFor(brand, {
          basePriceCents: work.basePriceCents,
          royaltyRate: rate ?? work.royaltyRate,
          size,
          paper,
          mount,
          frame,
        })
      : null;

  if (!quote || !work || !paper || !frame) {
    return <p className="mono text-ash">Catalogue unavailable.</p>;
  }

  const effectiveRate = rate ?? work.royaltyRate;

  const scenarios = [1, 3, 6, 12, 24].map((count) => {
    const artistMonthly = quote.royaltyCents * printsPerMonth;
    const studioMonthly = quote.studioCents * printsPerMonth * count;
    return {
      count,
      artistYearly: artistMonthly * 12,
      studioYearly: studioMonthly * 12,
      revenue: quote.retailCents * printsPerMonth * count * 12,
    };
  });

  return (
    <div className="grid gap-px border border-line bg-line lg:grid-cols-2">
      {/* CONFIGURE */}
      <div className="bg-ink p-6 md:p-8">
        <p className="eyebrow text-oxide">1 · Configure a real print</p>

        <label className="mono mt-6 block text-ash">WORK</label>
        <select
          className="field mt-2"
          value={workSlug}
          onChange={(e) => {
            setWorkSlug(e.target.value);
            setRate(null);
          }}
        >
          {works.map((w) => (
            <option key={w.slug} value={w.slug}>
              {w.title} — {w.artistName}
            </option>
          ))}
        </select>

        <label className="mono mt-6 block text-ash">SIZE</label>
        <div className="mt-2 grid grid-cols-6 gap-px border border-line bg-line">
          {SIZES.map((s) => (
            <button
              key={s.key}
              type="button"
              onClick={() => setSize(s.key)}
              className={`py-2 mono transition-colors ${
                size === s.key ? "bg-oxide text-white" : "bg-ink text-ash hover:bg-ink-3"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mono block text-ash">PAPER</label>
            <select
              className="field mt-2"
              value={paperSlug}
              onChange={(e) => setPaperSlug(e.target.value)}
            >
              {papers.map((p) => (
                <option key={p.slug} value={p.slug}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mono block text-ash">FRAME</label>
            <select
              className="field mt-2"
              value={frameSlug}
              onChange={(e) => setFrameSlug(e.target.value)}
            >
              {frames.map((f) => (
                <option key={f.slug} value={f.slug}>
                  {f.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-6">
          <label className="mono block text-ash">MOUNT</label>
          <div className="mt-2 flex flex-wrap gap-2">
            {mounts.map((m) => (
              <button
                key={m.slug}
                type="button"
                onClick={() => setMountSlug(m.slug)}
                className={`border px-3 py-2 mono uppercase transition-colors ${
                  mountSlug === m.slug
                    ? "border-oxide bg-oxide text-white"
                    : "border-line text-ash hover:border-oxide hover:text-oxide"
                }`}
              >
                {m.name}
              </button>
            ))}
          </div>
        </div>

        <label className="mono mt-8 block text-ash">
          ARTIST ROYALTY — {effectiveRate}% OF GROSS MARGIN
        </label>
        <input
          type="range"
          min={25}
          max={70}
          step={5}
          value={effectiveRate}
          onChange={(e) => setRate(Number(e.target.value))}
          className="mt-3 w-full accent-[#c1502e]"
        />
        <div className="mt-2 flex justify-between mono text-[10px] text-ash">
          <span>25% LOW</span>
          <span>40% TRACK A</span>
          <span>70% HIGH</span>
        </div>

        <div className="mt-8 border border-line">
          <div className="flex items-baseline justify-between border-b border-line p-4">
            <span className="mono text-ash">COLLECTOR PAYS</span>
            <span className="display text-3xl text-bone">
              {money(quote.retailCents)}
            </span>
          </div>
          <div className="grid grid-cols-3 gap-px bg-line">
            <div className="bg-ink p-4">
              <p className="eyebrow">Production</p>
              <p className="display mt-2 text-xl text-ash">
                {money(quote.productionCents)}
              </p>
            </div>
            <div className="bg-ink p-4">
              <p className="eyebrow text-oxide">Artist</p>
              <p className="display mt-2 text-xl text-oxide">
                {money(quote.royaltyCents)}
              </p>
            </div>
            <div className="bg-ink p-4">
              <p className="eyebrow">Studio</p>
              <p className="display mt-2 text-xl text-bone">
                {money(quote.studioCents)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* SCALE */}
      <div className="bg-ink-2 p-6 md:p-8">
        <p className="eyebrow text-oxide">2 · Scale the house</p>

        <label className="mono mt-6 block text-ash">
          PRINTS SOLD PER ARTIST, PER MONTH — {printsPerMonth}
        </label>
        <input
          type="range"
          min={1}
          max={40}
          value={printsPerMonth}
          onChange={(e) => setPrintsPerMonth(Number(e.target.value))}
          className="mt-3 w-full accent-[#c1502e]"
        />

        <label className="mono mt-6 block text-ash">
          ARTISTS ON THE SHELF — {artists}
        </label>
        <input
          type="range"
          min={1}
          max={30}
          value={artists}
          onChange={(e) => setArtists(Number(e.target.value))}
          className="mt-3 w-full accent-[#c1502e]"
        />

        <div className="mt-8 border border-line bg-ink">
          <div className="border-b border-line p-5">
            <p className="eyebrow">The one artist</p>
            <p className="display mt-3 text-4xl text-oxide">
              {money(quote.royaltyCents * printsPerMonth * 12)}
              <span className="mono ml-3 text-ash">/ YEAR</span>
            </p>
            <p className="mono mt-3 text-ash">
              {printsPerMonth} prints a month at {money(quote.royaltyCents)} each
              — with zero production risk, zero framing stock, zero website.
            </p>
          </div>
          <div className="border-b border-line p-5">
            <p className="eyebrow">The house, at {artists} artists</p>
            <p className="display mt-3 text-4xl text-bone">
              {money(quote.studioCents * printsPerMonth * artists * 12)}
              <span className="mono ml-3 text-ash">/ YEAR</span>
            </p>
            <p className="mono mt-3 text-ash">
              {money(quote.retailCents * printsPerMonth * artists * 12)} of gross
              turnover, run from one press and two people.
            </p>
          </div>
        </div>

        <div className="mt-8 overflow-x-auto border border-line">
          <table className="w-full min-w-[420px] border-collapse text-left">
            <thead className="bg-ink">
              <tr>
                {["Artists", "Turnover / yr", "Artist / yr", "Studio / yr"].map((h) => (
                  <th key={h} className="mono border-b border-line p-3 text-ash">
                    {h.toUpperCase()}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {scenarios.map((s) => (
                <tr
                  key={s.count}
                  className={`border-b border-line last:border-0 ${
                    s.count === artists ? "bg-oxide/10" : "bg-ink"
                  }`}
                >
                  <td className="p-3 mono text-bone">{s.count}</td>
                  <td className="p-3 text-sm text-ash">{money(s.revenue)}</td>
                  <td className="p-3 text-sm text-oxide">
                    {money(s.artistYearly)}
                  </td>
                  <td className="p-3 text-sm text-bone">
                    {money(s.studioYearly)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="mt-6 text-xs leading-relaxed text-ash">
          These are the numbers I want us to argue about. Nothing here assumes growth
          you don&apos;t believe in: move the sliders until it looks honest, then tell me
          what has to change for you to sign.
        </p>
      </div>
    </div>
  );
}
