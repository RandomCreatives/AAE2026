/**
 * Single place to change studio-level settings.
 * Currency is a flag so the numbers can be localised in one line.
 */
export const CURRENCY = {
  code: "USD",
  symbol: "$",
  label: "USD",
  locale: "en-US",
} as const;

export const STUDIO = {
  name: "ADDIS ART EDITIONS",
  legal: "Addis Art Editions",
  tagline: "Editions from the highlands, printed to order.",
  strap: "Artists keep the work. The house keeps the press.",
  email: "editions@addisart.et",
  city: "Addis Ababa · printing for the world",
  /** Flat studio overheads loaded onto every order. */
  captureQcCents: 25_000, // capture, colour-proof + QC, amortised per order
  packagingUnframedCents: 35_000, // glassine + archival tube or rigid sleeve
  packagingCents: 85_000, // fitted crate, corner blocks, insured courier
  printLabourCents: 1_450_00, // ink + operator time at A2 reference
} as const;

export const FEES = {
  /** Flat insured delivery allowance charged against the margin at order time. */
  deliveryCents: 1_200,
  /** Card + settlement fee, in basis points of the retail total. */
  gatewayBasisPoints: 250,
} as const;

export function formatMoney(cents: number): string {
  const value = cents / 100;
  return `${CURRENCY.symbol}${value.toLocaleString("en-US", {
    maximumFractionDigits: 0,
  })}`;
}
