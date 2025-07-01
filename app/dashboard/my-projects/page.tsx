"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Users, MessageSquare, Eye } from "lucide-react"
import Link from "next/link"

// Mock data for client projects
const mockProjects = [
  {
    id: "1",
    name: "Brand Redesign Project",
    description: "Complete brand identity redesign including logo, colors, and guidelines",
    status: "in_progress",
    progress: 75,
    startDate: "2024-01-15",
    endDate: "2024-03-15",
    budget: "$15,000",
    team: [
      { id: "1", name: "John Designer", avatar: "/placeholder.svg?height=32&width=32", role: "Lead Designer" },
      { id: "2", name: "Sarah Developer", avatar: "/placeholder.svg?height=32&width=32", role: "Frontend Developer" },
    ],
    milestones: [
      { id: "1", name: "Research & Discovery", completed: true, dueDate: "2024-01-30" },
      { id: "2", name: "Logo Design", completed: true, dueDate: "2024-02-15" },
      { id: "3", name: "Brand Guidelines", completed: false, dueDate: "2024-02-28" },
      { id: "4", name: "Final Delivery", completed: false, dueDate: "2024-03-15" },
    ],
    recentActivity: [
      { id: "1", action: "Logo concepts uploaded", date: "2024-01-20", user: "John Designer" },
      { id: "2", action: "Client feedback received", date: "2024-01-18", user: "You" },
    ],
  },
  {
    id: "2",
    name: "Website Development",
    description: "Modern responsive website with CMS integration",
    status: "planning",
    progress: 25,
    startDate: "2024-02-01",
    endDate: "2024-04-30",
    budget: "$25,000",
    team: [
      { id: "3", name: "Mike Developer", avatar: "/placeholder.svg?height=32&width=32", role: "Full Stack Developer" },
      { id: "4", name: "Lisa Designer", avatar: "/placeholder.svg?height=32&width=32", role: "UI/UX Designer" },
    ],
    milestones: [
      { id: "1", name: "Wireframes", completed: true, dueDate: "2024-02-10" },
      { id: "2", name: "Design Mockups", completed: false, dueDate: "2024-02-25" },
      { id: "3", name: "Development", completed: false, dueDate: "2024-04-15" },
      { id: "4", name: "Testing & Launch", completed: false, dueDate: "2024-04-30" },
    ],
    recentActivity: [
      { id: "1", action: "Wireframes approved", date: "2024-02-12", user: "You" },
      { id: "2", action: "Project kickoff meeting", date: "2024-02-01", user: "Mike Developer" },
    ],
  },
]

const getStatusColor = (status: string) => {
  switch (status) {
    case "completed":
      return "bg-green-100 text-green-800"
    case "in_progress":
      return "bg-blue-100 text-blue-800"
    case "planning":
      return "bg-yellow-100 text-yellow-800"
    case "on_hold":
      return "bg-gray-100 text-gray-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

const getStatusLabel = (status: string) => {
  switch (status) {
    case "completed":
      return "Completed"
    case "in_progress":
      return "In Progress"
    case "planning":
      return "Planning"
    case "on_hold":
      return "On Hold"
    default:
      return "Unknown"
  }
}

export default function MyProjectsPage() {
  const [selectedProject, setSelectedProject] = useState(mockProjects[0])

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">My Projects</h2>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {/* Project List */}
        <div className="space-y-4">
          {mockProjects.map((project) => (
            <Card
              key={project.id}
              className={`cursor-pointer transition-all hover:shadow-md ${
                selectedProject.id === project.id ? "ring-2 ring-primary" : ""
              }`}
              onClick={() => setSelectedProject(project)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{project.name}</CardTitle>
                  <Badge className={getStatusColor(project.status)}>{getStatusLabel(project.status)}</Badge>
                </div>
                <CardDescription className="text-sm">{project.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Progress</span>
                    <span>{project.progress}%</span>
                  </div>
                  <Progress value={project.progress} className="h-2" />
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(project.endDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      <span>{project.team.length}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Project Details */}
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl">{selectedProject.name}</CardTitle>
                  <CardDescription className="mt-2">{selectedProject.description}</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/dashboard/projects/${selectedProject.id}`}>
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </Link>
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/dashboard/chat">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Chat
                    </Link>
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="milestones">Milestones</TabsTrigger>
                  <TabsTrigger value="team">Team</TabsTrigger>
                  <TabsTrigger value="activity">Activity</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <h4 className="font-semibold">Project Details</h4>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Status:</span>
                          <Badge className={getStatusColor(selectedProject.status)}>
                            {getStatusLabel(selectedProject.status)}
                          </Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Progress:</span>
                          <span>{selectedProject.progress}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Budget:</span>
                          <span>{selectedProject.budget}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Start Date:</span>
                          <span>{new Date(selectedProject.startDate).toLocaleDateString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">End Date:</span>
                          <span>{new Date(selectedProject.endDate).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-semibold">Progress Overview</h4>
                      <Progress value={selectedProject.progress} className="h-3" />
                      <p className="text-sm text-muted-foreground">{selectedProject.progress}% complete</p>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="milestones" className="space-y-4">
                  <div className="space-y-3">
                    {selectedProject.milestones.map((milestone) => (
                      <div key={milestone.id} className="flex items-center gap-3 p-3 border rounded-lg">
                        <div
                          className={`w-3 h-3 rounded-full ${milestone.completed ? "bg-green-500" : "bg-gray-300"}`}
                        />
                        <div className="flex-1">
                          <h5 className="font-medium">{milestone.name}</h5>
                          <p className="text-sm text-muted-foreground">
                            Due: {new Date(milestone.dueDate).toLocaleDateString()}
                          </p>
                        </div>
                        <Badge variant={milestone.completed ? "default" : "secondary"}>
                          {milestone.completed ? "Completed" : "Pending"}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="team" className="space-y-4">
                  <div className="space-y-3">
                    {selectedProject.team.map((member) => (
                      <div key={member.id} className="flex items-center gap-3 p-3 border rounded-lg">
                        <Avatar>
                          <AvatarImage src={member.avatar || "/placeholder.svg"} />
                          <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <h5 className="font-medium">{member.name}</h5>
                          <p className="text-sm text-muted-foreground">{member.role}</p>
                        </div>
                        <Button variant="outline" size="sm" asChild>
                          <Link href="/dashboard/chat">
                            <MessageSquare className="h-4 w-4 mr-2" />
                            Chat
                          </Link>
                        </Button>
                      </div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="activity" className="space-y-4">
                  <div className="space-y-3">
                    {selectedProject.recentActivity.map((activity) => (
                      <div key={activity.id} className="flex items-start gap-3 p-3 border rounded-lg">
                        <div className="w-2 h-2 rounded-full bg-blue-500 mt-2" />
                        <div className="flex-1">
                          <p className="font-medium">{activity.action}</p>
                          <p className="text-sm text-muted-foreground">
                            by {activity.user} on {new Date(activity.date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
