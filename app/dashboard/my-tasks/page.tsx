"use client"

import { useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CheckSquare, Clock, AlertCircle, Calendar, User, Play, Pause, Square } from "lucide-react"

interface MyTask {
  id: string
  title: string
  description: string
  status: "todo" | "in_progress" | "completed" | "blocked"
  priority: "low" | "medium" | "high"
  project: string
  dueDate: string
  assignedBy: string
  estimatedHours: number
  actualHours: number
  progress: number
  isTimerRunning: boolean
  timerStartTime?: Date
}

const mockMyTasks: MyTask[] = [
  {
    id: "1",
    title: "Design Homepage Hero Section",
    description: "Create an engaging hero section with call-to-action buttons and responsive design",
    status: "in_progress",
    priority: "high",
    project: "Website Redesign",
    dueDate: "2024-01-15",
    assignedBy: "Sarah Johnson",
    estimatedHours: 8,
    actualHours: 5.5,
    progress: 70,
    isTimerRunning: false,
  },
  {
    id: "2",
    title: "Implement User Authentication API",
    description: "Build secure login/logout endpoints with JWT token management",
    status: "todo",
    priority: "high",
    project: "Mobile App Backend",
    dueDate: "2024-01-18",
    assignedBy: "Mike Chen",
    estimatedHours: 12,
    actualHours: 0,
    progress: 0,
    isTimerRunning: false,
  },
  {
    id: "3",
    title: "Write Unit Tests for Payment Module",
    description: "Create comprehensive test coverage for payment processing functionality",
    status: "completed",
    priority: "medium",
    project: "E-commerce Platform",
    dueDate: "2024-01-12",
    assignedBy: "Emily Davis",
    estimatedHours: 6,
    actualHours: 7,
    progress: 100,
    isTimerRunning: false,
  },
  {
    id: "4",
    title: "Client Feedback Integration",
    description: "Implement changes based on client feedback from last review meeting",
    status: "blocked",
    priority: "medium",
    project: "Brand Identity",
    dueDate: "2024-01-20",
    assignedBy: "Alex Rodriguez",
    estimatedHours: 4,
    actualHours: 2,
    progress: 25,
    isTimerRunning: false,
  },
]

export default function MyTasksPage() {
  const { user } = useAuth()
  const [tasks, setTasks] = useState<MyTask[]>(mockMyTasks)
  const [activeTab, setActiveTab] = useState("all")
  const [timerTask, setTimerTask] = useState<string | null>(null)

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
        return "bg-green-100 text-green-800 border-green-200"
      case "in_progress":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "blocked":
        return "bg-red-100 text-red-800 border-red-200"
      case "todo":
        return "bg-gray-100 text-gray-800 border-gray-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckSquare className="h-4 w-4 text-green-600" />
      case "in_progress":
        return <Clock className="h-4 w-4 text-blue-600" />
      case "blocked":
        return <AlertCircle className="h-4 w-4 text-red-600" />
      case "todo":
        return <Square className="h-4 w-4 text-gray-400" />
      default:
        return <Square className="h-4 w-4 text-gray-400" />
    }
  }

  const handleTimerToggle = (taskId: string) => {
    setTasks(
      tasks.map((task) => {
        if (task.id === taskId) {
          return {
            ...task,
            isTimerRunning: !task.isTimerRunning,
            timerStartTime: !task.isTimerRunning ? new Date() : undefined,
          }
        }
        return task
      }),
    )

    setTimerTask(timerTask === taskId ? null : taskId)
  }

  const handleStatusChange = (taskId: string, newStatus: string) => {
    setTasks(tasks.map((task) => (task.id === taskId ? { ...task, status: newStatus as any } : task)))
  }

  const filteredTasks = tasks.filter((task) => {
    if (activeTab === "all") return true
    return task.status === activeTab
  })

  const taskStats = {
    total: tasks.length,
    todo: tasks.filter((t) => t.status === "todo").length,
    in_progress: tasks.filter((t) => t.status === "in_progress").length,
    completed: tasks.filter((t) => t.status === "completed").length,
    blocked: tasks.filter((t) => t.status === "blocked").length,
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">My Tasks</h2>
          <p className="text-muted-foreground">Welcome back, {user?.name}! Here are your assigned tasks.</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
            <CheckSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{taskStats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">To Do</CardTitle>
            <Square className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{taskStats.todo}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <Clock className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{taskStats.in_progress}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckSquare className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{taskStats.completed}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Blocked</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{taskStats.blocked}</div>
          </CardContent>
        </Card>
      </div>

      {/* Tasks List */}
      <Card>
        <CardHeader>
          <CardTitle>My Assigned Tasks</CardTitle>
          <CardDescription>Track your progress and manage your workload</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="all">All Tasks</TabsTrigger>
              <TabsTrigger value="todo">To Do</TabsTrigger>
              <TabsTrigger value="in_progress">In Progress</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
              <TabsTrigger value="blocked">Blocked</TabsTrigger>
            </TabsList>
            <TabsContent value={activeTab} className="space-y-4">
              <div className="grid gap-4">
                {filteredTasks.map((task) => (
                  <Card key={task.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-start gap-4 flex-1">
                          {getStatusIcon(task.status)}
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-semibold text-lg">{task.title}</h3>
                              <Badge className={getPriorityColor(task.priority)}>{task.priority}</Badge>
                              <Badge className={getStatusColor(task.status)}>{task.status.replace("_", " ")}</Badge>
                            </div>
                            <p className="text-muted-foreground mb-3">{task.description}</p>

                            {/* Progress Bar */}
                            <div className="mb-3">
                              <div className="flex items-center justify-between text-sm mb-1">
                                <span>Progress</span>
                                <span className="font-medium">{task.progress}%</span>
                              </div>
                              <Progress value={task.progress} className="h-2" />
                            </div>

                            <div className="flex items-center gap-6 text-sm text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <User className="h-4 w-4" />
                                Assigned by: {task.assignedBy}
                              </div>
                              <div className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                Due: {new Date(task.dueDate).toLocaleDateString()}
                              </div>
                              <div>Project: {task.project}</div>
                              <div>
                                Time: {task.actualHours}h / {task.estimatedHours}h
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {/* Timer Button */}
                          <Button
                            variant={task.isTimerRunning ? "destructive" : "outline"}
                            size="sm"
                            onClick={() => handleTimerToggle(task.id)}
                            disabled={task.status === "completed" || task.status === "blocked"}
                          >
                            {task.isTimerRunning ? (
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

                          {/* Status Change */}
                          <Select value={task.status} onValueChange={(value) => handleStatusChange(task.id, value)}>
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="todo">To Do</SelectItem>
                              <SelectItem value="in_progress">In Progress</SelectItem>
                              <SelectItem value="completed">Completed</SelectItem>
                              <SelectItem value="blocked">Blocked</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
