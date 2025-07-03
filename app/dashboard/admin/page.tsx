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
        router.replace("/login") // user not logged in
      } else if (user.role !== "super_admin" && user.role !== "sub_admin") {
        router.replace("/dashboard") // not admin, redirect to general dashboard
      }
    }
  }, [user, loading])

  if (loading || !user) {
    return <div className="p-6">Loading...</div>
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold">Welcome Admin, {user.name}</h1>
      <p className="text-muted-foreground mt-2">This is the admin panel</p>
    </div>
  )
}
