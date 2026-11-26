import Link from "next/link";

import { ADDIS, brandMoney } from "@/lib/brand";
import { getReservations } from "@/lib/queries";
import { getReservationByCode } from "@/lib/queries";
import { getWorks } from "@/lib/queries";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "The Register — Addis Art Editions",
  description:
    "Every print the house has ever made: its code, its edition number and the collector who holds it. Searchable by anyone.",
};

export default async function AddisRegisterPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const raw = Array.isArray(params.code) ? params.code[0] : params.code;
  const code = raw?.trim() ?? "";

  const [ledger, works, found] = await Promise.all([
    getReservations(30, "addis"),
    getWorks({ brand: "addis", includeAll: true }),
    code ? getReservationByCode(code, "addis") : Promise.resolve(null),
  ]);

  const money = (cents: number) => brandMoney(ADDIS, cents);
  const addisLedger = ledger;
  const counts = works.reduce(
    (acc, row) => {
      acc.claimed += row.work.editionSold;
      acc.total += row.work.editionSize;
      return acc;
    },
    { claimed: 0, total: 0 },
  );

  return (
    <div>
      <section className="border-b border-line">
        <div className="mx-auto max-w-[1400px] px-5 py-12 md:px-10 md:py-16">
          <p className="eyebrow text-oxide">The register</p>
          <h1 className="display mt-4 text-5xl text-bone md:text-7xl">
            Provenance you
            <span className="italic text-ash"> can check.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ash">
            A certificate can be photocopied. A sequential register cannot. Every print
            this house has made is listed here with its code, edition number and holder
            — and anyone can look one up.
          </p>
        </div>
      </section>

      <section className="border-b border-line bg-ink-2">
        <div className="mx-auto grid max-w-[1400px] grid-cols-2 gap-px bg-line md:grid-cols-4">
          {[
            ["Prints claimed", String(counts.claimed), "text-bone"],
            ["Edition places", String(counts.total), "text-bone"],
            ["Reservations logged", String(addisLedger.length), "text-bone"],
            ["Numbers reused", "0", "text-oxide"],
          ].map(([label, value, tone]) => (
            <div key={label} className="bg-ink p-5">
              <p className="eyebrow">{label}</p>
              <p className={`display mt-3 text-3xl ${tone}`}>{value}</p>
            </div>
          ))}
        </div>
      </section>

      {/* LOOKUP */}
      <section className="mx-auto max-w-[1400px] px-5 py-12 md:px-10 md:py-16">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <div className="border border-line bg-ink p-7">
              <p className="eyebrow text-oxide">Verify an edition</p>
              <p className="mt-4 text-sm leading-relaxed text-ash">
                Enter the code from the certificate — it looks like{" "}
                <span className="text-bone">PW-XXXXX</span> — or the number on the
                print. The register answers with the work, the artist and the holder.
              </p>
              <form method="get" action="/register" className="mt-6 flex gap-2">
                <input
                  name="code"
                  defaultValue={code}
                  placeholder="PW-XXXXX"
                  className="field mono uppercase"
                  aria-label="Edition code"
                />
                <button type="submit" className="btn shrink-0">
                  Look up
                </button>
              </form>

              {code ? (
                found ? (
                  <div className="mt-6 border border-moss/50 bg-moss/10 p-6">
                    <p className="eyebrow text-moss">Found in the register</p>
                    <p className="display mt-3 text-3xl text-bone">{found.code}</p>
                    <div className="mt-5 divide-y divide-line">
                      {[
                        ["Work", found.workTitle],
                        ["Artist", found.artistName],
                        ["Build", `${found.sizeKey.toUpperCase()} · ${found.paperSlug}${found.frameSlug ? ` · ${found.frameSlug}` : ""}`],
                        ["Quantity", String(found.quantity)],
                        ["Held for", found.collectorName],
                        ["Logged", new Date(found.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })],
                        ["Status", found.status],
                      ].map(([k, v]) => (
                        <div key={k} className="flex items-baseline justify-between py-3">
                          <span className="mono text-ash">{k.toUpperCase()}</span>
                          <span className="text-sm text-bone">{v}</span>
                        </div>
                      ))}
                    </div>
                    <p className="mono mt-5 text-ash">
                      THIS ENTRY IS PERMANENT. THE CODE IS NEVER REISSUED.
                    </p>
                    <Link
                      href={`/works/${found.workSlug}`}
                      className="btn-ghost mt-5"
                    >
                      View the edition
                    </Link>
                  </div>
                ) : (
                  <div className="mt-6 border border-oxide/60 bg-oxide/10 p-6">
                    <p className="eyebrow text-oxide">No match</p>
                    <p className="mt-3 text-sm leading-relaxed text-bone">
                      Nothing in this house&apos;s register carries{" "}
                      <span className="mono">{code.toUpperCase()}</span>. That does not
                      make the print in your hands a fake — it may belong to our sister
                      house — but it was not made by us.
                    </p>
                    <Link href="/register" className="btn-ghost mt-5">
                      Clear
                    </Link>
                  </div>
                )
              ) : null}
            </div>

            <div className="mt-6 border border-line p-6">
              <p className="eyebrow text-oxide">What the register does not do</p>
              <p className="mt-3 text-sm leading-relaxed text-ash">
                It records what we made. It cannot stop someone photographing a print and
                running it elsewhere, and we will not pretend otherwise. What it does is
                hold this house accountable for its own numbers, permanently and in
                public.
              </p>
            </div>
          </div>

          {/* LEDGER */}
          <div className="lg:col-span-7">
            <div className="flex flex-col gap-3 border-t border-line pt-6 md:flex-row md:items-end md:justify-between">
              <h2 className="display text-3xl text-bone md:text-4xl">
                The open ledger
              </h2>
              <p className="mono text-ash">MOST RECENT FIRST</p>
            </div>

            {addisLedger.length === 0 ? (
              <div className="mt-6 border border-line p-10 text-center">
                <p className="display text-2xl text-bone">The register is empty.</p>
                <p className="mt-3 text-sm text-ash">
                  Reserve an edition and it appears here, permanently.
                </p>
                <Link href="/works" className="btn mt-6">
                  Browse the editions
                </Link>
              </div>
            ) : (
              <div className="mt-6 overflow-x-auto border border-line">
                <table className="w-full min-w-[640px] border-collapse text-left">
                  <thead className="bg-ink-2">
                    <tr>
                      {["Code", "Work", "Artist", "Build", "No.", "Retail"].map((h) => (
                        <th key={h} className="mono border-b border-line p-3 text-ash">
                          {h.toUpperCase()}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {addisLedger.map((row) => (
                      <tr key={row.id} className="border-b border-line last:border-0">
                        <td className="p-3 mono text-oxide">{row.code}</td>
                        <td className="p-3 text-sm text-bone">{row.workTitle}</td>
                        <td className="p-3 text-sm text-ash">{row.artistName}</td>
                        <td className="p-3 mono text-ash">
                          {row.sizeKey.toUpperCase()} · {row.paperSlug}
                          {row.frameSlug ? ` · ${row.frameSlug}` : ""}
                        </td>
                        <td className="p-3 mono text-bone">{row.quantity}</td>
                        <td className="p-3 mono text-bone">
                          {money(row.unitCents * row.quantity)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <p className="mt-4 mono text-ash">
              COLLECTOR NAMES IN THE LEDGER ARE REDACTED TO INITIALS ON REQUEST, AT ANY
              TIME, RETROACTIVELY.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
