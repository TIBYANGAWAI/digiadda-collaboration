"use client"
import { useAuth } from "@/contexts/auth-context"

export default function DebugPage() {
  const { user, loading } = useAuth()

  return (
    <main className="p-6">
      <h1 className="text-xl font-bold mb-4">Auth Debug</h1>
      {loading ? (
        <p>Loading auth state...</p>
      ) : user ? (
        <pre className="bg-gray-100 p-4 rounded text-sm">
          {JSON.stringify(user, null, 2)}
        </pre>
      ) : (
        <p>No user is logged in.</p>
      )}
    </main>
  )
}
