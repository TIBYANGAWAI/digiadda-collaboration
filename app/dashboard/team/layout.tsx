import React from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"

const navItems = [
  { name: "Home", href: "/dashboard/team" },
  { name: "Projects", href: "/dashboard/team/projects" },
  { name: "Tasks", href: "/dashboard/team/tasks" },
  { name: "Chat", href: "/dashboard/team/chat" },
]

export default function TeamLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r p-4">
        <div className="text-xl font-bold mb-6 text-primary">Team Panel</div>
        <nav className="space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "block px-3 py-2 rounded hover:bg-gray-100 text-gray-700 text-sm font-medium"
              )}
            >
              {item.name}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-gray-50 p-6">{children}</main>
    </div>
  )
}
