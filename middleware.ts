import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs"
import { type NextRequest, NextResponse } from "next/server"

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()

  const supabase = createMiddlewareClient({ req, res })
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const isAuthRoute = req.nextUrl.pathname.startsWith("/login") || req.nextUrl.pathname.startsWith("/reset-password")
  const isProtectedRoute = req.nextUrl.pathname.startsWith("/dashboard")

  // If not authenticated, redirect to login
  if (!user && isProtectedRoute) {
    const redirectUrl = req.nextUrl.clone()
    redirectUrl.pathname = "/login"
    redirectUrl.searchParams.set("redirectedFrom", req.nextUrl.pathname)
    return NextResponse.redirect(redirectUrl)
  }

  // If already logged in and tries to visit login, redirect to dashboard
  if (user && isAuthRoute) {
    const redirectUrl = req.nextUrl.clone()
    redirectUrl.pathname = "/dashboard/admin"
    return NextResponse.redirect(redirectUrl)
  }

  return res
}

export const config = {
  matcher: ["/login", "/dashboard/:path*", "/reset-password"],
}
