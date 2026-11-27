import { NextResponse } from "next/server";

import {
  RESERVATION_STATUSES,
  updateReservationStatus,
  type ReservationStatus,
} from "@/lib/queries";

export const dynamic = "force-dynamic";

type Body = { status?: string };

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const reservationId = Number(id);
  if (!Number.isInteger(reservationId)) {
    return NextResponse.json({ error: "Invalid reservation id." }, { status: 400 });
  }

  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  if (!RESERVATION_STATUSES.includes(body.status as ReservationStatus)) {
    return NextResponse.json({ error: "Unknown status." }, { status: 400 });
  }

  const row = await updateReservationStatus(
    reservationId,
    body.status as ReservationStatus,
  );
  if (!row) {
    return NextResponse.json({ error: "No such reservation." }, { status: 404 });
  }

  return NextResponse.json({ id: row.id, status: row.status });
}
