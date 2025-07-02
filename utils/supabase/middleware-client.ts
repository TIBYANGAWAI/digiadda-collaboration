import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export const createSupabaseServerClient = async () => {
  const cookieStore = await cookies() // ✅ FIXED with await

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name) {
          return cookieStore.get(name)?.value
        },
        set() {
          // not available in middleware
        },
        remove() {
          // not available in middleware
        },
      },
    }
  )
}
