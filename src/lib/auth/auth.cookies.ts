import "server-only";

import { cookies } from "next/headers";

import { REFRESH_TOKEN_COOKIE } from "@/lib/auth/auth.constants";

const SEVEN_DAYS_SECONDS = 7 * 24 * 60 * 60;

export async function getRefreshToken(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(REFRESH_TOKEN_COOKIE)?.value ?? null;
}

export async function setRefreshTokenCookie(refreshToken: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(REFRESH_TOKEN_COOKIE, refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SEVEN_DAYS_SECONDS,
  });
}

export async function clearRefreshTokenCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(REFRESH_TOKEN_COOKIE);
}
