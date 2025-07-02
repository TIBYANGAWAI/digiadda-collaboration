"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { createBrowserClient } from "@supabase/ssr"
import type { AppUser, Role } from "@/types/supabase"

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

type AuthContextType = {
  user: AppUser | null | undefined
  loading: boolean
}

const AuthContext = createContext<AuthContextType>({
  user: undefined,
  loading: true,
})

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<AppUser | null | undefined>(undefined)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user }, error }) => {
      if (error || !user) {
        setUser(null)
        setLoading(false)
        return
      }

      const metadata = user.user_metadata || {}

      const role: Role = metadata.role || "team"
      const name = metadata.name || user.email?.split("@")[0]

      setUser({
        id: user.id,
        email: user.email!,
        role,
        name,
        user_metadata: metadata,
      })
      setLoading(false)
    })
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
