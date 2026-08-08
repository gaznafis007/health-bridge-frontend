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
  "/admin",
  "/dispatch",
  "/driver",
];

function isPharmacyOrderList(pathname: string) {
  return pathname === "/pharmacy/orders" || pathname === "/pharmacy/orders/";
}

function resolveAuthenticatedAuthRedirect(request: NextRequest) {
  const redirect = request.nextUrl.searchParams.get("redirect");

  if (redirect && redirect.startsWith("/") && !redirect.startsWith("//")) {
    return NextResponse.redirect(new URL(redirect, request.url));
  }

  return NextResponse.redirect(new URL("/", request.url));
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasRefreshToken = request.cookies.has(REFRESH_TOKEN_COOKIE);

  if (pathname.startsWith("/auth")) {
    if (hasRefreshToken) {
      return resolveAuthenticatedAuthRedirect(request);
    }

    return NextResponse.next();
  }

  const isProtected =
    isPharmacyOrderList(pathname) ||
    PROTECTED_PREFIXES.some((prefix) => pathname.startsWith(prefix));

  if (isProtected && !hasRefreshToken) {
    const loginUrl = new URL("/auth/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const proxyConfig = {
  matcher: [
    "/auth/:path*",
    "/dashboard/:path*",
    "/account/:path*",
    "/notifications/:path*",
    "/appointments/:path*",
    "/lab-tests/:path*",
    "/ambulance/:path*",
    "/pharmacy/orders",
    "/admin/:path*",
    "/dispatch/:path*",
    "/driver/:path*",
  ],
};
