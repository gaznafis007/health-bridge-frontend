"use client";

import { createContext, useCallback, useEffect, useMemo, useState } from "react";

import {
  logoutAction,
  silentRefreshAction,
} from "@/lib/auth/auth.actions";
import { getMe, toAuthUser } from "@/lib/auth/auth.api";
import type { AuthSession, AuthUser } from "@/lib/auth/auth.types";

export interface AuthContextValue {
  user: AuthUser | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setSession: (session: AuthSession) => void;
  refreshUser: () => Promise<void>;
  signout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function restoreSession() {
      try {
        const session = await silentRefreshAction();

        if (!isMounted) {
          return;
        }

        if (session) {
          setUser(session.user);
          setAccessToken(session.accessToken);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    restoreSession();

    return () => {
      isMounted = false;
    };
  }, []);

  const setSession = useCallback((session: AuthSession) => {
    setUser(session.user);
    setAccessToken(session.accessToken);
  }, []);

  const refreshUser = useCallback(async () => {
    if (!accessToken) return;
    const me = await getMe(accessToken);
    setUser(toAuthUser(me));
  }, [accessToken]);

  const signout = useCallback(async () => {
    await logoutAction(accessToken);
    setUser(null);
    setAccessToken(null);
  }, [accessToken]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      accessToken,
      isAuthenticated: user !== null && accessToken !== null,
      isLoading,
      setSession,
      refreshUser,
      signout,
    }),
    [accessToken, isLoading, refreshUser, setSession, signout, user],
  );

  return <AuthContext value={value}>{children}</AuthContext>;
}
