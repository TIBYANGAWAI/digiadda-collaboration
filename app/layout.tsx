import type React from 'react'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/contexts/auth-context'
import { NotificationProvider } from '@/contexts/notification-context'
import { SessionContextProvider } from '@supabase/auth-helpers-react'
import { createPagesBrowserClient } from '@supabase/auth-helpers-nextjs'
import { useState } from 'react'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'DigiAdda - Digital Marketing Agency',
  description: 'A comprehensive collaboration platform for digital marketing teams and clients',
  generator: 'v0.dev',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [supabaseClient] = useState(() =>
    createPagesBrowserClient()
  )

  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionContextProvider supabaseClient={supabaseClient}>
          <AuthProvider>
            <NotificationProvider>{children}</NotificationProvider>
          </AuthProvider>
        </SessionContextProvider>
      </body>
    </html>
  )
}
