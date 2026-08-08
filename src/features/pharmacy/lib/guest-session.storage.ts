import { isSessionExpired } from "@/features/pharmacy/lib/pharmacy.utils";

export const GUEST_SESSION_STORAGE_KEY = "hb_guest_session";

export interface StoredGuestSession {
  sessionId: string;
  expiresAt: string;
}

export function readGuestSessionFromStorage(): StoredGuestSession | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const rawValue = window.localStorage.getItem(GUEST_SESSION_STORAGE_KEY);
    if (!rawValue) {
      return null;
    }

    const parsed = JSON.parse(rawValue) as Partial<StoredGuestSession>;

    if (
      typeof parsed.sessionId !== "string" ||
      typeof parsed.expiresAt !== "string" ||
      isSessionExpired(parsed.expiresAt)
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

export function saveGuestSessionToStorage(session: StoredGuestSession) {
  window.localStorage.setItem(GUEST_SESSION_STORAGE_KEY, JSON.stringify(session));
}

export function clearGuestSessionFromStorage() {
  window.localStorage.removeItem(GUEST_SESSION_STORAGE_KEY);
}
