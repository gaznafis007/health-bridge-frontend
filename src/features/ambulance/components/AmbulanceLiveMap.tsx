"use client";

import dynamic from "next/dynamic";

import type { LatLng } from "@/lib/ambulance/ambulance.types";

const AmbulanceMapInner = dynamic(
  () => import("@/features/ambulance/components/AmbulanceMapInner"),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full min-h-[320px] items-center justify-center rounded-2xl bg-sky-50 text-sm text-[var(--color-text-secondary)]">
        Loading map...
      </div>
    ),
  },
);

interface AmbulanceLiveMapProps {
  pickupLatLng: LatLng;
  destinationLatLng?: LatLng | null;
  ambulanceLatLng?: LatLng | null;
}

export function AmbulanceLiveMap({
  pickupLatLng,
  destinationLatLng,
  ambulanceLatLng,
}: AmbulanceLiveMapProps) {
  return (
    <div className="h-[320px] overflow-hidden rounded-2xl border border-[var(--color-border)] sm:h-[420px]">
      <AmbulanceMapInner
        pickupLatLng={pickupLatLng}
        destinationLatLng={destinationLatLng}
        ambulanceLatLng={ambulanceLatLng}
      />
    </div>
  );
}
