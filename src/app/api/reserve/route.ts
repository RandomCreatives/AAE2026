import { NextResponse } from "next/server";

import { getBrand, quoteFor } from "@/lib/brand";
import { brandMoney } from "@/lib/brand";
import { findOption, type SizeKey } from "@/lib/pricing";
import {
  createReservation,
  EditionClosedError,
  getCatalogueOptions,
  getWorkBySlug,
} from "@/lib/queries";

export const dynamic = "force-dynamic";

type Body = {
  brand?: string;
  workSlug?: string;
  size?: string;
  paperSlug?: string;
  mountSlug?: string | null;
  frameSlug?: string | null;
  quantity?: number;
  collectorName?: string;
  collectorEmail?: string;
  note?: string | null;
};

const SIZES = ["a5", "a4", "a3", "a2", "a1", "a0"];

export async function POST(request: Request) {
  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const { workSlug, collectorName, collectorEmail } = body;
  if (!workSlug || !collectorName?.trim() || !collectorEmail?.trim()) {
    return NextResponse.json(
      { error: "workSlug, collectorName and collectorEmail are required." },
      { status: 400 },
    );
  }
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(collectorEmail)) {
    return NextResponse.json({ error: "That email looks wrong." }, { status: 400 });
  }

  const size = (body.size && SIZES.includes(body.size) ? body.size : "a2") as SizeKey;
  const quantity = Math.min(Math.max(Number(body.quantity) || 1, 1), 5);

  const brand = getBrand();
  const row = await getWorkBySlug(workSlug, brand.key);
  if (!row) {
    return NextResponse.json(
      { error: "That work is not on this house's shelf." },
      { status: 404 },
    );
  }

  const remaining = row.work.editionSize - row.work.editionSold;
  if (row.work.status === "sold-out" || remaining <= 0) {
    return NextResponse.json({ error: "This edition is closed." }, { status: 409 });
  }
  if (quantity > remaining) {
    return NextResponse.json(
      { error: `Only ${remaining} print(s) left in this edition.` },
      { status: 409 },
    );
  }

  const options = await getCatalogueOptions();

  const paper =
    findOption(options, "paper", body.paperSlug) ??
    findOption(options, "paper", "cotton-matt") ??
    options.find((o) => o.kind === "paper");
  const mount = findOption(options, "mount", body.mountSlug) ?? null;
  const frame =
    findOption(options, "frame", body.frameSlug) ??
    findOption(options, "frame", "frame-none");

  if (!paper) {
    return NextResponse.json({ error: "Catalogue is empty." }, { status: 500 });
  }

  const quote = quoteFor(brand, {
    basePriceCents: row.work.basePriceCents,
    royaltyRate: row.artist.royaltyRate,
    size,
    paper,
    mount,
    frame: frame ?? null,
  });

  let reservation;
  try {
    reservation = await createReservation({
      brand: brand.key,
      workId: row.work.id,
      size,
      paperSlug: paper.slug,
      mountSlug: mount?.slug ?? null,
      frameSlug: frame?.slug ?? null,
      quantity,
      unitCents: quote.retailCents,
      productionCents: quote.productionCents,
      royaltyCents: quote.royaltyCents,
      studioCents: quote.studioCents,
      collectorName: collectorName.trim(),
      collectorEmail: collectorEmail.trim(),
      note: body.note?.trim() || null,
    });
  } catch (error) {
    if (error instanceof EditionClosedError) {
      return NextResponse.json({ error: error.message }, { status: 409 });
    }
    throw error;
  }

  const firstNumber = reservation.editionNumber;
  const lastNumber =
    firstNumber === null ? null : firstNumber + reservation.quantity - 1;

  return NextResponse.json(
    {
      code: reservation.code,
      workTitle: row.work.title,
      artist: row.artist.name,
      editionNumber: firstNumber,
      editionRange:
        firstNumber === null
          ? null
          : firstNumber === lastNumber
            ? String(firstNumber)
            : `${firstNumber}–${lastNumber}`,
      editionSize: row.work.editionSize,
      quantity: reservation.quantity,
      totalRetailCents: quote.retailCents * reservation.quantity,
      totalRoyaltyCents: quote.royaltyCents * reservation.quantity,
      retailLabel: brandMoney(brand, quote.retailCents * reservation.quantity),
    },
    { status: 201 },
  );
}
