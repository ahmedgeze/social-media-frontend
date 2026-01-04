import { NextRequest, NextResponse } from "next/server";

// For client-side routing, we use redirect to preserve JavaScript context
const AUTH_CLIENT_URL = process.env.NEXT_PUBLIC_AUTH_URL || "http://localhost:3001";
const SOCIAL_CLIENT_URL = process.env.NEXT_PUBLIC_SOCIAL_URL || "http://localhost:3002";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Auth routes - redirect to auth app (preserves localStorage context)
  if (pathname === "/profile") {
    return NextResponse.redirect(new URL(pathname, AUTH_CLIENT_URL));
  }

  // Login and register - redirect to auth app
  if (pathname === "/login" || pathname === "/register") {
    const returnUrl = request.nextUrl.searchParams.get("returnUrl") || "/";
    const authUrl = new URL(pathname, AUTH_CLIENT_URL);
    authUrl.searchParams.set("returnUrl", returnUrl);
    return NextResponse.redirect(authUrl);
  }

  // Social app routes - redirect to social app
  if (pathname === "/feed" || pathname === "/users") {
    const targetPath = pathname === "/feed" ? "/" : pathname;
    return NextResponse.redirect(new URL(targetPath, SOCIAL_CLIENT_URL));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/profile", "/feed", "/users", "/login", "/register"],
};
