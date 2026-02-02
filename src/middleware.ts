import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Define public paths that don't require authentication
  const isAuthPath = path.startsWith("/auth");
  const isPublicPath = isAuthPath || path === "/favicon.ico" || path === "/site.webmanifest";

  const token = request.cookies.get("HeroItemsAdmin")?.value || "";

  // If the user is not logged in and trying to access a protected route
  if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  // If the user is logged in and trying to access an auth page (login/forgot password etc)
  if (isAuthPath && token) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};

