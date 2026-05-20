"use client";

import { useEffect, useState } from "react";

import { createGuestSession } from "@/features/pharmacy/lib/pharmacy.api";
import { isSessionExpired } from "@/features/pharmacy/lib/pharmacy.utils";

const STORAGE_KEY = "hb_guest_session";

interface StoredGuestSession {
  sessionId: string;
  expiresAt: string;
}

interface UseGuestSessionResult {
  sessionId: string | null;
  isReady: boolean;
  errorMessage: string | null;
}

export function useGuestSession(): UseGuestSessionResult {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function initializeGuestSession() {
      try {
        const storedSession = readStoredSession();

        if (storedSession && !isSessionExpired(storedSession.expiresAt)) {
          if (!isMounted) {
            return;
          }

          setSessionId(storedSession.sessionId);
          setErrorMessage(null);
          setIsReady(true);
          return;
        }

        window.localStorage.removeItem(STORAGE_KEY);

        const nextSession = await createGuestSession();

        if (!isMounted) {
          return;
        }

        const value = JSON.stringify(nextSession);
        window.localStorage.setItem(STORAGE_KEY, value);
        setSessionId(nextSession.sessionId);
        setErrorMessage(null);
      } catch (error) {
        if (!isMounted) {
          return;
        }

        setSessionId(null);
        setErrorMessage(getErrorMessage(error, "We could not start your guest session."));
      } finally {
        if (isMounted) {
          setIsReady(true);
        }
      }
    }

    initializeGuestSession();

    return () => {
      isMounted = false;
    };
  }, []);

  return { sessionId, isReady, errorMessage };
}

function getErrorMessage(error: unknown, fallback: string) {
  return typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof (error as { message?: unknown }).message === "string"
    ? (error as { message: string }).message
    : fallback;
}

function readStoredSession(): StoredGuestSession | null {
  try {
    const rawValue = window.localStorage.getItem(STORAGE_KEY);
    if (!rawValue) {
      return null;
    }

    const parsed = JSON.parse(rawValue) as Partial<StoredGuestSession>;

    if (
      typeof parsed.sessionId !== "string" ||
      typeof parsed.expiresAt !== "string"
    ) {
      return null;
    }

    return {
      sessionId: parsed.sessionId,
      expiresAt: parsed.expiresAt,
    };
  } catch {
    return null;
  }
}
