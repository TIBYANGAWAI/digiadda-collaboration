"use client"

import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function AdminDashboardPage() {
  const { user } = useAuth()
  const router = useRouter()

  // If not logged in, redirect to login
  useEffect(() => {
    if (!user) {
      router.push("/login")
    } else if (user.role !== "super_admin" && user.role !== "sub_admin") {
      router.push("/dashboard") // redirect non-admin users elsewhere
    }
  }, [user, router])

  // Show loading placeholder while checking
  if (!user) {
    return (
      <div className="p-6 text-center text-gray-500">
        Loading admin dashboard...
      </div>
    )
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      <p className="text-gray-600 mt-2">
        Welcome back, {user.email || "Admin"}!
      </p>
    </div>
  )
}
