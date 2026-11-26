import { STUDIO } from "./config";

export type OptionKind = "paper" | "mount" | "frame";

export type SizeKey = "a5" | "a4" | "a3" | "a2" | "a1" | "a0";

export type SizeSpec = {
  key: SizeKey;
  label: string;
  dims: string;
  /** Print area relative to A2 (the reference size). Drives all scaling. */
  area: number;
};

export const SIZES: SizeSpec[] = [
  { key: "a5", label: "A5", dims: "148 × 210 mm", area: 0.16 },
  { key: "a4", label: "A4", dims: "210 × 297 mm", area: 0.32 },
  { key: "a3", label: "A3", dims: "297 × 420 mm", area: 0.55 },
  { key: "a2", label: "A2", dims: "420 × 594 mm", area: 1 },
  { key: "a1", label: "A1", dims: "594 × 841 mm", area: 1.58 },
  { key: "a0", label: "A0", dims: "841 × 1189 mm", area: 2.4 },
];

export const DEFAULT_SIZE: SizeKey = "a2";

export function sizeSpec(key: string): SizeSpec {
  return SIZES.find((s) => s.key === key) ?? SIZES[3];
}

export type CatalogueOption = {
  slug: string;
  kind: OptionKind;
  name: string;
  blurb: string;
  /** Retail contribution at the A2 reference size. */
  addCents: number;
  /** Studio production cost at the A2 reference size. */
  costCents: number;
};

export const NONE_OPTION: CatalogueOption = {
  slug: "none",
  kind: "frame",
  name: "Unframed",
  blurb: "Archival sleeve or tube — ready for your framer.",
  addCents: 0,
  costCents: 0,
};

export type QuoteInput = {
  basePriceCents: number;
  royaltyRate: number;
  /**
   * Catalogue prices are authored in the studio's operating currency. The house
   * passes a scale so every line — retail, production, royalty, studio net —
   * lands in the collector's currency.
   */
  scale?: number;
  size: SizeKey;
  paper: CatalogueOption;
  mount?: CatalogueOption | null;
  frame?: CatalogueOption | null;
};

export type QuoteLine = { label: string; detail: string; amount: number };

export type Quote = {
  size: SizeSpec;
  imageCents: number;
  paperCents: number;
  mountCents: number;
  frameCents: number;
  retailCents: number;
  productionCents: number;
  marginCents: number;
  royaltyRate: number;
  royaltyCents: number;
  studioCents: number;
  lines: QuoteLine[];
};

const roundToUnit = (cents: number) => Math.round(cents / 100) * 100;

/**
 * The whole business in one function.
 * retail − production = margin. margin splits into artist royalty + studio net.
 * Nothing is hidden: the collector, the artist and the studio see the same math.
 */
export function computeQuote(input: QuoteInput): Quote {
  const spec = sizeSpec(input.size);
  const area = spec.area;
  const k = input.scale ?? 1;

  const paper = input.paper;
  const mount = input.mount ?? null;
  const frame = input.frame ?? null;

  // "frame-none" is a real catalogue row (kind: frame) with zero cost — it must
  // never be priced as a framed shipment.
  const isFramed = Boolean(
    frame &&
      frame.kind === "frame" &&
      frame.slug !== "none" &&
      frame.slug !== "frame-none",
  );

  const imageCents = roundToUnit(input.basePriceCents * k * area);
  const paperCents = roundToUnit(paper.addCents * k * area);
  const mountCents = mount ? roundToUnit(mount.addCents * k * area) : 0;
  const frameCents = isFramed && frame ? roundToUnit(frame.addCents * k * area) : 0;

  const retailCents = imageCents + paperCents + mountCents + frameCents;

  const productionCents =
    roundToUnit(STUDIO.printLabourCents * k * area) +
    roundToUnit(paper.costCents * k * area) +
    (mount ? roundToUnit(mount.costCents * k * area) : 0) +
    (isFramed && frame ? roundToUnit(frame.costCents * k * area) : 0) +
    roundToUnit(STUDIO.captureQcCents * k) +
    roundToUnit((isFramed ? STUDIO.packagingCents : STUDIO.packagingUnframedCents) * k);

  const marginCents = retailCents - productionCents;
  const royaltyRate = input.royaltyRate;
  const royaltyCents = Math.round((marginCents * royaltyRate) / 100);
  const studioCents = marginCents - royaltyCents;

  const lines: QuoteLine[] = [
    {
      label: `Image licence · ${spec.label}`,
      detail: `${spec.label} · ${area}× the A2 reference area`,
      amount: imageCents,
    },
    { label: paper.name, detail: spec.label, amount: paperCents },
  ];
  if (mount) {
    lines.push({ label: mount.name, detail: spec.label, amount: mountCents });
  }
  if (isFramed && frame) {
    lines.push({ label: frame.name, detail: spec.label, amount: frameCents });
  }

  return {
    size: spec,
    imageCents,
    paperCents,
    mountCents,
    frameCents,
    retailCents,
    productionCents,
    marginCents,
    royaltyRate,
    royaltyCents,
    studioCents,
    lines,
  };
}

export function groupByKind(options: CatalogueOption[]) {
  const papers = options.filter((o) => o.kind === "paper");
  const mounts = options.filter((o) => o.kind === "mount");
  const frames = options.filter((o) => o.kind === "frame");
  return { papers, mounts, frames };
}

export function findOption(
  options: CatalogueOption[],
  kind: OptionKind,
  slug: string | null | undefined,
): CatalogueOption | undefined {
  if (!slug || slug === "none") return undefined;
  return options.find((o) => o.kind === kind && o.slug === slug);
}
