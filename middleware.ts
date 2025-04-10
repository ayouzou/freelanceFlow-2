import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { verifyAuth } from "./lib/auth"


// Define paths that require authentication
const protectedPaths = [
  "/dashboard",
  "/dashboard/projects",
  "/dashboard/clients",
  "/dashboard/invoices",
  "/dashboard/settings",
]

// Define paths that are only accessible to non-authenticated users
const authPaths = ["/login", "/register", "/forgot-password", "/reset-password"]

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Check if user is authenticated
  const user = await verifyAuth(request)
  const isAuthenticated = !!user
  // Redirect authenticated users away from auth pages
  if (isAuthenticated && authPaths.some((path) => pathname.startsWith(path))) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  // Redirect unauthenticated users away from protected pages
  if (!isAuthenticated && protectedPaths.some((path) => pathname.startsWith(path))) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public files)
     * - api (API routes that handle their own auth)
     */
    "/((?!_next/static|_next/image|favicon.ico|public|api).*)",
  ],
}

