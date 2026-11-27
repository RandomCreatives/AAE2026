export const RESERVATION_STATUSES = [
  "pending",
  "in_production",
  "delivered",
  "artist_paid",
] as const;

export type ReservationStatus = (typeof RESERVATION_STATUSES)[number];

export const STATUS_LABELS: Record<ReservationStatus, string> = {
  pending: "Pending",
  in_production: "In production",
  delivered: "Delivered",
  artist_paid: "Artist paid",
};
