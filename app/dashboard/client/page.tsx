"use client"

import type React from "react"

import { useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import {
  Upload,
  MessageSquare,
  CheckCircle,
  Clock,
  AlertCircle,
  FileText,
  Send,
  Paperclip,
  Download,
  Eye,
  DollarSign,
  Plus,
} from "lucide-react"

// Essential client data
const clientProjects = [
  {
    id: "1",
    name: "Website Redesign",
    status: "In Progress",
    progress: 65,
    assignedTeam: [
      { id: "1", name: "Sarah Johnson", role: "Lead Designer", avatar: "/placeholder.svg?height=32&width=32" },
      { id: "2", name: "Mike Wilson", role: "Project Manager", avatar: "/placeholder.svg?height=32&width=32" },
    ],
    deadline: new Date("2024-02-15"),
    tasks: [
      { id: "1", title: "Homepage Design", status: "completed", progress: 100 },
      { id: "2", title: "Product Pages", status: "in_progress", progress: 70 },
      { id: "3", title: "Contact Form", status: "pending", progress: 0 },
    ],
  },
  {
    id: "2",
    name: "Brand Identity",
    status: "Pending Review",
    progress: 90,
    assignedTeam: [
      { id: "3", name: "Emma Davis", role: "Creative Director", avatar: "/placeholder.svg?height=32&width=32" },
    ],
    deadline: new Date("2024-01-25"),
    tasks: [
      { id: "4", title: "Logo Design", status: "completed", progress: 100 },
      { id: "5", title: "Brand Guidelines", status: "completed", progress: 100 },
      { id: "6", title: "Business Cards", status: "pending_review", progress: 90 },
    ],
  },
]

const projectFiles = [
  { id: "1", name: "Homepage_Mockup_v2.jpg", type: "image", size: "2.4 MB", uploadedAt: new Date("2024-01-10") },
  { id: "2", name: "Brand_Guidelines.pdf", type: "document", size: "1.8 MB", uploadedAt: new Date("2024-01-08") },
  { id: "3", name: "Logo_Variations.zip", type: "archive", size: "5.2 MB", uploadedAt: new Date("2024-01-05") },
]

const chatMessages = [
  {
    id: "1",
    sender: "Sarah Johnson",
    message: "Hi! I've uploaded the latest homepage design. Please review and let me know your thoughts.",
    timestamp: new Date("2024-01-14T10:30:00"),
    isTeam: true,
  },
  {
    id: "2",
    sender: "You",
    message: "Looks great! Could we make the hero section more prominent?",
    timestamp: new Date("2024-01-14T11:15:00"),
    isTeam: false,
  },
]

const invoices = [
  {
    id: "1",
    number: "INV-001",
    amount: 2500,
    status: "paid",
    dueDate: new Date("2024-01-15"),
    paidDate: new Date("2024-01-10"),
  },
  {
    id: "2",
    number: "INV-002",
    amount: 1800,
    status: "pending",
    dueDate: new Date("2024-02-01"),
  },
]

export default function ClientPanel() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [selectedProject, setSelectedProject] = useState(clientProjects[0])
  const [newMessage, setNewMessage] = useState("")
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [briefForm, setBriefForm] = useState({
    title: "",
    description: "",
    priority: "medium",
    attachments: [] as File[],
  })

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "bg-green-100 text-green-800 border-green-200"
      case "in progress":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "pending review":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "pending":
        return "bg-gray-100 text-gray-800 border-gray-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getTaskStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "in_progress":
        return <Clock className="h-4 w-4 text-blue-600" />
      case "pending_review":
        return <AlertCircle className="h-4 w-4 text-yellow-600" />
      default:
        return <Clock className="h-4 w-4 text-gray-400" />
    }
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "video/mp4",
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ]

    const validFiles = files.filter((file) => allowedTypes.includes(file.type))
    if (validFiles.length !== files.length) {
      toast({
        title: "Invalid file type",
        description: "Only JPG, MP4, PDF, and DOCX files are allowed.",
        variant: "destructive",
      })
    }

    setUploadedFiles((prev) => [...prev, ...validFiles])
    toast({
      title: "Files uploaded",
      description: `${validFiles.length} file(s) uploaded successfully.`,
    })
  }

  const handleSendMessage = () => {
    if (!newMessage.trim()) return

    toast({
      title: "Message sent",
      description: "Your message has been sent to the team.",
    })
    setNewMessage("")
  }

  const handleSubmitBrief = () => {
    if (!briefForm.title || !briefForm.description) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    toast({
      title: "Brief submitted",
      description: "Your project brief has been submitted to the team.",
    })
    setBriefForm({ title: "", description: "", priority: "medium", attachments: [] })
  }

  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Client Dashboard</h2>
          <p className="text-muted-foreground">Welcome back, {user?.name}!</p>
        </div>
      </div>

      {/* Dashboard Overview */}
      <div className="grid gap-6 md:grid-cols-2">
        {clientProjects.map((project) => (
          <Card
            key={project.id}
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => setSelectedProject(project)}
          >
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{project.name}</CardTitle>
                <Badge className={getStatusColor(project.status)}>{project.status}</Badge>
              </div>
              <CardDescription>Due: {project.deadline.toLocaleDateString()}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Progress</span>
                    <span>{project.progress}%</span>
                  </div>
                  <Progress value={project.progress} className="h-2" />
                </div>

                <div>
                  <p className="text-sm font-medium mb-2">Assigned Team:</p>
                  <div className="flex gap-2">
                    {project.assignedTeam.map((member) => (
                      <div key={member.id} className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={member.avatar || "/placeholder.svg"} />
                          <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span className="text-xs">{member.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="tasks" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="tasks">Tasks & Updates</TabsTrigger>
          <TabsTrigger value="files">Files & Media</TabsTrigger>
          <TabsTrigger value="chat">Messages</TabsTrigger>
          <TabsTrigger value="brief">Submit Brief</TabsTrigger>
          <TabsTrigger value="invoices">Invoices</TabsTrigger>
        </TabsList>

        {/* Tasks & Updates */}
        <TabsContent value="tasks">
          <Card>
            <CardHeader>
              <CardTitle>Project Tasks - {selectedProject.name}</CardTitle>
              <CardDescription>Track progress and provide feedback</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {selectedProject.tasks.map((task) => (
                  <div key={task.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      {getTaskStatusIcon(task.status)}
                      <div>
                        <h4 className="font-medium">{task.title}</h4>
                        <p className="text-sm text-muted-foreground capitalize">{task.status.replace("_", " ")}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <Progress value={task.progress} className="w-20 h-2" />
                        <span className="text-xs text-muted-foreground">{task.progress}%</span>
                      </div>
                      <Button size="sm" variant="outline">
                        <MessageSquare className="h-4 w-4 mr-1" />
                        Feedback
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Files & Media Gallery */}
        <TabsContent value="files">
          <Card>
            <CardHeader>
              <CardTitle>Files & Media Gallery</CardTitle>
              <CardDescription>Upload and manage project files (JPG, MP4, PDF, DOCX only)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Upload Area */}
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Upload project files</p>
                    <p className="text-xs text-muted-foreground">JPG, MP4, PDF, DOCX files only</p>
                    <input
                      type="file"
                      multiple
                      accept=".jpg,.jpeg,.mp4,.pdf,.docx"
                      onChange={handleFileUpload}
                      className="hidden"
                      id="file-upload"
                    />
                    <Button asChild>
                      <label htmlFor="file-upload" className="cursor-pointer">
                        Choose Files
                      </label>
                    </Button>
                  </div>
                </div>

                {/* File List */}
                <div className="space-y-3">
                  <h4 className="font-medium">Project Files</h4>
                  {projectFiles.map((file) => (
                    <div key={file.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <FileText className="h-8 w-8 text-blue-500" />
                        <div>
                          <p className="font-medium text-sm">{file.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {file.size} • {file.uploadedAt.toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Messages/Chat */}
        <TabsContent value="chat">
          <Card>
            <CardHeader>
              <CardTitle>Project Messages - {selectedProject.name}</CardTitle>
              <CardDescription>Chat with your assigned team</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Chat Messages */}
                <ScrollArea className="h-64 w-full border rounded-lg p-4">
                  <div className="space-y-4">
                    {chatMessages.map((message) => (
                      <div key={message.id} className={`flex ${message.isTeam ? "justify-start" : "justify-end"}`}>
                        <div
                          className={`max-w-[70%] p-3 rounded-lg ${
                            message.isTeam ? "bg-gray-100" : "bg-blue-500 text-white"
                          }`}
                        >
                          <p className="text-sm font-medium mb-1">{message.sender}</p>
                          <p className="text-sm">{message.message}</p>
                          <p className={`text-xs mt-1 ${message.isTeam ? "text-gray-500" : "text-blue-100"}`}>
                            {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>

                {/* Message Input */}
                <div className="flex gap-2">
                  <Input
                    placeholder="Type your message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                  />
                  <Button size="sm" variant="outline">
                    <Paperclip className="h-4 w-4" />
                  </Button>
                  <Button size="sm" onClick={handleSendMessage}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Submit Requirements/Brief */}
        <TabsContent value="brief">
          <Card>
            <CardHeader>
              <CardTitle>Submit Project Brief</CardTitle>
              <CardDescription>Submit initial requirements or change requests</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="brief-title">Brief Title *</Label>
                  <Input
                    id="brief-title"
                    placeholder="e.g., Homepage Design Requirements"
                    value={briefForm.title}
                    onChange={(e) => setBriefForm((prev) => ({ ...prev, title: e.target.value }))}
                  />
                </div>

                <div>
                  <Label htmlFor="brief-description">Description *</Label>
                  <Textarea
                    id="brief-description"
                    placeholder="Describe your requirements, changes, or feedback in detail..."
                    rows={6}
                    value={briefForm.description}
                    onChange={(e) => setBriefForm((prev) => ({ ...prev, description: e.target.value }))}
                  />
                </div>

                <div>
                  <Label htmlFor="brief-priority">Priority</Label>
                  <Select
                    value={briefForm.priority}
                    onValueChange={(value) => setBriefForm((prev) => ({ ...prev, priority: value }))}
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

                <div>
                  <Label>Attachments (Optional)</Label>
                  <input
                    type="file"
                    multiple
                    accept=".jpg,.jpeg,.mp4,.pdf,.docx"
                    onChange={(e) => {
                      const files = Array.from(e.target.files || [])
                      setBriefForm((prev) => ({ ...prev, attachments: files }))
                    }}
                    className="hidden"
                    id="brief-attachments"
                  />
                  <Button variant="outline" asChild className="w-full">
                    <label htmlFor="brief-attachments" className="cursor-pointer">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Files
                    </label>
                  </Button>
                </div>

                <Button onClick={handleSubmitBrief} className="w-full">
                  Submit Brief
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Invoices & Payment */}
        <TabsContent value="invoices">
          <Card>
            <CardHeader>
              <CardTitle>Invoices & Payment</CardTitle>
              <CardDescription>View bills and payment history</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {invoices.map((invoice) => (
                  <div key={invoice.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <DollarSign className="h-8 w-8 text-green-500" />
                      <div>
                        <p className="font-medium">{invoice.number}</p>
                        <p className="text-sm text-muted-foreground">
                          Due: {invoice.dueDate.toLocaleDateString()}
                          {invoice.paidDate && ` • Paid: ${invoice.paidDate.toLocaleDateString()}`}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="font-bold">${invoice.amount}</p>
                        <Badge
                          className={
                            invoice.status === "paid" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                          }
                        >
                          {invoice.status}
                        </Badge>
                      </div>
                      <Button size="sm" variant="outline">
                        <Download className="h-4 w-4 mr-1" />
                        Download
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
