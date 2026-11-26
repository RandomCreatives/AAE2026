"use client";

import { useState } from "react";

import type { Brand } from "@/lib/brand";

const TRACKS = [
  {
    key: "a",
    label: "A · Published artist",
    hint: "40% of margin, zero upfront, invited in batches of five.",
  },
  {
    key: "b",
    label: "B · Founding artist",
    hint: "50% of margin for life, first position on the shelf, 2 slots ever.",
  },
  {
    key: "c",
    label: "C · Resident producer",
    hint: "You run capture, print, mount, frame, pack — and share the studio net.",
  },
];

export function SubmitWorkForm({
  initialTrack = "b",
  brand,
  thankYouHref = "/works",
}: {
  initialTrack?: string;
  brand: Brand;
  thankYouHref?: string;
}) {
  const [track, setTrack] = useState(
    TRACKS.some((t) => t.key === initialTrack) ? initialTrack : "a",
  );
  const [form, setForm] = useState({
    artistName: "",
    email: "",
    city: "",
    practice: "",
    title: "",
    medium: "",
    editionIdea: "",
    statement: "",
    portfolio: "",
  });
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState<{ reference: string; track: string } | null>(null);

  const set = (key: keyof typeof form) => (value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  async function submit() {
    setPending(true);
    setError(null);
    try {
      const response = await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, track, brand: brand.key }),
      });
      const payload = (await response.json()) as {
        error?: string;
        reference?: string;
      };
      if (!response.ok) {
        setError(payload.error ?? "Something went wrong.");
      } else if (payload.reference) {
        setDone({ reference: payload.reference, track });
      }
    } catch {
      setError("Network error — try again.");
    } finally {
      setPending(false);
    }
  }

  if (done) {
    return (
      <div className="border border-moss/50 bg-moss/10 p-8">
        <p className="eyebrow text-moss">Logged in the register</p>
        <p className="display mt-4 text-4xl text-bone">{done.reference}</p>
        <p className="mt-5 text-[15px] leading-relaxed text-ash">
          Track {done.track.toUpperCase()} interest recorded. This is not a signature —
          it is a flag that says &ldquo;let&apos;s talk numbers&rdquo;. I will come back
          with a pricing sheet for the work you named, a paper recommendation, and two
          edition options. Nothing gets printed until you have seen the margin on paper.
        </p>
        <p className="mono mt-6 text-ash">
          NEXT: BRING THE FILE · 300DPI MINIMUM, TIF OR PSD, COLOUR PROFILE ATTACHED
        </p>
      </div>
    );
  }

  return (
    <div className="border border-line bg-ink-2 p-6 md:p-8">
      <p className="eyebrow text-oxide">Pick your track</p>
      <div className="mt-4 grid gap-2 md:grid-cols-3">
        {TRACKS.map((option) => (
          <button
            key={option.key}
            type="button"
            onClick={() => setTrack(option.key)}
            className={`border p-4 text-left transition-colors ${
              track === option.key
                ? "border-oxide bg-oxide/10"
                : "border-line hover:border-ash/60"
            }`}
          >
            <p className="mono text-bone">{option.label}</p>
            <p className="mt-2 text-xs leading-relaxed text-ash">{option.hint}</p>
          </button>
        ))}
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <div>
          <label className="mono block text-ash">NAME *</label>
          <input
            className="field mt-2"
            value={form.artistName}
            onChange={(e) => set("artistName")(e.target.value)}
            placeholder="As you sign your work"
          />
        </div>
        <div>
          <label className="mono block text-ash">EMAIL *</label>
          <input
            className="field mt-2"
            type="email"
            value={form.email}
            onChange={(e) => set("email")(e.target.value)}
            placeholder="you@studio.com"
          />
        </div>
        <div>
          <label className="mono block text-ash">CITY</label>
          <input
            className="field mt-2"
            value={form.city}
            onChange={(e) => set("city")(e.target.value)}
            placeholder="Where the work gets made"
          />
        </div>
        <div>
          <label className="mono block text-ash">PRACTICE</label>
          <input
            className="field mt-2"
            value={form.practice}
            onChange={(e) => set("practice")(e.target.value)}
            placeholder="Oil, ink, photography, riso…"
          />
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <div>
          <label className="mono block text-ash">WORK TITLE *</label>
          <input
            className="field mt-2"
            value={form.title}
            onChange={(e) => set("title")(e.target.value)}
            placeholder="The piece you want printed first"
          />
        </div>
        <div>
          <label className="mono block text-ash">MEDIUM OF THE ORIGINAL</label>
          <input
            className="field mt-2"
            value={form.medium}
            onChange={(e) => set("medium")(e.target.value)}
            placeholder="e.g. oil on canvas, 120 × 120 cm"
          />
        </div>
      </div>

      <div className="mt-6">
        <label className="mono block text-ash">EDITION IDEA</label>
        <input
          className="field mt-2"
          value={form.editionIdea}
          onChange={(e) => set("editionIdea")(e.target.value)}
          placeholder="25 strict, 50 open, or 'you tell me'"
        />
      </div>

      <div className="mt-6">
        <label className="mono block text-ash">STATEMENT — WHY THIS WORK</label>
        <textarea
          className="field mt-2"
          rows={4}
          value={form.statement}
          onChange={(e) => set("statement")(e.target.value)}
          placeholder="Four sentences a collector would repeat to a friend."
        />
      </div>

      <div className="mt-6">
        <label className="mono block text-ash">PORTFOLIO LINK</label>
        <input
          className="field mt-2"
          value={form.portfolio}
          onChange={(e) => set("portfolio")(e.target.value)}
          placeholder="Instagram, site, Drive folder — anything"
        />
      </div>

      {error ? <p className="mono mt-5 text-oxide">{error}</p> : null}

      <button
        type="button"
        onClick={submit}
        disabled={pending || !form.artistName.trim() || !form.email.trim() || !form.title.trim()}
        className="btn mt-6 w-full disabled:cursor-not-allowed disabled:opacity-40"
      >
        {pending ? "Filing it…" : "Register interest"}
      </button>
      <p className="mono mt-4 text-ash">
        No signature, no payment, no exclusivity. One conversation.
      </p>
    </div>
  );
}
