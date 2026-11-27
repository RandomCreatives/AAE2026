import Image from "next/image";
import Link from "next/link";

import { ADDIS, brandMoney, quoteFor, type Brand } from "@/lib/brand";
import { computeQuote, findOption, sizeSpec } from "@/lib/pricing";
import type { CatalogueOption } from "@/lib/pricing";
import type { ArtistRow, WorkRow } from "@/lib/queries";

export function workPriceRange(
  work: WorkRow,
  options: CatalogueOption[],
  brand: Brand = ADDIS,
): { fromCents: number; framedCents: number } {
  const paper = findOption(options, "paper", "cotton-matt") ?? options[0];
  const frame = findOption(options, "frame", "frame-oak");
  const entry = quoteFor(brand, {
    basePriceCents: work.basePriceCents,
    royaltyRate: 45,
    size: "a4",
    paper,
  });
  const framed = quoteFor(brand, {
    basePriceCents: work.basePriceCents,
    royaltyRate: 45,
    size: "a1",
    paper: findOption(options, "paper", "photo-rag") ?? paper,
    frame,
  });
  return { fromCents: entry.retailCents, framedCents: framed.retailCents };
}

const ASPECT: Record<string, string> = {
  portrait: "aspect-[3/4]",
  landscape: "aspect-[4/3]",
  square: "aspect-square",
};

export function WorkCard({
  work,
  artist,
  options,
  brand = ADDIS,
  href,
  priority = false,
}: {
  work: WorkRow;
  artist: ArtistRow;
  options: CatalogueOption[];
  brand?: Brand;
  href?: string;
  priority?: boolean;
}) {
  const { fromCents, framedCents } = workPriceRange(work, options, brand);
  const money = (cents: number) => brandMoney(brand, cents);
  const link = href ?? `${brand.base}/works/${work.slug}`;
  const remaining = Math.max(work.editionSize - work.editionSold, 0);
  const soldOut = work.status === "sold-out" || remaining === 0;

  return (
    <Link
      href={link}
      className="group block border border-line bg-ink-2 transition-colors hover:border-oxide/60"
    >
      <div className={`relative overflow-hidden ${ASPECT[work.orientation] ?? "aspect-square"}`}>
        <Image
          src={work.image}
          alt={`${work.title} — ${artist.name}`}
          fill
          priority={priority}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className={`object-cover transition-transform duration-700 group-hover:scale-[1.03] ${
            soldOut ? "opacity-40 saturate-0" : ""
          }`}
        />
        {soldOut ? (
          <span className="absolute left-4 top-4 border border-bone/60 bg-ink/80 px-2 py-1 mono text-[10px] tracking-[0.2em] text-bone">
            EDITION CLOSED
          </span>
        ) : work.itemMode === "original" ? (
          <span className="absolute left-4 top-4 border border-bone/60 bg-ink/80 px-2 py-1 mono text-[10px] tracking-[0.2em] text-bone">
            UNIQUE 1/1
          </span>
        ) : work.itemMode === "open" ? (
          <span className="absolute left-4 top-4 border border-bone/60 bg-ink/80 px-2 py-1 mono text-[10px] tracking-[0.2em] text-bone">
            OPEN EDITION
          </span>
        ) : null}
        <span className="absolute bottom-3 right-3 mono text-[10px] tracking-[0.2em] text-bone/70">
          {sizeSpec("a2").label} REF · {brand.currency.code}
        </span>
      </div>
      <div className="flex items-start justify-between gap-4 border-t border-line p-5">
        <div>
          <p className="eyebrow">{artist.name}</p>
          <h3 className="display mt-2 text-2xl leading-tight text-bone">{work.title}</h3>
          <p className="mono mt-2 text-ash">
            {work.year} · {work.originalMedium.split(",")[0]}
          </p>
        </div>
        <div className="text-right">
          <p className="mono text-bone">from {money(fromCents)}</p>
          <p className="mono mt-2 text-ash">
            {work.itemMode === "original"
              ? "one existing work"
              : work.itemMode === "open"
                ? "printed to order"
                : `${remaining} / ${work.editionSize} left`}
          </p>
        </div>
      </div>
      <div className="flex items-center justify-between border-t border-line px-5 py-3 mono text-[10px] tracking-[0.16em] text-ash">
        <span>{framedCents ? `FRAMED A1 ${money(framedCents)}` : ""}</span>
        <span className="text-oxide opacity-0 transition-opacity group-hover:opacity-100">
          BUILD A PRINT →
        </span>
      </div>
    </Link>
  );
}
