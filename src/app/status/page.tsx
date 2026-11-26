import Link from "next/link";

import { ADDIS } from "@/lib/brand";
import { getSubmissionByReference } from "@/lib/queries";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Check a submission — Addis Art Editions",
  description: "Look up the status of an artist submission by its reference.",
};

export default async function StatusPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const raw = Array.isArray(params.ref) ? params.ref[0] : params.ref;
  const reference = raw?.trim().toUpperCase() ?? "";
  const submission = reference ? await getSubmissionByReference(reference) : null;

  return (
    <div className="mx-auto max-w-[900px] px-5 py-16 md:px-10 md:py-24">
      <p className="eyebrow text-oxide">Submissions</p>
      <h1 className="display mt-5 text-4xl text-bone md:text-6xl">
        Check where it
        <span className="italic text-ash"> stands.</span>
      </h1>
      <p className="mt-6 max-w-xl text-lg leading-relaxed text-ash">
        Enter the reference the house gave you after you registered interest. It looks
        like SUB-0001.
      </p>

      <form method="get" action="/status" className="mt-10 flex gap-2">
        <input
          name="ref"
          defaultValue={reference}
          placeholder="SUB-0001"
          className="field mono uppercase"
          aria-label="Submission reference"
        />
        <button type="submit" className="btn shrink-0">
          Check
        </button>
      </form>

      {reference ? (
        submission ? (
          <div className="mt-10 border border-moss/50 bg-moss/10 p-7">
            <p className="eyebrow text-moss">Found</p>
            <p className="display mt-3 text-3xl text-bone">
              SUB-{String(submission.id).padStart(4, "0")}
            </p>
            <div className="mt-5 divide-y divide-line">
              {[
                ["Artist", submission.artistName],
                ["Work", submission.title],
                ["Track", submission.track.toUpperCase()],
                ["Status", submission.status.replace(/_/g, " ")],
                [
                  "Logged",
                  new Date(submission.createdAt).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  }),
                ],
              ].map(([k, v]) => (
                <div key={k} className="flex items-baseline justify-between py-3">
                  <span className="mono text-ash">{k.toUpperCase()}</span>
                  <span className="text-sm text-bone">{v}</span>
                </div>
              ))}
            </div>
            <p className="mono mt-6 text-ash">
              NO MONEY HAS MOVED. THE HOUSE WRITES BEFORE ANY PRINT IS MADE.
            </p>
          </div>
        ) : (
          <div className="mt-10 border border-oxide/60 bg-oxide/10 p-7">
            <p className="eyebrow text-oxide">No match</p>
            <p className="mt-3 text-sm leading-relaxed text-bone">
              Nothing here carries <span className="mono">{reference}</span>. Check the
              reference, or write to the house.
            </p>
            <a className="btn-ghost mt-5" href={`mailto:${ADDIS.email}`}>
              Contact the house
            </a>
          </div>
        )
      ) : null}

      <div className="mt-10 flex flex-wrap gap-4">
        <Link href="/submit" className="btn-ghost">
          Register interest
        </Link>
        <Link href="/about" className="btn-ghost">
          Read the model
        </Link>
      </div>
    </div>
  );
}
