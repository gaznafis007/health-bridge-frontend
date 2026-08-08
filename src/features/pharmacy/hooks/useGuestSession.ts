"use client";

import { useCallback, useEffect, useState } from "react";

import { createGuestSession, getCart } from "@/features/pharmacy/lib/pharmacy.api";
import {
  clearGuestSessionFromStorage,
  readGuestSessionFromStorage,
  saveGuestSessionToStorage,
} from "@/features/pharmacy/lib/guest-session.storage";
import { isGuestSessionNotFound } from "@/features/pharmacy/lib/pharmacy.utils";

interface UseGuestSessionResult {
  sessionId: string | null;
  isReady: boolean;
  errorMessage: string | null;
  refreshGuestSession: () => Promise<string | null>;
}

export function useGuestSession(): UseGuestSessionResult {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const refreshGuestSession = useCallback(async (): Promise<string | null> => {
    clearGuestSessionFromStorage();

    try {
      const nextSession = await createGuestSession();
      saveGuestSessionToStorage(nextSession);
      setSessionId(nextSession.sessionId);
      setErrorMessage(null);
      return nextSession.sessionId;
    } catch (error) {
      setSessionId(null);
      setErrorMessage(getErrorMessage(error, "We could not start your guest session."));
      return null;
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function initializeGuestSession() {
      setIsReady(false);

      try {
        const storedSession = readGuestSessionFromStorage();

        if (storedSession) {
          try {
            await getCart(storedSession.sessionId);

            if (!isMounted) {
              return;
            }

            setSessionId(storedSession.sessionId);
            setErrorMessage(null);
            return;
          } catch (error) {
            if (!isGuestSessionNotFound(error)) {
              throw error;
            }

            clearGuestSessionFromStorage();
          }
        }

        const nextSession = await createGuestSession();

        if (!isMounted) {
          return;
        }

        saveGuestSessionToStorage(nextSession);
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

    void initializeGuestSession();

    return () => {
      isMounted = false;
    };
  }, []);

  return { sessionId, isReady, errorMessage, refreshGuestSession };
}

function getErrorMessage(error: unknown, fallback: string) {
  return typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof (error as { message?: unknown }).message === "string"
    ? (error as { message: string }).message
    : fallback;
}
