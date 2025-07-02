"use client"

import type React from "react"

import { useAuth } from "@/contexts/auth-context"
import { DashboardHeader } from "@/components/dashboard-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Users,
  FolderOpen,
  CheckSquare,
  TrendingUp,
  Clock,
  DollarSign,
  Calendar,
  MessageSquare,
  Upload,
  FileText,
  Star,
  ArrowRight,
  Activity,
  Zap,
} from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { BlobStorageService } from "@/lib/blob-storage"
import { toast } from "@/components/ui/use-toast"

// Ensure user name is accessed via user_metadata fallback

export default function DashboardPage() {
  const { user } = useAuth()
  const router = useRouter()

  const isAdmin = user?.user_metadata?.role === "admin"
  const isClient = user?.user_metadata?.role === "client"

  const [uploadedFiles, setUploadedFiles] = useState<any[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false)

  const userName = user?.user_metadata?.name || "User"

  const handleFileUpload = async (files: FileList) => {
    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        const uploadedFile = await BlobStorageService.uploadFile(file, {
          onProgress: (progress) => {
            console.log(`Upload progress: ${progress}%`)
          },
        })
        return {
          id: uploadedFile.id,
          name: uploadedFile.name,
          size: BlobStorageService.formatFileSize(uploadedFile.size),
          type: uploadedFile.type,
          uploadedAt: new Date().toLocaleTimeString(),
          uploadedBy: userName,
          url: uploadedFile.url,
        }
      })

      const results = await Promise.all(uploadPromises)
      setUploadedFiles((prev) => [...results, ...prev])

      toast({
        title: "Upload Successful",
        description: `${results.length} file(s) uploaded to cloud storage`,
      })
    } catch (error) {
      toast({
        title: "Upload Failed",
        description: "Failed to upload files to cloud storage",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="flex-1 flex flex-col">
      <DashboardHeader
        title={`Welcome back, ${userName}! 👋`}
        description={
          isAdmin
            ? "Super Admin Dashboard - Manage your entire workspace"
            : isClient
              ? "Client Portal - Track your projects and communicate with the team"
              : "Team Member Dashboard - View your tasks and projects"
        }
      />
      {/* rest of component remains unchanged */}
    </div>
  )
}
