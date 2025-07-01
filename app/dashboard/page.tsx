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

// Mock data for dashboard
const mockStats = {
  totalTeamMembers: 12,
  totalClients: 8,
  activeProjects: 5,
  completedTasks: 47,
  pendingTasks: 23,
  inProgressTasks: 15,
  totalRevenue: 125000,
  monthlyRevenue: 25000,
}

const mockProjects = [
  {
    id: "1",
    name: "Website Redesign",
    progress: 75,
    status: "active",
    client: "TechCorp",
    dueDate: "2024-01-20",
    priority: "high",
    team: ["John", "Sarah", "Mike"],
  },
  {
    id: "2",
    name: "Mobile App Development",
    progress: 45,
    status: "active",
    client: "StartupXYZ",
    dueDate: "2024-02-15",
    priority: "medium",
    team: ["Jane", "Alex"],
  },
  {
    id: "3",
    name: "Brand Identity Package",
    progress: 90,
    status: "active",
    client: "Fashion Co",
    dueDate: "2024-01-25",
    priority: "low",
    team: ["Sarah", "Emma"],
  },
  {
    id: "4",
    name: "E-commerce Platform",
    progress: 100,
    status: "completed",
    client: "RetailCorp",
    dueDate: "2024-01-10",
    priority: "high",
    team: ["John", "Mike", "Lisa"],
  },
]

const mockRecentMessages = [
  {
    id: "1",
    sender: "Sarah Designer",
    message: "Homepage mockups are ready for review",
    time: "5 min ago",
    avatar: "/placeholder.svg?height=32&width=32",
    unread: true,
  },
  {
    id: "2",
    sender: "TechCorp Client",
    message: "Love the new design direction! When can we see the mobile version?",
    time: "1 hour ago",
    avatar: "/placeholder.svg?height=32&width=32",
    unread: true,
  },
  {
    id: "3",
    sender: "Mike Developer",
    message: "API integration completed successfully",
    time: "2 hours ago",
    avatar: "/placeholder.svg?height=32&width=32",
    unread: false,
  },
  {
    id: "4",
    sender: "Fashion Co",
    message: "Thank you for the brand guidelines document",
    time: "3 hours ago",
    avatar: "/placeholder.svg?height=32&width=32",
    unread: false,
  },
]

const mockRecentFiles = [
  {
    id: "1",
    name: "Homepage_Design_v3.fig",
    type: "design",
    size: "2.4 MB",
    uploadedBy: "Sarah Designer",
    uploadedAt: "2 hours ago",
  },
  {
    id: "2",
    name: "Brand_Guidelines.pdf",
    type: "document",
    size: "1.8 MB",
    uploadedBy: "Emma Creative",
    uploadedAt: "4 hours ago",
  },
  {
    id: "3",
    name: "Mobile_Mockups.sketch",
    type: "design",
    size: "3.2 MB",
    uploadedBy: "Alex Designer",
    uploadedAt: "1 day ago",
  },
]

export default function DashboardPage() {
  const { user } = useAuth()
  const router = useRouter()

  const isAdmin = user?.role === "super_admin" || user?.role === "sub_admin"
  const isClient = user?.role === "client"

  const [uploadedFiles, setUploadedFiles] = useState<any[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false)

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
          uploadedBy: user?.name || "Current User",
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

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    if (e.dataTransfer.files) {
      handleFileUpload(e.dataTransfer.files)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const getProjectStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "completed":
        return "bg-blue-100 text-blue-800"
      case "on_hold":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800"
      case "medium":
        return "bg-orange-100 text-orange-800"
      case "low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const handleQuickAction = (action: string) => {
    switch (action) {
      case "new-project":
        router.push("/dashboard/projects/new")
        break
      case "add-task":
        router.push("/dashboard/tasks/new")
        break
      case "create-invoice":
        router.push("/dashboard/invoices/new")
        break
      case "invite-member":
        setIsInviteDialogOpen(true)
        break
    }
  }

  return (
    <div className="flex-1 flex flex-col">
      <DashboardHeader
        title={`Welcome back, ${user?.name}! 👋`}
        description={
          isAdmin
            ? "Super Admin Dashboard - Manage your entire workspace"
            : isClient
              ? "Client Portal - Track your projects and communicate with the team"
              : "Team Member Dashboard - View your tasks and projects"
        }
      />

      <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="modern-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
              <div className="p-2 bg-gradient-to-r from-pink-100 to-purple-100 rounded-lg">
                <FolderOpen className="h-4 w-4 text-pink-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold gradient-text">{mockStats.activeProjects}</div>
              <div className="flex items-center text-xs text-muted-foreground">
                <TrendingUp className="h-3 w-3 text-green-600 mr-1" />
                <span className="text-green-600">+12%</span>
                <span className="ml-1">from last month</span>
              </div>
            </CardContent>
          </Card>

          <Card className="modern-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed Tasks</CardTitle>
              <div className="p-2 bg-gradient-to-r from-green-100 to-blue-100 rounded-lg">
                <CheckSquare className="h-4 w-4 text-green-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold gradient-text">{mockStats.completedTasks}</div>
              <div className="flex items-center text-xs text-muted-foreground">
                <TrendingUp className="h-3 w-3 text-green-600 mr-1" />
                <span className="text-green-600">+8%</span>
                <span className="ml-1">this week</span>
              </div>
            </CardContent>
          </Card>

          <Card className="modern-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Team Members</CardTitle>
              <div className="p-2 bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg">
                <Users className="h-4 w-4 text-blue-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold gradient-text">{mockStats.totalTeamMembers}</div>
              <div className="flex items-center text-xs text-muted-foreground">
                <Activity className="h-3 w-3 text-blue-600 mr-1" />
                <span className="text-blue-600">All active</span>
              </div>
            </CardContent>
          </Card>

          <Card className="modern-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
              <div className="p-2 bg-gradient-to-r from-yellow-100 to-orange-100 rounded-lg">
                <DollarSign className="h-4 w-4 text-yellow-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold gradient-text">${mockStats.monthlyRevenue.toLocaleString()}</div>
              <div className="flex items-center text-xs text-muted-foreground">
                <TrendingUp className="h-3 w-3 text-green-600 mr-1" />
                <span className="text-green-600">+15%</span>
                <span className="ml-1">from last month</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Project Overview - Takes 2 columns */}
          <div className="lg:col-span-2 space-y-6">
            {/* Project Status Cards */}
            <div className="grid gap-4 md:grid-cols-3">
              <Card className="modern-card bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-green-800">Active Projects</p>
                      <p className="text-2xl font-bold text-green-900">5</p>
                    </div>
                    <div className="p-2 bg-green-200 rounded-full">
                      <Zap className="h-5 w-5 text-green-700" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="modern-card bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-blue-800">Completed</p>
                      <p className="text-2xl font-bold text-blue-900">12</p>
                    </div>
                    <div className="p-2 bg-blue-200 rounded-full">
                      <CheckSquare className="h-5 w-5 text-blue-700" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="modern-card bg-gradient-to-br from-orange-50 to-yellow-50 border-orange-200">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-orange-800">Pending</p>
                      <p className="text-2xl font-bold text-orange-900">3</p>
                    </div>
                    <div className="p-2 bg-orange-200 rounded-full">
                      <Clock className="h-5 w-5 text-orange-700" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Projects List */}
            <Card className="modern-card">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <FolderOpen className="h-5 w-5 text-pink-500" />
                      Recent Projects
                    </CardTitle>
                    <CardDescription>Track progress of your active projects</CardDescription>
                  </div>
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/dashboard/projects">
                      View All
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {mockProjects.slice(0, 4).map((project) => (
                  <div key={project.id} className="p-4 border rounded-xl hover:shadow-md transition-all duration-200">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-pink-100 to-purple-100 rounded-lg flex items-center justify-center">
                          <FolderOpen className="h-5 w-5 text-pink-600" />
                        </div>
                        <div>
                          <h4 className="font-medium">{project.name}</h4>
                          <p className="text-sm text-muted-foreground">Client: {project.client}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getPriorityColor(project.priority)}>{project.priority}</Badge>
                        <Badge className={getProjectStatusColor(project.status)}>{project.status}</Badge>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Progress</span>
                        <span className="font-medium">{project.progress}%</span>
                      </div>
                      <Progress value={project.progress} className="h-2" />
                    </div>

                    <div className="flex items-center justify-between mt-3 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>Due: {project.dueDate}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        <span>{project.team.length} members</span>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - Takes 1 column */}
          <div className="space-y-6">
            {/* Recent Messages */}
            <Card className="modern-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-purple-500" />
                  Recent Messages
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-64 custom-scrollbar">
                  <div className="space-y-3">
                    {mockRecentMessages.map((message) => (
                      <div
                        key={message.id}
                        className="flex items-start gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={message.avatar || "/placeholder.svg"} />
                          <AvatarFallback>{message.sender.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-medium truncate">{message.sender}</p>
                            {message.unread && <div className="w-2 h-2 bg-pink-500 rounded-full" />}
                          </div>
                          <p className="text-xs text-muted-foreground truncate">{message.message}</p>
                          <p className="text-xs text-muted-foreground">{message.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
                <Button variant="outline" size="sm" className="w-full mt-3" asChild>
                  <Link href="/dashboard/chat">View All Messages</Link>
                </Button>
              </CardContent>
            </Card>

            {/* File Upload Area */}
            <Card className="modern-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="h-5 w-5 text-pink-500" />
                  Quick Upload
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div
                  className={`border-2 border-dashed rounded-xl p-6 text-center transition-colors cursor-pointer ${
                    isDragging ? "border-pink-400 bg-pink-50" : "border-gray-300 hover:border-pink-400"
                  }`}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onClick={() => document.getElementById("file-upload")?.click()}
                >
                  <input
                    type="file"
                    multiple
                    onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
                    className="hidden"
                    id="file-upload"
                  />
                  <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm font-medium">Drop files here or click to upload</p>
                  <p className="text-xs text-muted-foreground">Support for images, documents, and videos</p>
                </div>

                {/* Recent Files */}
                <div className="mt-4 space-y-2">
                  <p className="text-sm font-medium">Recent Files</p>
                  {mockRecentFiles.slice(0, 3).map((file) => (
                    <div key={file.id} className="flex items-center gap-2 p-2 border rounded-lg">
                      <FileText className="h-4 w-4 text-gray-500" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium truncate">{file.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {file.size} • {file.uploadedAt}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="modern-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-yellow-500" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button className="w-full gradient-button" onClick={() => handleQuickAction("new-project")}>
                  <FolderOpen className="h-4 w-4 mr-2" />
                  New Project
                </Button>
                <Button variant="outline" className="w-full" onClick={() => handleQuickAction("add-task")}>
                  <CheckSquare className="h-4 w-4 mr-2" />
                  Add Task
                </Button>
                <Button variant="outline" className="w-full" onClick={() => handleQuickAction("create-invoice")}>
                  <FileText className="h-4 w-4 mr-2" />
                  Create Invoice
                </Button>
                <Button variant="outline" className="w-full" onClick={() => handleQuickAction("invite-member")}>
                  <Users className="h-4 w-4 mr-2" />
                  Invite Member
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
