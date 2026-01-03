import { NextRequest, NextResponse } from "next/server";

const AUTH_URL = process.env.AUTH_SERVICE_URL || "http://localhost:3001";
const SOCIAL_URL = process.env.SOCIAL_SERVICE_URL || "http://localhost:3002";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Auth app routes
  if (pathname === "/login" || pathname === "/register" || pathname === "/profile") {
    const targetUrl = `${AUTH_URL}${pathname}`;
    try {
      const response = await fetch(targetUrl, {
        method: request.method,
        headers: request.headers,
        body: request.method !== "GET" && request.method !== "HEAD" ? request.body : undefined,
      });

      const body = await response.text();
      return new NextResponse(body, {
        status: response.status,
        statusText: response.statusText,
        headers: response.headers,
      });
    } catch {
      return NextResponse.json({ error: "Auth service unavailable" }, { status: 503 });
    }
  }

  // Social app routes
  if (pathname === "/feed" || pathname === "/users") {
    const targetPath = pathname === "/feed" ? "/" : pathname;
    const targetUrl = `${SOCIAL_URL}${targetPath}`;
    try {
      const response = await fetch(targetUrl, {
        method: request.method,
        headers: request.headers,
        body: request.method !== "GET" && request.method !== "HEAD" ? request.body : undefined,
      });

      const body = await response.text();
      return new NextResponse(body, {
        status: response.status,
        statusText: response.statusText,
        headers: response.headers,
      });
    } catch {
      return NextResponse.json({ error: "Social service unavailable" }, { status: 503 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/login", "/register", "/profile", "/feed", "/users"],
};
