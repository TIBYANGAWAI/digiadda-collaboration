'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2 } from "lucide-react"
import Link from "next/link"

import { createBrowserClient } from "@supabase/ssr"
import { supabaseUrl, supabaseAnonKey } from "@/lib/supabase/config"

const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey)

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [resetMessage, setResetMessage] = useState("")

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setResetMessage("")
    setIsLoading(true)

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setError("Invalid credentials. Please check your login details.")
      setIsLoading(false)
      return
    }

    const role = data.user.user_metadata?.role

    if (role === "admin") {
      router.push("/dashboard")
    } else if (role === "team") {
      router.push("/dashboard/team")
    } else if (role === "client") {
      router.push("/dashboard/client")
    } else {
      router.push("/dashboard")
    }
  }

  const handleResetPassword = async () => {
    setError("")
    setResetMessage("")
    if (!email) {
      setError("Enter your email to receive a reset link.")
      return
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })

    if (error) {
      setError("Failed to send reset link. Please try again.")
    } else {
      setResetMessage("Password reset link sent. Check your email.")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-blue-50 to-indigo-100">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center flex flex-col items-center gap-2">
          <img
            src="/digiadda-logo.png"
            alt="DigiAdda Logo"
            className="h-12 w-auto object-contain"
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
                placeholder="you@example.com"
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
                placeholder="••••••••"
                required
              />
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {resetMessage && (
              <Alert variant="default">
                <AlertDescription>{resetMessage}</AlertDescription>
              </Alert>
            )}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Sign In
            </Button>

            <div className="text-center mt-2">
              <button
                type="button"
                className="text-sm text-blue-600 hover:underline"
                onClick={handleResetPassword}
              >
                Forgot password?
              </button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
