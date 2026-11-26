import {
  boolean,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

/**
 * Addis Art Editions data model.
 *
 * The studio is a *publisher*, not a gallery. Artists (authors) hold their
 * copyright and submit works; the studio captures, proofs, prints, mounts,
 * frames, packs and ships. Every sale is split from a transparent margin.
 */

export const artists = pgTable("artists", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  monogram: text("monogram").notNull(),
  role: text("role").notNull(),
  practice: text("practice").notNull(),
  location: text("location").notNull(),
  bio: text("bio").notNull(),
  /** Percent of gross margin paid to the artist on every print sold. */
  royaltyRate: integer("royalty_rate").notNull().default(45),
  isFounding: boolean("is_founding").notNull().default(false),
  brand: text("brand").notNull().default("addis"),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const works = pgTable("works", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  artistId: integer("artist_id")
    .notNull()
    .references(() => artists.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  year: integer("year").notNull(),
  discipline: text("discipline").notNull(),
  originalMedium: text("original_medium").notNull(),
  note: text("note").notNull(),
  editionSize: integer("edition_size").notNull(),
  editionSold: integer("edition_sold").notNull().default(0),
  image: text("image").notNull(),
  orientation: text("orientation").notNull(),
  /** Retail value of the image itself at the A2 reference size, unframed. */
  basePriceCents: integer("base_price_cents").notNull(),
  status: text("status").notNull().default("live"),
  brand: text("brand").notNull().default("addis"),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

/** Paper / mount / frame catalogue. Studio SKUs, editable at any time. */
export const printOptions = pgTable("print_options", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  kind: text("kind").notNull(),
  name: text("name").notNull(),
  blurb: text("blurb").notNull(),
  /** Retail contribution at the A2 reference size, in cents. */
  addCents: integer("add_cents").notNull().default(0),
  /** Studio production cost at the A2 reference size, in cents. */
  costCents: integer("cost_cents").notNull().default(0),
  sortOrder: integer("sort_order").notNull().default(0),
  active: boolean("active").notNull().default(true),
});

/** Collector reservations — an edition number is held, then invoiced. */
export const reservations = pgTable("reservations", {
  id: serial("id").primaryKey(),
  code: text("code").notNull().unique(),
  workId: integer("work_id")
    .notNull()
    .references(() => works.id, { onDelete: "cascade" }),
  sizeKey: text("size_key").notNull(),
  paperSlug: text("paper_slug").notNull(),
  mountSlug: text("mount_slug"),
  frameSlug: text("frame_slug"),
  quantity: integer("quantity").notNull().default(1),
  editionNumber: integer("edition_number"),
  unitCents: integer("unit_cents").notNull(),
  productionCents: integer("production_cents").notNull(),
  royaltyCents: integer("royalty_cents").notNull(),
  studioCents: integer("studio_cents").notNull(),
  collectorName: text("collector_name").notNull(),
  collectorEmail: text("collector_email").notNull(),
  note: text("note"),
  brand: text("brand").notNull().default("addis"),
  status: text("status").notNull().default("reserved"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

/** Open submissions — the "send us your work" funnel. */
/** Collectors waiting for a closed edition to return. */
export const waitlist = pgTable("waitlist", {
  id: serial("id").primaryKey(),
  workId: integer("work_id")
    .notNull()
    .references(() => works.id, { onDelete: "cascade" }),
  collectorName: text("collector_name").notNull(),
  collectorEmail: text("collector_email").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const submissions = pgTable("submissions", {
  id: serial("id").primaryKey(),
  artistName: text("artist_name").notNull(),
  email: text("email").notNull(),
  city: text("city"),
  practice: text("practice"),
  title: text("title").notNull(),
  medium: text("medium"),
  editionIdea: text("edition_idea"),
  statement: text("statement"),
  portfolio: text("portfolio"),
  track: text("track").notNull().default("a"),
  brand: text("brand").notNull().default("addis"),
  status: text("status").notNull().default("in_review"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});
