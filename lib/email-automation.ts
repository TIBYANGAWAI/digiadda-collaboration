export interface EmailTemplate {
  id: string
  name: string
  subject: string
  content: string
  type: "invoice_sent" | "payment_reminder" | "payment_received" | "project_update" | "welcome"
  isActive: boolean
  variables: string[]
}

export interface EmailAutomation {
  id: string
  name: string
  trigger: "invoice_created" | "invoice_overdue" | "payment_received" | "project_completed"
  templateId: string
  delay?: number // in hours
  conditions?: EmailCondition[]
  isActive: boolean
  recipients: "client" | "team" | "admin" | "custom"
  customRecipients?: string[]
}

export interface EmailCondition {
  field: string
  operator: "equals" | "greater_than" | "less_than" | "contains"
  value: string | number
}

export interface EmailLog {
  id: string
  automationId: string
  recipientEmail: string
  subject: string
  status: "sent" | "failed" | "pending"
  sentAt?: Date
  error?: string
  invoiceId?: string
  projectId?: string
}

// Mock email templates
export const mockEmailTemplates: EmailTemplate[] = [
  {
    id: "template-1",
    name: "Invoice Sent",
    subject: "Invoice {{invoiceNumber}} from DigiAdda",
    content: `
      <h2>Hello {{clientName}},</h2>
      <p>We've sent you a new invoice for your project: <strong>{{projectName}}</strong></p>
      <p><strong>Invoice Details:</strong></p>
      <ul>
        <li>Invoice Number: {{invoiceNumber}}</li>
        <li>Amount: {{amount}}</li>
        <li>Due Date: {{dueDate}}</li>
      </ul>
      <p>You can view and pay your invoice by clicking the link below:</p>
      <a href="{{invoiceUrl}}" style="background: linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%); color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block;">View Invoice</a>
      <p>Thank you for your business!</p>
      <p>Best regards,<br>The DigiAdda Team</p>
    `,
    type: "invoice_sent",
    isActive: true,
    variables: ["clientName", "projectName", "invoiceNumber", "amount", "dueDate", "invoiceUrl"],
  },
  {
    id: "template-2",
    name: "Payment Reminder",
    subject: "Payment Reminder - Invoice {{invoiceNumber}}",
    content: `
      <h2>Hello {{clientName}},</h2>
      <p>This is a friendly reminder that your invoice is due soon.</p>
      <p><strong>Invoice Details:</strong></p>
      <ul>
        <li>Invoice Number: {{invoiceNumber}}</li>
        <li>Amount: ${{ amount }}</li>
        <li>Due Date: {{dueDate}}</li>
        <li>Days Overdue: {{daysOverdue}}</li>
      </ul>
      <p>Please make your payment at your earliest convenience:</p>
      <a href="{{invoiceUrl}}" style="background: linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%); color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block;">Pay Now</a>
      <p>If you have any questions, please don't hesitate to contact us.</p>
      <p>Best regards,<br>The DigiAdda Team</p>
    `,
    type: "payment_reminder",
    isActive: true,
    variables: ["clientName", "invoiceNumber", "amount", "dueDate", "daysOverdue", "invoiceUrl"],
  },
  {
    id: "template-3",
    name: "Payment Received",
    subject: "Payment Received - Thank You!",
    content: `
      <h2>Hello {{clientName}},</h2>
      <p>Thank you! We've received your payment for invoice {{invoiceNumber}}.</p>
      <p><strong>Payment Details:</strong></p>
      <ul>
        <li>Invoice Number: {{invoiceNumber}}</li>
        <li>Amount Paid: {{amountPaid}}</li>
        <li>Payment Date: {{paymentDate}}</li>
        <li>Payment Method: {{paymentMethod}}</li>
      </ul>
      <p>Your invoice has been marked as paid. You can download your receipt from your client portal.</p>
      <a href="{{clientPortalUrl}}" style="background: linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%); color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block;">View Receipt</a>
      <p>Thank you for your business!</p>
      <p>Best regards,<br>The DigiAdda Team</p>
    `,
    type: "payment_received",
    isActive: true,
    variables: ["clientName", "invoiceNumber", "amountPaid", "paymentDate", "paymentMethod", "clientPortalUrl"],
  },
]

// Mock email automations
export const mockEmailAutomations: EmailAutomation[] = [
  {
    id: "auto-1",
    name: "Send Invoice Notification",
    trigger: "invoice_created",
    templateId: "template-1",
    recipients: "client",
    isActive: true,
  },
  {
    id: "auto-2",
    name: "Payment Reminder (3 days overdue)",
    trigger: "invoice_overdue",
    templateId: "template-2",
    delay: 72, // 3 days
    recipients: "client",
    isActive: true,
    conditions: [
      {
        field: "daysOverdue",
        operator: "greater_than",
        value: 3,
      },
    ],
  },
  {
    id: "auto-3",
    name: "Payment Confirmation",
    trigger: "payment_received",
    templateId: "template-3",
    recipients: "client",
    isActive: true,
  },
]

export class EmailAutomationService {
  static async sendEmail(templateId: string, variables: Record<string, any>, recipientEmail: string): Promise<boolean> {
    // In a real application, this would integrate with an email service like SendGrid, Mailgun, etc.
    console.log("Sending email:", { templateId, variables, recipientEmail })

    // Simulate email sending
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(Math.random() > 0.1) // 90% success rate
      }, 1000)
    })
  }

  static async processAutomation(automation: EmailAutomation, triggerData: any): Promise<void> {
    if (!automation.isActive) return

    // Check conditions
    if (automation.conditions) {
      const conditionsMet = automation.conditions.every((condition) => {
        const value = triggerData[condition.field]
        switch (condition.operator) {
          case "equals":
            return value === condition.value
          case "greater_than":
            return value > condition.value
          case "less_than":
            return value < condition.value
          case "contains":
            return String(value).includes(String(condition.value))
          default:
            return false
        }
      })

      if (!conditionsMet) return
    }

    // Get template
    const template = mockEmailTemplates.find((t) => t.id === automation.templateId)
    if (!template) return

    // Determine recipients
    let recipients: string[] = []
    switch (automation.recipients) {
      case "client":
        recipients = [triggerData.clientEmail]
        break
      case "team":
        recipients = triggerData.teamEmails || []
        break
      case "admin":
        recipients = ["admin@digiadda.com"]
        break
      case "custom":
        recipients = automation.customRecipients || []
        break
    }

    // Send emails
    for (const email of recipients) {
      try {
        await this.sendEmail(template.id, triggerData, email)
        console.log(`Email sent successfully to ${email}`)
      } catch (error) {
        console.error(`Failed to send email to ${email}:`, error)
      }
    }
  }
}
