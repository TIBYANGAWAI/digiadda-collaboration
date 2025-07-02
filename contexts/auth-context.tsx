"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import type { User } from "@/lib/types"

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const mockUsers: User[] = [
  {
    id: "1",
    name: "Admin User",
    email: "admin@digiadda.com",
    role: "super_admin",
    avatar: "/placeholder.svg?height=40&width=40",
    createdAt: new Date(),
  },
  {
    id: "2",
    name: "John Developer",
    email: "john@digiadda.com",
    role: "team_member",
    avatar: "/placeholder.svg?height=40&width=40",
    createdAt: new Date(),
  },
  {
    id: "3",
    name: "Sarah Client",
    email: "client@digiadda.com",
    role: "client",
    avatar: "/placeholder.svg?height=40&width=40",
    createdAt: new Date(),
  },
]

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const storedUser = localStorage.getItem("digiadda_user")
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch (e) {
        localStorage.removeItem("digiadda_user")
      }
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true)
    const foundUser = mockUsers.find((u) => u.email === email)

    if (foundUser && password === "password") {
      setUser(foundUser)
      localStorage.setItem("digiadda_user", JSON.stringify(foundUser))
      setIsLoading(false)
      return true
    }

    setIsLoading(false)
    return false
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("digiadda_user")
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
