import Link from "next/link";

import { RoyaltyCalculator } from "@/components/royalty-calculator";
import { ADDIS, brandMoney, quoteFor } from "@/lib/brand";
import { findOption } from "@/lib/pricing";
import { getCatalogueOptions, getStudioTotals, getWorks } from "@/lib/queries";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "The Model — Addis Art Editions",
  description:
    "How the house is funded, how the margin is split, and exactly what an artist is paid. With a live calculator you can argue with.",
};

const RULES = [
  "Copyright never moves. Not at signing, not at scale, not in the small print.",
  "Royalty is a share of gross margin, never of list price.",
  "Production cost is printed on the product page, next to the price.",
  "An edition is numbered and closed. It is never silently re-opened.",
  "Artist's proofs are logged in the same register as the numbered prints.",
  "The artist sees the same dashboard the house sees.",
  "Payouts are monthly, with a statement, and there is no minimum threshold.",
  "Returns are absorbed by the house. Never clawed back from the artist.",
  "The shelf is curated. The house says no, and says no often.",
  "Any artist leaves with their files, in sixty days.",
];

const RISKS = [
  [
    "One press is a single point of failure",
    "Capture, print, mount, frame, pack is a real week. If one of us is ill, the house stops shipping.",
    "Batch printing, a small stock of proven bestsellers, and a framing partner from phase two.",
  ],
  [
    "Cross-border logistics from Addis",
    "Customs paperwork and courier reliability out of Ethiopia are harder than out of Europe.",
    "Acrylic instead of glass, fitted crates, insured couriers, and a fulfilment partner for volume.",
  ],
  [
    "Wall art is discretionary",
    "The first thing a household cuts in a bad year is a framed print.",
    "No inventory, no gallery rent, and an entry price at A5 that stays human.",
  ],
  [
    "Curation means saying no to friends",
    "The moment submissions open, someone we like gets rejected.",
    "A written standard, small batches, and identical terms for everyone.",
  ],
  [
    "Currency exposure",
    "Artists are paid in USD while our costs are in birr.",
    "Pricing and payouts are both in USD; the house carries the conversion risk.",
  ],
];

export default async function AddisModelPage() {
  const [rows, options, totals] = await Promise.all([
    getWorks({ brand: "addis" }),
    getCatalogueOptions(),
    getStudioTotals("addis"),
  ]);

  const money = (cents: number) => brandMoney(ADDIS, cents);
  const paper = findOption(options, "paper", "photo-rag") ?? options[0];

  const calcWorks = rows.map((row) => ({
    slug: row.work.slug,
    title: row.work.title,
    artistName: row.artist.name,
    basePriceCents: row.work.basePriceCents,
    royaltyRate: row.artist.royaltyRate,
  }));

  const flagship = rows.find((r) => r.work.slug === "meskel-lattice") ?? rows[0];
  const receipt = quoteFor(ADDIS, {
    basePriceCents: flagship?.work.basePriceCents ?? 640_000,
    royaltyRate: flagship?.artist.royaltyRate ?? 60,
    size: "a1",
    paper,
    mount: findOption(options, "mount", "mount-8ply"),
    frame: findOption(options, "frame", "frame-oak"),
  });

  const tracks = [
    {
      key: "B",
      name: "Founding artist",
      for: "The four already on the shelf",
      terms: [
        "60% of gross margin on prints, permanently",
        "Edition size they set",
        "A veto on curation for year one",
        "First position on the shelf",
        "No exclusivity on originals",
      ],
    },
    {
      key: "A",
      name: "Published artist",
      for: "Invited, in small batches",
      terms: [
        "60% of gross margin on prints",
        "Zero upfront cost, ever",
        "The house's collectors and search traffic",
        "The house chooses size, paper and price band",
        "90-day rolling term, no lock-in",
      ],
    },
    {
      key: "C",
      name: "Resident producer",
      for: "The hands behind the press",
      terms: [
        "A fixed production fee on every print",
        "A share of the house net",
        "Co-owner of the craft standard",
        "Name on the colophon of every edition",
      ],
    },
  ];

  return (
    <div>
      <section className="border-b border-line">
        <div className="mx-auto max-w-[1400px] px-5 py-12 md:px-10 md:py-20">
          <p className="eyebrow text-oxide">The model</p>
          <h1 className="display mt-6 max-w-4xl text-5xl text-bone md:text-7xl">
            The artist is never
            <span className="italic text-ash"> asked for money.</span>
          </h1>
          <p className="mt-8 max-w-3xl text-lg leading-relaxed text-ash">
            Everything about this house is designed around one commitment: the person who
            made the work takes no financial risk and pays nothing upfront. The house
            finances the print, carries the loss when one does not sell, and pays a
            published share of every one that does.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link href="/submit" className="btn">
              Register interest
            </Link>
            <Link href="/works" className="btn-ghost">
              Test the storefront
            </Link>
          </div>
        </div>
      </section>

      {/* THE ARITHMETIC */}
      <section className="border-b border-line bg-ink-2">
        <div className="mx-auto max-w-[1400px] px-5 py-14 md:px-10 md:py-20">
          <div className="flex flex-col gap-3 border-t border-line pt-6 md:flex-row md:items-end md:justify-between">
            <div className="flex items-baseline gap-5">
              <span className="mono text-oxide">01</span>
              <h2 className="display text-3xl text-bone md:text-5xl">
                The arithmetic, in one line
              </h2>
            </div>
            <p className="mono max-w-md text-ash">
              RETAIL − PRODUCTION = MARGIN. MARGIN SPLITS: ARTIST, HOUSE.
            </p>
          </div>

          <div className="mt-10 grid gap-px border border-line bg-line md:grid-cols-5">
            {[
              ["Collector pays", money(receipt.retailCents), "text-bone", "size, paper, mount, frame"],
              ["Production", `−${money(receipt.productionCents)}`, "text-ash", "the house carries this"],
              ["Gross margin", money(receipt.marginCents), "text-bone", "what there is to split"],
              ["Artist", money(receipt.royaltyCents), "text-oxide", `${receipt.royaltyRate}% of margin, monthly`],
              ["The house", money(receipt.studioCents), "text-bone", "press, rent, returns"],
            ].map(([label, value, tone, sub]) => (
              <div key={label} className="bg-ink p-6">
                <p className="eyebrow">{label}</p>
                <p className={`display mt-3 text-3xl ${tone}`}>{value}</p>
                <p className="mono mt-3 text-ash">{sub}</p>
              </div>
            ))}
          </div>

          <p className="mt-4 mono text-ash">
            EXAMPLE: {flagship?.work.title.toUpperCase()} AT A1 ON PHOTO RAG, 8-PLY
            MOUNT, OAK BOX FRAME.
          </p>
        </div>
      </section>

      {/* TRACKS */}
      <section className="border-b border-line">
        <div className="mx-auto max-w-[1400px] px-5 py-14 md:px-10 md:py-20">
          <div className="flex flex-col gap-3 border-t border-line pt-6 md:flex-row md:items-end md:justify-between">
            <div className="flex items-baseline gap-5">
              <span className="mono text-oxide">02</span>
              <h2 className="display text-3xl text-bone md:text-5xl">Three tracks</h2>
            </div>
            <p className="mono max-w-md text-ash">
              SAME HOUSE, THREE POSITIONS. YOU CAN HOLD MORE THAN ONE.
            </p>
          </div>
          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            {tracks.map((track) => (
              <div key={track.key} className="flex flex-col justify-between border border-line bg-ink-2 p-7">
                <div>
                  <div className="flex items-start justify-between">
                    <span className="mono text-oxide">TRACK {track.key}</span>
                  </div>
                  <h3 className="display mt-5 text-3xl text-bone">{track.name}</h3>
                  <p className="mt-2 text-sm text-ash">{track.for}</p>
                </div>
                <ul className="mt-8 space-y-3 border-t border-line pt-6">
                  {track.terms.map((term) => (
                    <li key={term} className="flex gap-3 text-sm text-ash">
                      <span className="mono text-oxide">+</span>
                      <span>{term}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href={`/submit?track=${track.key.toLowerCase()}`}
                  className={`mt-8 ${track.key === "B" ? "btn" : "btn-ghost"}`}
                >
                  Take track {track.key}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CALCULATOR */}
      <section className="border-b border-line bg-ink-2">
        <div className="mx-auto max-w-[1400px] px-5 py-14 md:px-10 md:py-20">
          <div className="flex flex-col gap-3 border-t border-line pt-6 md:flex-row md:items-end md:justify-between">
            <div className="flex items-baseline gap-5">
              <span className="mono text-oxide">03</span>
              <h2 className="display text-3xl text-bone md:text-5xl">
                Run your own numbers
              </h2>
            </div>
            <p className="mono max-w-md text-ash">
              LIVE FROM THE ADDIS CATALOGUE. MOVE IT UNTIL IT LOOKS HONEST.
            </p>
          </div>
          <div className="mt-10">
            <RoyaltyCalculator works={calcWorks} options={options} brand={ADDIS} />
          </div>
        </div>
      </section>

      {/* RULES */}
      <section className="border-b border-line">
        <div className="mx-auto max-w-[1400px] px-5 py-14 md:px-10 md:py-20">
          <div className="flex flex-col gap-3 border-t border-line pt-6 md:flex-row md:items-end md:justify-between">
            <div className="flex items-baseline gap-5">
              <span className="mono text-oxide">04</span>
              <h2 className="display text-3xl text-bone md:text-5xl">House rules</h2>
            </div>
            <p className="mono max-w-md text-ash">
              NON-NEGOTIABLE, PRINTED ON THE WALL OF THE PRESS ROOM.
            </p>
          </div>
          <div className="mt-10 border border-line">
            {RULES.map((rule, i) => (
              <div key={rule} className={`flex gap-5 p-5 ${i ? "border-t border-line" : ""}`}>
                <span className="mono w-8 shrink-0 text-oxide">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p className="text-[15px] leading-relaxed text-bone">{rule}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* RISKS */}
      <section className="border-b border-line bg-ink-2">
        <div className="mx-auto max-w-[1400px] px-5 py-14 md:px-10 md:py-20">
          <div className="flex flex-col gap-3 border-t border-line pt-6 md:flex-row md:items-end md:justify-between">
            <div className="flex items-baseline gap-5">
              <span className="mono text-oxide">05</span>
              <h2 className="display text-3xl text-bone md:text-5xl">
                What could go wrong
              </h2>
            </div>
            <p className="mono max-w-md text-ash">
              BETTER FROM US THAN FROM A COURIER.
            </p>
          </div>
          <div className="mt-10 grid gap-px border border-line bg-line md:grid-cols-2">
            {RISKS.map(([title, body, fix]) => (
              <div key={title} className="bg-ink p-7">
                <p className="display text-2xl text-bone">{title}</p>
                <p className="mt-3 text-sm leading-relaxed text-ash">{body}</p>
                <p className="mt-5 border-t border-line pt-4 text-sm leading-relaxed text-moss">
                  Mitigation — {fix}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* STATUS */}
      <section>
        <div className="mx-auto max-w-[1400px] px-5 py-14 md:px-10 md:py-20">
          <div className="grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <p className="eyebrow text-oxide">06 · Where this stands today</p>
              <h2 className="display mt-5 text-4xl text-bone md:text-5xl">
                Running, not proposed.
              </h2>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-ash">
                The storefront, the pricing engine, the register and the submissions
                funnel are all live and reading from one database. What is left to
                decide is the deal, not the technology.
              </p>
              <div className="mt-8 grid grid-cols-2 gap-px border border-line bg-line sm:grid-cols-4">
                {[
                  ["Artists", String(totals.artistCount)],
                  ["Editions", String(totals.workCount)],
                  ["Prints claimed", String(totals.editionsSold)],
                  ["Submissions", String(totals.submissions)],
                ].map(([label, value]) => (
                  <div key={label} className="bg-ink p-5">
                    <p className="eyebrow">{label}</p>
                    <p className="display mt-3 text-3xl text-bone">{value}</p>
                  </div>
                ))}
              </div>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link href="/submit" className="btn">
                  Register interest
                </Link>
                <Link href="/craft" className="btn-ghost">
                  Read the craft guide
                </Link>
              </div>
            </div>
            <div className="lg:col-span-5">
              <div className="border border-line p-7">
                <p className="eyebrow text-oxide">Also open for debate</p>
                <ul className="mt-5 space-y-4">
                  {[
                    "Whether founding artists also take a share of the house's net",
                    "Do we sell originals on the same shelf, or editions only",
                    "Whether the first drop is four works or eight",
                    "Artist's proofs: how many, and for whom",
                    "Who signs the courier and customs contracts",
                  ].map((item) => (
                    <li key={item} className="flex gap-3 text-sm text-ash">
                      <span className="mono text-oxide">?</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
