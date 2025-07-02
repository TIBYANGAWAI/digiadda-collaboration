"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardContent, CardDescription } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2 } from "lucide-react"
import { createClient } from "@/utils/supabase/client"

const supabase = createClient()

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [resetMessage, setResetMessage] = useState("")

  const router = useRouter()
  const supabase = createClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    const { data, error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError("Invalid credentials. Please check your login details.")
      setIsLoading(false)
    } else {
      const role = data.user?.user_metadata?.role || "client"
      if (role === "admin") router.push("/dashboard")
      else if (role === "team") router.push("/dashboard/team")
      else router.push("/dashboard/client")
    }
  }

  const handleResetPassword = async () => {
    setError("")
    setResetMessage("")
    if (!email) {
      setError("Please enter your email to reset password.")
      return
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })

    if (error) {
      setError("Failed to send reset link. Please try again.")
    } else {
      setResetMessage("Password reset link sent to your email.")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md shadow-md">
        <CardHeader className="flex flex-col items-center gap-3">
          <img
            src="/digiadda-logo.png"
            alt="DigiAdda Logo"
            className="h-20 object-contain"
          />
          <CardDescription className="text-center text-muted-foreground text-sm">
            Sign in to your DigiAdda workspace
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
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
            <div>
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

            {resetMessage && (
              <Alert variant="default">
                <AlertDescription>{resetMessage}</AlertDescription>
              </Alert>
            )}

            <div className="flex items-center justify-between">
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Sign In
              </Button>
            </div>

            <div className="text-sm text-center mt-2">
              <button
                type="button"
                className="text-blue-600 hover:underline"
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
