"use client";

import { useRouter } from "next/navigation";
import useSWR, { type SWRConfiguration } from "swr";

import { useAuth } from "@/features/auth/hooks/useAuth";
import { silentRefreshAction } from "@/lib/auth/auth.actions";
import { getApiErrorStatus } from "@/lib/api/errors";

function buildLoginRedirect(pathname: string) {
  return `/auth/login?redirect=${encodeURIComponent(pathname)}`;
}

export function useAuthenticatedSWR<T>(
  key: string | null,
  fetcher: (accessToken: string) => Promise<T>,
  config?: SWRConfiguration<T>,
) {
  const router = useRouter();
  const { accessToken, isLoading: isAuthLoading, setSession } = useAuth();

  const swrKey =
    isAuthLoading || !accessToken || !key ? null : ([key, accessToken] as const);

  return useSWR<T>(
    swrKey,
    async ([, token]: readonly [string, string]) => {
      try {
        return await fetcher(token);
      } catch (error) {
        if (getApiErrorStatus(error) !== 401) {
          throw error;
        }

        const session = await silentRefreshAction();
        if (session) {
          setSession(session);
          return fetcher(session.accessToken);
        }

        router.replace(buildLoginRedirect(window.location.pathname));
        throw error;
      }
    },
    config,
  );
}
