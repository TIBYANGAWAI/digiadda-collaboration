"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Mail, Send, Settings, Plus, Edit, Trash2, Play, Pause, Eye } from "lucide-react"
import type { EmailTemplate, EmailAutomation, EmailLog } from "@/lib/email-automation"
import { mockEmailTemplates, mockEmailAutomations } from "@/lib/email-automation"

const mockEmailLogs: EmailLog[] = [
  {
    id: "log-1",
    automationId: "auto-1",
    recipientEmail: "client@techcorp.com",
    subject: "Invoice INV-2024-001 from DigiAdda",
    status: "sent",
    sentAt: new Date(Date.now() - 1000 * 60 * 30),
    invoiceId: "1",
  },
  {
    id: "log-2",
    automationId: "auto-2",
    recipientEmail: "billing@startupxyz.com",
    subject: "Payment Reminder - Invoice INV-2024-002",
    status: "sent",
    sentAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
    invoiceId: "2",
  },
  {
    id: "log-3",
    automationId: "auto-3",
    recipientEmail: "accounts@fashionco.com",
    subject: "Payment Received - Thank You!",
    status: "failed",
    error: "Invalid email address",
    invoiceId: "3",
  },
]

export function EmailAutomationManager() {
  const [templates, setTemplates] = useState<EmailTemplate[]>(mockEmailTemplates)
  const [automations, setAutomations] = useState<EmailAutomation[]>(mockEmailAutomations)
  const [emailLogs] = useState<EmailLog[]>(mockEmailLogs)
  const [isCreatingTemplate, setIsCreatingTemplate] = useState(false)
  const [isCreatingAutomation, setIsCreatingAutomation] = useState(false)
  const [editingTemplate, setEditingTemplate] = useState<EmailTemplate | null>(null)

  const toggleTemplateStatus = (id: string) => {
    setTemplates((templates) =>
      templates.map((template) => (template.id === id ? { ...template, isActive: !template.isActive } : template)),
    )
  }

  const toggleAutomationStatus = (id: string) => {
    setAutomations((automations) =>
      automations.map((automation) =>
        automation.id === id ? { ...automation, isActive: !automation.isActive } : automation,
      ),
    )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "sent":
        return "bg-green-100 text-green-800"
      case "failed":
        return "bg-red-100 text-red-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold gradient-text">Email Automation</h2>
          <p className="text-muted-foreground">Automate your email communications with clients</p>
        </div>
      </div>

      <Tabs defaultValue="automations" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="automations">Automations</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="logs">Email Logs</TabsTrigger>
        </TabsList>

        {/* Automations Tab */}
        <TabsContent value="automations" className="space-y-6">
          <Card className="modern-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5 text-pink-500" />
                    Email Automations
                  </CardTitle>
                  <CardDescription>Set up automated email workflows for your business</CardDescription>
                </div>
                <Dialog open={isCreatingAutomation} onOpenChange={setIsCreatingAutomation}>
                  <DialogTrigger asChild>
                    <Button className="gradient-button">
                      <Plus className="h-4 w-4 mr-2" />
                      Create Automation
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Create Email Automation</DialogTitle>
                      <DialogDescription>Set up an automated email workflow</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Automation Name</Label>
                        <Input placeholder="e.g., Welcome New Clients" />
                      </div>
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label>Trigger Event</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Select trigger" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="invoice_created">Invoice Created</SelectItem>
                              <SelectItem value="invoice_overdue">Invoice Overdue</SelectItem>
                              <SelectItem value="payment_received">Payment Received</SelectItem>
                              <SelectItem value="project_completed">Project Completed</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Email Template</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Select template" />
                            </SelectTrigger>
                            <SelectContent>
                              {templates.map((template) => (
                                <SelectItem key={template.id} value={template.id}>
                                  {template.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Recipients</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select recipients" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="client">Client</SelectItem>
                            <SelectItem value="team">Team Members</SelectItem>
                            <SelectItem value="admin">Administrators</SelectItem>
                            <SelectItem value="custom">Custom Recipients</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch id="active" />
                        <Label htmlFor="active">Activate automation immediately</Label>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsCreatingAutomation(false)}>
                        Cancel
                      </Button>
                      <Button className="gradient-button" onClick={() => setIsCreatingAutomation(false)}>
                        Create Automation
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Trigger</TableHead>
                    <TableHead>Template</TableHead>
                    <TableHead>Recipients</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {automations.map((automation) => (
                    <TableRow key={automation.id}>
                      <TableCell className="font-medium">{automation.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">
                          {automation.trigger.replace("_", " ")}
                        </Badge>
                      </TableCell>
                      <TableCell>{templates.find((t) => t.id === automation.templateId)?.name || "Unknown"}</TableCell>
                      <TableCell className="capitalize">{automation.recipients}</TableCell>
                      <TableCell>
                        <Badge variant={automation.isActive ? "default" : "secondary"}>
                          {automation.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button variant="ghost" size="sm" onClick={() => toggleAutomationStatus(automation.id)}>
                            {automation.isActive ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Templates Tab */}
        <TabsContent value="templates" className="space-y-6">
          <Card className="modern-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Mail className="h-5 w-5 text-purple-500" />
                    Email Templates
                  </CardTitle>
                  <CardDescription>Manage your email templates for automated communications</CardDescription>
                </div>
                <Dialog open={isCreatingTemplate} onOpenChange={setIsCreatingTemplate}>
                  <DialogTrigger asChild>
                    <Button className="gradient-button">
                      <Plus className="h-4 w-4 mr-2" />
                      Create Template
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl">
                    <DialogHeader>
                      <DialogTitle>Create Email Template</DialogTitle>
                      <DialogDescription>Design a new email template for your automations</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label>Template Name</Label>
                          <Input placeholder="e.g., Welcome Email" />
                        </div>
                        <div className="space-y-2">
                          <Label>Template Type</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="invoice_sent">Invoice Sent</SelectItem>
                              <SelectItem value="payment_reminder">Payment Reminder</SelectItem>
                              <SelectItem value="payment_received">Payment Received</SelectItem>
                              <SelectItem value="project_update">Project Update</SelectItem>
                              <SelectItem value="welcome">Welcome Email</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Subject Line</Label>
                        <Input placeholder="Email subject with {{variables}}" />
                      </div>
                      <div className="space-y-2">
                        <Label>Email Content</Label>
                        <Textarea
                          placeholder="Email content with {{variables}} for personalization"
                          rows={10}
                          className="font-mono text-sm"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Available Variables</Label>
                        <div className="flex flex-wrap gap-2">
                          {["clientName", "invoiceNumber", "amount", "dueDate", "projectName"].map((variable) => (
                            <Badge key={variable} variant="outline" className="text-xs">
                              {`{{${variable}}}`}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsCreatingTemplate(false)}>
                        Cancel
                      </Button>
                      <Button className="gradient-button" onClick={() => setIsCreatingTemplate(false)}>
                        Create Template
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {templates.map((template) => (
                  <Card key={template.id} className="modern-card">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className="capitalize">
                          {template.type.replace("_", " ")}
                        </Badge>
                        <Badge variant={template.isActive ? "default" : "secondary"}>
                          {template.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                      <CardTitle className="text-lg">{template.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Subject:</p>
                        <p className="text-sm truncate">{template.subject}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Variables:</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {template.variables.slice(0, 3).map((variable) => (
                            <Badge key={variable} variant="outline" className="text-xs">
                              {`{{${variable}}}`}
                            </Badge>
                          ))}
                          {template.variables.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{template.variables.length - 3} more
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center justify-between pt-2">
                        <div className="flex items-center gap-1">
                          <Button variant="ghost" size="sm" onClick={() => setEditingTemplate(template)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => toggleTemplateStatus(template.id)}>
                            {template.isActive ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                          </Button>
                        </div>
                        <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Email Logs Tab */}
        <TabsContent value="logs" className="space-y-6">
          <Card className="modern-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Send className="h-5 w-5 text-pink-500" />
                Email Logs
              </CardTitle>
              <CardDescription>Track all automated emails sent from your system</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Recipient</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Sent At</TableHead>
                    <TableHead>Error</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {emailLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="font-medium">{log.recipientEmail}</TableCell>
                      <TableCell className="max-w-64 truncate">{log.subject}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(log.status)}>{log.status}</Badge>
                      </TableCell>
                      <TableCell>{log.sentAt ? log.sentAt.toLocaleString() : "-"}</TableCell>
                      <TableCell className="text-red-600 text-sm">{log.error || "-"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
