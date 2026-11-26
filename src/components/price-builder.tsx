"use client";

import Image from "next/image";
import { useMemo, useState } from "react";

import { ADDIS, brandMoney, quoteFor, type Brand } from "@/lib/brand";
import {
  computeQuote,
  SIZES,
  type CatalogueOption,
  type SizeKey,
} from "@/lib/pricing";

type WorkProps = {
  slug: string;
  title: string;
  year: number;
  originalMedium: string;
  note: string;
  image: string;
  orientation: string;
  editionSize: number;
  editionSold: number;
  basePriceCents: number;
  status: string;
};

type ArtistProps = {
  name: string;
  slug: string;
  role: string;
  practice: string;
  royaltyRate: number;
};

const FRAME_STYLES: Record<string, { border: string; label: string }> = {
  "frame-none": { border: "border-0 p-0", label: "Unframed" },
  "frame-aluminium": { border: "border-[10px] border-[#1b1b1e]", label: "Aluminium" },
  "frame-oak": { border: "border-[16px] border-[#b38b57]", label: "Oak" },
  "frame-ash-black": { border: "border-[16px] border-[#1d1d20]", label: "Ash black" },
  "frame-walnut-museum": {
    border: "border-[22px] border-[#5b3a25]",
    label: "Walnut",
  },
};

function OptionRow({
  option,
  selected,
  addCents,
  format,
  onSelect,
}: {
  option: CatalogueOption;
  selected: boolean;
  addCents: number;
  format: (cents: number) => string;
  onSelect: (slug: string) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onSelect(option.slug)}
      className={`flex w-full items-start justify-between gap-4 border p-4 text-left transition-colors ${
        selected
          ? "border-oxide bg-oxide/10"
          : "border-line hover:border-ash/60 hover:bg-ink-3/40"
      }`}
    >
      <span className="flex-1">
        <span className="flex items-center gap-3">
          <span
            className={`inline-block h-2 w-2 shrink-0 ${
              selected ? "bg-oxide" : "border border-ash"
            }`}
          />
          <span className="text-sm text-bone">{option.name}</span>
        </span>
        <span className="mt-2 block pl-5 text-xs leading-relaxed text-ash">
          {option.blurb}
        </span>
      </span>
      <span className="mono whitespace-nowrap pt-1 text-ash">
        {option.addCents === 0 ? "included" : `+${format(addCents)}`}
      </span>
    </button>
  );
}

export function PriceBuilder({
  work,
  artist,
  options,
  brand = ADDIS,
}: {
  work: WorkProps;
  artist: ArtistProps;
  options: CatalogueOption[];
  brand?: Brand;
}) {
  const money = (cents: number) => brandMoney(brand, cents);
  const papers = useMemo(() => options.filter((o) => o.kind === "paper"), [options]);
  const mounts = useMemo(() => options.filter((o) => o.kind === "mount"), [options]);
  const frames = useMemo(() => options.filter((o) => o.kind === "frame"), [options]);

  const paperFor = (slug: string) =>
    papers.find((p) => p.slug === slug) ?? papers[0] ?? null;

  const [size, setSize] = useState<SizeKey>("a2");
  const [paperSlug, setPaperSlug] = useState(
    papers.find((p) => p.slug === "photo-rag")?.slug ?? papers[0]?.slug ?? "",
  );
  const [mountSlug, setMountSlug] = useState("mount-none");
  const [frameSlug, setFrameSlug] = useState("frame-none");
  const [showEconomics, setShowEconomics] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [note, setNote] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{
    code: string;
    editionNumber: number;
    retailLabel: string;
    quantity: number;
  } | null>(null);

  const paper = paperFor(paperSlug);
  const mount = mounts.find((m) => m.slug === mountSlug) ?? null;
  const frame = frames.find((f) => f.slug === frameSlug) ?? null;

  const quote = useMemo(
    () =>
      paper
        ? quoteFor(brand, {
            basePriceCents: work.basePriceCents,
            royaltyRate: artist.royaltyRate,
            size,
            paper,
            mount,
            frame,
          })
        : null,
    [brand, work.basePriceCents, artist.royaltyRate, size, paper, mount, frame],
  );

  const remaining = Math.max(work.editionSize - work.editionSold, 0);
  const soldOut = work.status === "sold-out" || remaining === 0;

  const aspect =
    work.orientation === "portrait"
      ? "aspect-[3/4]"
      : work.orientation === "landscape"
        ? "aspect-[4/3]"
        : "aspect-square";

  const frameStyle = FRAME_STYLES[frameSlug] ?? FRAME_STYLES["frame-none"];
  const mountPadding =
    mountSlug === "mount-8ply"
      ? "bg-[#efeade] p-[6%]"
      : mountSlug === "mount-float"
        ? "bg-[#141416] p-[5%]"
        : "p-0";

  async function submit() {
    setPending(true);
    setError(null);
    try {
      const response = await fetch("/api/reserve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          brand: brand.key,
          workSlug: work.slug,
          size,
          paperSlug,
          mountSlug,
          frameSlug,
          quantity,
          collectorName: name,
          collectorEmail: email,
          note,
        }),
      });
      const payload = (await response.json()) as {
        error?: string;
        code?: string;
        editionNumber?: number;
        retailLabel?: string;
        quantity?: number;
      };
      if (!response.ok) {
        setError(payload.error ?? "Something went wrong.");
      } else if (payload.code) {
        setResult({
          code: payload.code,
          editionNumber: payload.editionNumber ?? 0,
          retailLabel: payload.retailLabel ?? "",
          quantity: payload.quantity ?? 1,
        });
      }
    } catch {
      setError("Network error — try again.");
    } finally {
      setPending(false);
    }
  }

  if (!quote || !paper) {
    return (
      <div className="border border-line p-10 text-center text-ash">
        The print catalogue is still loading.
      </div>
    );
  }

  return (
    <div className="grid gap-12 lg:grid-cols-12">
      {/* Preview */}
      <div className="lg:col-span-6">
        <div className="relative border border-line bg-ink-2 p-8 md:p-14">
          <div className={`relative ${frameStyle.border} ${mountPadding} transition-all duration-300`}>
            <div className={`relative overflow-hidden ${aspect}`}>
              <Image
                src={work.image}
                alt={work.title}
                fill
                priority
                sizes="(max-width: 1024px) 90vw, 45vw"
                className="object-cover"
              />
            </div>
          </div>
          <div className="mt-6 flex items-center justify-between mono text-[10px] tracking-[0.16em] text-ash">
            <span>
              {quote.size.label} · {quote.size.dims}
            </span>
            <span>{frameStyle.label.toUpperCase()}</span>
          </div>
        </div>

        <div className="mt-6 border border-line p-6">
          <p className="eyebrow text-oxide">Artist&apos;s note</p>
          <p className="mt-4 text-[15px] leading-relaxed text-ash">{work.note}</p>
          <div className="mt-6 grid grid-cols-2 gap-4 border-t border-line pt-6 mono text-ash">
            <div>
              <p>ORIGINAL</p>
              <p className="mt-1 text-bone">{work.originalMedium}</p>
            </div>
            <div>
              <p>EDITION</p>
              <p className="mt-1 text-bone">
                {work.editionSold} / {work.editionSize} claimed
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Configurator */}
      <div className="lg:col-span-6">
        <p className="eyebrow text-oxide">{artist.name} · {work.year}</p>
        <h1 className="display mt-3 text-4xl text-bone md:text-5xl">{work.title}</h1>

        {/* sizes */}
        <div className="mt-8">
          <p className="eyebrow">Size</p>
          <div className="mt-3 grid grid-cols-3 gap-px border border-line bg-line sm:grid-cols-6">
            {SIZES.map((s) => (
              <button
                key={s.key}
                type="button"
                onClick={() => setSize(s.key)}
                className={`bg-ink px-2 py-3 text-center transition-colors ${
                  size === s.key ? "bg-oxide text-white" : "hover:bg-ink-3"
                }`}
              >
                <span className="mono block">{s.label}</span>
                <span className="mono mt-1 block text-[9px] text-ash">
                  {Math.round(s.area * 100) / 100}×
                </span>
              </button>
            ))}
          </div>
          <p className="mono mt-3 text-ash">
            Image value scales with print area · {money(
              Math.round(work.basePriceCents * brand.scale),
            )}{" "}
            at A2
          </p>
        </div>

        {/* papers */}
        <div className="mt-8">
          <p className="eyebrow">Paper</p>
          <div className="mt-3 space-y-2">
            {papers.map((option) => (
              <OptionRow
                key={option.slug}
                option={option}
                selected={option.slug === paperSlug}
                addCents={Math.round((option.addCents * brand.scale * quote.size.area) / 100) * 100}
                format={money}
                onSelect={setPaperSlug}
              />
            ))}
          </div>
        </div>

        {/* mount */}
        <div className="mt-8">
          <p className="eyebrow">Mount</p>
          <div className="mt-3 space-y-2">
            {mounts.map((option) => (
              <OptionRow
                key={option.slug}
                option={option}
                selected={option.slug === mountSlug}
                addCents={Math.round((option.addCents * brand.scale * quote.size.area) / 100) * 100}
                format={money}
                onSelect={setMountSlug}
              />
            ))}
          </div>
        </div>

        {/* frame */}
        <div className="mt-8">
          <p className="eyebrow">Frame</p>
          <div className="mt-3 space-y-2">
            {frames.map((option) => (
              <OptionRow
                key={option.slug}
                option={option}
                selected={option.slug === frameSlug}
                addCents={Math.round((option.addCents * brand.scale * quote.size.area) / 100) * 100}
                format={money}
                onSelect={setFrameSlug}
              />
            ))}
          </div>
        </div>

        {/* summary */}
        <div className="mt-10 border border-line bg-ink-2">
          <div className="border-b border-line p-5">
            {quote.lines.map((line) => (
              <div
                key={line.label}
                className="flex items-baseline justify-between border-b border-line/50 py-2 last:border-0"
              >
                <p className="text-sm text-ash">{line.label}</p>
                <p className="mono text-bone">{money(line.amount)}</p>
              </div>
            ))}
          </div>

          <div className="flex items-end justify-between gap-4 p-5">
            <div>
              <p className="eyebrow">Your price, per print</p>
              <p className="display mt-2 text-5xl text-bone">
                {money(quote.retailCents)}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                aria-label="Fewer prints"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="h-9 w-9 border border-line text-bone hover:border-oxide"
              >
                −
              </button>
              <span className="mono w-8 text-center text-bone">{quantity}</span>
              <button
                type="button"
                aria-label="More prints"
                onClick={() =>
                  setQuantity((q) => Math.min(Math.max(remaining, 1), q + 1))
                }
                className="h-9 w-9 border border-line text-bone hover:border-oxide"
              >
                +
              </button>
            </div>
          </div>

          <div className="border-t border-line">
            <button
              type="button"
              onClick={() => setShowEconomics((v) => !v)}
              className="flex w-full items-center justify-between p-4 mono text-[10px] tracking-[0.18em] text-ash hover:text-oxide"
            >
              <span>SHOW THE MARGIN SPLIT — WE PUBLISH IT</span>
              <span>{showEconomics ? "−" : "+"}</span>
            </button>
            {showEconomics ? (
              <div className="grid gap-px bg-line sm:grid-cols-3">
                <div className="bg-ink p-4">
                  <p className="eyebrow">Production</p>
                  <p className="display mt-2 text-2xl text-ash">
                    {money(quote.productionCents)}
                  </p>
                  <p className="mono mt-2 text-ash">house carries this</p>
                </div>
                <div className="bg-ink p-4">
                  <p className="eyebrow text-oxide">
                    Artist · {quote.royaltyRate}%
                  </p>
                  <p className="display mt-2 text-2xl text-oxide">
                    {money(quote.royaltyCents)}
                  </p>
                  <p className="mono mt-2 text-ash">per print, monthly</p>
                </div>
                <div className="bg-ink p-4">
                  <p className="eyebrow">Studio net</p>
                  <p className="display mt-2 text-2xl text-bone">
                    {money(quote.studioCents)}
                  </p>
                  <p className="mono mt-2 text-ash">
                    margin {money(quote.marginCents)}
                  </p>
                </div>
              </div>
            ) : null}
          </div>
        </div>

        {/* reserve */}
        <div className="mt-6 border border-line p-5">
          {result ? (
            <div className="border border-moss/50 bg-moss/10 p-6">
              <p className="eyebrow text-moss">Reserved</p>
              <p className="display mt-3 text-3xl text-bone">{result.code}</p>
              <p className="mt-4 text-sm leading-relaxed text-ash">
                {result.quantity > 1
                  ? `${result.quantity} prints`
                  : "One print"}{" "}
                of <span className="text-bone">{work.title}</span> are held for you at{" "}
                {result.retailLabel}. Edition number{" "}
                <span className="text-bone">
                  {result.editionNumber} / {work.editionSize}
                </span>{" "}
                is now logged in the house register. The studio emails within 24 hours
                to confirm paper, glazing and delivery.
              </p>
              <a href={`${brand.base}/works`} className="btn-ghost mt-6">
                Back to the shelf
              </a>
            </div>
          ) : (
            <>
              <p className="eyebrow text-oxide">Reserve from this edition</p>
              <p className="mt-3 text-sm text-ash">
                {soldOut
                  ? "This edition is closed. Join the waiting list and we will write to you if a print returns."
                  : `${remaining} of ${work.editionSize} prints left. No payment now — the studio confirms and invoices.`}
              </p>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <input
                  className="field"
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <input
                  className="field"
                  placeholder="Email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <textarea
                className="field mt-3"
                rows={2}
                placeholder="Delivery city, or anything we should know"
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
              {error ? <p className="mono mt-3 text-oxide">{error}</p> : null}
              <button
                type="button"
                onClick={submit}
                disabled={pending || !name.trim() || !email.trim()}
                className="btn mt-4 w-full disabled:cursor-not-allowed disabled:opacity-40"
              >
                {pending
                  ? "Holding your print…"
                  : soldOut
                    ? "Join the waiting list"
                    : `Reserve · ${money(quote.retailCents * quantity)}`}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
