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
    const fetchUser = async () => {
      console.log("🔄 Checking Supabase session...")

      const { data, error } = await supabase.auth.getUser()

      if (error || !data?.user) {
        console.warn("⚠️ Supabase user fetch error:", error)
        setUser(null)
        setLoading(false)
        return
      }

      const supaUser = data.user
      const metadata = supaUser.user_metadata || {}
      const role: Role = metadata.role || "team"
      const name = metadata.name || supaUser.email?.split("@")[0] || "User"

      const appUser: AppUser = {
        id: supaUser.id,
        email: supaUser.email!,
        role,
        name,
        user_metadata: metadata,
      }

      console.log("✅ Logged in user:", appUser)

      setUser(appUser)
      setLoading(false)
    }

    fetchUser()
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
