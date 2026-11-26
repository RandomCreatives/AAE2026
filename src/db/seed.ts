import { eq, sql } from "drizzle-orm";

import { db } from "@/db";
import { artists, printOptions, works } from "@/db/schema";

/**
 * Self-healing bootstrap: the app can start against an empty database and
 * still have a catalogue to show. DDL is idempotent and matches schema.ts.
 */
const DDL = [
  `CREATE TABLE IF NOT EXISTS artists (
    id serial PRIMARY KEY,
    slug text NOT NULL UNIQUE,
    name text NOT NULL,
    monogram text NOT NULL,
    role text NOT NULL,
    practice text NOT NULL,
    location text NOT NULL,
    bio text NOT NULL,
    royalty_rate integer NOT NULL DEFAULT 45,
    is_founding boolean NOT NULL DEFAULT false,
    brand text NOT NULL DEFAULT 'addis',
    sort_order integer NOT NULL DEFAULT 0,
    created_at timestamptz NOT NULL DEFAULT now()
  )`,
  `CREATE TABLE IF NOT EXISTS works (
    id serial PRIMARY KEY,
    slug text NOT NULL UNIQUE,
    artist_id integer NOT NULL REFERENCES artists(id) ON DELETE CASCADE,
    title text NOT NULL,
    year integer NOT NULL,
    discipline text NOT NULL,
    original_medium text NOT NULL,
    note text NOT NULL,
    edition_size integer NOT NULL,
    edition_sold integer NOT NULL DEFAULT 0,
    image text NOT NULL,
    orientation text NOT NULL,
    base_price_cents integer NOT NULL,
    status text NOT NULL DEFAULT 'live',
    brand text NOT NULL DEFAULT 'addis',
    sort_order integer NOT NULL DEFAULT 0,
    created_at timestamptz NOT NULL DEFAULT now()
  )`,
  `CREATE TABLE IF NOT EXISTS print_options (
    id serial PRIMARY KEY,
    slug text NOT NULL UNIQUE,
    kind text NOT NULL,
    name text NOT NULL,
    blurb text NOT NULL,
    add_cents integer NOT NULL DEFAULT 0,
    cost_cents integer NOT NULL DEFAULT 0,
    sort_order integer NOT NULL DEFAULT 0,
    active boolean NOT NULL DEFAULT true
  )`,
  `CREATE TABLE IF NOT EXISTS reservations (
    id serial PRIMARY KEY,
    code text NOT NULL UNIQUE,
    work_id integer NOT NULL REFERENCES works(id) ON DELETE CASCADE,
    size_key text NOT NULL,
    paper_slug text NOT NULL,
    mount_slug text,
    frame_slug text,
    quantity integer NOT NULL DEFAULT 1,
    edition_number integer,
    unit_cents integer NOT NULL,
    production_cents integer NOT NULL,
    royalty_cents integer NOT NULL,
    studio_cents integer NOT NULL,
    collector_name text NOT NULL,
    collector_email text NOT NULL,
    note text,
    brand text NOT NULL DEFAULT 'addis',
    status text NOT NULL DEFAULT 'reserved',
    created_at timestamptz NOT NULL DEFAULT now()
  )`,
  `CREATE TABLE IF NOT EXISTS submissions (
    id serial PRIMARY KEY,
    artist_name text NOT NULL,
    email text NOT NULL,
    city text,
    practice text,
    title text NOT NULL,
    medium text,
    edition_idea text,
    statement text,
    portfolio text,
    track text NOT NULL DEFAULT 'a',
    brand text NOT NULL DEFAULT 'addis',
    status text NOT NULL DEFAULT 'in_review',
    created_at timestamptz NOT NULL DEFAULT now()
  )`,
  `CREATE TABLE IF NOT EXISTS waitlist (
    id serial PRIMARY KEY,
    work_id integer NOT NULL REFERENCES works(id) ON DELETE CASCADE,
    collector_name text NOT NULL,
    collector_email text NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now()
  )`,
];

type WorkSeed = {
  brand?: string;
  slug: string;
  artistSlug: string;
  title: string;
  year: number;
  discipline: string;
  originalMedium: string;
  note: string;
  editionSize: number;
  editionSold: number;
  image: string;
  orientation: "landscape" | "portrait" | "square";
  basePriceCents: number;
  status: string;
  sortOrder: number;
};

const ARTIST_SEED = [
  {
    slug: "meron-tadesse",
    name: "Meron Tadesse",
    monogram: "MT",
    role: "Founding artist · Addis No. 001",
    practice: "Oil and gouache on canvas",
    location: "Addis Ababa",
    bio: "Paints the lattice of the Meskel crosses her grandfather drew for a church in Gondar — ochre and indigo, one deliberate gap in every grid. Editions are printed from drum scans that keep the paint's ridges.",
    royaltyRate: 50,
    isFounding: true,
    brand: "addis",
    sortOrder: 10,
  },
  {
    slug: "yohannes-girma",
    name: "Yohannes Girma",
    monogram: "YG",
    role: "Founding artist · Addis No. 002",
    practice: "Ink, oxide and coffee wash on paper",
    location: "Gondar",
    bio: "One breath, one sweep. Works at dawn because the ink behaves differently before the heat arrives. The originals take minutes; the proofs take weeks.",
    royaltyRate: 50,
    isFounding: true,
    brand: "addis",
    sortOrder: 11,
  },
  {
    slug: "selamawit-bekele",
    name: "Selamawit Bekele",
    monogram: "SB",
    role: "Founding artist · Addis No. 003",
    practice: "Large-format photography",
    location: "Addis Ababa / Nairobi",
    bio: "Photographs the rift when the water has gone, and corridors at the hour the light comes in sideways. Prints small editions on baryta, colour-managed against the house monitor.",
    royaltyRate: 45,
    isFounding: true,
    brand: "addis",
    sortOrder: 12,
  },
  {
    slug: "fatima-osman",
    name: "Fatima Osman",
    monogram: "FO",
    role: "Published artist",
    practice: "Collage and two-colour overprint",
    location: "Khartoum",
    bio: "Torn arches and deliberate misregistration — teal against a pink that has no business working. The first artist the house invited without ever meeting her in person.",
    royaltyRate: 40,
    isFounding: false,
    brand: "addis",
    sortOrder: 13,
  },
];

const WORK_SEED: WorkSeed[] = [
  {
    brand: "addis",
    slug: "meskel-lattice",
    artistSlug: "meron-tadesse",
    title: "Meskel Lattice",
    year: 2025,
    discipline: "Painting",
    originalMedium: "Oil on canvas, 120 × 120 cm",
    note: "The interlocking cross-grid from a Gondar church wall, opened in three places. The gaps are the argument.",
    editionSize: 50,
    editionSold: 7,
    image: "/art/addis-cross.jpg",
    orientation: "square",
    basePriceCents: 780_000,
    status: "live",
    sortOrder: 10,
  },
  {
    brand: "addis",
    slug: "em-lalibela-hours",
    artistSlug: "yohannes-girma",
    title: "Lalibela Hours",
    year: 2025,
    discipline: "Painting",
    originalMedium: "Gouache on paper, 56 × 76 cm",
    note: "Eleven hours of a rock-hewn church recorded as eleven rectangles and one graphite line drawn by hand on every print.",
    editionSize: 75,
    editionSold: 12,
    image: "/art/ravi-limestone.jpg",
    orientation: "landscape",
    basePriceCents: 520_000,
    status: "live",
    sortOrder: 11,
  },
  {
    brand: "addis",
    slug: "ember-after",
    artistSlug: "yohannes-girma",
    title: "Ember, After",
    year: 2024,
    discipline: "Painting",
    originalMedium: "Ink, oxide and coffee wash, 76 × 56 cm",
    note: "Coffee was the only binder available that week. It has since become the whole method.",
    editionSize: 40,
    editionSold: 5,
    image: "/art/ravi-furnace.jpg",
    orientation: "portrait",
    basePriceCents: 640_000,
    status: "live",
    sortOrder: 12,
  },
  {
    brand: "addis",
    slug: "rift-dry-season",
    artistSlug: "selamawit-bekele",
    title: "Rift, Dry Season",
    year: 2024,
    discipline: "Photography",
    originalMedium: "Medium format film, 6 × 17 cm",
    note: "Four kilometres of lake bed at 6am. Printed with a deliberate lift in the shadows so the paper holds the haze.",
    editionSize: 25,
    editionSold: 3,
    image: "/art/mira-salt.jpg",
    orientation: "landscape",
    basePriceCents: 560_000,
    status: "live",
    sortOrder: 13,
  },
  {
    brand: "addis",
    slug: "corridor-sihat",
    artistSlug: "selamawit-bekele",
    title: "Corridor, Sihat",
    year: 2025,
    discipline: "Photography",
    originalMedium: "Large format film, 4 × 5 in",
    note: "A public building nobody looks at. The frame is the architecture; the light is the subject.",
    editionSize: 25,
    editionSold: 1,
    image: "/art/mira-corridor.jpg",
    orientation: "portrait",
    basePriceCents: 580_000,
    status: "live",
    sortOrder: 14,
  },
  {
    brand: "addis",
    slug: "terminus-meridian",
    artistSlug: "selamawit-bekele",
    title: "Terminus, Meridian",
    year: 2025,
    discipline: "Digital",
    originalMedium: "Chromatic study, 12-bit gradient field",
    note: "The hour the highland light changes its mind. Born digital, printed like film.",
    editionSize: 100,
    editionSold: 9,
    image: "/art/studio-meridian.jpg",
    orientation: "landscape",
    basePriceCents: 420_000,
    status: "live",
    sortOrder: 15,
  },
  {
    brand: "addis",
    slug: "tibeb-torn",
    artistSlug: "fatima-osman",
    title: "Tibeb, Torn",
    year: 2025,
    discipline: "Print",
    originalMedium: "Two-colour overprint, torn collage",
    note: "The tibeb border of a wedding cloth, torn and misregistered. Every print in the edition is 3mm different — that is the point.",
    editionSize: 60,
    editionSold: 6,
    image: "/art/tobe-diaspora.jpg",
    orientation: "square",
    basePriceCents: 380_000,
    status: "live",
    sortOrder: 16,
  },
  {
    brand: "addis",
    slug: "night-mercato",
    artistSlug: "meron-tadesse",
    title: "Night, Mercato",
    year: 2023,
    discipline: "Print",
    originalMedium: "Etching, 60 × 60 cm",
    note: "The largest open market in Africa, cross-hatched from memory at midnight. Closed at thirty.",
    editionSize: 30,
    editionSold: 30,
    image: "/art/ravi-nocturne.jpg",
    orientation: "square",
    basePriceCents: 590_000,
    status: "sold-out",
    sortOrder: 17,
  },
];

const OPTION_SEED = [
  {
    slug: "cotton-matt",
    kind: "paper",
    name: "Studio Cotton Matt 200gsm",
    blurb: "Our house paper. Matte cotton rag, warm white, archival. Included in the base price.",
    addCents: 0,
    costCents: 90_000,
    sortOrder: 1,
  },
  {
    slug: "photo-rag",
    kind: "paper",
    name: "Photo Rag 308gsm",
    blurb: "The giclée standard. Heavy, soft, no optical brighteners. Best for gestural work.",
    addCents: 260_000,
    costCents: 190_000,
    sortOrder: 2,
  },
  {
    slug: "bamboo",
    kind: "paper",
    name: "Bamboo 290gsm",
    blurb: "Warm tone, subtle tooth, 70% bamboo fibre. Carbon-neutral and gorgeous with earth palettes.",
    addCents: 340_000,
    costCents: 240_000,
    sortOrder: 3,
  },
  {
    slug: "baryta",
    kind: "paper",
    name: "Baryta Glossy 315gsm",
    blurb: "Depth and specular blacks. For photography that needs to glow under glass.",
    addCents: 380_000,
    costCents: 280_000,
    sortOrder: 4,
  },
  {
    slug: "riso-news",
    kind: "paper",
    name: "Riso Newsprint 90gsm",
    blurb: "Only for riso-native editions. Cheap, loud, ages beautifully.",
    addCents: 0,
    costCents: 40_000,
    sortOrder: 5,
  },
  {
    slug: "mount-none",
    kind: "mount",
    name: "No mount",
    blurb: "Print only, or framed flush to the edge.",
    addCents: 0,
    costCents: 0,
    sortOrder: 1,
  },
  {
    slug: "mount-8ply",
    kind: "mount",
    name: "8-ply conservation mount",
    blurb: "Cotton rag window mount plus backing board. Adds breathing room and value.",
    addCents: 180_000,
    costCents: 110_000,
    sortOrder: 2,
  },
  {
    slug: "mount-float",
    kind: "mount",
    name: "Float mount on 5mm board",
    blurb: "Deckled edge floating over a backing — the contemporary gallery look.",
    addCents: 140_000,
    costCents: 80_000,
    sortOrder: 3,
  },
  {
    slug: "frame-none",
    kind: "frame",
    name: "Unframed",
    blurb: "Archival sleeve or rigid tube. Ready for your own framer.",
    addCents: 0,
    costCents: 0,
    sortOrder: 1,
  },
  {
    slug: "frame-aluminium",
    kind: "frame",
    name: "Anodised aluminium",
    blurb: "Slim black or natural aluminium, shatter-proof acrylic. The quiet option.",
    addCents: 540_000,
    costCents: 290_000,
    sortOrder: 2,
  },
  {
    slug: "frame-oak",
    kind: "frame",
    name: "Natural oak box frame",
    blurb: "Solid oak, hand-oiled, 25mm box profile, acrylic glazing.",
    addCents: 680_000,
    costCents: 360_000,
    sortOrder: 3,
  },
  {
    slug: "frame-ash-black",
    kind: "frame",
    name: "Stained ash, black",
    blurb: "Deep black stain on ash with a visible grain. Acrylic glazing.",
    addCents: 720_000,
    costCents: 380_000,
    sortOrder: 4,
  },
  {
    slug: "frame-walnut-museum",
    kind: "frame",
    name: "Walnut + museum glass",
    blurb: "The top of the house. Solid walnut, 99% UV museum glass, felt-lined back.",
    addCents: 1_150_000,
    costCents: 620_000,
    sortOrder: 5,
  },
];

/** For databases created before the brand column existed. */
const MIGRATIONS = [
  `ALTER TABLE artists ADD COLUMN IF NOT EXISTS brand text NOT NULL DEFAULT 'addis'`,
  `ALTER TABLE works ADD COLUMN IF NOT EXISTS brand text NOT NULL DEFAULT 'addis'`,
  `ALTER TABLE reservations ADD COLUMN IF NOT EXISTS brand text NOT NULL DEFAULT 'addis'`,
  `ALTER TABLE submissions ADD COLUMN IF NOT EXISTS brand text NOT NULL DEFAULT 'addis'`,
  `ALTER TABLE reservations ADD COLUMN IF NOT EXISTS edition_number integer`,
];

let bootstrapPromise: Promise<void> | null = null;

async function runBootstrap(): Promise<void> {
  for (const statement of [...DDL, ...MIGRATIONS]) {
    await db.execute(sql.raw(statement));
  }

  const existing = await db
    .select({ id: artists.id })
    .from(artists)
    .where(eq(artists.brand, "addis"))
    .limit(1);
  if (existing.length === 0) {
    const inserted = await db
      .insert(artists)
      .values(ARTIST_SEED)
      .returning({ id: artists.id, slug: artists.slug });
    const idBySlug = new Map(inserted.map((a) => [a.slug, a.id]));
    await db.insert(works).values(
      WORK_SEED.map((w) => ({
        ...w,
        artistId: idBySlug.get(w.artistSlug) ?? inserted[0].id,
      })),
    );
  }

  const optionCount = await db
    .select({ id: printOptions.id })
    .from(printOptions)
    .limit(1);
  if (optionCount.length === 0) {
    await db.insert(printOptions).values(OPTION_SEED);
  }
}

/** Idempotent, cached per process. Call at the top of any data loader. */
export async function ensureCatalogue(): Promise<void> {
  if (!bootstrapPromise) {
    bootstrapPromise = runBootstrap().catch((error) => {
      bootstrapPromise = null;
      throw error;
    });
  }
  return bootstrapPromise;
}
