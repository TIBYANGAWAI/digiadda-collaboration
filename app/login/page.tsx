"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2 } from "lucide-react"
import { supabase } from "@/utils/supabase/client"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setError("Invalid credentials. Please check your login details.")
      setLoading(false)
      return
    }

    const role = data.user?.user_metadata?.role

    if (role === "admin") {
      router.push("/dashboard")
    } else if (role === "team") {
      router.push("/dashboard/team")
    } else if (role === "client") {
      router.push("/dashboard/client")
    } else {
      setError("No role assigned. Please contact support.")
    }

    setLoading(false)
  }

  const handlePasswordReset = async () => {
    const { error } = await supabase.auth.resetPasswordForEmail(email)
    if (error) {
      setError("Failed to send reset link. Please try again.")
    } else {
      alert("Password reset link sent to your email.")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center flex flex-col items-center gap-2">
          <img
            src="/digiadda-logo.png"
            alt="DigiAdda Logo"
            className="h-16 w-16 rounded-full shadow object-contain"
          />
          <CardDescription className="text-gray-600 mt-1">
            Sign in to your collaboration workspace
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Sign In
            </Button>

            <button
              type="button"
              onClick={handlePasswordReset}
              className="w-full mt-2 text-sm text-blue-600 hover:underline"
              disabled={!email}
            >
              Forgot Password?
            </button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
