import { createSupabaseServerClient } from "@/utils/supabase/middleware-client"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(req: NextRequest) {
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.redirect(new URL("/login", req.url))
  }

  // Fetch role from Supabase
  const { data: roleData } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", user.id)
    .single()

  if (!roleData) {
    return NextResponse.redirect(new URL("/login", req.url))
  }

  const role = roleData.role

  if (req.nextUrl.pathname.startsWith("/dashboard/admin") && role !== "admin") {
    return NextResponse.redirect(new URL("/dashboard", req.url))
  }

  return NextResponse.next()
}
export const config = {
  matcher: [
    "/dashboard/:path*",     // protect all dashboard pages
  ],
}
