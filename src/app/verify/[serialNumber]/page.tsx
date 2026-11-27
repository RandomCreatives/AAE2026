import { ADDIS, brandMoney } from "@/lib/brand";
import { getReservationBySerial } from "@/lib/queries";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Verify a certificate — Addis Art Editions",
  description: "Public provenance record for an Addis Art Editions certificate.",
};

export default async function VerifyPage({
  params,
}: {
  params: Promise<{ serialNumber: string }>;
}) {
  const { serialNumber } = await params;
  const row = await getReservationBySerial(serialNumber);

  return (
    <div className="mx-auto max-w-[900px] px-5 py-16 md:px-10 md:py-24">
      <p className="eyebrow text-oxide">Certificate verification</p>
      <h1 className="display mt-5 text-4xl text-bone md:text-6xl">
        {row ? "This certificate" : "No such certificate"}
        {row ? <span className="italic text-ash"> is real.</span> : null}
      </h1>

      {row ? (
        <div className="mt-12 border border-line bg-ink-2">
          <div className="flex flex-col gap-2 border-b border-line p-7 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="mono text-ash">SERIAL</p>
              <p className="display mt-2 text-3xl text-bone md:text-4xl">
                {row.serialNumber}
              </p>
            </div>
            <p className="mono text-moss">RECORD IS PERMANENT</p>
          </div>
          <div className="divide-y divide-line">
            {[
              ["Artwork", row.workTitle],
              ["Artist", row.artistName],
              [
                "Edition",
                row.itemMode === "original"
                  ? "Unique original · 1 of 1"
                  : row.editionNumber === null
                    ? `Open edition · ${row.quantity} held`
                    : `${String(row.editionNumber).padStart(2, "0")} of ${row.editionSize}`,
              ],
              [
                "Print specification",
                `${row.sizeKey.toUpperCase()} · ${row.paperSlug}${row.frameSlug ? ` · ${row.frameSlug}` : ""}`,
              ],
              [
                "Issued",
                new Date(row.createdAt).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                }),
              ],
              ["Order state", row.status.replace(/_/g, " ")],
              ["Total", brandMoney(ADDIS, row.unitCents * row.quantity)],
              ["Artist share", `${row.splitRate}% of net profit`],
            ].map(([k, v]) => (
              <div key={k} className="flex items-baseline justify-between p-5">
                <span className="mono text-ash">{k.toUpperCase()}</span>
                <span className="text-sm text-bone">{v}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-line p-7">
            <p className="text-sm leading-relaxed text-ash">
              This page is the house&apos;s record of the certificate. It cannot be
              edited after issue; a closed edition is never silently re-opened.
            </p>
          </div>
        </div>
      ) : (
        <p className="mt-8 max-w-xl text-lg leading-relaxed text-ash">
          Nothing in the house register carries{" "}
          <span className="mono text-bone">{serialNumber}</span>. Check the serial on
          the certificate, or write to the house.
        </p>
      )}
    </div>
  );
}
