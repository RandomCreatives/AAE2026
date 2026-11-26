import Link from "next/link";

import { WorkCard } from "@/components/work-card";
import { ADDIS } from "@/lib/brand";
import { getArtistsWithCounts, getCatalogueOptions, getWorks } from "@/lib/queries";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Editions — Addis Art Editions",
  description:
    "Every open edition on the Addis shelf, printable in any size on any paper in any frame.",
};

function normalize(value: string | string[] | undefined): string | undefined {
  if (Array.isArray(value)) return value[0];
  return value;
}

export default async function AddisWorksPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const artistSlug = normalize(params.artist);
  const discipline = normalize(params.discipline);

  const [rows, options, artists, allRows] = await Promise.all([
    getWorks({ artistSlug, discipline, brand: "addis" }),
    getCatalogueOptions(),
    getArtistsWithCounts("addis"),
    getWorks({ brand: "addis" }),
  ]);

  const allDisciplines = Array.from(
    new Set(allRows.map((r) => r.work.discipline)),
  ).sort();

  const chip = (active: boolean) =>
    `inline-flex items-center border px-3 py-2 mono uppercase transition-colors ${
      active
        ? "border-oxide bg-oxide text-white"
        : "border-line text-ash hover:border-oxide hover:text-oxide"
    }`;

  return (
    <div>
      <section className="border-b border-line">
        <div className="mx-auto max-w-[1400px] px-5 py-12 md:px-10 md:py-16">
          <p className="eyebrow text-oxide">The shelf</p>
          <h1 className="display mt-4 text-5xl text-bone md:text-7xl">
            Every edition
            <span className="italic text-ash">, numbered.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ash">
            {rows.length} works from {artists.length} artists across {ADDIS.region}.
            Printed to order in Addis Ababa on your choice of paper, mounted and framed
            by hand, and logged in the register with a signed certificate.
          </p>
        </div>
      </section>

      <section className="border-b border-line bg-ink-2">
        <div className="mx-auto flex max-w-[1400px] flex-col gap-4 px-5 py-6 md:flex-row md:flex-wrap md:items-center md:gap-6 md:px-10">
          <div className="flex flex-wrap items-center gap-2">
            <span className="mono mr-1 text-ash">ARTIST</span>
            <Link
              href={discipline ? `/works?discipline=${discipline}` : "/works"}
              className={chip(!artistSlug)}
            >
              All
            </Link>
            {artists.map((artist) => (
              <Link
                key={artist.slug}
                href={`/works?artist=${artist.slug}${
                  discipline ? `&discipline=${discipline}` : ""
                }`}
                className={chip(artistSlug === artist.slug)}
              >
                {artist.name.split(" ")[0]}
              </Link>
            ))}
          </div>
          <div className="hidden h-6 w-px bg-line md:block" />
          <div className="flex flex-wrap items-center gap-2">
            <span className="mono mr-1 text-ash">FORM</span>
            {allDisciplines.map((d) => (
              <Link
                key={d}
                href={`/works?discipline=${d}${
                  artistSlug ? `&artist=${artistSlug}` : ""
                }`}
                className={chip(discipline === d)}
              >
                {d}
              </Link>
            ))}
          </div>
          <p className="mono ml-auto text-ash">{rows.length} EDITIONS IN VIEW</p>
        </div>
      </section>

      <section className="mx-auto max-w-[1400px] px-5 py-12 md:px-10 md:py-16">
        {rows.length === 0 ? (
          <div className="border border-line p-14 text-center">
            <p className="display text-3xl text-bone">Nothing here yet.</p>
            <p className="mt-4 text-ash">
              Clear the filters, or{" "}
              <Link className="link text-oxide" href="/submit">
                submit a work
              </Link>{" "}
              to fill the gap.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {rows.map((row, i) => (
              <WorkCard
                key={row.work.id}
                work={row.work}
                artist={row.artist}
                options={options}
                brand={ADDIS}
                href={`/works/${row.work.slug}`}
                priority={i < 3}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
