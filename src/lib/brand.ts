import { computeQuote, type QuoteInput, type Quote } from "./pricing";

export type BrandKey = "addis";

export type Brand = {
  key: BrandKey;
  name: string;
  shortName: string;
  legal: string;
  tagline: string;
  strap: string;
  city: string;
  email: string;
  /** CSS scope class that re-maps the design tokens for this house. */
  scope: string;
  currency: {
    code: string;
    symbol: string;
    locale: string;
  };
  /** Route prefix for every page in this house. */
  base: string;
  house: string;
  region: string;
  /** Catalogue prices are authored in the studio currency; this converts them. */
  scale: number;
};

export const ADDIS: Brand = {
  key: "addis",
  name: "ADDIS ART EDITIONS",
  shortName: "ADDIS",
  legal: "Addis Art Editions",
  tagline: "Editions from the highlands, printed to order.",
  strap: "Artists keep the work. The house keeps the press.",
  city: "Addis Ababa · printing for the world",
  email: "editions@addisart.et",
  scope: "brand-addis",
  currency: {
    code: "USD",
    symbol: "$",
    locale: "en-US",
  },
  base: "",
  scale: 0.012,
  house: "the editions house",
  region: "Addis Ababa · Gondar · Nairobi · Khartoum",
};

export function getBrand(): Brand {
  return ADDIS;
}

/**
 * Brand-scoped money formatting. Every price in a house is rendered through
 * this so a collector never sees a foreign symbol.
 */
export function brandMoney(brand: Brand, cents: number): string {
  const value = cents / 100;
  const formatted = value.toLocaleString(brand.currency.locale, {
    maximumFractionDigits: 0,
  });
  return `${brand.currency.symbol}${formatted}`;
}

/**
 * Quote in the house's own currency. Every monetary line the collector,
 * the artist and the studio see comes from here.
 */
export function quoteFor(brand: Brand, input: QuoteInput): Quote {
  return computeQuote({ ...input, scale: brand.scale });
}
