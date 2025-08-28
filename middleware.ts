// middleware.ts

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";
import { authConfig } from "./lib/auth-config";

// The secret key should be stored securely in your environment variables
const secret = new TextEncoder().encode(
  process.env.JWT_SECRET || "your-fallback-secret-for-dev"
);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("accessToken")?.value;

  const publicPaths = ["/login", "/signup", "/forgot-password"];
  const isPublicPath = publicPaths.some((path) => pathname.startsWith(path));

  // --- Logic for Authenticated Users ---
  if (token) {
    try {
      const { payload } = await jwtVerify(token, secret);
      const userRole = payload.role as string;

      // If an authenticated user tries to access a public path (e.g., /login), redirect them away
      if (isPublicPath) {
        const url =
          userRole === authConfig.roles.patient ? "/patient-portal" : "/";
        return NextResponse.redirect(new URL(url, request.url));
      }

      // Check authorization for the requested protected route
      const allowedRoles = getAllowedRolesForPath(pathname);
      if (allowedRoles && !allowedRoles.includes(userRole)) {
        // If their role is not allowed, redirect to their default dashboard
        const url =
          userRole === authConfig.roles.patient ? "/patient-portal" : "/";
        return NextResponse.redirect(new URL(url, request.url));
      }
    } catch (err) {
      // This happens if the token is invalid or expired
      // Redirect to the login page and clear the bad cookie
      const response = NextResponse.redirect(
        new URL(authConfig.pages.signIn, request.url)
      );
      response.cookies.delete("accessToken");
      return response;
    }
  }

  // --- Logic for Unauthenticated Users ---
  if (!token) {
    // If an unauthenticated user tries to access a protected route, redirect to login
    if (!isPublicPath) {
      return NextResponse.redirect(
        new URL(authConfig.pages.signIn, request.url)
      );
    }
  }

  // If none of the above conditions are met, allow the request to proceed
  return NextResponse.next();
}

/**
 * Finds the allowed roles for a given pathname by matching it against the protectedRoutes config.
 * This helper correctly handles dynamic routes like '/patients/[username]'.
 * @param pathname The path from the incoming request.
 * @returns An array of allowed roles, or undefined if the route is not protected.
 */
function getAllowedRolesForPath(pathname: string): string[] | undefined {
  const { protectedRoutes } = authConfig;
  // Find a protected route pattern that matches the current pathname
  for (const routePattern in protectedRoutes) {
    const regex = new RegExp(`^${routePattern.replace(/\[.*?\]/g, "[^/]+")}$`);
    if (regex.test(pathname)) {
      return protectedRoutes[routePattern as keyof typeof protectedRoutes];
    }
  }
  return undefined; // Return undefined if no pattern matches (i.e., it's not a protected route)
}

// Configure which paths the middleware should run on
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
