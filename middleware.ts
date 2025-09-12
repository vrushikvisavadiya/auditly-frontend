import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ROUTES } from "./src/routes/constants";
import { ROLES } from "./src/constants/roles";

// Define public routes that don't require authentication
const publicRoutes = [
  "/login",
  "/signup",
  "/forgot-password",
  "/reset-password",
];

// Function to check if a route is public
const isPublicRoute = (path: string) => {
  return publicRoutes.some((route) => path.startsWith(route));
};

// Function to get user from localStorage (client-side only)
const getUserFromRequest = (request: NextRequest) => {
  const token = request.cookies.get("accessToken")?.value;
  if (!token) return null;

  try {
    const user = request.cookies.get("user")?.value;
    return user ? JSON.parse(user) : null;
  } catch {
    return null;
  }
};

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public assets and API routes
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/static")
  ) {
    return NextResponse.next();
  }

  // Check if it's a public route
  if (isPublicRoute(pathname)) {
    return NextResponse.next();
  }

  // Get user from request
  const user = getUserFromRequest(request);
  const isAuthenticated = !!user;

  // For protected routes, let client-side protection handle the redirects
  // This prevents the middleware from interfering with the login flow
  if (!isAuthenticated && !isPublicRoute(pathname)) {
    // Only redirect to login if it's not already a login redirect
    if (!pathname.includes("login")) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // If authenticated but trying to access auth pages
  if (isAuthenticated && isPublicRoute(pathname)) {
    return NextResponse.redirect(
      new URL(
        user.platformRole === ROLES.ADMIN
          ? ROUTES.ADMIN.DASHBOARD
          : ROUTES.ORGANIZATION,
        request.url
      )
    );
  }

  // For admin routes, let client-side protection handle the role checks
  // This allows the ProtectedRoute component to handle the redirects properly
  if (pathname.startsWith("/admin") && !isAuthenticated) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * 1. /api/ (API routes)
     * 2. /_next/ (Next.js internals)
     * 3. /static (public files)
     * 4. /_vercel (Vercel internals)
     * 5. all root files inside public (e.g. /favicon.ico)
     */
    "/((?!api|_next|_vercel|static|[\\w-]+\\.\\w+).*)",
  ],
};
