"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"

export default function AdminDashboardPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.replace("/login")
      } else if (user.role !== "super_admin" && user.role !== "sub_admin") {
        router.replace("/dashboard")
      }
    }
  }, [user, loading, router])

  if (loading || !user) {
    return <div className="p-4">Loading admin dashboard...</div>
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>
      <p className="text-muted-foreground mt-2">Welcome, {user.email}</p>
    </div>
  )
}
