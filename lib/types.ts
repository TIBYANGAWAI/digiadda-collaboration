export interface User {
  id: string
  name: string
  email: string
  role: "super_admin" | "sub_admin" | "team_member" | "client"
  avatar?: string
  createdAt: Date
  lastActive?: Date
  permissions?: Permission[]
}

export interface Permission {
  id: string
  name: string
  description: string
  module: string
}

export interface TeamMember extends User {
  role: "team_member" | "sub_admin"
  skills: string[]
  department: string
  hourlyRate?: number
  phone?: string
}

export interface Client extends User {
  role: "client"
  company: string
  phone: string
  address?: string
  taxId?: string
}

export interface Task {
  id: string
  title: string
  description: string
  status: "pending" | "in_progress" | "completed" | "cancelled"
  priority: "low" | "medium" | "high"
  assignedTo: string[]
  projectId: string
  dueDate: Date
  createdAt: Date
  createdBy: string
  comments: TaskComment[]
  timeTracked?: number
  estimatedHours?: number
}

export interface TaskComment {
  id: string
  taskId: string
  userId: string
  content: string
  createdAt: Date
  attachments?: string[]
}

export interface Project {
  id: string
  name: string
  description: string
  status: "planning" | "active" | "completed" | "on_hold"
  clientId: string
  teamMembers: string[]
  startDate: Date
  endDate: Date
  progress: number
  createdAt: Date
  budget?: number
  hourlyRate?: number
  comments: ProjectComment[]
}

export interface ProjectComment {
  id: string
  projectId: string
  userId: string
  content: string
  createdAt: Date
  attachments?: string[]
}

export interface Asset {
  id: string
  name: string
  type: "image" | "video" | "document"
  url: string
  size: number
  uploadedBy: string
  projectId?: string
  createdAt: Date
  tags?: string[]
}

export interface ChatMessage {
  id: string
  content: string
  senderId: string
  receiverId?: string
  channelId?: string
  timestamp: Date
  read: boolean
  type: "text" | "file" | "image"
  attachments?: string[]
}

export interface Notification {
  id: string
  userId: string
  title: string
  message: string
  type: "task" | "project" | "chat" | "system" | "invoice"
  read: boolean
  createdAt: Date
  actionUrl?: string
}

export interface CalendarEvent {
  id: string
  title: string
  description?: string
  startDate: Date
  endDate: Date
  type: "task" | "meeting" | "deadline" | "reminder"
  attendees?: string[]
  projectId?: string
  taskId?: string
}

export interface Invoice {
  id: string
  invoiceNumber: string
  clientId: string
  projectId?: string
  items: InvoiceItem[]
  subtotal: number
  tax: number
  taxRate: number
  discount?: number
  discountType?: "percentage" | "fixed"
  total: number
  status: "draft" | "sent" | "viewed" | "paid" | "overdue" | "cancelled"
  dueDate: Date
  issueDate: Date
  createdAt: Date
  paidAt?: Date
  paymentMethod?: string
  paymentReference?: string
  notes?: string
  terms?: string
  currency: string
  recurringId?: string
  isRecurring?: boolean
  recurringFrequency?: "weekly" | "monthly" | "quarterly" | "yearly"
  nextInvoiceDate?: Date
  paymentHistory: PaymentRecord[]
}

export interface InvoiceItem {
  id: string
  description: string
  quantity: number
  rate: number
  amount: number
  taxable: boolean
  category?: string
}

export interface PaymentRecord {
  id: string
  invoiceId: string
  amount: number
  paymentDate: Date
  paymentMethod: string
  reference?: string
  notes?: string
  createdBy: string
}

export interface InvoiceTemplate {
  id: string
  name: string
  isDefault: boolean
  companyInfo: {
    name: string
    address: string
    phone: string
    email: string
    website?: string
    logo?: string
    taxId?: string
  }
  colors: {
    primary: string
    secondary: string
    accent: string
  }
  terms: string
  footer?: string
}

export interface AISummary {
  id: string
  type: "project" | "client_request" | "task_summary"
  entityId: string
  summary: string
  keyPoints: string[]
  recommendations?: string[]
  createdAt: Date
}

export interface TaskDeadline {
  id: string
  taskId: string
  title: string
  dueDate: Date
  priority: "low" | "medium" | "high"
  status: "pending" | "approaching" | "overdue"
  projectName: string
}

export interface WorkUpload {
  id: string
  taskId: string
  projectId: string
  fileName: string
  fileUrl: string
  fileType: string
  fileSize: number
  uploadedBy: string
  uploadedAt: Date
  description?: string
  status: "pending_review" | "approved" | "needs_revision"
  feedback?: string
}

export interface ClientBrief {
  id: string
  projectId: string
  title: string
  description: string
  attachments: string[]
  uploadedBy: string
  uploadedAt: Date
  status: "new" | "in_review" | "approved"
  priority: "low" | "medium" | "high"
}

export interface ProjectProgress {
  id: string
  projectId: string
  projectName: string
  clientId: string
  progress: number
  status: "planning" | "active" | "completed" | "on_hold"
  milestones: ProjectMilestone[]
  lastUpdate: Date
  assignedTeam: string[]
}

export interface ProjectMilestone {
  id: string
  title: string
  description: string
  dueDate: Date
  status: "pending" | "in_progress" | "completed"
  progress: number
}
