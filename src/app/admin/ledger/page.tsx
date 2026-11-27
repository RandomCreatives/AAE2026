import Link from "next/link";

import { LedgerActions } from "@/components/ledger-actions";
import { ADDIS, brandMoney } from "@/lib/brand";
import { STATUS_LABELS, type ReservationStatus } from "@/lib/order-status";
import { getReservations } from "@/lib/queries";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Order ledger — Addis Art Editions",
  description: "Order states, payout splits and certificate serials.",
};

export default async function AdminLedgerPage() {
  const rows = await getReservations(200, "addis");
  const money = (cents: number) => brandMoney(ADDIS, cents);

  const totals = rows.reduce(
    (acc, row) => {
      acc.retail += row.unitCents * row.quantity;
      acc.production += row.productionCents * row.quantity;
      acc.artist += row.artistShareCents * row.quantity;
      acc.studio += row.studioShareCents * row.quantity;
      return acc;
    },
    { retail: 0, production: 0, artist: 0, studio: 0 },
  );

  const counts = (Object.keys(STATUS_LABELS) as ReservationStatus[]).map((key) => ({
    key,
    label: STATUS_LABELS[key],
    count: rows.filter((row) => row.status === key).length,
  }));

  return (
    <div className="mx-auto max-w-[1400px] px-5 py-14 md:px-10 md:py-20">
      <p className="eyebrow text-oxide">Studio operations</p>
      <h1 className="display mt-5 text-4xl text-bone md:text-6xl">
        The order
        <span className="italic text-ash"> ledger.</span>
      </h1>
      <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ash">
        Retail, hard costs, fees and the contractual split on every order. States move
        from Pending to Artist Paid as the work is made, delivered and settled.
      </p>

      <div className="mt-10 grid gap-px border border-line bg-line sm:grid-cols-3 lg:grid-cols-6">
        {counts.map((item) => (
          <div key={item.key} className="bg-ink p-5">
            <p className="eyebrow">{item.label}</p>
            <p className="display mt-3 text-3xl text-bone">{item.count}</p>
          </div>
        ))}
        <div className="bg-ink p-5">
          <p className="eyebrow">Retail</p>
          <p className="display mt-3 text-3xl text-bone">{money(totals.retail)}</p>
        </div>
        <div className="bg-ink p-5">
          <p className="eyebrow">Artist share</p>
          <p className="display mt-3 text-3xl text-oxide">{money(totals.artist)}</p>
        </div>
      </div>

      <div className="mt-8 border border-line bg-ink-2 p-5">
        <div className="flex flex-wrap gap-x-8 gap-y-2 mono text-[10px] tracking-[0.16em] text-ash">
          <span>RETAIL {money(totals.retail)}</span>
          <span>PRODUCTION {money(totals.production)}</span>
          <span>STUDIO SHARE {money(totals.studio)}</span>
          <span>SPLITS 60/40 PRINTS · 80/20 ORIGINALS</span>
        </div>
      </div>

      {rows.length === 0 ? (
        <div className="mt-10 border border-line p-10 text-center">
          <p className="display text-2xl text-bone">No orders in the ledger yet.</p>
          <Link href="/works" className="btn mt-6">
            Browse the editions
          </Link>
        </div>
      ) : (
        <div className="mt-10 overflow-x-auto border border-line">
          <table className="w-full min-w-[900px] border-collapse text-left">
            <thead className="bg-ink-2">
              <tr>
                {[
                  "Serial",
                  "Work",
                  "Collector",
                  "Net",
                  "Artist",
                  "Split",
                  "State",
                ].map((h) => (
                  <th
                    key={h}
                    scope="col"
                    className="mono border-b border-line p-3 text-ash"
                  >
                    {h.toUpperCase()}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id} className="border-b border-line last:border-0">
                  <td className="p-3 mono text-oxide">
                    {row.serialNumber ?? "—"}
                  </td>
                  <td className="p-3 text-sm text-bone">{row.workTitle}</td>
                  <td className="p-3 text-sm text-ash">{row.collectorName}</td>
                  <td className="p-3 mono text-bone">
                    {money(row.netProfitCents)}
                  </td>
                  <td className="p-3 mono text-bone">
                    {money(row.artistShareCents * row.quantity)}
                  </td>
                  <td className="p-3 mono text-ash">{row.splitRate}%</td>
                  <td className="p-3">
                    <LedgerActions id={row.id} status={row.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
