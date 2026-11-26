import Image from "next/image";
import Link from "next/link";

import { ADDIS, brandMoney, quoteFor } from "@/lib/brand";
import { findOption, SIZES } from "@/lib/pricing";
import { getCatalogueOptions } from "@/lib/queries";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Print & Frame — Addis Art Editions",
  description:
    "The full guide to papers, mounts, frames and glazing: what each one does to an image, what it weighs, and what it costs at every size.",
};

const PAPER_NOTES: Record<string, { weight: string; best: string; care: string }> = {
  "cotton-matt": {
    weight: "200gsm · warm white · matte",
    best: "Everything. It is the house paper because it is never wrong.",
    care: "Handle by the edges. No optical brighteners, so it will not yellow-shift.",
  },
  "photo-rag": {
    weight: "308gsm · soft white · matte",
    best: "Gestural painting, ink, anything with texture you want to feel.",
    care: "The softest surface in the range — frame it, do not lean it.",
  },
  bamboo: {
    weight: "290gsm · warm tone · subtle tooth",
    best: "Earth palettes, ochres, coffee washes, natural pigments.",
    care: "70% bamboo fibre, no brighteners. Ages like a good paper should.",
  },
  baryta: {
    weight: "315gsm · gloss · barium sulphate coating",
    best: "Photography with deep blacks, night work, anything under glass.",
    care: "Fingerprints are permanent. Cotton gloves only, always.",
  },
  "riso-news": {
    weight: "90gsm · off-white · uncoated",
    best: "Riso-native editions only. Loud, cheap, and ages beautifully.",
    care: "It is meant to yellow slightly. Do not fight it.",
  },
};

const FRAME_NOTES: Record<string, { profile: string; glazing: string; room: string }> = {
  "frame-aluminium": {
    profile: "12mm anodised aluminium, black or natural",
    glazing: "Shatter-proof acrylic, 92% light transmission",
    room: "Modern interiors, offices, anything with concrete in it.",
  },
  "frame-oak": {
    profile: "25mm solid oak box, hand-oiled",
    glazing: "Acrylic, UV filtering",
    room: "Warm rooms, wood, natural pigment work. The safe excellent choice.",
  },
  "frame-ash-black": {
    profile: "28mm stained ash, grain visible",
    glazing: "Acrylic, UV filtering",
    room: "Photography and anything monochrome. Disappears into the wall.",
  },
  "frame-walnut-museum": {
    profile: "30mm solid walnut, felt-lined back",
    glazing: "Museum glass, 99% UV, anti-reflective",
    room: "The top of the house. Where the light is uncontrollable.",
  },
};

export default async function AddisCraftPage() {
  const options = await getCatalogueOptions();
  const money = (cents: number) => brandMoney(ADDIS, cents);

  const papers = options.filter((o) => o.kind === "paper");
  const mounts = options.filter((o) => o.kind === "mount");
  const frames = options.filter((o) => o.kind === "frame");

  // a size ladder for the house paper, unframed — the honest entry table
  const paper = findOption(options, "paper", "cotton-matt") ?? papers[0];
  const ladder = SIZES.map((s) => ({
    spec: s,
    quote: quoteFor(ADDIS, {
      basePriceCents: 640_000,
      royaltyRate: 50,
      size: s.key,
      paper,
    }),
  }));

  const flagship = findOption(options, "paper", "photo-rag") ?? paper;
  const a1Base = quoteFor(ADDIS, {
    basePriceCents: 640_000,
    royaltyRate: 50,
    size: "a1",
    paper: flagship,
  });

  return (
    <div>
      <section className="border-b border-line">
        <div className="mx-auto max-w-[1400px] px-5 py-12 md:px-10 md:py-16">
          <p className="eyebrow text-oxide">The craft guide</p>
          <h1 className="display mt-4 max-w-3xl text-5xl text-bone md:text-7xl">
            Paper, mount,
            <span className="italic text-ash"> frame.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ash">
            You should not have to guess what a baryta is, or why museum glass costs
            more than the frame. Here is the whole menu — what each choice does to the
            image, where it belongs, and exactly what it adds to the price.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link href="/works" className="btn">
              Build a print
            </Link>
            <a href="#sizes" className="btn-ghost">
              The size ladder
            </a>
          </div>
        </div>
      </section>

      {/* PAPERS */}
      <section className="border-b border-line bg-ink-2">
        <div className="mx-auto max-w-[1400px] px-5 py-14 md:px-10 md:py-20">
          <div className="flex flex-col gap-3 border-t border-line pt-6 md:flex-row md:items-end md:justify-between">
            <div className="flex items-baseline gap-5">
              <span className="mono text-oxide">01</span>
              <h2 className="display text-3xl text-bone md:text-5xl">Papers</h2>
            </div>
            <p className="mono max-w-md text-ash">
              FIVE SURFACES. THE HOUSE PAPER IS INCLUDED IN EVERY EDITION.
            </p>
          </div>

          <div className="mt-10 border border-line">
            {papers.map((paper, i) => {
              const note = PAPER_NOTES[paper.slug];
              return (
                <div
                  key={paper.slug}
                  className={`grid gap-6 p-6 md:grid-cols-12 ${
                    i ? "border-t border-line" : ""
                  }`}
                >
                  <div className="md:col-span-4">
                    <p className="display text-2xl text-bone">{paper.name}</p>
                    {note ? (
                      <p className="mono mt-2 text-ash">{note.weight}</p>
                    ) : null}
                    <p className="mt-4 text-sm leading-relaxed text-ash">
                      {paper.blurb}
                    </p>
                  </div>
                  <div className="md:col-span-3">
                    <p className="eyebrow">Best for</p>
                    <p className="mt-2 text-sm leading-relaxed text-bone">
                      {note?.best ?? paper.blurb}
                    </p>
                  </div>
                  <div className="md:col-span-3">
                    <p className="eyebrow">Care</p>
                    <p className="mt-2 text-sm leading-relaxed text-ash">
                      {note?.care ?? "Archival, acid-free, cotton gloves when handling."}
                    </p>
                  </div>
                  <div className="md:col-span-2 md:text-right">
                    <p className="eyebrow">Adds at A2</p>
                    <p className="display mt-2 text-2xl text-oxide">
                      {paper.addCents === 0
                        ? "included"
                        : `+${money(Math.round(paper.addCents * ADDIS.scale))}`}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* SIZE LADDER */}
      <section id="sizes" className="border-b border-line">
        <div className="mx-auto max-w-[1400px] px-5 py-14 md:px-10 md:py-20">
          <div className="flex flex-col gap-3 border-t border-line pt-6 md:flex-row md:items-end md:justify-between">
            <div className="flex items-baseline gap-5">
              <span className="mono text-oxide">02</span>
              <h2 className="display text-3xl text-bone md:text-5xl">
                The size ladder
              </h2>
            </div>
            <p className="mono max-w-md text-ash">
              PRICED BY PRINT AREA, NOT BY GUESSWORK. UNFRAMED, HOUSE PAPER.
            </p>
          </div>

          <div className="mt-10 overflow-x-auto border border-line">
            <table className="w-full min-w-[720px] border-collapse text-left">
              <thead className="bg-ink-2">
                <tr>
                  {["Size", "Print area", "Relative", "Retail", "Artist", "The house"].map(
                    (h) => (
                      <th key={h} className="mono border-b border-line p-4 text-ash">
                        {h.toUpperCase()}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody>
                {ladder.map((row) => (
                  <tr key={row.spec.key} className="border-b border-line last:border-0">
                    <td className="p-4 display text-2xl text-bone">{row.spec.label}</td>
                    <td className="p-4 mono text-ash">{row.spec.dims}</td>
                    <td className="p-4 mono text-ash">{row.spec.area}×</td>
                    <td className="p-4 mono text-bone">
                      {money(row.quote.retailCents)}
                    </td>
                    <td className="p-4 mono text-oxide">
                      {money(row.quote.royaltyCents)}
                    </td>
                    <td className="p-4 mono text-ash">
                      {money(row.quote.studioCents)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 mono text-ash">
            EVERY SIZE IS THE SAME IMAGE. THE PRICE MOVES BECAUSE THE PAPER, THE INK AND
            THE LABOUR MOVE.
          </p>
        </div>
      </section>

      {/* MOUNTS */}
      <section className="border-b border-line bg-ink-2">
        <div className="mx-auto max-w-[1400px] px-5 py-14 md:px-10 md:py-20">
          <div className="flex flex-col gap-3 border-t border-line pt-6 md:flex-row md:items-end md:justify-between">
            <div className="flex items-baseline gap-5">
              <span className="mono text-oxide">03</span>
              <h2 className="display text-3xl text-bone md:text-5xl">Mounts</h2>
            </div>
            <p className="mono max-w-md text-ash">
              THE SPACE BETWEEN THE PRINT AND THE GLASS. IT IS NOT DECORATION.
            </p>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {mounts.map((mount) => (
              <div key={mount.slug} className="border border-line bg-ink p-7">
                <p className="display text-2xl text-bone">{mount.name}</p>
                <p className="mt-3 text-sm leading-relaxed text-ash">{mount.blurb}</p>
                <p className="mono mt-6 border-t border-line pt-4 text-oxide">
                  {mount.addCents === 0
                    ? "INCLUDED"
                    : `+${money(Math.round(mount.addCents * ADDIS.scale))} AT A2`}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-6 border border-line bg-ink p-7">
            <p className="eyebrow text-oxide">Why a mount matters</p>
            <p className="mt-4 max-w-4xl text-[15px] leading-relaxed text-ash">
              A window mount keeps the print off the glazing. Without it, over years, the
              image can transfer to the glass in any room with humidity — which, in the
              highlands, is every room. All mounts in this house are cotton rag,
              acid-free, reversible with water, and hinged with archival tape so the
              print can be removed intact by any conservator in fifty years. That is the
              difference between a print and a poster.
            </p>
          </div>
        </div>
      </section>

      {/* FRAMES */}
      <section className="border-b border-line">
        <div className="mx-auto max-w-[1400px] px-5 py-14 md:px-10 md:py-20">
          <div className="flex flex-col gap-3 border-t border-line pt-6 md:flex-row md:items-end md:justify-between">
            <div className="flex items-baseline gap-5">
              <span className="mono text-oxide">04</span>
              <h2 className="display text-3xl text-bone md:text-5xl">
                Frames &amp; glazing
              </h2>
            </div>
            <p className="mono max-w-md text-ash">
              FOUR FINISHES. MUSEUM GLASS ONLY ON THE WALNUT.
            </p>
          </div>

          <div className="mt-10 border border-line">
            {frames.map((frame, i) => {
              const note = FRAME_NOTES[frame.slug];
              const isUnframed = frame.slug === "frame-none";
              return (
                <div
                  key={frame.slug}
                  className={`grid gap-6 p-6 md:grid-cols-12 ${
                    i ? "border-t border-line" : ""
                  }`}
                >
                  <div className="md:col-span-4">
                    <p className="display text-2xl text-bone">{frame.name}</p>
                    <p className="mt-2 text-sm leading-relaxed text-ash">
                      {frame.blurb}
                    </p>
                  </div>
                  {isUnframed ? (
                    <div className="md:col-span-8">
                      <p className="text-sm leading-relaxed text-ash">
                        Your print arrives in a glassine sleeve inside a rigid archival
                        tube, or flat in a board folder. If you have a framer you trust,
                        this is the cheapest way in — and the mount and frame lines
                        simply disappear from the receipt.
                      </p>
                    </div>
                  ) : (
                    <>
                      <div className="md:col-span-3">
                        <p className="eyebrow">Profile</p>
                        <p className="mt-2 text-sm text-bone">
                          {note?.profile ?? "—"}
                        </p>
                      </div>
                      <div className="md:col-span-3">
                        <p className="eyebrow">Glazing</p>
                        <p className="mt-2 text-sm text-bone">{note?.glazing ?? "—"}</p>
                      </div>
                      <div className="md:col-span-2 md:text-right">
                        <p className="eyebrow">Adds at A2</p>
                        <p className="display mt-2 text-2xl text-oxide">
                          +{money(Math.round(frame.addCents * ADDIS.scale))}
                        </p>
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-6 grid gap-px border border-line bg-line md:grid-cols-3">
            {[
              [
                "Acrylic, not glass",
                "We ship framed work behind acrylic everywhere outside Addis. It does not shatter in transit, it weighs a third as much, and it filters UV as standard.",
              ],
              [
                "Museum glass",
                "99% UV and anti-reflective. Worth it if the work hangs opposite a window or under spotlights — otherwise you are paying for a difference you will not see.",
              ],
              [
                "Every frame is glazed on assembly",
                "Cut, joined, cleaned, glazed, sealed and felt-lined at the back. The print never sits loose in the frame.",
              ],
            ].map(([a, b]) => (
              <div key={a} className="bg-ink p-6">
                <p className="display text-xl text-bone">{a}</p>
                <p className="mt-2 text-sm leading-relaxed text-ash">{b}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ANATOMY */}
      <section className="border-b border-line bg-ink-2">
        <div className="mx-auto grid max-w-[1400px] gap-10 px-5 py-14 md:grid-cols-12 md:px-10 md:py-20">
          <div className="md:col-span-5">
            <div className="relative aspect-[4/5] overflow-hidden border border-line">
              <Image
                src="/studio/press-room.jpg"
                alt="Framed work stacked in the house"
                fill
                sizes="(max-width: 768px) 100vw, 40vw"
                className="object-cover"
              />
            </div>
          </div>
          <div className="md:col-span-7">
            <div className="flex flex-col gap-3 border-t border-line pt-6">
              <div className="flex items-baseline gap-5">
                <span className="mono text-oxide">05</span>
                <h2 className="display text-3xl text-bone md:text-5xl">
                  Anatomy of a finished piece
                </h2>
              </div>
            </div>
            <div className="mt-8 border border-line">
              {[
                ["01", "The print", "Archival ink on your chosen paper, dried 24 hours on the rack, never stacked."],
                ["02", "The hinge", "Archival tape, reversible with water, so the print can be removed intact."],
                ["03", "The mount", "8-ply cotton rag window, or floated on 5mm board for deckled edges."],
                ["04", "The backing", "Acid-free board, sealed, felt-lined on the walnut finish."],
                ["05", "The glazing", "Acrylic as standard, museum glass on the top of the range."],
                ["06", "The certificate", "Hand-drawn, signed by the artist, carrying the edition number."],
                ["07", "The register", "Your name against that number, permanently, and searchable."],
                ["08", "The crate", "Fitted corner blocks, glassine, insured courier to your door."],
              ].map(([n, t, b], i) => (
                <div
                  key={n}
                  className={`grid gap-4 p-5 md:grid-cols-12 ${i ? "border-t border-line" : ""}`}
                >
                  <p className="mono text-oxide md:col-span-1">{n}</p>
                  <p className="display text-xl text-bone md:col-span-3">{t}</p>
                  <p className="text-sm leading-relaxed text-ash md:col-span-8">{b}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section>
        <div className="mx-auto max-w-[1400px] px-5 py-14 md:px-10 md:py-20">
          <div className="flex flex-col gap-8 border border-line bg-ink p-8 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="eyebrow text-oxide">The whole menu, live</p>
              <h2 className="display mt-4 max-w-2xl text-3xl text-bone md:text-4xl">
                A1 on Photo Rag with an 8-ply mount and oak box frame:{" "}
                <span className="text-oxide">{money(a1Base.retailCents)}</span>
              </h2>
              <p className="mono mt-4 text-ash">
                OF WHICH THE ARTIST TAKES {money(a1Base.royaltyCents)} — PRINTED ON THE
                PAGE, ALWAYS.
              </p>
            </div>
            <Link href="/works" className="btn shrink-0">
              Build your print
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
