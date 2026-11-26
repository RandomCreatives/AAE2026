import { NextResponse } from "next/server";

import { getBrand } from "@/lib/brand";
import { createWaitlistEntry, getWorkBySlug } from "@/lib/queries";

export const dynamic = "force-dynamic";

type Body = {
  workSlug?: string;
  collectorName?: string;
  collectorEmail?: string;
};

export async function POST(request: Request) {
  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const { workSlug, collectorName, collectorEmail } = body;
  if (!workSlug || !collectorName?.trim() || !collectorEmail?.trim()) {
    return NextResponse.json(
      { error: "Name, email and the work are required." },
      { status: 400 },
    );
  }
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(collectorEmail)) {
    return NextResponse.json({ error: "That email looks wrong." }, { status: 400 });
  }

  const brand = getBrand();
  const row = await getWorkBySlug(workSlug, brand.key);
  if (!row) {
    return NextResponse.json({ error: "That edition does not exist." }, { status: 404 });
  }

  const entry = await createWaitlistEntry({
    workId: row.work.id,
    collectorName: collectorName.trim().slice(0, 120),
    collectorEmail: collectorEmail.trim().slice(0, 160),
  });

  return NextResponse.json(
    { position: entry.position, workTitle: row.work.title },
    { status: 201 },
  );
}
