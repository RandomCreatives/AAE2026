import Link from "next/link";
import Image from "next/image";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Journal — Addis Art Editions",
  description:
    "Notes from the press room: how the house prices a print, what an edition number means, and what artists are actually paid.",
};

type Entry = {
  slug: string;
  kicker: string;
  title: string;
  excerpt: string;
  read: string;
  date: string;
  image: string;
};

const ENTRIES: Entry[] = [
  {
    slug: "what-an-edition-number-means",
    kicker: "Collecting",
    title: "What an edition number actually means",
    excerpt:
      "12/50 does not mean you got the twelfth best print. It means the plate was retired after the fiftieth. Here is the difference, and why one of them holds value.",
    read: "6 min",
    date: "12 Feb 2026",
    image: "/art/addis-cross.jpg",
  },
  {
    slug: "why-we-publish-the-margin",
    kicker: "The model",
    title: "Why we publish our margin on every page",
    excerpt:
      "Galleries do not tell you what the artist was paid. Neither do most print shops. We print it, because the artist can read, and so can you.",
    read: "4 min",
    date: "28 Jan 2026",
    image: "/art/ravi-furnace.jpg",
  },
  {
    slug: "coffee-as-a-binder",
    kicker: "Studio note",
    title: "Coffee as a binder: an accident that became a method",
    excerpt:
      "Yohannes ran out of medium on a Tuesday in Gondar. What happened to the ink changed the whole way we proof his editions.",
    read: "7 min",
    date: "19 Jan 2026",
    image: "/art/ravi-nocturne.jpg",
  },
  {
    slug: "the-register-is-the-product",
    kicker: "Provenance",
    title: "The register is the product",
    excerpt:
      "A certificate can be photocopied. A register with your name against a number that never repeats is harder to fake, and it is the reason a print is an asset at all.",
    read: "5 min",
    date: "06 Jan 2026",
    image: "/studio/press-room.jpg",
  },
  {
    slug: "choosing-a-paper",
    kicker: "Craft",
    title: "Five papers, and how to choose between them",
    excerpt:
      "A short decision tree: what the work is made of, where it will hang, and how much light the room gets. It usually takes ninety seconds.",
    read: "8 min",
    date: "21 Dec 2025",
    image: "/art/ravi-limestone.jpg",
  },
  {
    slug: "shipping-glass",
    kicker: "Operations",
    title: "On shipping glass out of Addis Ababa",
    excerpt:
      "We do not. Everything framed leaves behind acrylic, in a fitted crate, insured. What we learned the expensive way.",
    read: "4 min",
    date: "09 Dec 2025",
    image: "/art/mira-corridor.jpg",
  },
];

const FEATURED: Record<string, { standfirst: string; body: string[] }> = {
  "what-an-edition-number-means": {
    standfirst:
      "The number in the corner of your print is not a quality grade. It is a promise about the future.",
    body: [
      "When an artist and a house agree an edition of fifty, they are agreeing to one thing above all: that the plate — the master file, the drum scan, the stone — will be retired once the fiftieth print is claimed. Not rested, not paused for a decade. Retired.",
      "That is what separates an edition from a reproduction. A reproduction can be run again whenever demand justifies it, and the market prices that risk in by paying less. An edition closes, permanently, and the register proves it closed.",
      "This is why the number matters, and why it is not a ranking. 12/50 and 47/50 are the same image on the same paper from the same run. The only real difference is timing — and if the edition sells out, the number becomes the only thing that makes yours yours.",
      "There is one honest exception: artist's proofs. Convention allows about ten percent outside the numbered run, marked AP and usually kept by the artist or given away. Ours are logged in the same register as the numbered prints, so nothing is quietly printed twice.",
      "So when you buy a print here, you are buying three things: the image, the object, and the fact that no more of them will ever be made. The first two are the artist's. The third is the house's, and it is the whole reason the certificate exists.",
    ],
  },
  "why-we-publish-the-margin": {
    standfirst:
      "Every product page on this site carries the production cost next to the price. It makes some people uncomfortable. That is fine.",
    body: [
      "The standard arrangement in art is opacity. The gallery takes fifty percent and the artist is told not to discuss it. Print shops quote a retail price and never mention what the paper cost. The collector pays, the artist waits, and nobody can check anything.",
      "We put the production cost on the page because it makes the royalty mean something. If I tell you an artist takes forty percent of gross margin, you need to know the margin. Otherwise the number is decoration.",
      "It also disciplines us. When the paper supplier raises prices, the split moves in the open and we have to justify it — either to the artist at the next statement, or to a collector who notices. That is a good pressure to be under.",
      "The counter-argument is real: some collectors prefer not to know, and a few artists find it undignified to be seen earning. We respect both, and we do not print anyone's name next to their money. But the structure is public, because the structure is the promise.",
    ],
  },
};

export default async function AddisJournalPage() {
  const [lead, ...rest] = ENTRIES;

  return (
    <div>
      <section className="border-b border-line">
        <div className="mx-auto max-w-[1400px] px-5 py-12 md:px-10 md:py-16">
          <p className="eyebrow text-oxide">The journal</p>
          <h1 className="display mt-4 text-5xl text-bone md:text-7xl">
            Notes from
            <span className="italic text-ash"> the press room.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ash">
            Written by the house, for collectors and artists both. How pricing works,
            what an edition number commits us to, and what we broke learning it.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-[1400px] px-5 py-12 md:px-10 md:py-16">
        {/* lead */}
        <Link
          href={`/journal/${lead.slug}`}
          className="group grid gap-8 border border-line bg-ink-2 transition-colors hover:border-oxide/60 md:grid-cols-12"
        >
          <div className="relative aspect-[16/10] overflow-hidden md:col-span-6">
            <Image
              src={lead.image}
              alt={lead.title}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover transition-transform duration-700 group-hover:scale-[1.02]"
            />
          </div>
          <div className="flex flex-col justify-center p-7 md:col-span-6 md:p-10">
            <p className="eyebrow text-oxide">
              {lead.kicker} · {lead.date}
            </p>
            <h2 className="display mt-4 text-3xl text-bone md:text-4xl">{lead.title}</h2>
            <p className="mt-5 max-w-lg text-[15px] leading-relaxed text-ash">
              {lead.excerpt}
            </p>
            <p className="mono mt-6 text-oxide opacity-0 transition-opacity group-hover:opacity-100">
              READ · {lead.read} →
            </p>
          </div>
        </Link>

        {/* grid */}
        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {rest.map((entry) => (
            <Link
              key={entry.slug}
              href={`/journal/${entry.slug}`}
              className="group flex flex-col justify-between border border-line bg-ink-2 p-7 transition-colors hover:border-oxide/60"
            >
              <div>
                <p className="eyebrow text-oxide">
                  {entry.kicker} · {entry.date}
                </p>
                <h3 className="display mt-4 text-2xl text-bone">{entry.title}</h3>
                <p className="mt-4 text-sm leading-relaxed text-ash">{entry.excerpt}</p>
              </div>
              <p className="mono mt-6 border-t border-line pt-4 text-ash">
                {entry.read} READ ·{" "}
                <span className="text-oxide opacity-0 transition-opacity group-hover:opacity-100">
                  OPEN →
                </span>
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* pinned essay, in full — content over a stub */}
      {Object.entries(FEATURED).map(([slug, essay]) => (
        <section key={slug} className="border-y border-line bg-ink-2">
          <div className="mx-auto max-w-[800px] px-5 py-14 md:px-10 md:py-20">
            <p className="eyebrow text-oxide">Pinned · the two that matter most</p>
            <h2 className="display mt-5 text-4xl text-bone">
              {ENTRIES.find((e) => e.slug === slug)?.title}
            </h2>
            <p className="mt-5 border-l border-oxide pl-6 text-lg italic leading-relaxed text-bone">
              {essay.standfirst}
            </p>
            <div className="mt-8 space-y-6">
              {essay.body.map((para) => (
                <p key={para.slice(0, 40)} className="text-[15px] leading-[1.85] text-ash">
                  {para}
                </p>
              ))}
            </div>
            <Link href={`/journal/${slug}`} className="btn mt-8">
              Read the full entry
            </Link>
          </div>
        </section>
      ))}
    </div>
  );
}
