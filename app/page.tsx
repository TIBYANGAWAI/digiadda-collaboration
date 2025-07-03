// file: app/page.tsx
"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"

export default function Home() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (loading) return

    const role = user?.role || "team"
    const redirectTo =
      role === "super_admin" || role === "sub_admin"
        ? "/dashboard/admin"
        : "/dashboard/team/member"

    if (user) {
      router.replace(redirectTo)
    } else {
      router.replace("/login")
    }
  }, [user, loading])

  return null
}
