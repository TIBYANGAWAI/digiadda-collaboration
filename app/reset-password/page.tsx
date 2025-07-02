'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2 } from 'lucide-react'
import { createBrowserClient } from '@supabase/ssr'
import { supabaseUrl, supabaseAnonKey } from '@/lib/supabase/config'

const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey)

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Ensure user is already logged in through the magic link
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) {
        setError('Password reset link is invalid or has expired.')
      }
    })
  }, [])

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    setIsLoading(true)

    const { data, error } = await supabase.auth.updateUser({
      password,
    })

    if (error) {
      setError('Failed to update password. Please try again.')
    } else {
      setSuccess('Password updated! Redirecting to login...')
      setTimeout(() => {
        router.push('/login')
      }, 2500)
    }

    setIsLoading(false)
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
            Enter your new password below
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">New Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert variant="default">
                <AlertDescription>{success}</AlertDescription>
              </Alert>
            )}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Reset Password
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
