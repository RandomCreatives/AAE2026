import Link from "next/link";
import { notFound } from "next/navigation";

import { PriceBuilder } from "@/components/price-builder";
import { ADDIS } from "@/lib/brand";
import { getCatalogueOptions, getWorkBySlug, getWorks } from "@/lib/queries";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const row = await getWorkBySlug(slug, "addis");
  if (!row) return { title: "Not found — Addis Art Editions" };
  return {
    title: `${row.work.title} — ${row.artist.name} · Addis Art Editions`,
    description: row.work.note,
  };
}

export default async function AddisWorkPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [row, options] = await Promise.all([
    getWorkBySlug(slug, "addis"),
    getCatalogueOptions(),
  ]);

  if (!row) notFound();

  const more = (await getWorks({ brand: "addis" }))
    .filter((r) => r.artist.slug === row.artist.slug && r.work.slug !== slug)
    .slice(0, 3);

  return (
    <div>
      <div className="border-b border-line">
        <div className="mx-auto flex max-w-[1400px] items-center gap-3 px-5 py-4 mono text-[10px] tracking-[0.18em] text-ash md:px-10">
          <Link href="/works" className="link hover:text-bone">
            EDITIONS
          </Link>
          <span>/</span>
          <Link href={`/artists/${row.artist.slug}`} className="link hover:text-bone">
            {row.artist.name.toUpperCase()}
          </Link>
          <span>/</span>
          <span className="text-oxide">{row.work.title.toUpperCase()}</span>
        </div>
      </div>

      <section className="mx-auto max-w-[1400px] px-5 py-10 md:px-10 md:py-14">
        <PriceBuilder
          brand={ADDIS}
          work={{
            slug: row.work.slug,
            title: row.work.title,
            year: row.work.year,
            originalMedium: row.work.originalMedium,
            note: row.work.note,
            image: row.work.image,
            orientation: row.work.orientation,
            editionSize: row.work.editionSize,
            editionSold: row.work.editionSold,
            basePriceCents: row.work.basePriceCents,
            status: row.work.status,
          }}
          artist={{
            name: row.artist.name,
            slug: row.artist.slug,
            role: row.artist.role,
            practice: row.artist.practice,
            royaltyRate: row.artist.royaltyRate,
          }}
          options={options}
        />
      </section>

      <section className="border-t border-line bg-ink-2">
        <div className="mx-auto max-w-[1400px] px-5 py-10 md:px-10 md:py-14">
          <div className="flex flex-col gap-6 border border-line bg-ink p-7 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="eyebrow text-oxide">The artist</p>
              <p className="display mt-3 text-3xl text-bone">{row.artist.name}</p>
              <p className="mono mt-2 text-ash">
                {row.artist.role} · {row.artist.practice} · {row.artist.location}
              </p>
              <p className="mt-4 max-w-xl text-sm leading-relaxed text-ash">
                {row.artist.bio}
              </p>
            </div>
            <Link
              href={`/artists/${row.artist.slug}`}
              className="btn-ghost shrink-0"
            >
              {row.artist.name.split(" ")[0]}&apos;s editions
            </Link>
          </div>

          <div className="mt-8 grid gap-px border border-line bg-line md:grid-cols-3">
            {[
              ["Copyright", "Stays with the artist, always"],
              ["Certificate", "Hand-drawn and signed, one per print"],
              ["Register", `Entry ${row.work.editionSold} of ${row.work.editionSize} claimed`],
            ].map(([a, b]) => (
              <div key={a} className="bg-ink p-6">
                <p className="eyebrow">{a}</p>
                <p className="mt-3 text-sm text-ash">{b}</p>
              </div>
            ))}
          </div>

          {more.length ? (
            <div className="mt-10">
              <p className="eyebrow">More from this hand</p>
              <div className="mt-4 grid gap-6 sm:grid-cols-3">
                {more.map((item) => (
                  <Link
                    key={item.work.id}
                    href={`/works/${item.work.slug}`}
                    className="group border border-line bg-ink p-5 transition-colors hover:border-oxide/60"
                  >
                    <p className="display text-2xl text-bone">{item.work.title}</p>
                    <p className="mono mt-2 text-ash">
                      {item.work.year} · {item.work.discipline}
                    </p>
                    <p className="mono mt-4 text-oxide opacity-0 transition-opacity group-hover:opacity-100">
                      VIEW →
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </section>
    </div>
  );
}
