"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createBrowserClient } from "@supabase/ssr"
import type { AppUser } from "@/types/supabase"

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

type AuthContextType = {
  user: AppUser | null | undefined
  loading: boolean
  logout: () => void        // ✅ Added logout
}

const AuthContext = createContext<AuthContextType>({
  user: undefined,
  loading: true,
  logout: () => {},         // ✅ Placeholder default
})

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<AppUser | null | undefined>(undefined)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user }, error }) => {
      if (error || !user) {
        setUser(null)
        setLoading(false)
        return
      }

      const role = user.user_metadata?.role || "team"
      const name = user.user_metadata?.name || user.email?.split("@")[0] || "User"

      setUser({
        id: user.id,
        email: user.email!,
        role,
        name,
        user_metadata: user.user_metadata,
      })
      setLoading(false)
    })
  }, [])

  const logout = async () => {
    await supabase.auth.signOut()
    setUser(null)
    router.push("/login")
  }

  return (
    <AuthContext.Provider value={{ user, loading, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
