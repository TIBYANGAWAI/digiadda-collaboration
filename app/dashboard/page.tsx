"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"

export default function DashboardRouterPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.replace("/login")
      } else {
        switch (user.role) {
          case "super_admin":
          case "sub_admin":
            router.replace("/dashboard/admin")
            break
          case "team":
            router.replace("/dashboard/team/member")
            break
          case "client":
            router.replace("/dashboard/client/overview")
            break
          default:
            router.replace("/login")
        }
      }
    }
  }, [user, loading, router])

  return (
    <div className="p-4">
      <p>Redirecting based on your role...</p>
    </div>
  )
}
