import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const SESSION_COOKIE_NAME = "client_session";

/**
 * Middleware to protect portal routes with authentication.
 * Redirects unauthenticated users to the login page.
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip authentication check for login page
  if (pathname === "/portal/login") {
    return NextResponse.next();
  }

  // Check for session cookie
  const sessionCookie = request.cookies.get(SESSION_COOKIE_NAME);

  if (!sessionCookie?.value) {
    // No session - redirect to login
    const loginUrl = new URL("/portal/login", request.url);

    // Add redirect parameter to return user after login
    loginUrl.searchParams.set("redirect", pathname);

    return NextResponse.redirect(loginUrl);
  }

  // Cookie present - the signature is verified by getSession() in each page/API route
  return NextResponse.next();
}

/**
 * Matcher configuration to apply middleware only to portal routes.
 * Excludes static assets and API routes.
 */
export const config = {
  matcher: ["/portal/dashboard/:path*", "/portal/project/:path*"],
};
