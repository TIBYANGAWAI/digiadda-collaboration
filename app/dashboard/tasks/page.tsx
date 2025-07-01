"use client"

import { useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { DashboardHeader } from "@/components/dashboard-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, CheckSquare, Clock, AlertCircle, Calendar, User, Edit, Trash2 } from "lucide-react"

interface Task {
  id: string
  title: string
  description: string
  status: "todo" | "in_progress" | "completed" | "blocked"
  priority: "low" | "medium" | "high"
  assignee: string
  project: string
  dueDate: string
  createdAt: Date
  estimatedHours: number
  actualHours: number
  progress: number
}

const mockTasks: Task[] = [
  {
    id: "1",
    title: "Design Homepage Hero Section",
    description: "Create an engaging hero section with call-to-action buttons and responsive design",
    status: "in_progress",
    priority: "high",
    assignee: "Sarah Johnson",
    project: "Website Redesign",
    dueDate: "2024-01-15",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
    estimatedHours: 8,
    actualHours: 5.5,
    progress: 70,
  },
  {
    id: "2",
    title: "Implement User Authentication API",
    description: "Build secure login/logout endpoints with JWT token management",
    status: "todo",
    priority: "high",
    assignee: "Mike Chen",
    project: "Mobile App Backend",
    dueDate: "2024-01-18",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
    estimatedHours: 12,
    actualHours: 0,
    progress: 0,
  },
  {
    id: "3",
    title: "Write Unit Tests for Payment Module",
    description: "Create comprehensive test coverage for payment processing functionality",
    status: "completed",
    priority: "medium",
    assignee: "Emily Davis",
    project: "E-commerce Platform",
    dueDate: "2024-01-12",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5),
    estimatedHours: 6,
    actualHours: 7,
    progress: 100,
  },
  {
    id: "4",
    title: "Client Feedback Integration",
    description: "Implement changes based on client feedback from last review meeting",
    status: "blocked",
    priority: "medium",
    assignee: "Alex Rodriguez",
    project: "Brand Identity",
    dueDate: "2024-01-20",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1),
    estimatedHours: 4,
    actualHours: 2,
    progress: 25,
  },
]

export default function TasksPage() {
  const { user } = useAuth()
  const [tasks, setTasks] = useState<Task[]>(mockTasks)
  const [activeTab, setActiveTab] = useState("all")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "medium",
    assignee: "",
    project: "",
    dueDate: "",
    estimatedHours: "",
  })

  const isAdmin = user?.role === "super_admin" || user?.role === "sub_admin"

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
        return <CheckSquare className="h-4 w-4 text-gray-400" />
      default:
        return <CheckSquare className="h-4 w-4 text-gray-400" />
    }
  }

  const handleCreateTask = () => {
    const newTask: Task = {
      id: Date.now().toString(),
      title: formData.title,
      description: formData.description,
      status: "todo",
      priority: formData.priority as any,
      assignee: formData.assignee,
      project: formData.project,
      dueDate: formData.dueDate,
      createdAt: new Date(),
      estimatedHours: Number.parseInt(formData.estimatedHours) || 0,
      actualHours: 0,
      progress: 0,
    }
    setTasks([...tasks, newTask])
    setFormData({
      title: "",
      description: "",
      priority: "medium",
      assignee: "",
      project: "",
      dueDate: "",
      estimatedHours: "",
    })
    setIsCreateDialogOpen(false)
  }

  const handleEditTask = () => {
    if (!editingTask) return

    const updatedTasks = tasks.map((task) =>
      task.id === editingTask.id
        ? {
            ...task,
            title: formData.title,
            description: formData.description,
            priority: formData.priority as any,
            assignee: formData.assignee,
            project: formData.project,
            dueDate: formData.dueDate,
            estimatedHours: Number.parseInt(formData.estimatedHours) || 0,
          }
        : task,
    )
    setTasks(updatedTasks)
    setEditingTask(null)
    setFormData({
      title: "",
      description: "",
      priority: "medium",
      assignee: "",
      project: "",
      dueDate: "",
      estimatedHours: "",
    })
  }

  const handleDeleteTask = (id: string) => {
    setTasks(tasks.filter((task) => task.id !== id))
  }

  const openEditDialog = (task: Task) => {
    setEditingTask(task)
    setFormData({
      title: task.title,
      description: task.description,
      priority: task.priority,
      assignee: task.assignee,
      project: task.project,
      dueDate: task.dueDate,
      estimatedHours: task.estimatedHours.toString(),
    })
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
    <div className="flex-1 flex flex-col">
      <DashboardHeader
        title="Tasks"
        description="Manage and track all project tasks across your organization"
        showSearch={false}
      />

      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
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
              <CheckSquare className="h-4 w-4 text-gray-400" />
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

        {/* Tasks Management */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Task Management</CardTitle>
                <CardDescription>Create, assign, and track project tasks</CardDescription>
              </div>
              {isAdmin && (
                <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      Create Task
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Create New Task</DialogTitle>
                      <DialogDescription>Add a new task and assign it to team members.</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <Label htmlFor="title">Task Title</Label>
                        <Input
                          id="title"
                          value={formData.title}
                          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                          placeholder="Enter task title"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                          id="description"
                          value={formData.description}
                          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                          placeholder="Enter task description"
                          rows={3}
                        />
                      </div>
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="grid gap-2">
                          <Label htmlFor="priority">Priority</Label>
                          <Select
                            value={formData.priority}
                            onValueChange={(value) => setFormData({ ...formData, priority: value })}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="low">Low</SelectItem>
                              <SelectItem value="medium">Medium</SelectItem>
                              <SelectItem value="high">High</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="assignee">Assignee</Label>
                          <Select
                            value={formData.assignee}
                            onValueChange={(value) => setFormData({ ...formData, assignee: value })}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select assignee" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Sarah Johnson">Sarah Johnson</SelectItem>
                              <SelectItem value="Mike Chen">Mike Chen</SelectItem>
                              <SelectItem value="Emily Davis">Emily Davis</SelectItem>
                              <SelectItem value="Alex Rodriguez">Alex Rodriguez</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="grid gap-2">
                          <Label htmlFor="project">Project</Label>
                          <Select
                            value={formData.project}
                            onValueChange={(value) => setFormData({ ...formData, project: value })}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select project" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Website Redesign">Website Redesign</SelectItem>
                              <SelectItem value="Mobile App Backend">Mobile App Backend</SelectItem>
                              <SelectItem value="E-commerce Platform">E-commerce Platform</SelectItem>
                              <SelectItem value="Brand Identity">Brand Identity</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="dueDate">Due Date</Label>
                          <Input
                            id="dueDate"
                            type="date"
                            value={formData.dueDate}
                            onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                          />
                        </div>
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="estimatedHours">Estimated Hours</Label>
                        <Input
                          id="estimatedHours"
                          type="number"
                          value={formData.estimatedHours}
                          onChange={(e) => setFormData({ ...formData, estimatedHours: e.target.value })}
                          placeholder="Enter estimated hours"
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button onClick={handleCreateTask}>Create Task</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              )}
            </div>
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
                                  {task.assignee}
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
                          {isAdmin && (
                            <div className="flex items-center gap-2">
                              <Button variant="ghost" size="sm" onClick={() => openEditDialog(task)}>
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm" onClick={() => handleDeleteTask(task.id)}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Edit Dialog */}
        <Dialog open={!!editingTask} onOpenChange={() => setEditingTask(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Task</DialogTitle>
              <DialogDescription>Update task information and assignment.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-title">Task Title</Label>
                <Input
                  id="edit-title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="edit-priority">Priority</Label>
                  <Select
                    value={formData.priority}
                    onValueChange={(value) => setFormData({ ...formData, priority: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-assignee">Assignee</Label>
                  <Select
                    value={formData.assignee}
                    onValueChange={(value) => setFormData({ ...formData, assignee: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Sarah Johnson">Sarah Johnson</SelectItem>
                      <SelectItem value="Mike Chen">Mike Chen</SelectItem>
                      <SelectItem value="Emily Davis">Emily Davis</SelectItem>
                      <SelectItem value="Alex Rodriguez">Alex Rodriguez</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="edit-project">Project</Label>
                  <Select
                    value={formData.project}
                    onValueChange={(value) => setFormData({ ...formData, project: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Website Redesign">Website Redesign</SelectItem>
                      <SelectItem value="Mobile App Backend">Mobile App Backend</SelectItem>
                      <SelectItem value="E-commerce Platform">E-commerce Platform</SelectItem>
                      <SelectItem value="Brand Identity">Brand Identity</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-dueDate">Due Date</Label>
                  <Input
                    id="edit-dueDate"
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-estimatedHours">Estimated Hours</Label>
                <Input
                  id="edit-estimatedHours"
                  type="number"
                  value={formData.estimatedHours}
                  onChange={(e) => setFormData({ ...formData, estimatedHours: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleEditTask}>Update Task</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
