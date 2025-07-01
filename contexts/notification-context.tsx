"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import type { Notification } from "@/lib/types"
import { useAuth } from "./auth-context"

interface NotificationContextType {
  notifications: Notification[]
  unreadCount: number
  addNotification: (notification: Omit<Notification, "id" | "createdAt">) => void
  markAsRead: (id: string) => void
  markAllAsRead: () => void
  removeNotification: (id: string) => void
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

// Mock notifications for demo
const mockNotifications: Notification[] = [
  {
    id: "1",
    userId: "1",
    title: "New Task Assigned",
    message: "You have been assigned a new task: Design homepage mockup",
    type: "task",
    read: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    actionUrl: "/dashboard/tasks/1",
  },
  {
    id: "2",
    userId: "1",
    title: "Project Update",
    message: "Website Redesign project has been updated",
    type: "project",
    read: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    actionUrl: "/dashboard/projects/1",
  },
  {
    id: "3",
    userId: "1",
    title: "New Message",
    message: "You have a new message from Sarah Designer",
    type: "chat",
    read: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    actionUrl: "/dashboard/chat",
  },
]

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  const [notifications, setNotifications] = useState<Notification[]>([])

  useEffect(() => {
    if (user) {
      // Filter notifications for current user
      const userNotifications = mockNotifications.filter((n) => n.userId === user.id)
      setNotifications(userNotifications)

      // Simulate real-time notifications
      const interval = setInterval(() => {
        if (Math.random() > 0.8) {
          // 20% chance every 30 seconds
          addNotification({
            userId: user.id,
            title: "System Update",
            message: "Your dashboard has been updated with new features",
            type: "system",
            read: false,
          })
        }
      }, 30000)

      return () => clearInterval(interval)
    }
  }, [user])

  const unreadCount = notifications.filter((n) => !n.read).length

  const addNotification = (notification: Omit<Notification, "id" | "createdAt">) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      createdAt: new Date(),
    }
    setNotifications((prev) => [newNotification, ...prev])
  }

  const markAsRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        addNotification,
        markAsRead,
        markAllAsRead,
        removeNotification,
      }}
    >
      {children}
    </NotificationContext.Provider>
  )
}

export const useNotifications = () => {
  const context = useContext(NotificationContext)
  if (context === undefined) {
    throw new Error("useNotifications must be used within a NotificationProvider")
  }
  return context
}
