import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

type Entry = {
  slug: string;
  kicker: string;
  title: string;
  standfirst: string;
  body: string[];
  date: string;
  read: string;
  image: string;
  author: string;
};

const FULL: Entry[] = [
  {
    slug: "what-an-edition-number-means",
    kicker: "Collecting",
    title: "What an edition number actually means",
    standfirst:
      "The number in the corner of your print is not a quality grade. It is a promise about the future.",
    date: "12 Feb 2026",
    read: "6 min",
    author: "The house",
    image: "/art/addis-cross.jpg",
    body: [
      "When an artist and a house agree an edition of fifty, they are agreeing to one thing above all: that the plate — the master file, the drum scan, the stone — will be retired once the fiftieth print is claimed. Not rested. Not paused for a decade while the market catches up. Retired.",
      "That is what separates an edition from a reproduction. A reproduction can be run again whenever demand justifies it, and the market prices that risk in by paying less. An edition closes, permanently, and the register is what proves it closed.",
      "This is why the number matters, and why it is not a ranking. 12/50 and 47/50 are the same image on the same paper from the same run. The only real difference is timing — and if the edition sells out, the number becomes the only thing that makes yours yours.",
      "There is one honest exception: artist's proofs. Convention allows roughly ten percent outside the numbered run, marked AP, usually kept by the artist or given away. Ours are logged in the same register as the numbered prints, so nothing is quietly printed twice.",
      "So when you buy a print here you are buying three things: the image, the object, and the fact that no more of them will ever be made. The first two are the artist's work. The third is the house's word, and it is the entire reason the certificate exists.",
    ],
  },
  {
    slug: "why-we-publish-the-margin",
    kicker: "The model",
    title: "Why we publish our margin on every page",
    standfirst:
      "Every product page carries the production cost next to the price. It makes some people uncomfortable. That is fine.",
    date: "28 Jan 2026",
    read: "4 min",
    author: "The house",
    image: "/art/ravi-furnace.jpg",
    body: [
      "The standard arrangement in art is opacity. The gallery takes fifty percent and the artist is told not to discuss it. Print shops quote a retail price and never mention what the paper cost. The collector pays, the artist waits, and nobody can check anything.",
      "We put the production cost on the page because it makes the royalty mean something. If I tell you an artist takes forty percent of gross margin, you need to know the margin. Otherwise the number is decoration.",
      "It also disciplines us. When a supplier raises prices, the split moves in the open and we have to justify it — either to the artist at the next statement, or to a collector who notices. That is a good pressure to operate under.",
      "The counter-argument is real: some collectors prefer not to know, and a few artists find it undignified to be seen earning. We respect both. We do not print anyone's name next to their money. But the structure is public, because the structure is the promise.",
      "There is a commercial defence too, which is that trust is the cheapest marketing available to a small house. We cannot outspend a gallery. We can be more legible than one.",
    ],
  },
  {
    slug: "coffee-as-a-binder",
    kicker: "Studio note",
    title: "Coffee as a binder: an accident that became a method",
    standfirst:
      "Yohannes ran out of medium on a Tuesday in Gondar. What happened to the ink changed how we proof his editions.",
    date: "19 Jan 2026",
    read: "7 min",
    author: "The house",
    image: "/art/ravi-nocturne.jpg",
    body: [
      "The original mistake was logistical. A tin of medium that was supposed to arrive on the Monday did not arrive at all, and a painting that had to be finished that week could not wait.",
      "Coffee — buna, brewed thick, unsweetened — has enough body to carry oxide pigment. It dries darker than it looks wet, it is slightly acidic, and it never dries to exactly the same tone twice. On paper it produces a bloom that no manufactured medium gives you.",
      "For the artist this was a discovery. For the house it was a proofing problem. The first attempt to reproduce Ember, After faithfully failed, because a scanner reads coffee bloom as noise and removes it.",
      "The solution was to proof against the object rather than the file: a hard proof on the actual paper, compared under the same light the original was made in. Three weeks of a job that should have taken a day.",
      "That is now house method for any work with an unconventional binder. The scan is a reference, not a target. The proof is the target. It is slower, it costs us more, and it is the only honest way to do it.",
    ],
  },
  {
    slug: "the-register-is-the-product",
    kicker: "Provenance",
    title: "The register is the product",
    standfirst:
      "A certificate can be photocopied. A register with your name against a number that never repeats is harder to fake.",
    date: "06 Jan 2026",
    read: "5 min",
    author: "The house",
    image: "/studio/press-room.jpg",
    body: [
      "Most certificates of authenticity are decorative. They are printed on nice paper, signed in pencil, and carry no information a forger could not produce in an afternoon.",
      "The register is different because it is sequential and public. Every print we have ever made has a code, an edition number, and a name against it. Those numbers never repeat, and they never go backwards.",
      "If you are offered a 14/50 of a work whose register shows fourteen already claimed by other people, that is checkable. Not by us quietly — by you, on this site, without asking permission.",
      "There is a limit to this and we should be honest about it. A register proves what we recorded, not what is true in the world. It cannot stop someone photographing a print and running it elsewhere. What it does is make our own house accountable for its own numbers, permanently.",
      "Which is, in the end, the whole proposition. The artist keeps the work. The collector keeps a real object. The house keeps the only thing a house should be trusted with: an accurate record.",
    ],
  },
  {
    slug: "choosing-a-paper",
    kicker: "Craft",
    title: "Five papers, and how to choose between them",
    standfirst:
      "A short decision tree. It usually takes ninety seconds, and it is almost always the same three questions.",
    date: "21 Dec 2025",
    read: "8 min",
    author: "The house",
    image: "/art/ravi-limestone.jpg",
    body: [
      "The first question is what the original was made of. Paint with real texture — impasto, palette knife, thick ink — wants a heavy matte rag, because gloss flattens texture into sheen. Photography usually wants baryta, because depth in the blacks is the point of the photograph.",
      "The second question is the palette. Warm papers — bamboo, cotton rag — flatter ochre, earth, coffee, oxide. Cool papers, and anything with optical brighteners, flatter blues, greens and stark monochrome. If the work is mostly neutral, take the warm one and let it age.",
      "The third question is the room. Under glass in a bright room you will not see the paper surface at all, so buy the frame and take the house paper. In a room where you can get close and the light is soft, the paper is the object — spend on it.",
      "One thing we would advise against: choosing paper by specification. A 308gsm rag and a 290gsm bamboo differ by almost nothing you can feel, and a great deal you can see. Choose with your eyes on a proof, not with a datasheet.",
      "Which is why we send one. Every edition here is proofed on two papers before it goes live, and the artist picks. You are choosing from a choice that was already made carefully.",
    ],
  },
  {
    slug: "shipping-glass",
    kicker: "Operations",
    title: "On shipping glass out of Addis Ababa",
    standfirst: "We do not. Everything framed leaves behind acrylic, in a fitted crate, insured.",
    date: "09 Dec 2025",
    read: "4 min",
    author: "The house",
    image: "/art/mira-corridor.jpg",
    body: [
      "Glass is beautiful and it is ruinous. It adds a third to the weight, it does not survive a temperature swing between a cargo hold and a tarmac, and it destroys the print it is meant to protect when it goes.",
      "So every framed work leaving this house is glazed in acrylic. It filters UV as standard, it weighs a fraction as much, and it can be cut to size locally in Addis without a specialist order.",
      "The exception is the walnut finish with museum glass, which we only offer for local delivery in Addis Ababa, hand-carried. If you want museum glass abroad, we ship the frame unglazed with a glazing rebate sized for your local glazier, and the certificate notes it.",
      "Crates are fitted, not generic: corner blocks cut to the frame profile, glassine against the glazing, and a double wall. The cost of that crate is in the packaging line of the receipt, not hidden in the shipping charge.",
      "It costs us a little more per order than a padded box would. It has so far cost us zero destroyed prints, which is the only number we care about.",
    ],
  },
];

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const entry = FULL.find((e) => e.slug === slug);
  if (!entry) return { title: "Not found — Addis Art Editions" };
  return { title: `${entry.title} — Addis Art Editions`, description: entry.standfirst };
}

export default async function AddisJournalEntry({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const entry = FULL.find((e) => e.slug === slug);
  if (!entry) notFound();

  const index = FULL.findIndex((e) => e.slug === slug);
  const next = FULL[(index + 1) % FULL.length];

  return (
    <div>
      <div className="border-b border-line">
        <div className="mx-auto flex max-w-[800px] items-center gap-3 px-5 py-4 mono text-[10px] tracking-[0.18em] text-ash md:px-0">
          <Link href="/journal" className="link hover:text-bone">
            JOURNAL
          </Link>
          <span>/</span>
          <span className="text-oxide">{entry.kicker.toUpperCase()}</span>
        </div>
      </div>

      <article className="mx-auto max-w-[800px] px-5 py-14 md:px-0 md:py-20">
        <p className="eyebrow text-oxide">
          {entry.kicker} · {entry.date} · {entry.read}
        </p>
        <h1 className="display mt-5 text-4xl text-bone md:text-6xl">{entry.title}</h1>
        <p className="mt-6 border-l border-oxide pl-6 text-lg italic leading-relaxed text-bone">
          {entry.standfirst}
        </p>

        <div className="relative mt-10 aspect-[16/10] overflow-hidden border border-line">
          <Image
            src={entry.image}
            alt={entry.title}
            fill
            priority
            sizes="(max-width: 800px) 100vw, 800px"
            className="object-cover"
          />
        </div>

        <div className="mt-10 space-y-7">
          {entry.body.map((para) => (
            <p key={para.slice(0, 40)} className="text-[16px] leading-[1.9] text-ash">
              {para}
            </p>
          ))}
        </div>

        <div className="mt-12 flex items-baseline justify-between border-t border-line pt-6 mono text-[10px] tracking-[0.18em] text-ash">
          <span>WRITTEN BY {entry.author.toUpperCase()}</span>
          <span>ADDIS ART EDITIONS · JOURNAL</span>
        </div>

        <Link
          href={`/journal/${next.slug}`}
          className="group mt-10 flex items-center justify-between border border-line bg-ink-2 p-6 transition-colors hover:border-oxide/60"
        >
          <div>
            <p className="eyebrow text-oxide">Next in the journal</p>
            <p className="display mt-2 text-2xl text-bone">{next.title}</p>
          </div>
          <span className="mono text-oxide opacity-0 transition-opacity group-hover:opacity-100">
            READ →
          </span>
        </Link>
      </article>
    </div>
  );
}
