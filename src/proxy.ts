import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { REFRESH_TOKEN_COOKIE } from "@/lib/auth/auth.constants";

const PROTECTED_PREFIXES = [
  "/dashboard",
  "/account",
  "/notifications",
  "/appointments",
  "/lab-tests",
  "/ambulance",
  "/pharmacy/orders",
  "/admin",
  "/dispatch",
  "/driver",
];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasRefreshToken = request.cookies.has(REFRESH_TOKEN_COOKIE);

  if (pathname.startsWith("/auth")) {
    if (hasRefreshToken) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    return NextResponse.next();
  }

  const isProtected = PROTECTED_PREFIXES.some((prefix) => pathname.startsWith(prefix));

  if (isProtected && !hasRefreshToken) {
    const loginUrl = new URL("/auth/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/auth/:path*",
    "/dashboard/:path*",
    "/account/:path*",
    "/notifications/:path*",
    "/appointments/:path*",
    "/lab-tests/:path*",
    "/ambulance/:path*",
    "/pharmacy/orders/:path*",
    "/admin/:path*",
    "/dispatch/:path*",
    "/driver/:path*",
  ],
};
