import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-[1400px] flex-col justify-center px-5 py-24 md:px-10">
      <p className="eyebrow text-oxide">404 · off the shelf</p>
      <h1 className="display mt-6 text-5xl text-bone md:text-7xl">
        This edition
        <span className="italic text-ash"> never existed.</span>
      </h1>
      <p className="mt-6 max-w-xl text-lg leading-relaxed text-ash">
        Either the work has been retired, or the address has changed. Nothing here
        quietly disappears — a closed edition says so on its page.
      </p>
      <div className="mt-10 flex flex-wrap gap-4">
        <Link href="/works" className="btn">
          The editions shelf
        </Link>
        <Link href="/" className="btn-ghost">
          The house
        </Link>
      </div>
    </div>
  );
}
