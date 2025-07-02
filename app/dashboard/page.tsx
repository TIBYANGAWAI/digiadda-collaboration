"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"

export default function DashboardRedirectPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (loading || user === undefined) return // wait for auth check

    if (!user) {
      router.push("/login")
    } else {
      switch (user.role) {
        case "super_admin":
        case "sub_admin":
          router.push("/dashboard/admin")
          break
        case "team":
          router.push("/dashboard/team")
          break
        case "client":
          router.push("/dashboard/client")
          break
        default:
          router.push("/login")
      }
    }
  }, [user, loading, router])

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p className="text-gray-500 text-sm">Redirecting to your dashboard...</p>
    </div>
  )
}
