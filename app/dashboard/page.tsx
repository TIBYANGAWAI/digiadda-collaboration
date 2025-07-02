'use client'

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"

export default function DashboardRedirectPage() {
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (user === null) {
      // Still loading, do nothing
      return
    }

    if (!user) {
      router.push("/login")
    } else if (user.role === "super_admin" || user.role === "sub_admin") {
      router.push("/dashboard/admin")
    } else if (user.role === "team") {
      router.push("/dashboard/team")
    } else if (user.role === "client") {
      router.push("/dashboard/client")
    } else {
      router.push("/login") // fallback
    }
  }, [user, router])

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p className="text-gray-500 text-sm">Redirecting to your dashboard...</p>
    </div>
  )
}
