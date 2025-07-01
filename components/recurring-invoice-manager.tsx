"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
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
import { Repeat, Calendar, Pause, Play, Trash2, Edit } from "lucide-react"
import type { Invoice } from "@/lib/types"
import { format, addWeeks, addMonths, addYears } from "date-fns"

interface RecurringInvoice extends Omit<Invoice, "id" | "invoiceNumber" | "createdAt"> {
  id: string
  templateName: string
  frequency: "weekly" | "monthly" | "quarterly" | "yearly"
  nextInvoiceDate: Date
  isActive: boolean
  lastGenerated?: Date
  totalGenerated: number
}

const mockRecurringInvoices: RecurringInvoice[] = [
  {
    id: "rec-1",
    templateName: "Monthly SEO Services - TechCorp",
    clientId: "client-1",
    items: [
      {
        id: "1",
        description: "Monthly SEO Services",
        quantity: 1,
        rate: 1500,
        amount: 1500,
        taxable: true,
        category: "Marketing",
      },
    ],
    subtotal: 1500,
    tax: 150,
    taxRate: 10,
    total: 1650,
    status: "draft",
    frequency: "monthly",
    nextInvoiceDate: new Date("2024-02-01"),
    isActive: true,
    dueDate: new Date("2024-02-15"),
    issueDate: new Date("2024-01-01"),
    currency: "USD",
    terms: "Payment due within 15 days",
    paymentHistory: [],
    totalGenerated: 3,
    lastGenerated: new Date("2024-01-01"),
  },
  {
    id: "rec-2",
    templateName: "Quarterly Brand Maintenance - Fashion Co",
    clientId: "client-3",
    items: [
      {
        id: "2",
        description: "Quarterly Brand Maintenance",
        quantity: 1,
        rate: 2000,
        amount: 2000,
        taxable: true,
        category: "Design",
      },
    ],
    subtotal: 2000,
    tax: 200,
    taxRate: 10,
    total: 2200,
    status: "draft",
    frequency: "quarterly",
    nextInvoiceDate: new Date("2024-04-01"),
    isActive: false,
    dueDate: new Date("2024-04-30"),
    issueDate: new Date("2024-01-01"),
    currency: "USD",
    terms: "Payment due within 30 days",
    paymentHistory: [],
    totalGenerated: 1,
    lastGenerated: new Date("2024-01-01"),
  },
]

export function RecurringInvoiceManager() {
  const [recurringInvoices, setRecurringInvoices] = useState<RecurringInvoice[]>(mockRecurringInvoices)
  const [isCreating, setIsCreating] = useState(false)
  const [editingInvoice, setEditingInvoice] = useState<RecurringInvoice | null>(null)

  const getNextInvoiceDate = (lastDate: Date, frequency: string) => {
    switch (frequency) {
      case "weekly":
        return addWeeks(lastDate, 1)
      case "monthly":
        return addMonths(lastDate, 1)
      case "quarterly":
        return addMonths(lastDate, 3)
      case "yearly":
        return addYears(lastDate, 1)
      default:
        return addMonths(lastDate, 1)
    }
  }

  const toggleInvoiceStatus = (id: string) => {
    setRecurringInvoices((invoices) =>
      invoices.map((invoice) => (invoice.id === id ? { ...invoice, isActive: !invoice.isActive } : invoice)),
    )
  }

  const generateInvoice = (recurringInvoice: RecurringInvoice) => {
    // In a real app, this would create a new invoice and update the recurring invoice
    const newInvoiceNumber = `INV-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`

    console.log("Generating invoice:", {
      ...recurringInvoice,
      invoiceNumber: newInvoiceNumber,
      issueDate: new Date(),
      dueDate: getNextInvoiceDate(new Date(), "15 days"),
    })

    // Update the recurring invoice
    setRecurringInvoices((invoices) =>
      invoices.map((invoice) =>
        invoice.id === recurringInvoice.id
          ? {
              ...invoice,
              lastGenerated: new Date(),
              nextInvoiceDate: getNextInvoiceDate(new Date(), invoice.frequency),
              totalGenerated: invoice.totalGenerated + 1,
            }
          : invoice,
      ),
    )
  }

  const deleteRecurringInvoice = (id: string) => {
    setRecurringInvoices((invoices) => invoices.filter((invoice) => invoice.id !== id))
  }

  const getFrequencyColor = (frequency: string) => {
    switch (frequency) {
      case "weekly":
        return "bg-blue-100 text-blue-800"
      case "monthly":
        return "bg-green-100 text-green-800"
      case "quarterly":
        return "bg-purple-100 text-purple-800"
      case "yearly":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Repeat className="h-5 w-5" />
              Recurring Invoices
            </CardTitle>
            <CardDescription>Automate your regular billing with recurring invoices</CardDescription>
          </div>

          <Dialog open={isCreating} onOpenChange={setIsCreating}>
            <DialogTrigger asChild>
              <Button>
                <Repeat className="h-4 w-4 mr-2" />
                Create Recurring Invoice
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create Recurring Invoice</DialogTitle>
                <DialogDescription>
                  Set up an invoice template that will be automatically generated at regular intervals
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="templateName">Template Name</Label>
                  <Input id="templateName" placeholder="e.g., Monthly SEO Services - Client Name" />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="frequency">Billing Frequency</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select frequency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="quarterly">Quarterly</SelectItem>
                        <SelectItem value="yearly">Yearly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="nextDate">Next Invoice Date</Label>
                    <Input id="nextDate" type="date" defaultValue={new Date().toISOString().split("T")[0]} />
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch id="autoSend" />
                  <Label htmlFor="autoSend">Automatically send invoices when generated</Label>
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreating(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setIsCreating(false)}>Create Template</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>

      <CardContent>
        {recurringInvoices.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Repeat className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No recurring invoices set up yet</p>
            <p className="text-sm">Create recurring invoice templates to automate your billing</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Template Name</TableHead>
                <TableHead>Frequency</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Next Invoice</TableHead>
                <TableHead>Generated</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recurringInvoices.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{invoice.templateName}</p>
                      <p className="text-sm text-muted-foreground">
                        {invoice.lastGenerated && `Last: ${format(invoice.lastGenerated, "MMM d, yyyy")}`}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getFrequencyColor(invoice.frequency)}>{invoice.frequency}</Badge>
                  </TableCell>
                  <TableCell className="font-medium">${invoice.total.toLocaleString()}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      {format(invoice.nextInvoiceDate, "MMM d, yyyy")}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="font-medium">{invoice.totalGenerated}</span>
                    <span className="text-muted-foreground"> invoices</span>
                  </TableCell>
                  <TableCell>
                    <Badge variant={invoice.isActive ? "default" : "secondary"}>
                      {invoice.isActive ? "Active" : "Paused"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => generateInvoice(invoice)}
                        disabled={!invoice.isActive}
                      >
                        Generate Now
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => toggleInvoiceStatus(invoice.id)}>
                        {invoice.isActive ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => setEditingInvoice(invoice)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteRecurringInvoice(invoice.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}
