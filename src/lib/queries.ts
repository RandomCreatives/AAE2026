import { and, asc, desc, eq, ne, sql } from "drizzle-orm";

import { db } from "@/db";
import {
  artists,
  printOptions,
  reservations,
  submissions,
  waitlist,
  works,
} from "@/db/schema";
import { ensureCatalogue } from "@/db/seed";
import type { ReservationStatus } from "@/lib/order-status";
import type { BrandKey } from "@/lib/brand";
import {
  computeOrderLedger,
  type CatalogueOption,
  type OptionKind,
  type OrderMode,
  type SizeKey,
} from "@/lib/pricing";

export type ArtistRow = typeof artists.$inferSelect;
export type WorkRow = typeof works.$inferSelect;

export type WorkWithArtist = {
  work: WorkRow;
  artist: ArtistRow;
};

export type ReservationRow = typeof reservations.$inferSelect & {
  workTitle: string;
  artistName: string;
  artistRate: number;
};

export async function getCatalogueOptions(): Promise<CatalogueOption[]> {
  await ensureCatalogue();
  const rows = await db
    .select()
    .from(printOptions)
    .where(eq(printOptions.active, true))
    .orderBy(asc(printOptions.kind), asc(printOptions.sortOrder));

  return rows.map((row) => ({
    slug: row.slug,
    kind: row.kind as OptionKind,
    name: row.name,
    blurb: row.blurb,
    addCents: row.addCents,
    costCents: row.costCents,
  }));
}

export async function getWorks(filters?: {
  artistSlug?: string;
  discipline?: string;
  includeAll?: boolean;
  brand?: BrandKey;
}): Promise<WorkWithArtist[]> {
  await ensureCatalogue();
  const conditions = [];
  if (!filters?.includeAll) conditions.push(sql`${works.status} <> 'draft'`);
  if (filters?.brand) conditions.push(eq(works.brand, filters.brand));
  if (filters?.artistSlug) conditions.push(eq(artists.slug, filters.artistSlug));
  if (filters?.discipline) conditions.push(eq(works.discipline, filters.discipline));

  const rows = await db
    .select({ work: works, artist: artists })
    .from(works)
    .innerJoin(artists, eq(works.artistId, artists.id))
    .where(conditions.length ? and(...conditions) : undefined)
    .orderBy(asc(works.sortOrder), asc(works.id));

  return rows;
}

export async function getWorkBySlug(
  slug: string,
  brand?: BrandKey,
): Promise<WorkWithArtist | null> {
  await ensureCatalogue();
  const rows = await db
    .select({ work: works, artist: artists })
    .from(works)
    .innerJoin(artists, eq(works.artistId, artists.id))
    .where(
      brand
        ? and(eq(works.slug, slug), eq(works.brand, brand))
        : eq(works.slug, slug),
    )
    .limit(1);

  return rows[0] ?? null;
}

export async function getArtistsWithCounts(
  brand?: BrandKey,
): Promise<(ArtistRow & { workCount: number; editionsSold: number })[]> {
  await ensureCatalogue();
  const brandFilter = brand ? eq(artists.brand, brand) : undefined;
  const rows = await db
    .select({
      artist: artists,
      workCount: sql<number>`count(${works.id})::int`,
      editionsSold: sql<number>`coalesce(sum(${works.editionSold}), 0)::int`,
    })
    .from(artists)
    .leftJoin(
      works,
      and(
        eq(works.artistId, artists.id),
        sql`${works.status} <> 'draft'`,
        brand ? eq(works.brand, brand) : undefined,
      ),
    )
    .where(brandFilter)
    .groupBy(artists.id)
    .orderBy(asc(artists.sortOrder));

  return rows.map((row) => ({
    ...row.artist,
    workCount: row.workCount,
    editionsSold: row.editionsSold,
  }));
}

export async function getArtistBySlug(slug: string, brand?: BrandKey) {
  await ensureCatalogue();
  const rows = await db
    .select()
    .from(artists)
    .where(
      brand
        ? and(eq(artists.slug, slug), eq(artists.brand, brand))
        : eq(artists.slug, slug),
    )
    .limit(1);
  const artist = rows[0];
  if (!artist) return null;
  const artistWorks = await getWorks({
    artistSlug: slug,
    brand: artist.brand as BrandKey,
  });
  return { artist, works: artistWorks };
}

export type ReservationInput = {
  brand: BrandKey;
  workId: number;
  itemMode: OrderMode;
  deliveryFeeCents: number;
  gatewayFeeCents: number;
  size: SizeKey;
  paperSlug: string;
  mountSlug: string | null;
  frameSlug: string | null;
  quantity: number;
  unitCents: number;
  productionCents: number;
  royaltyCents: number;
  studioCents: number;
  collectorName: string;
  collectorEmail: string;
  note: string | null;
};

/** A short, self-identifying prefix for every certificate. */
function reservationCode(): string {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let tail = "";
  for (let i = 0; i < 5; i += 1) {
    tail += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return `ADD-${tail}`;
}

export class EditionClosedError extends Error {
  constructor(message = "This edition is closed.") {
    super(message);
    this.name = "EditionClosedError";
  }
}

export async function createReservation(input: ReservationInput) {
  await ensureCatalogue();
  const code = reservationCode();
  const { size, itemMode, deliveryFeeCents, gatewayFeeCents, ...rest } = input;
  const ledger = computeOrderLedger({
    retailCents: input.unitCents * input.quantity,
    productionCents: input.productionCents * input.quantity,
    mode: itemMode,
    deliveryFeeCents,
    gatewayFeeCents,
  });

  return db.transaction(async (tx) => {
    const [work] = await tx
      .select()
      .from(works)
      .where(eq(works.id, input.workId))
      .for("update");

    if (!work || work.status === "sold-out") throw new EditionClosedError();

    let editionNumber: number | null = null;
    if (itemMode === "original") {
      const [held] = await tx
        .select({ id: reservations.id })
        .from(reservations)
        .where(
          and(
            eq(reservations.workId, work.id),
            ne(reservations.status, "cancelled"),
          ),
        )
        .limit(1);
      if (held) throw new EditionClosedError("This original is already held.");
      editionNumber = 1;
    } else if (itemMode === "limited") {
      const remaining = work.editionSize - work.editionSold;
      if (input.quantity > remaining) throw new EditionClosedError();
      editionNumber = work.editionSold + 1;
    }

    const [inserted] = await tx
      .insert(reservations)
      .values({
        ...rest,
        sizeKey: size,
        code,
        editionNumber,
        deliveryFeeCents,
        gatewayFeeCents,
        netProfitCents: ledger.netProfitCents,
        splitRate: ledger.splitRate,
        artistShareCents: Math.round(ledger.artistShareCents / input.quantity),
        studioShareCents: Math.round(ledger.studioShareCents / input.quantity),
        royaltyCents: Math.round(ledger.artistShareCents / input.quantity),
        studioCents: Math.round(ledger.studioShareCents / input.quantity),
      })
      .returning();

    const serialNumber = `AM-${new Date().getFullYear()}-${String(inserted.id).padStart(4, "0")}`;
    const [row] = await tx
      .update(reservations)
      .set({ serialNumber })
      .where(eq(reservations.id, inserted.id))
      .returning();

    await tx
      .update(works)
      .set({
        editionSold:
          itemMode === "original"
            ? sql`1`
            : sql`${works.editionSold} + ${input.quantity}`,
      })
      .where(eq(works.id, input.workId));

    return row;
  });
}

export async function getReservations(
  limit = 25,
  brand?: BrandKey,
): Promise<ReservationRow[]> {
  await ensureCatalogue();
  const rows = await db
    .select({
      reservation: reservations,
      workTitle: works.title,
      artistName: artists.name,
      artistRate: artists.royaltyRate,
    })
    .from(reservations)
    .innerJoin(works, eq(reservations.workId, works.id))
    .innerJoin(artists, eq(works.artistId, artists.id))
    .where(brand ? eq(reservations.brand, brand) : undefined)
    .orderBy(desc(reservations.createdAt))
    .limit(limit);

  return rows.map((row) => ({
    ...row.reservation,
    workTitle: row.workTitle,
    artistName: row.artistName,
    artistRate: row.artistRate,
  }));
}

export type SubmissionInput = {
  brand: BrandKey;
  artistName: string;
  email: string;
  city: string | null;
  practice: string | null;
  title: string;
  medium: string | null;
  editionIdea: string | null;
  statement: string | null;
  portfolio: string | null;
  track: string;
};

export async function createSubmission(input: SubmissionInput) {
  await ensureCatalogue();
  const rows = await db.insert(submissions).values(input).returning();
  return rows[0];
}

export async function getSubmissions(limit = 20, brand?: BrandKey) {
  await ensureCatalogue();
  return db
    .select()
    .from(submissions)
    .where(brand ? eq(submissions.brand, brand) : undefined)
    .orderBy(desc(submissions.createdAt))
    .limit(limit);
}

export async function getReservationByCode(
  code: string,
  brand?: BrandKey,
): Promise<(ReservationRow & { workSlug: string; editionSize: number }) | null> {
  await ensureCatalogue();
  const rows = await db
    .select({
      reservation: reservations,
      workTitle: works.title,
      workSlug: works.slug,
      editionSize: works.editionSize,
      artistName: artists.name,
      artistRate: artists.royaltyRate,
    })
    .from(reservations)
    .innerJoin(works, eq(reservations.workId, works.id))
    .innerJoin(artists, eq(works.artistId, artists.id))
    .where(
      brand
        ? and(
            eq(reservations.code, code.toUpperCase().trim()),
            eq(reservations.brand, brand),
          )
        : eq(reservations.code, code.toUpperCase().trim()),
    )
    .limit(1);

  const row = rows[0];
  if (!row) return null;
  return {
    ...row.reservation,
    workTitle: row.workTitle,
    workSlug: row.workSlug,
    editionSize: row.editionSize,
    artistName: row.artistName,
    artistRate: row.artistRate,
  };
}

export { RESERVATION_STATUSES } from "@/lib/order-status";
export type { ReservationStatus } from "@/lib/order-status";

export async function updateReservationStatus(
  id: number,
  status: ReservationStatus,
) {
  await ensureCatalogue();
  const [row] = await db
    .update(reservations)
    .set({ status })
    .where(eq(reservations.id, id))
    .returning();
  return row ?? null;
}

export async function getReservationBySerial(serialNumber: string) {
  await ensureCatalogue();
  const [row] = await db
    .select({
      reservation: reservations,
      workTitle: works.title,
      workSlug: works.slug,
      artistName: artists.name,
      editionSize: works.editionSize,
      itemMode: works.itemMode,
    })
    .from(reservations)
    .innerJoin(works, eq(reservations.workId, works.id))
    .innerJoin(artists, eq(works.artistId, artists.id))
    .where(eq(reservations.serialNumber, serialNumber.trim().toUpperCase()))
    .limit(1);
  if (!row) return null;
  return {
    ...row.reservation,
    workTitle: row.workTitle,
    workSlug: row.workSlug,
    artistName: row.artistName,
    editionSize: row.editionSize,
    itemMode: row.itemMode,
  };
}

export async function getReservationCount(brand?: BrandKey): Promise<number> {
  await ensureCatalogue();
  const [row] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(reservations)
    .where(brand ? eq(reservations.brand, brand) : undefined);
  return row?.count ?? 0;
}

export async function createWaitlistEntry(input: {
  workId: number;
  collectorName: string;
  collectorEmail: string;
}) {
  await ensureCatalogue();
  const [row] = await db.insert(waitlist).values(input).returning();
  const [count] = await db
    .select({ total: sql<number>`count(*)::int` })
    .from(waitlist)
    .where(eq(waitlist.workId, input.workId));
  return { ...row, position: count?.total ?? 1 };
}

export async function getSubmissionByReference(reference: string) {
  await ensureCatalogue();
  const match = /^SUB-(\d+)$/.exec(reference.trim().toUpperCase());
  if (!match) return null;
  const [row] = await db
    .select({
      id: submissions.id,
      artistName: submissions.artistName,
      title: submissions.title,
      track: submissions.track,
      status: submissions.status,
      createdAt: submissions.createdAt,
    })
    .from(submissions)
    .where(eq(submissions.id, Number(match[1])))
    .limit(1);
  return row ?? null;
}

export type StudioTotals = {
  reservations: number;
  grossCents: number;
  artistCents: number;
  studioCents: number;
  editionsSold: number;
  artistCount: number;
  workCount: number;
  submissions: number;
};

export async function getStudioTotals(brand?: BrandKey): Promise<StudioTotals> {
  await ensureCatalogue();
  const salesFilter = brand ? eq(reservations.brand, brand) : undefined;
  const workBrand = brand ?? "addis";

  const [sales] = await db
    .select({
      count: sql<number>`count(*)::int`,
      gross: sql<number>`coalesce(sum(${reservations.unitCents} * ${reservations.quantity}), 0)::int`,
      artist: sql<number>`coalesce(sum(${reservations.royaltyCents} * ${reservations.quantity}), 0)::int`,
      studio: sql<number>`coalesce(sum(${reservations.studioCents} * ${reservations.quantity}), 0)::int`,
    })
    .from(reservations)
    .where(salesFilter);

  const [catalogue] = await db
    .select({
      artists: sql<number>`(select count(*) from ${artists} where brand = ${workBrand})::int`,
      works: sql<number>`(select count(*) from ${works} where brand = ${workBrand})::int`,
      sold: sql<number>`(select coalesce(sum(edition_sold), 0) from ${works} where brand = ${workBrand})::int`,
    })
    .from(artists)
    .limit(1);

  const [open] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(submissions)
    .where(brand ? eq(submissions.brand, brand) : undefined);

  return {
    reservations: sales?.count ?? 0,
    grossCents: sales?.gross ?? 0,
    artistCents: sales?.artist ?? 0,
    studioCents: sales?.studio ?? 0,
    editionsSold: catalogue?.sold ?? 0,
    artistCount: catalogue?.artists ?? 0,
    workCount: catalogue?.works ?? 0,
    submissions: open?.count ?? 0,
  };
}
