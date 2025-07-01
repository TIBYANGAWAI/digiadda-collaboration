"use client"

import { useState } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Plus,
  Edit,
  Trash2,
  Calendar,
  Users,
  DollarSign,
  Clock,
  FolderOpen,
  Target,
  TrendingUp,
  AlertCircle,
} from "lucide-react"
import type { Project } from "@/lib/types"

// Mock projects data
const mockProjects: Project[] = [
  {
    id: "1",
    name: "Website Redesign",
    description: "Complete redesign of the corporate website with modern UI/UX",
    status: "active",
    clientId: "client-1",
    teamMembers: ["team-1", "team-2", "team-3"],
    startDate: new Date("2024-01-01"),
    endDate: new Date("2024-03-15"),
    progress: 75,
    createdAt: new Date("2023-12-15"),
    budget: 50000,
    hourlyRate: 150,
    comments: [],
  },
  {
    id: "2",
    name: "Mobile App Development",
    description: "Native iOS and Android app for e-commerce platform",
    status: "active",
    clientId: "client-2",
    teamMembers: ["team-2", "team-4"],
    startDate: new Date("2024-01-15"),
    endDate: new Date("2024-05-30"),
    progress: 45,
    createdAt: new Date("2024-01-01"),
    budget: 80000,
    hourlyRate: 175,
    comments: [],
  },
  {
    id: "3",
    name: "Brand Identity Package",
    description: "Complete brand identity including logo, guidelines, and marketing materials",
    status: "completed",
    clientId: "client-3",
    teamMembers: ["team-1", "team-5"],
    startDate: new Date("2023-11-01"),
    endDate: new Date("2024-01-15"),
    progress: 100,
    createdAt: new Date("2023-10-15"),
    budget: 25000,
    hourlyRate: 125,
    comments: [],
  },
  {
    id: "4",
    name: "E-commerce Platform",
    description: "Custom e-commerce solution with advanced features",
    status: "on_hold",
    clientId: "client-1",
    teamMembers: ["team-2", "team-3", "team-4"],
    startDate: new Date("2024-02-01"),
    endDate: new Date("2024-06-30"),
    progress: 25,
    createdAt: new Date("2024-01-20"),
    budget: 120000,
    hourlyRate: 160,
    comments: [],
  },
]

const mockClients = [
  { id: "client-1", name: "TechCorp Inc." },
  { id: "client-2", name: "StartupXYZ" },
  { id: "client-3", name: "Fashion Co" },
]

const mockTeamMembers = [
  { id: "team-1", name: "Sarah Designer", avatar: "/placeholder.svg?height=32&width=32" },
  { id: "team-2", name: "John Developer", avatar: "/placeholder.svg?height=32&width=32" },
  { id: "team-3", name: "Mike Manager", avatar: "/placeholder.svg?height=32&width=32" },
  { id: "team-4", name: "Lisa QA", avatar: "/placeholder.svg?height=32&width=32" },
  { id: "team-5", name: "Emma Creative", avatar: "/placeholder.svg?height=32&width=32" },
]

const projectStats = {
  totalProjects: 24,
  activeProjects: 8,
  completedProjects: 14,
  onHoldProjects: 2,
  totalBudget: 485000,
  averageBudget: 20208,
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>(mockProjects)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    clientId: "",
    startDate: "",
    endDate: "",
    budget: "",
    hourlyRate: "",
    teamMembers: [] as string[],
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "completed":
        return "bg-blue-100 text-blue-800"
      case "on_hold":
        return "bg-yellow-100 text-yellow-800"
      case "planning":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return "bg-green-500"
    if (progress >= 50) return "bg-blue-500"
    if (progress >= 25) return "bg-yellow-500"
    return "bg-red-500"
  }

  const handleAddProject = () => {
    const newProject: Project = {
      id: Date.now().toString(),
      name: formData.name,
      description: formData.description,
      status: "planning",
      clientId: formData.clientId,
      teamMembers: formData.teamMembers,
      startDate: new Date(formData.startDate),
      endDate: new Date(formData.endDate),
      progress: 0,
      createdAt: new Date(),
      budget: Number.parseFloat(formData.budget) || undefined,
      hourlyRate: Number.parseFloat(formData.hourlyRate) || undefined,
      comments: [],
    }
    setProjects([...projects, newProject])
    setFormData({
      name: "",
      description: "",
      clientId: "",
      startDate: "",
      endDate: "",
      budget: "",
      hourlyRate: "",
      teamMembers: [],
    })
    setIsAddDialogOpen(false)
  }

  const handleDeleteProject = (id: string) => {
    setProjects(projects.filter((project) => project.id !== id))
  }

  const getClientName = (clientId: string) => {
    return mockClients.find((client) => client.id === clientId)?.name || "Unknown Client"
  }

  const getTeamMemberName = (memberId: string) => {
    return mockTeamMembers.find((member) => member.id === memberId)?.name || "Unknown Member"
  }

  const getDaysRemaining = (endDate: Date) => {
    const today = new Date()
    const diffTime = endDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  return (
    <div className="flex-1 flex flex-col">
      <DashboardHeader title="Project Management" description="Manage and track all your projects" />

      <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="modern-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
              <div className="p-2 bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg">
                <FolderOpen className="h-4 w-4 text-blue-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold gradient-text">{projectStats.totalProjects}</div>
              <p className="text-xs text-muted-foreground">All time</p>
            </CardContent>
          </Card>

          <Card className="modern-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
              <div className="p-2 bg-gradient-to-r from-green-100 to-blue-100 rounded-lg">
                <Target className="h-4 w-4 text-green-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold gradient-text">{projectStats.activeProjects}</div>
              <p className="text-xs text-muted-foreground">Currently in progress</p>
            </CardContent>
          </Card>

          <Card className="modern-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Budget</CardTitle>
              <div className="p-2 bg-gradient-to-r from-yellow-100 to-orange-100 rounded-lg">
                <DollarSign className="h-4 w-4 text-yellow-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold gradient-text">${projectStats.totalBudget.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Across all projects</p>
            </CardContent>
          </Card>

          <Card className="modern-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Budget</CardTitle>
              <div className="p-2 bg-gradient-to-r from-pink-100 to-purple-100 rounded-lg">
                <TrendingUp className="h-4 w-4 text-pink-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold gradient-text">${projectStats.averageBudget.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Per project</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="all" className="space-y-6">
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="all">All Projects</TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
              <TabsTrigger value="on_hold">On Hold</TabsTrigger>
            </TabsList>

            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gradient-button">
                  <Plus className="mr-2 h-4 w-4" />
                  New Project
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl">
                <DialogHeader>
                  <DialogTitle>Create New Project</DialogTitle>
                  <DialogDescription>Add a new project to your workspace.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="name">Project Name *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Enter project name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="client">Client *</Label>
                      <Select
                        value={formData.clientId}
                        onValueChange={(value) => setFormData({ ...formData, clientId: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a client" />
                        </SelectTrigger>
                        <SelectContent>
                          {mockClients.map((client) => (
                            <SelectItem key={client.id} value={client.id}>
                              {client.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Enter project description"
                      rows={3}
                    />
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="startDate">Start Date</Label>
                      <Input
                        id="startDate"
                        type="date"
                        value={formData.startDate}
                        onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="endDate">End Date</Label>
                      <Input
                        id="endDate"
                        type="date"
                        value={formData.endDate}
                        onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="budget">Budget ($)</Label>
                      <Input
                        id="budget"
                        type="number"
                        value={formData.budget}
                        onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                        placeholder="Enter project budget"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="hourlyRate">Hourly Rate ($)</Label>
                      <Input
                        id="hourlyRate"
                        type="number"
                        value={formData.hourlyRate}
                        onChange={(e) => setFormData({ ...formData, hourlyRate: e.target.value })}
                        placeholder="Enter hourly rate"
                      />
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button className="gradient-button" onClick={handleAddProject}>
                    Create Project
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <TabsContent value="all" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {projects.map((project) => (
                <Card key={project.id} className="modern-card">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <Badge className={getStatusColor(project.status)}>{project.status.replace("_", " ")}</Badge>
                      <div className="flex space-x-1">
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDeleteProject(project.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <CardTitle className="text-lg">{project.name}</CardTitle>
                    <CardDescription className="line-clamp-2">{project.description}</CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {/* Progress */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Progress</span>
                        <span className="font-medium">{project.progress}%</span>
                      </div>
                      <Progress value={project.progress} className="h-2" />
                    </div>

                    {/* Project Info */}
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Client:</span>
                        <span className="font-medium">{getClientName(project.clientId)}</span>
                      </div>

                      {project.budget && (
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Budget:</span>
                          <span className="font-medium">${project.budget.toLocaleString()}</span>
                        </div>
                      )}

                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Due:</span>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          <span className="font-medium">{project.endDate.toLocaleDateString()}</span>
                          {getDaysRemaining(project.endDate) < 7 && project.status === "active" && (
                            <AlertCircle className="h-3 w-3 text-red-500" />
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Team Members */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Team:</span>
                        <div className="flex items-center gap-1">
                          <Users className="h-3 w-3 text-muted-foreground" />
                          <span className="text-sm">{project.teamMembers.length}</span>
                        </div>
                      </div>
                      <div className="flex -space-x-2">
                        {project.teamMembers.slice(0, 4).map((memberId) => {
                          const member = mockTeamMembers.find((m) => m.id === memberId)
                          return (
                            <Avatar key={memberId} className="h-6 w-6 border-2 border-white">
                              <AvatarImage src={member?.avatar || "/placeholder.svg"} />
                              <AvatarFallback className="text-xs bg-gradient-to-r from-pink-100 to-purple-100 text-pink-700">
                                {member?.name.charAt(0) || "?"}
                              </AvatarFallback>
                            </Avatar>
                          )
                        })}
                        {project.teamMembers.length > 4 && (
                          <div className="h-6 w-6 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center">
                            <span className="text-xs text-gray-600">+{project.teamMembers.length - 4}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-2 border-t">
                      <Button size="sm" variant="outline" className="flex-1">
                        View Details
                      </Button>
                      <Button size="sm" className="gradient-button flex-1">
                        Open Project
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Other tab contents would filter projects by status */}
          <TabsContent value="active">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {projects
                .filter((p) => p.status === "active")
                .map((project) => (
                  <Card key={project.id} className="modern-card">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <Badge className={getStatusColor(project.status)}>{project.status.replace("_", " ")}</Badge>
                        <div className="flex space-x-1">
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleDeleteProject(project.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <CardTitle className="text-lg">{project.name}</CardTitle>
                      <CardDescription className="line-clamp-2">{project.description}</CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span>Progress</span>
                          <span className="font-medium">{project.progress}%</span>
                        </div>
                        <Progress value={project.progress} className="h-2" />
                      </div>

                      <div className="space-y-2 text-sm">
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Client:</span>
                          <span className="font-medium">{getClientName(project.clientId)}</span>
                        </div>

                        {project.budget && (
                          <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">Budget:</span>
                            <span className="font-medium">${project.budget.toLocaleString()}</span>
                          </div>
                        )}

                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Due:</span>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            <span className="font-medium">{project.endDate.toLocaleDateString()}</span>
                            {getDaysRemaining(project.endDate) < 7 && <AlertCircle className="h-3 w-3 text-red-500" />}
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2 pt-2 border-t">
                        <Button size="sm" variant="outline" className="flex-1">
                          View Details
                        </Button>
                        <Button size="sm" className="gradient-button flex-1">
                          Open Project
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </TabsContent>

          <TabsContent value="completed">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {projects
                .filter((p) => p.status === "completed")
                .map((project) => (
                  <Card key={project.id} className="modern-card">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <Badge className={getStatusColor(project.status)}>{project.status.replace("_", " ")}</Badge>
                        <div className="flex space-x-1">
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleDeleteProject(project.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <CardTitle className="text-lg">{project.name}</CardTitle>
                      <CardDescription className="line-clamp-2">{project.description}</CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span>Progress</span>
                          <span className="font-medium text-green-600">{project.progress}%</span>
                        </div>
                        <Progress value={project.progress} className="h-2" />
                      </div>

                      <div className="space-y-2 text-sm">
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Client:</span>
                          <span className="font-medium">{getClientName(project.clientId)}</span>
                        </div>

                        {project.budget && (
                          <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">Budget:</span>
                            <span className="font-medium">${project.budget.toLocaleString()}</span>
                          </div>
                        )}

                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Completed:</span>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            <span className="font-medium">{project.endDate.toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2 pt-2 border-t">
                        <Button size="sm" variant="outline" className="flex-1">
                          View Details
                        </Button>
                        <Button size="sm" className="gradient-button flex-1">
                          Archive
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </TabsContent>

          <TabsContent value="on_hold">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {projects
                .filter((p) => p.status === "on_hold")
                .map((project) => (
                  <Card key={project.id} className="modern-card">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <Badge className={getStatusColor(project.status)}>{project.status.replace("_", " ")}</Badge>
                        <div className="flex space-x-1">
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleDeleteProject(project.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <CardTitle className="text-lg">{project.name}</CardTitle>
                      <CardDescription className="line-clamp-2">{project.description}</CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span>Progress</span>
                          <span className="font-medium text-yellow-600">{project.progress}%</span>
                        </div>
                        <Progress value={project.progress} className="h-2" />
                      </div>

                      <div className="space-y-2 text-sm">
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Client:</span>
                          <span className="font-medium">{getClientName(project.clientId)}</span>
                        </div>

                        {project.budget && (
                          <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">Budget:</span>
                            <span className="font-medium">${project.budget.toLocaleString()}</span>
                          </div>
                        )}

                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Due:</span>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            <span className="font-medium">{project.endDate.toLocaleDateString()}</span>
                            <Clock className="h-3 w-3 text-yellow-500" />
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2 pt-2 border-t">
                        <Button size="sm" variant="outline" className="flex-1">
                          Resume
                        </Button>
                        <Button size="sm" className="gradient-button flex-1">
                          View Details
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
