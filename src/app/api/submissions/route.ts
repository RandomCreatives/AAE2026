import { NextResponse } from "next/server";

import { getBrand, type BrandKey } from "@/lib/brand";
import { createSubmission } from "@/lib/queries";

export const dynamic = "force-dynamic";

type Body = {
  brand?: string;
  artistName?: string;
  email?: string;
  city?: string;
  practice?: string;
  title?: string;
  medium?: string;
  editionIdea?: string;
  statement?: string;
  portfolio?: string;
  track?: string;
};

export async function POST(request: Request) {
  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const { artistName, email, title } = body;
  if (!artistName?.trim() || !email?.trim() || !title?.trim()) {
    return NextResponse.json(
      { error: "Name, email and the work title are required." },
      { status: 400 },
    );
  }
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return NextResponse.json({ error: "That email looks wrong." }, { status: 400 });
  }

  const brand = getBrand();
  const submission = await createSubmission({
    brand: brand.key as BrandKey,
    artistName: artistName.trim().slice(0, 120),
    email: email.trim().slice(0, 160),
    city: body.city?.trim().slice(0, 80) || null,
    practice: body.practice?.trim().slice(0, 120) || null,
    title: title.trim().slice(0, 160),
    medium: body.medium?.trim().slice(0, 160) || null,
    editionIdea: body.editionIdea?.trim().slice(0, 400) || null,
    statement: body.statement?.trim().slice(0, 2000) || null,
    portfolio: body.portfolio?.trim().slice(0, 240) || null,
    track: ["a", "b", "c"].includes(body.track ?? "") ? (body.track as string) : "a",
  });

  return NextResponse.json(
    {
      id: submission.id,
      status: submission.status,
      reference: `SUB-${String(submission.id).padStart(4, "0")}`,
    },
    { status: 201 },
  );
}
