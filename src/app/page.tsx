import Image from "next/image";
import Link from "next/link";

import { WorkCard } from "@/components/work-card";
import { brandMoney, ADDIS, quoteFor } from "@/lib/brand";
import { findOption } from "@/lib/pricing";
import {
  getArtistsWithCounts,
  getCatalogueOptions,
  getStudioTotals,
  getWorks,
} from "@/lib/queries";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Addis Art Editions — editions from the highlands",
};

export default async function AddisHomePage() {
  const [works, options, artistRows, totals] = await Promise.all([
    getWorks({ brand: "addis" }),
    getCatalogueOptions(),
    getArtistsWithCounts("addis"),
    getStudioTotals("addis"),
  ]);

  const money = (cents: number) => brandMoney(ADDIS, cents);
  const live = works.filter((row) => row.work.status !== "sold-out");
  const featured = live.slice(0, 4);

  const flagship =
    works.find((row) => row.work.slug === "meskel-lattice") ?? works[0];
  const paper = findOption(options, "paper", "photo-rag") ?? options[0];
  const frame = findOption(options, "frame", "frame-oak");
  const mount = findOption(options, "mount", "mount-8ply");
  const receipt = quoteFor(ADDIS, {
    basePriceCents: flagship.work.basePriceCents,
    royaltyRate: flagship.artist.royaltyRate,
    size: "a1",
    paper,
    mount,
    frame,
  });

  const pillars = [
    {
      k: "The artist",
      t: "Makes the work, keeps the work",
      b: "Copyright never leaves the studio. The originals stay on the wall. The file comes to us once, and goes back on request, any time.",
    },
    {
      k: "The house",
      t: "Prints, mounts, frames, ships",
      b: "Capture, colour proofing, paper stock, mounting, framing, the crate and the courier. Also the returns, and the risk of a print nobody buys.",
    },
    {
      k: "The collector",
      t: "Buys a number, not a gamble",
      b: "A closed edition, a hand-drawn certificate, an entry in a public register. Framed, glazed, ready to hang on arrival.",
    },
  ];

  return (
    <div>
      {/* HERO */}
      <section className="border-b border-line">
        <div className="mx-auto grid max-w-[1400px] gap-10 px-5 py-16 md:grid-cols-12 md:px-10 md:py-24">
          <div className="md:col-span-7">
            <p className="eyebrow text-oxide">Addis Ababa · est. 2026</p>
            <h1 className="display mt-6 text-5xl text-bone md:text-7xl lg:text-8xl">
              Editions from
              <br />
              <span className="italic text-ash">the highlands.</span>
            </h1>
            <p className="mt-8 max-w-xl text-lg leading-relaxed text-ash">
              Addis Art Editions is a print publishing house, not a gallery and not a
              portfolio. Four artists from across the region, one press in Addis, and a
              rule we will not bend: the work belongs to the artist, and so does a
              published share of every print sold.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Link href="/works" className="btn">
                Browse the editions
              </Link>
              <Link href="/craft" className="btn-ghost">
                Papers, mounts &amp; frames
              </Link>
            </div>
          </div>

          <div className="md:col-span-5">
            <div className="relative aspect-[4/5] overflow-hidden border border-line">
              <Image
                src="/art/addis-cross.jpg"
                alt="Meskel Lattice — ochre and indigo cross lattice painting"
                fill
                priority
                sizes="(max-width: 768px) 100vw, 40vw"
                className="object-cover"
              />
            </div>
            <div className="grid grid-cols-2 border-x border-b border-line">
              <div className="border-r border-line p-4">
                <p className="display text-3xl text-oxide">{artistRows.length}</p>
                <p className="mono mt-1 text-ash">ARTISTS</p>
              </div>
              <div className="p-4">
                <p className="display text-3xl text-oxide">{live.length}</p>
                <p className="mono mt-1 text-ash">OPEN EDITIONS</p>
              </div>
              <div className="border-r border-t border-line p-4">
                <p className="display text-3xl text-oxide">
                  {options.filter((o) => o.kind === "paper").length}
                </p>
                <p className="mono mt-1 text-ash">PAPERS</p>
              </div>
              <div className="border-t border-line p-4">
                <p className="display text-3xl text-oxide">USD</p>
                <p className="mono mt-1 text-ash">SHIPPED WORLDWIDE</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MARQUEE */}
      <section className="overflow-hidden border-b border-line bg-ink-2 py-4">
        <div className="marquee flex w-max gap-10 whitespace-nowrap">
          {Array.from({ length: 2 }).flatMap((_, dup) =>
            [
              "COPYRIGHT STAYS WITH THE ARTIST",
              "EDITIONS ARE NUMBERED AND CLOSED",
              "PRODUCTION COST PRINTED ON EVERY PAGE",
              "ROYALTY PAID ON GROSS MARGIN",
              "PRINTED TO ORDER, HAND-FINISHED",
              "REGISTER OPEN TO ANY COLLECTOR",
            ].map((line) => (
              <span key={`${dup}-${line}`} className="mono text-ash">
                {line} <span className="text-oxide">·</span>
              </span>
            )),
          )}
        </div>
      </section>

      {/* PILLARS */}
      <section className="border-b border-line">
        <div className="mx-auto max-w-[1400px] px-5 py-16 md:px-10 md:py-24">
          <div className="flex flex-col gap-3 border-t border-line pt-6 md:flex-row md:items-end md:justify-between">
            <div className="flex items-baseline gap-5">
              <span className="mono text-oxide">01</span>
              <h2 className="display text-3xl text-bone md:text-5xl">
                Three parties, one honest contract
              </h2>
            </div>
            <p className="mono max-w-md text-ash">
              THE SPLIT IS ON THE PAGE. NOBODY GUESSES.
            </p>
          </div>
          <div className="mt-10 grid gap-px border border-line bg-line md:grid-cols-3">
            {pillars.map((pillar) => (
              <div key={pillar.k} className="bg-ink p-7">
                <p className="eyebrow text-oxide">{pillar.k}</p>
                <h3 className="display mt-4 text-2xl text-bone">{pillar.t}</h3>
                <p className="mt-4 text-[15px] leading-relaxed text-ash">{pillar.b}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* EDITIONS */}
      <section className="border-b border-line bg-ink-2">
        <div className="mx-auto max-w-[1400px] px-5 py-16 md:px-10 md:py-24">
          <div className="flex flex-col gap-3 border-t border-line pt-6 md:flex-row md:items-end md:justify-between">
            <div className="flex items-baseline gap-5">
              <span className="mono text-oxide">02</span>
              <h2 className="display text-3xl text-bone md:text-5xl">
                Currently on the shelf
              </h2>
            </div>
            <p className="mono max-w-md text-ash">
              BUILD ANY PRINT IN ANY SIZE, PAPER OR FRAME — THE PRICE AND THE SPLIT
              RECALCULATE AS YOU GO.
            </p>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((row, i) => (
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
          <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border border-line p-5">
            <p className="text-sm text-ash">
              {live.length} open editions · {totals.editionsSold} prints in the register
              · {artistRows.length} artists
            </p>
            <Link href="/works" className="btn-ghost">
              All editions
            </Link>
          </div>
        </div>
      </section>

      {/* RECEIPT */}
      <section className="border-b border-line">
        <div className="mx-auto max-w-[1400px] px-5 py-16 md:px-10 md:py-24">
          <div className="flex flex-col gap-3 border-t border-line pt-6 md:flex-row md:items-end md:justify-between">
            <div className="flex items-baseline gap-5">
              <span className="mono text-oxide">03</span>
              <h2 className="display text-3xl text-bone md:text-5xl">
                What a print actually costs
              </h2>
            </div>
            <p className="mono max-w-md text-ash">
              A LIVE QUOTE, AND THE SAME NUMBERS THE ARTIST SEES.
            </p>
          </div>

          <div className="mt-10 grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <div className="border border-line bg-ink-2">
                <div className="flex items-baseline justify-between border-b border-line p-5">
                  <div>
                    <p className="eyebrow">Edition receipt</p>
                    <p className="display mt-2 text-3xl text-bone">
                      {flagship.work.title}
                    </p>
                    <p className="mono mt-2 text-ash">
                      {flagship.artist.name} · {receipt.size.label} ·{" "}
                      {receipt.size.dims}
                    </p>
                  </div>
                  <p className="mono text-oxide">
                    NO. {flagship.work.editionSold + 1}
                  </p>
                </div>
                <div className="p-5">
                  {receipt.lines.map((line) => (
                    <div
                      key={line.label}
                      className="flex items-baseline justify-between border-b border-line/60 py-3"
                    >
                      <div>
                        <p className="text-sm text-bone">{line.label}</p>
                        <p className="mono text-ash">{line.detail}</p>
                      </div>
                      <p className="mono text-bone">{money(line.amount)}</p>
                    </div>
                  ))}
                  <div className="flex items-baseline justify-between py-4">
                    <p className="mono uppercase tracking-[0.2em] text-ash">
                      Collector pays
                    </p>
                    <p className="display text-4xl text-bone">
                      {money(receipt.retailCents)}
                    </p>
                  </div>
                </div>
                <div className="grid border-t border-line sm:grid-cols-2">
                  <div className="border-b border-line p-5 sm:border-b-0 sm:border-r">
                    <p className="eyebrow">Production</p>
                    <p className="display mt-3 text-3xl text-ash">
                      −{money(receipt.productionCents)}
                    </p>
                    <p className="mono mt-3 text-ash">the house carries this</p>
                  </div>
                  <div className="p-5">
                    <p className="eyebrow">Gross margin</p>
                    <p className="display mt-3 text-3xl text-bone">
                      {money(receipt.marginCents)}
                    </p>
                  </div>
                </div>
                <div className="grid border-t border-line sm:grid-cols-2">
                  <div className="border-b border-line bg-oxide/10 p-5 sm:border-b-0 sm:border-r">
                    <p className="eyebrow text-oxide">
                      Artist · {receipt.royaltyRate}% of margin
                    </p>
                    <p className="display mt-3 text-4xl text-oxide">
                      {money(receipt.royaltyCents)}
                    </p>
                    <p className="mono mt-3 text-ash">per print, paid monthly</p>
                  </div>
                  <div className="p-5">
                    <p className="eyebrow">The house</p>
                    <p className="display mt-3 text-4xl text-bone">
                      {money(receipt.studioCents)}
                    </p>
                    <p className="mono mt-3 text-ash">press, rent, returns</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="flex h-full flex-col justify-between gap-8 border border-line p-7">
                <div>
                  <p className="eyebrow text-oxide">Why this matters here</p>
                  <p className="mt-5 text-[15px] leading-relaxed text-ash">
                    In this region an artist who wants to sell a print usually has to
                    pay a printer up front, buy the frame, chase the courier, and hope.
                    The house takes that whole half of the job — and takes the loss when
                    a print does not sell. The artist is never asked for money.
                  </p>
                </div>
                <div>
                  <ul className="space-y-4">
                    {[
                      ["Nothing paid upfront", "The house finances every print"],
                      ["No framing stock", "Built to order, one at a time"],
                      ["No currency risk", "Priced in USD, royalty in USD"],
                      [
                        "Full edition closed at the last print",
                        "Never silently reprinted",
                      ],
                    ].map(([a, b]) => (
                      <li key={a} className="border-b border-line pb-4">
                        <p className="text-sm text-bone">{a}</p>
                        <p className="mono mt-1 text-ash">{b}</p>
                      </li>
                    ))}
                  </ul>
                  <Link href="/about" className="btn mt-6">
                    Read the model
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CRAFT TEASER */}
      <section className="border-b border-line bg-ink-2">
        <div className="mx-auto grid max-w-[1400px] gap-10 px-5 py-16 md:grid-cols-12 md:px-10 md:py-24">
          <div className="md:col-span-5">
            <div className="relative aspect-[4/5] overflow-hidden border border-line">
              <Image
                src="/studio/press-room.jpg"
                alt="The house proofing table"
                fill
                sizes="(max-width: 768px) 100vw, 40vw"
                className="object-cover"
              />
            </div>
          </div>
          <div className="md:col-span-7">
            <div className="flex flex-col gap-3 border-t border-line pt-6">
              <div className="flex items-baseline gap-5">
                <span className="mono text-oxide">04</span>
                <h2 className="display text-3xl text-bone md:text-5xl">
                  Every paper, mount and frame, explained
                </h2>
              </div>
            </div>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-ash">
              Cotton rag, photo rag, bamboo, baryta or riso newsprint. 8-ply
              conservation mount or a float on board. Aluminium, oak, stained ash or
              walnut behind museum glass. Each one changes the price, the weight and
              the room it belongs in — so each one is written down properly.
            </p>
            <div className="mt-8 grid gap-px border border-line bg-line sm:grid-cols-2">
              {[
                ["Papers", "Five, from 90gsm newsprint to 315gsm baryta"],
                ["Mounts", "Flush, 8-ply conservation, or floated on 5mm board"],
                ["Frames", "Four finishes, acrylic or 99% UV museum glass"],
                ["Sizes", "A5 to A0, priced by print area not by guesswork"],
              ].map(([a, b]) => (
                <div key={a} className="bg-ink p-6">
                  <p className="display text-2xl text-bone">{a}</p>
                  <p className="mt-2 text-sm leading-relaxed text-ash">{b}</p>
                </div>
              ))}
            </div>
            <Link href="/craft" className="btn mt-8">
              The full craft guide
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-oxide">
        <div className="mx-auto flex max-w-[1400px] flex-col items-start gap-6 px-5 py-14 md:flex-row md:items-center md:justify-between md:px-10">
          <h2 className="display max-w-2xl text-4xl text-white md:text-5xl">
            One press in Addis. Artists across the region.
          </h2>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/submit"
              className="btn-ghost border-white text-white hover:text-white"
            >
              Submit a work
            </Link>
            <Link
              href="/register"
              className="btn border-white bg-white text-oxide hover:bg-transparent hover:text-white"
            >
              Look up an edition
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
