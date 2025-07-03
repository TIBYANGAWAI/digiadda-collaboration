"use client"

import { useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { EnhancedFileUpload } from "@/components/enhanced-file-upload"
import {
  CheckSquare,
  Clock,
  AlertCircle,
  Calendar,
  Upload,
  MessageSquare,
  Target,
  Users,
  Bell,
  Play,
  Pause,
  Square,
} from "lucide-react"
import type { Task, TaskDeadline, WorkUpload } from "@/lib/types"
import { formatDistanceToNow } from "date-fns"

// Mock data for team member
const mockAssignedTasks: Task[] = [
  {
    id: "1",
    title: "Design Homepage Hero Section",
    description: "Create an engaging hero section with call-to-action buttons and responsive design",
    status: "in_progress",
    priority: "high",
    assignedTo: ["current-user"],
    projectId: "1",
    dueDate: new Date("2024-01-15"),
    createdAt: new Date("2024-01-01"),
    createdBy: "admin-1",
    comments: [],
    timeTracked: 5.5,
    estimatedHours: 8,
  },
  {
    id: "2",
    title: "Mobile App UI Components",
    description: "Build reusable UI components for the mobile application",
    status: "pending",
    priority: "medium",
    assignedTo: ["current-user"],
    projectId: "2",
    dueDate: new Date("2024-01-20"),
    createdAt: new Date("2024-01-05"),
    createdBy: "admin-1",
    comments: [],
    timeTracked: 0,
    estimatedHours: 12,
  },
  {
    id: "3",
    title: "Client Feedback Integration",
    description: "Implement changes based on client feedback from last review",
    status: "completed",
    priority: "high",
    assignedTo: ["current-user"],
    projectId: "1",
    dueDate: new Date("2024-01-10"),
    createdAt: new Date("2023-12-28"),
    createdBy: "admin-1",
    comments: [],
    timeTracked: 6,
    estimatedHours: 4,
  },
]

const mockDeadlines: TaskDeadline[] = [
  {
    id: "1",
    taskId: "1",
    title: "Design Homepage Hero Section",
    dueDate: new Date("2024-01-15"),
    priority: "high",
    status: "approaching",
    projectName: "Website Redesign",
  },
  {
    id: "2",
    taskId: "2",
    title: "Mobile App UI Components",
    dueDate: new Date("2024-01-20"),
    priority: "medium",
    status: "pending",
    projectName: "Mobile App Development",
  },
]

const mockWorkUploads: WorkUpload[] = [
  {
    id: "1",
    taskId: "1",
    projectId: "1",
    fileName: "homepage_design_v2.fig",
    fileUrl: "/placeholder.svg",
    fileType: "application/figma",
    fileSize: 2048000,
    uploadedBy: "current-user",
    uploadedAt: new Date("2024-01-12"),
    description: "Updated homepage design with client feedback",
    status: "approved",
    feedback: "Great work! The new color scheme looks perfect.",
  },
  {
    id: "2",
    taskId: "2",
    projectId: "2",
    fileName: "ui_components.zip",
    fileUrl: "/placeholder.svg",
    fileType: "application/zip",
    fileSize: 5120000,
    uploadedBy: "current-user",
    uploadedAt: new Date("2024-01-14"),
    description: "Mobile UI components package",
    status: "pending_review",
  },
]

export default function TeamMemberPage() {
  const { user } = useAuth()
  const [tasks, setTasks] = useState<Task[]>(mockAssignedTasks)
  const [deadlines, setDeadlines] = useState<TaskDeadline[]>(mockDeadlines)
  const [workUploads, setWorkUploads] = useState<WorkUpload[]>(mockWorkUploads)
  const [activeTimers, setActiveTimers] = useState<Set<string>>(new Set())

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "low":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "in_progress":
        return "bg-blue-100 text-blue-800"
      case "pending":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getDeadlineStatus = (dueDate: Date) => {
    const now = new Date()
    const diffDays = Math.ceil((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))

    if (diffDays < 0) return { status: "overdue", color: "text-red-600", bg: "bg-red-50" }
    if (diffDays <= 2) return { status: "approaching", color: "text-orange-600", bg: "bg-orange-50" }
    return { status: "pending", color: "text-green-600", bg: "bg-green-50" }
  }

  const handleTimerToggle = (taskId: string) => {
    setActiveTimers((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(taskId)) {
        newSet.delete(taskId)
      } else {
        newSet.add(taskId)
      }
      return newSet
    })
  }

  const handleStatusUpdate = (taskId: string, newStatus: string) => {
    setTasks((prev) => prev.map((task) => (task.id === taskId ? { ...task, status: newStatus as any } : task)))
  }

  const handleWorkUpload = (files: any[]) => {
    // Handle work upload logic here
    console.log("Work uploaded:", files)
  }

  const taskStats = {
    total: tasks.length,
    pending: tasks.filter((t) => t.status === "pending").length,
    inProgress: tasks.filter((t) => t.status === "in_progress").length,
    completed: tasks.filter((t) => t.status === "completed").length,
    overdue: deadlines.filter((d) => getDeadlineStatus(d.dueDate).status === "overdue").length,
  }

  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight gradient-text">Team Member Dashboard</h2>
          <p className="text-muted-foreground">Welcome back, {user?.name}! Here's your work overview.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <MessageSquare className="h-4 w-4 mr-2" />
            Chat
          </Button>
          <Button variant="outline" size="sm">
            <Bell className="h-4 w-4 mr-2" />
            Notifications
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card className="modern-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
            <CheckSquare className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold gradient-text">{taskStats.total}</div>
            <p className="text-xs text-muted-foreground">Assigned to you</p>
          </CardContent>
        </Card>

        <Card className="modern-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <Clock className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold gradient-text">{taskStats.inProgress}</div>
            <p className="text-xs text-muted-foreground">Currently working</p>
          </CardContent>
        </Card>

        <Card className="modern-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <Target className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold gradient-text">{taskStats.completed}</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>

        <Card className="modern-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Square className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold gradient-text">{taskStats.pending}</div>
            <p className="text-xs text-muted-foreground">To start</p>
          </CardContent>
        </Card>

        <Card className="modern-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{taskStats.overdue}</div>
            <p className="text-xs text-muted-foreground">Need attention</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="tasks" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="tasks">My Tasks</TabsTrigger>
          <TabsTrigger value="deadlines">Deadlines</TabsTrigger>
          <TabsTrigger value="uploads">Work Uploads</TabsTrigger>
          <TabsTrigger value="chat">Team Chat</TabsTrigger>
        </TabsList>

        {/* Tasks Tab */}
        <TabsContent value="tasks" className="space-y-4">
          <Card className="modern-card">
            <CardHeader>
              <CardTitle>Assigned Tasks</CardTitle>
              <CardDescription>Tasks assigned to you with progress tracking</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {tasks.map((task) => (
                  <Card key={task.id} className="border-l-4 border-l-blue-500">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold">{task.title}</h3>
                            <Badge className={getPriorityColor(task.priority)}>{task.priority}</Badge>
                            <Badge className={getStatusColor(task.status)}>{task.status.replace("_", " ")}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-3">{task.description}</p>

                          {/* Progress */}
                          <div className="mb-3">
                            <div className="flex items-center justify-between text-sm mb-1">
                              <span>Progress</span>
                              <span>{Math.round(((task.timeTracked || 0) / (task.estimatedHours || 1)) * 100)}%</span>
                            </div>
                            <Progress
                              value={((task.timeTracked || 0) / (task.estimatedHours || 1)) * 100}
                              className="h-2"
                            />
                          </div>

                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              Due: {task.dueDate.toLocaleDateString()}
                            </div>
                            <div>
                              Time: {task.timeTracked || 0}h / {task.estimatedHours || 0}h
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant={activeTimers.has(task.id) ? "destructive" : "outline"}
                            onClick={() => handleTimerToggle(task.id)}
                          >
                            {activeTimers.has(task.id) ? (
                              <>
                                <Pause className="h-4 w-4 mr-1" />
                                Stop
                              </>
                            ) : (
                              <>
                                <Play className="h-4 w-4 mr-1" />
                                Start
                              </>
                            )}
                          </Button>

                          {task.status !== "completed" && (
                            <Button
                              size="sm"
                              className="gradient-button"
                              onClick={() =>
                                handleStatusUpdate(task.id, task.status === "pending" ? "in_progress" : "completed")
                              }
                            >
                              {task.status === "pending" ? "Start Task" : "Mark Complete"}
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Deadlines Tab */}
        <TabsContent value="deadlines" className="space-y-4">
          <Card className="modern-card">
            <CardHeader>
              <CardTitle>Upcoming Deadlines</CardTitle>
              <CardDescription>Keep track of your task deadlines and priorities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {deadlines.map((deadline) => {
                  const deadlineInfo = getDeadlineStatus(deadline.dueDate)
                  return (
                    <div key={deadline.id} className={`p-4 rounded-lg border ${deadlineInfo.bg}`}>
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold">{deadline.title}</h3>
                            <Badge className={getPriorityColor(deadline.priority)}>{deadline.priority}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">{deadline.projectName}</p>
                          <div className="flex items-center gap-4 text-sm">
                            <div className={`flex items-center gap-1 ${deadlineInfo.color}`}>
                              <Calendar className="h-4 w-4" />
                              Due: {deadline.dueDate.toLocaleDateString()}
                            </div>
                            <div className={deadlineInfo.color}>
                              {formatDistanceToNow(deadline.dueDate, { addSuffix: true })}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className={deadlineInfo.color}>
                            {deadlineInfo.status}
                          </Badge>
                          {deadlineInfo.status === "overdue" && <AlertCircle className="h-5 w-5 text-red-500" />}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Work Uploads Tab */}
        <TabsContent value="uploads" className="space-y-4">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Upload Section */}
            <Card className="modern-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="h-5 w-5 text-blue-500" />
                  Upload Work
                </CardTitle>
                <CardDescription>Upload your completed work, designs, and deliverables</CardDescription>
              </CardHeader>
              <CardContent>
                <EnhancedFileUpload
                  onFilesUploaded={handleWorkUpload}
                  maxFileSize={100}
                  acceptedTypes={["image", "video", "application"]}
                  showRecentFiles={false}
                />
              </CardContent>
            </Card>

            {/* Recent Uploads */}
            <Card className="modern-card">
              <CardHeader>
                <CardTitle>Recent Uploads</CardTitle>
                <CardDescription>Your recently uploaded work and their review status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {workUploads.map((upload) => (
                    <div key={upload.id} className="p-3 border rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h4 className="font-medium text-sm">{upload.fileName}</h4>
                          <p className="text-xs text-muted-foreground">{upload.description}</p>
                        </div>
                        <Badge
                          className={
                            upload.status === "approved"
                              ? "bg-green-100 text-green-800"
                              : upload.status === "needs_revision"
                                ? "bg-red-100 text-red-800"
                                : "bg-yellow-100 text-yellow-800"
                          }
                        >
                          {upload.status.replace("_", " ")}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>{upload.uploadedAt.toLocaleDateString()}</span>
                        <span>{(upload.fileSize / 1024 / 1024).toFixed(1)} MB</span>
                      </div>
                      {upload.feedback && (
                        <div className="mt-2 p-2 bg-gray-50 rounded text-xs">
                          <strong>Feedback:</strong> {upload.feedback}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Chat Tab */}
        <TabsContent value="chat" className="space-y-4">
          <Card className="modern-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-green-500" />
                Team Communication
              </CardTitle>
              <CardDescription>Chat with your admin and team members</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <Button className="gradient-button h-20 flex-col">
                  <Users className="h-6 w-6 mb-2" />
                  <span>Team Chat</span>
                  <span className="text-xs opacity-80">3 unread messages</span>
                </Button>
                <Button variant="outline" className="h-20 flex-col">
                  <Avatar className="h-8 w-8 mb-2">
                    <AvatarImage src="/placeholder.svg" />
                    <AvatarFallback>AD</AvatarFallback>
                  </Avatar>
                  <span>Admin Chat</span>
                  <span className="text-xs text-muted-foreground">Last seen 2h ago</span>
                </Button>
              </div>

              <Alert className="mt-4">
                <MessageSquare className="h-4 w-4" />
                <AlertDescription>
                  Click on any chat to start communicating with your team or admin. You can share files, ask questions,
                  and get real-time updates.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
