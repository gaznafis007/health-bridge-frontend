"use client";

import { useEffect, useRef } from "react";

import { useAuth } from "@/features/auth/hooks/useAuth";
import { pushDriverLocation } from "@/lib/ambulance/ambulance.api";

const LOCATION_INTERVAL_MS = 10_000;

interface DriverLocationPublisherProps {
  bookingId: string;
  enabled: boolean;
}

export function DriverLocationPublisher({
  bookingId,
  enabled,
}: DriverLocationPublisherProps) {
  const { accessToken } = useAuth();
  const lastErrorRef = useRef<string | null>(null);

  useEffect(() => {
    if (!enabled || !accessToken || !navigator.geolocation) return;

    const token = accessToken;

    function publishPosition(position: GeolocationPosition) {
      pushDriverLocation(token, bookingId, {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: position.coords.accuracy,
        recordedAt: new Date().toISOString(),
      }).catch(() => {
        // Throttle or transient errors — next interval retries
      });
    }

    function handleError(error: GeolocationPositionError) {
      lastErrorRef.current = error.message;
    }

    navigator.geolocation.getCurrentPosition(publishPosition, handleError, {
      enableHighAccuracy: true,
      maximumAge: 5000,
    });

    const intervalId = window.setInterval(() => {
      navigator.geolocation.getCurrentPosition(publishPosition, handleError, {
        enableHighAccuracy: true,
        maximumAge: 5000,
      });
    }, LOCATION_INTERVAL_MS);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [accessToken, bookingId, enabled]);

  if (!enabled) return null;

  return (
    <p className="text-xs text-[var(--color-text-secondary)]">
      Live location sharing active (updates every {LOCATION_INTERVAL_MS / 1000}s)
    </p>
  );
}
