"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Calendar,
  Users,
  DollarSign,
  Clock,
  MessageSquare,
  FileText,
  Edit,
  Play,
  Pause,
  CheckSquare,
  Target,
} from "lucide-react"
import { formatDistanceToNow } from "date-fns"

// Mock project data
const mockProject = {
  id: "1",
  name: "Website Redesign",
  description:
    "Complete redesign of the corporate website with modern UI/UX, responsive design, and improved user experience",
  status: "active",
  clientId: "client-1",
  clientName: "TechCorp Inc.",
  teamMembers: [
    {
      id: "team-1",
      name: "Sarah Designer",
      role: "UI/UX Designer",
      avatar: "/placeholder.svg?height=32&width=32",
      status: "online",
    },
    {
      id: "team-2",
      name: "John Developer",
      role: "Frontend Developer",
      avatar: "/placeholder.svg?height=32&width=32",
      status: "away",
    },
    {
      id: "team-3",
      name: "Mike Manager",
      role: "Project Manager",
      avatar: "/placeholder.svg?height=32&width=32",
      status: "online",
    },
  ],
  startDate: new Date("2024-01-01"),
  endDate: new Date("2024-03-15"),
  progress: 75,
  budget: 50000,
  hourlyRate: 150,
  timeSpent: 180,
  estimatedTime: 240,
  milestones: [
    { id: "1", title: "Research & Planning", status: "completed", dueDate: new Date("2024-01-15"), progress: 100 },
    { id: "2", title: "Design Mockups", status: "completed", dueDate: new Date("2024-02-01"), progress: 100 },
    { id: "3", title: "Frontend Development", status: "in_progress", dueDate: new Date("2024-02-20"), progress: 80 },
    { id: "4", title: "Backend Integration", status: "pending", dueDate: new Date("2024-03-01"), progress: 0 },
    { id: "5", title: "Testing & Launch", status: "pending", dueDate: new Date("2024-03-15"), progress: 0 },
  ],
  tasks: [
    {
      id: "1",
      title: "Homepage Design",
      assignee: "Sarah Designer",
      status: "completed",
      priority: "high",
      dueDate: new Date("2024-01-20"),
    },
    {
      id: "2",
      title: "Mobile Responsive Layout",
      assignee: "John Developer",
      status: "in_progress",
      priority: "high",
      dueDate: new Date("2024-02-10"),
    },
    {
      id: "3",
      title: "Contact Form Integration",
      assignee: "John Developer",
      status: "pending",
      priority: "medium",
      dueDate: new Date("2024-02-25"),
    },
  ],
  files: [
    {
      id: "1",
      name: "Design_Mockups_v3.fig",
      type: "design",
      size: "2.4 MB",
      uploadedBy: "Sarah Designer",
      uploadedAt: new Date("2024-01-18"),
    },
    {
      id: "2",
      name: "Brand_Guidelines.pdf",
      type: "document",
      size: "1.8 MB",
      uploadedBy: "Mike Manager",
      uploadedAt: new Date("2024-01-10"),
    },
    {
      id: "3",
      name: "Homepage_Prototype.html",
      type: "code",
      size: "856 KB",
      uploadedBy: "John Developer",
      uploadedAt: new Date("2024-02-05"),
    },
  ],
  comments: [
    {
      id: "1",
      author: "Mike Manager",
      content: "Great progress on the homepage design! The client feedback has been very positive.",
      timestamp: new Date("2024-02-01"),
      avatar: "/placeholder.svg?height=32&width=32",
    },
    {
      id: "2",
      author: "Sarah Designer",
      content: "I've updated the color scheme based on the latest brand guidelines. Ready for development.",
      timestamp: new Date("2024-02-03"),
      avatar: "/placeholder.svg?height=32&width=32",
    },
    {
      id: "3",
      author: "John Developer",
      content: "Mobile responsive layout is 80% complete. Should be ready for testing by end of week.",
      timestamp: new Date("2024-02-08"),
      avatar: "/placeholder.svg?height=32&width=32",
    },
  ],
}

export default function ProjectDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const [project] = useState(mockProject)
  const [newComment, setNewComment] = useState("")
  const [activeTimers, setActiveTimers] = useState<Set<string>>(new Set())

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "in_progress":
        return "bg-blue-100 text-blue-800"
      case "pending":
        return "bg-gray-100 text-gray-800"
      case "active":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
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

  const handleAddComment = () => {
    if (newComment.trim()) {
      // Add comment logic here
      setNewComment("")
    }
  }

  return (
    <div className="flex-1 flex flex-col">
      <DashboardHeader
        title={project.name}
        description={`Project Details • Client: ${project.clientName}`}
        action={
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => router.back()}>
              Back to Projects
            </Button>
            <Button className="gradient-button">
              <Edit className="h-4 w-4 mr-2" />
              Edit Project
            </Button>
          </div>
        }
      />

      <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
        {/* Project Overview Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="modern-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Progress</CardTitle>
              <Target className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold gradient-text">{project.progress}%</div>
              <Progress value={project.progress} className="mt-2" />
            </CardContent>
          </Card>

          <Card className="modern-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Budget</CardTitle>
              <DollarSign className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold gradient-text">${project.budget.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Total project budget</p>
            </CardContent>
          </Card>

          <Card className="modern-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Time Spent</CardTitle>
              <Clock className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold gradient-text">{project.timeSpent}h</div>
              <p className="text-xs text-muted-foreground">of {project.estimatedTime}h estimated</p>
            </CardContent>
          </Card>

          <Card className="modern-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Team Size</CardTitle>
              <Users className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold gradient-text">{project.teamMembers.length}</div>
              <p className="text-xs text-muted-foreground">Active team members</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="tasks">Tasks</TabsTrigger>
            <TabsTrigger value="milestones">Milestones</TabsTrigger>
            <TabsTrigger value="files">Files</TabsTrigger>
            <TabsTrigger value="comments">Comments</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2 space-y-6">
                <Card className="modern-card">
                  <CardHeader>
                    <CardTitle>Project Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium">Description</Label>
                      <p className="text-sm text-muted-foreground mt-1">{project.description}</p>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <Label className="text-sm font-medium">Start Date</Label>
                        <p className="text-sm text-muted-foreground">{project.startDate.toLocaleDateString()}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">End Date</Label>
                        <p className="text-sm text-muted-foreground">{project.endDate.toLocaleDateString()}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Status</Label>
                        <Badge className={getStatusColor(project.status)}>{project.status}</Badge>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Hourly Rate</Label>
                        <p className="text-sm text-muted-foreground">${project.hourlyRate}/hour</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="modern-card">
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {project.comments.slice(0, 3).map((comment) => (
                        <div key={comment.id} className="flex gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={comment.avatar || "/placeholder.svg"} />
                            <AvatarFallback>{comment.author.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium">{comment.author}</span>
                              <span className="text-xs text-muted-foreground">
                                {formatDistanceToNow(comment.timestamp, { addSuffix: true })}
                              </span>
                            </div>
                            <p className="text-sm text-muted-foreground">{comment.content}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                <Card className="modern-card">
                  <CardHeader>
                    <CardTitle>Team Members</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {project.teamMembers.map((member) => (
                        <div key={member.id} className="flex items-center gap-3">
                          <div className="relative">
                            <Avatar className="h-10 w-10">
                              <AvatarImage src={member.avatar || "/placeholder.svg"} />
                              <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div
                              className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${
                                member.status === "online" ? "bg-green-500" : "bg-gray-400"
                              }`}
                            />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium">{member.name}</p>
                            <p className="text-xs text-muted-foreground">{member.role}</p>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {member.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="modern-card">
                  <CardHeader>
                    <CardTitle>Project Stats</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Completed Milestones</span>
                      <span className="font-medium">
                        {project.milestones.filter((m) => m.status === "completed").length} /{" "}
                        {project.milestones.length}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Active Tasks</span>
                      <span className="font-medium">
                        {project.tasks.filter((t) => t.status === "in_progress").length}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Files Uploaded</span>
                      <span className="font-medium">{project.files.length}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Comments</span>
                      <span className="font-medium">{project.comments.length}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Tasks Tab */}
          <TabsContent value="tasks" className="space-y-4">
            <Card className="modern-card">
              <CardHeader>
                <CardTitle>Project Tasks</CardTitle>
                <CardDescription>All tasks associated with this project</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {project.tasks.map((task) => (
                    <Card key={task.id} className="border-l-4 border-l-blue-500">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-semibold">{task.title}</h3>
                              <Badge className={getPriorityColor(task.priority)}>{task.priority}</Badge>
                              <Badge className={getStatusColor(task.status)}>{task.status.replace("_", " ")}</Badge>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <span>Assigned to: {task.assignee}</span>
                              <div className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                Due: {task.dueDate.toLocaleDateString()}
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
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Milestones Tab */}
          <TabsContent value="milestones" className="space-y-4">
            <Card className="modern-card">
              <CardHeader>
                <CardTitle>Project Milestones</CardTitle>
                <CardDescription>Track major project milestones and deliverables</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {project.milestones.map((milestone, index) => (
                    <div key={milestone.id} className="flex items-center gap-4">
                      <div className="flex flex-col items-center">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            milestone.status === "completed"
                              ? "bg-green-500 text-white"
                              : milestone.status === "in_progress"
                                ? "bg-blue-500 text-white"
                                : "bg-gray-200 text-gray-600"
                          }`}
                        >
                          {milestone.status === "completed" ? (
                            <CheckSquare className="h-4 w-4" />
                          ) : milestone.status === "in_progress" ? (
                            <Clock className="h-4 w-4" />
                          ) : (
                            <span className="text-xs">{index + 1}</span>
                          )}
                        </div>
                        {index < project.milestones.length - 1 && <div className="w-0.5 h-8 bg-gray-200 mt-2" />}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold">{milestone.title}</h3>
                          <Badge className={getStatusColor(milestone.status)}>
                            {milestone.status.replace("_", " ")}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            Due: {milestone.dueDate.toLocaleDateString()}
                          </div>
                          <div>Progress: {milestone.progress}%</div>
                        </div>
                        <Progress value={milestone.progress} className="mt-2 h-2" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Files Tab */}
          <TabsContent value="files" className="space-y-4">
            <Card className="modern-card">
              <CardHeader>
                <CardTitle>Project Files</CardTitle>
                <CardDescription>All files and documents related to this project</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {project.files.map((file) => (
                    <div key={file.id} className="flex items-center gap-3 p-3 border rounded-lg">
                      <FileText className="h-8 w-8 text-blue-500" />
                      <div className="flex-1">
                        <h4 className="font-medium">{file.name}</h4>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>{file.size}</span>
                          <span>Uploaded by {file.uploadedBy}</span>
                          <span>{formatDistanceToNow(file.uploadedAt, { addSuffix: true })}</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          Download
                        </Button>
                        <Button size="sm" variant="outline">
                          Preview
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Comments Tab */}
          <TabsContent value="comments" className="space-y-4">
            <Card className="modern-card">
              <CardHeader>
                <CardTitle>Project Comments</CardTitle>
                <CardDescription>Team discussions and project updates</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-96 mb-4">
                  <div className="space-y-4">
                    {project.comments.map((comment) => (
                      <div key={comment.id} className="flex gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={comment.avatar || "/placeholder.svg"} />
                          <AvatarFallback>{comment.author.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">{comment.author}</span>
                            <span className="text-xs text-muted-foreground">
                              {formatDistanceToNow(comment.timestamp, { addSuffix: true })}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">{comment.content}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>

                <div className="space-y-3">
                  <Textarea
                    placeholder="Add a comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                  />
                  <Button onClick={handleAddComment} className="gradient-button">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Add Comment
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
