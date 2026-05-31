"use client";

import { useRouter } from "next/navigation";
import useSWR, { type SWRConfiguration } from "swr";

import { useAuth } from "@/features/auth/hooks/useAuth";
import { getApiErrorStatus } from "@/lib/api/errors";

export function useAuthenticatedSWR<T>(
  key: string | null,
  fetcher: (accessToken: string) => Promise<T>,
  config?: SWRConfiguration<T>,
) {
  const router = useRouter();
  const { accessToken, isLoading: isAuthLoading } = useAuth();

  const swrKey =
    isAuthLoading || !accessToken || !key ? null : ([key, accessToken] as const);

  return useSWR<T>(
    swrKey,
    async ([, token]: readonly [string, string]) => {
      try {
        return await fetcher(token);
      } catch (error) {
        if (getApiErrorStatus(error) === 401) {
          router.replace(`/auth/login?redirect=${encodeURIComponent(window.location.pathname)}`);
        }
        throw error;
      }
    },
    config,
  );
}
