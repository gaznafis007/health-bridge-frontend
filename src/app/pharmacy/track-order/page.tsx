import { Suspense } from "react";

import { GuestOrderTrackShell } from "@/features/pharmacy/components/GuestOrderTrackShell";
import { Spinner } from "@/components/ui/Spinner";

export default function GuestOrderTrackPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[40vh] items-center justify-center">
          <Spinner />
        </div>
      }
    >
      <GuestOrderTrackShell />
    </Suspense>
  );
}
