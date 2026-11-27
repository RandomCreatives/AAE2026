"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import {
  RESERVATION_STATUSES,
  STATUS_LABELS,
  type ReservationStatus,
} from "@/lib/order-status";

export function LedgerActions({
  id,
  status,
}: {
  id: number;
  status: string;
}) {
  const router = useRouter();
  const [value, setValue] = useState(status);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const save = async () => {
    setBusy(true);
    setError(null);
    try {
      const response = await fetch(`/api/reservation/${id}/status`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: value }),
      });
      if (!response.ok) {
        const payload = (await response.json()) as { error?: string };
        setError(payload.error ?? "Could not update.");
      } else {
        router.refresh();
      }
    } catch {
      setError("Network error.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex items-center justify-end gap-2">
      <select
        className="field mono max-w-[140px] py-1 text-[10px]"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        aria-label="Order status"
      >
        {RESERVATION_STATUSES.map((key) => (
          <option key={key} value={key}>
            {STATUS_LABELS[key]}
          </option>
        ))}
      </select>
      <button
        type="button"
        onClick={save}
        disabled={busy || value === status}
        className="btn shrink-0 px-3 py-1 text-[10px] disabled:opacity-40"
      >
        {busy ? "Saving" : "Set"}
      </button>
      {error ? <span className="mono text-oxide">{error}</span> : null}
    </div>
  );
}
