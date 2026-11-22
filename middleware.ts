import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

export async function middleware(request: NextRequest) {
  const sessionCookie = getSessionCookie(request);

  // 1. If no cookie, redirect to login
  if (!sessionCookie) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // 2. We can't easily read the role from the cookie in middleware without an API call, 
  // so we will let the Layout handle the specific role check.
  // This middleware just ensures they are logged in.
  return NextResponse.next();
}

// Only run this on dashboard routes
export const config = {
  matcher: ["/dashboard/:path*"],
};