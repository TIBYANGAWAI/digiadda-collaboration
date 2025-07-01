"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Crown, User, UserCheck } from "lucide-react"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const { login, isLoading } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    const success = await login(email, password)
    if (success) {
      router.push("/dashboard")
    } else {
      setError("Invalid credentials. Please check the demo credentials below.")
    }
  }

  const handleDemoLogin = async (demoEmail: string) => {
    setEmail(demoEmail)
    setPassword("password")
    const success = await login(demoEmail, "password")
    if (success) {
      router.push("/dashboard")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            DigiAdda
          </CardTitle>
          <CardDescription className="text-gray-600">Sign in to your collaboration workspace</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
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
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Sign In
            </Button>
          </form>

          <div className="mt-6 space-y-3">
            <p className="text-sm font-medium text-gray-700 text-center">Quick Demo Access:</p>

            <div className="space-y-2">
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => handleDemoLogin("admin@digiadda.com")}
                disabled={isLoading}
              >
                <Crown className="mr-2 h-4 w-4 text-yellow-500" />
                <div className="text-left">
                  <div className="font-medium">Super Admin</div>
                  <div className="text-xs text-gray-500">admin@digiadda.com</div>
                </div>
              </Button>

              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => handleDemoLogin("john@digiadda.com")}
                disabled={isLoading}
              >
                <User className="mr-2 h-4 w-4 text-blue-500" />
                <div className="text-left">
                  <div className="font-medium">Team Member</div>
                  <div className="text-xs text-gray-500">john@digiadda.com</div>
                </div>
              </Button>

              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => handleDemoLogin("client@digiadda.com")}
                disabled={isLoading}
              >
                <UserCheck className="mr-2 h-4 w-4 text-green-500" />
                <div className="text-left">
                  <div className="font-medium">Client Portal</div>
                  <div className="text-xs text-gray-500">client@digiadda.com</div>
                </div>
              </Button>
            </div>
          </div>

          <div className="mt-4 text-xs text-gray-500 text-center">
            <p>
              All demo accounts use password: <code className="bg-gray-100 px-1 rounded">password</code>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
