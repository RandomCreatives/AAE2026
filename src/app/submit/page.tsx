import Link from "next/link";

import { SubmitWorkForm } from "@/components/submit-work-form";
import { ADDIS } from "@/lib/brand";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Submit a work — Addis Art Editions",
  description:
    "Put a work on the Addis shelf. No upfront cost, no exclusivity on originals, published margins.",
};

const STEPS = [
  {
    n: "01",
    title: "You send one work",
    body: "The file, or the original — we drum-scan a painting at full resolution. Nothing is committed.",
  },
  {
    n: "02",
    title: "We make a proof",
    body: "Two papers, one size, and a free hard proof couriered to you. You approve the colour, or you walk away.",
  },
  {
    n: "03",
    title: "We price it together",
    body: "You see the production cost, the retail band and your per-print royalty before anything goes live.",
  },
  {
    n: "04",
    title: "It goes on the shelf",
    body: "Numbered, certificated, printed to order. You never touch a printer, a tube, a customs form or a courier.",
  },
];

export default async function AddisSubmitPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const raw = Array.isArray(params.track) ? params.track[0] : params.track;

  return (
    <div>
      <section className="border-b border-line">
        <div className="mx-auto max-w-[1400px] px-5 py-12 md:px-10 md:py-16">
          <p className="eyebrow text-oxide">Open the shelf</p>
          <h1 className="display mt-4 text-5xl text-bone md:text-7xl">
            Submit a work.
            <span className="italic text-ash"> Keep everything.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ash">
            The shelf is reviewed in small batches, so the artists already on it keep
            their share of attention. This form registers interest — it is not a
            signature, it costs nothing, and it commits you to nothing.
          </p>
          <p className="mono mt-6 text-ash">
            {ADDIS.region} · ANYWHERE IN THE REGION CONSIDERED · WORKING IN ENGLISH
          </p>
          <p className="mono mt-2 text-ash">
            QUESTIONS FIRST?{" "}
            <a className="link text-oxide" href={`mailto:${ADDIS.email}`}>
              {ADDIS.email}
            </a>
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-[1400px] px-5 py-12 md:px-10 md:py-16">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="eyebrow text-oxide">How it actually goes</p>
            <div className="mt-6 border border-line">
              {STEPS.map((step, i) => (
                <div key={step.n} className={`p-6 ${i ? "border-t border-line" : ""}`}>
                  <p className="mono text-oxide">{step.n}</p>
                  <h3 className="display mt-3 text-2xl text-bone">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ash">{step.body}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 border border-oxide/50 bg-oxide/5 p-6">
              <p className="eyebrow text-oxide">The fine print, short</p>
              <p className="mt-3 text-sm leading-relaxed text-bone">
                Copyright stays with you. Royalty is a share of gross margin, not of
                list price. Production cost is printed on the page. You can leave with
                your files in sixty days.
              </p>
              <Link href="/about" className="link mono mt-4 inline-block text-oxide">
                READ THE FULL MODEL →
              </Link>
            </div>

            <div className="mt-6 border border-line p-6">
              <p className="eyebrow">File requirements</p>
              <ul className="mt-4 space-y-3">
                {[
                  "300dpi minimum at A2, TIF or PSD, layered if you have them",
                  "Colour profile attached — Adobe RGB or wider, not sRGB",
                  "A flat photograph of the original in the room it lives in",
                  "Anything less and we will ask for a drum scan instead",
                ].map((item) => (
                  <li key={item} className="flex gap-3 text-sm text-ash">
                    <span className="mono text-line">·</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="lg:col-span-7">
            <SubmitWorkForm
              initialTrack={raw ?? "a"}
              brand={ADDIS}
              thankYouHref="/works"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
