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
  console.log(`\n--- Middleware running for path: ${pathname} ---`);

  // --- ADD THIS LOG TO CHECK YOUR SECRET ---
  // If this logs 'undefined', your .env file is not being read correctly.
  console.log(
    "Using JWT_SECRET:",
    process.env.JWT_SECRET ? "Loaded from env" : "Using fallback secret"
  );

  const token = request.cookies.get("accessToken")?.value;

  const publicPaths = ["/login", "/signup", "/forgot-password"];
  const isPublicPath = publicPaths.some((path) => pathname.startsWith(path));

  // --- Logic for Authenticated Users ---
  if (token) {
    console.log("Token found. Attempting to verify...");
    try {
      const { payload } = await jwtVerify(token, secret);
      // --- THIS LOG IS KEY ---
      // If you see this, the token was successfully verified and is NOT considered invalid/expired.
      console.log("✅ Token verification SUCCEEDED. Payload:", payload);

      const userRole = payload.role as string;

      if (isPublicPath) {
        const url =
          userRole === authConfig.roles.patient ? "/patient-portal" : "/";
        return NextResponse.redirect(new URL(url, request.url));
      }

      const allowedRoles = getAllowedRolesForPath(pathname);
      if (allowedRoles && !allowedRoles.includes(userRole)) {
        const url =
          userRole === authConfig.roles.patient ? "/patient-portal" : "/";
        return NextResponse.redirect(new URL(url, request.url));
      }
    } catch (err) {
      // --- THIS IS THE BLOCK YOU EXPECT TO RUN ---
      // If the token is invalid, you should see this error log.
      console.error("❌ TOKEN VERIFICATION FAILED:", err);

      const response = NextResponse.redirect(
        new URL(authConfig.pages.signIn, request.url)
      );
      response.cookies.delete("accessToken");
      return response;
    }
  }

  // --- Logic for Unauthenticated Users ---
  if (!token) {
    console.log("No token found.");
    if (!isPublicPath) {
      console.log(
        "Accessing protected route without token. Redirecting to login."
      );
      return NextResponse.redirect(
        new URL(authConfig.pages.signIn, request.url)
      );
    }
  }

  console.log("Request allowed to proceed.");
  return NextResponse.next();
}

// ... (getAllowedRolesForPath and config functions remain the same)
// Keep your existing getAllowedRolesForPath and config exports here
/**
 * Finds the allowed roles for a given pathname...
 */
function getAllowedRolesForPath(pathname: string): string[] | undefined {
  // ... your implementation
  const { protectedRoutes } = authConfig;
  for (const routePattern in protectedRoutes) {
    const regex = new RegExp(`^${routePattern.replace(/\[.*?\]/g, "[^/]+")}$`);
    if (regex.test(pathname)) {
      return protectedRoutes[routePattern as keyof typeof protectedRoutes];
    }
  }
  return undefined;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
