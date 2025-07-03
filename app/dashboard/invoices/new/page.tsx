"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Trash2, Save, Send } from "lucide-react"
import type { Invoice, InvoiceItem } from "@/lib/types"

// ...existing code...
// Dummy/mock clients and projects removed. Please fetch real clients and projects from your backend or Supabase here.

export default function NewInvoicePage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    clientId: "",
    projectId: "",
    issueDate: new Date().toISOString().split("T")[0],
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    taxRate: 10,
    discount: 0,
    discountType: "percentage" as "percentage" | "fixed",
    currency: "USD",
    terms: "Payment due within 30 days of invoice date.",
    notes: "",
  })

  const [items, setItems] = useState<InvoiceItem[]>([
    {
      id: "1",
      description: "",
      quantity: 1,
      rate: 0,
      amount: 0,
      taxable: true,
      category: "",
    },
  ])

  const addItem = () => {
    const newItem: InvoiceItem = {
      id: Date.now().toString(),
      description: "",
      quantity: 1,
      rate: 0,
      amount: 0,
      taxable: true,
      category: "",
    }
    setItems([...items, newItem])
  }

  const removeItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id))
  }

  const updateItem = (id: string, field: keyof InvoiceItem, value: any) => {
    setItems(
      items.map((item) => {
        if (item.id === id) {
          const updatedItem = { ...item, [field]: value }
          if (field === "quantity" || field === "rate") {
            updatedItem.amount = updatedItem.quantity * updatedItem.rate
          }
          return updatedItem
        }
        return item
      }),
    )
  }

  const subtotal = items.reduce((sum, item) => sum + item.amount, 0)
  const discountAmount =
    formData.discountType === "percentage" ? (subtotal * formData.discount) / 100 : formData.discount
  const taxableAmount = subtotal - discountAmount
  const taxAmount = (taxableAmount * formData.taxRate) / 100
  const total = taxableAmount + taxAmount

  const generateInvoiceNumber = () => {
    const year = new Date().getFullYear()
    const month = String(new Date().getMonth() + 1).padStart(2, "0")
    const random = Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, "0")
    return `INV-${year}-${month}-${random}`
  }

  const handleSave = (status: "draft" | "sent") => {
    const invoice: Partial<Invoice> = {
      invoiceNumber: generateInvoiceNumber(),
      clientId: formData.clientId,
      projectId: formData.projectId || undefined,
      items: items.filter((item) => item.description.trim() !== ""),
      subtotal,
      tax: taxAmount,
      taxRate: formData.taxRate,
      discount: discountAmount,
      discountType: formData.discountType,
      total,
      status,
      issueDate: new Date(formData.issueDate),
      dueDate: new Date(formData.dueDate),
      currency: formData.currency,
      terms: formData.terms,
      notes: formData.notes,
      paymentHistory: [],
    }

    console.log("Saving invoice:", invoice)
    // Here you would typically save to your backend

    router.push("/dashboard/invoices")
  }

  // Replace with real filtered projects from your backend or Supabase
  const filteredProjects: any[] = []

  return (
    <div className="flex-1 flex flex-col">
      <DashboardHeader
        title="Create New Invoice"
        description="Generate a professional invoice for your client"
        showSearch={false}
        showQuickActions={false}
      />

      <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Invoice Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Client and Project Selection */}
            <Card>
              <CardHeader>
                <CardTitle>Invoice Details</CardTitle>
                <CardDescription>Select client and project information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="client">Client *</Label>
                    <Select
                      value={formData.clientId}
                      onValueChange={(value) => setFormData({ ...formData, clientId: value, projectId: "" })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a client" />
                      </SelectTrigger>
                      <SelectContent>
                        {/* Replace with real clients from your backend or Supabase */}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="project">Project (Optional)</Label>
                    <Select
                      value={formData.projectId}
                      onValueChange={(value) => setFormData({ ...formData, projectId: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a project" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">No project</SelectItem>
                        {/* Replace with real filtered projects from your backend or Supabase */}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="issueDate">Issue Date</Label>
                    <Input
                      id="issueDate"
                      type="date"
                      value={formData.issueDate}
                      onChange={(e) => setFormData({ ...formData, issueDate: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="dueDate">Due Date</Label>
                    <Input
                      id="dueDate"
                      type="date"
                      value={formData.dueDate}
                      onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Invoice Items */}
            <Card>
              <CardHeader>
                <CardTitle>Invoice Items</CardTitle>
                <CardDescription>Add products or services to this invoice</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Description</TableHead>
                      <TableHead className="w-20">Qty</TableHead>
                      <TableHead className="w-24">Rate</TableHead>
                      <TableHead className="w-24">Amount</TableHead>
                      <TableHead className="w-12"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {items.map((item, index) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <div className="space-y-2">
                            <Input
                              placeholder="Item description"
                              value={item.description}
                              onChange={(e) => updateItem(item.id, "description", e.target.value)}
                            />
                            <Input
                              placeholder="Category (optional)"
                              value={item.category || ""}
                              onChange={(e) => updateItem(item.id, "category", e.target.value)}
                              className="text-sm"
                            />
                          </div>
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) => updateItem(item.id, "quantity", Number.parseInt(e.target.value) || 1)}
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            min="0"
                            step="0.01"
                            value={item.rate}
                            onChange={(e) => updateItem(item.id, "rate", Number.parseFloat(e.target.value) || 0)}
                          />
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">${item.amount.toFixed(2)}</div>
                        </TableCell>
                        <TableCell>
                          {items.length > 1 && (
                            <Button variant="ghost" size="sm" onClick={() => removeItem(item.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                <Button variant="outline" onClick={addItem} className="mt-4">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Item
                </Button>
              </CardContent>
            </Card>

            {/* Tax and Discount */}
            <Card>
              <CardHeader>
                <CardTitle>Tax & Discount</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="taxRate">Tax Rate (%)</Label>
                    <Input
                      id="taxRate"
                      type="number"
                      min="0"
                      max="100"
                      step="0.1"
                      value={formData.taxRate}
                      onChange={(e) => setFormData({ ...formData, taxRate: Number.parseFloat(e.target.value) || 0 })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="discount">Discount</Label>
                    <Input
                      id="discount"
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.discount}
                      onChange={(e) => setFormData({ ...formData, discount: Number.parseFloat(e.target.value) || 0 })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="discountType">Discount Type</Label>
                    <Select
                      value={formData.discountType}
                      onValueChange={(value: "percentage" | "fixed") =>
                        setFormData({ ...formData, discountType: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="percentage">Percentage (%)</SelectItem>
                        <SelectItem value="fixed">Fixed Amount ($)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Terms and Notes */}
            <Card>
              <CardHeader>
                <CardTitle>Terms & Notes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="terms">Terms & Conditions</Label>
                  <Textarea
                    id="terms"
                    value={formData.terms}
                    onChange={(e) => setFormData({ ...formData, terms: e.target.value })}
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Notes (Internal)</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    rows={2}
                    placeholder="Internal notes (not visible to client)"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Invoice Summary */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Invoice Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>

                  {formData.discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount ({formData.discountType === "percentage" ? `${formData.discount}%` : "$"}):</span>
                      <span>-${discountAmount.toFixed(2)}</span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span>Tax ({formData.taxRate}%):</span>
                    <span>${taxAmount.toFixed(2)}</span>
                  </div>

                  <Separator />

                  <div className="flex justify-between text-lg font-bold">
                    <span>Total:</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>

                <div className="space-y-2 pt-4">
                  <Button onClick={() => handleSave("draft")} variant="outline" className="w-full">
                    <Save className="h-4 w-4 mr-2" />
                    Save as Draft
                  </Button>

                  <Button onClick={() => handleSave("sent")} className="w-full">
                    <Send className="h-4 w-4 mr-2" />
                    Send Invoice
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Client Information */}
            {formData.clientId && (
              <Card>
                <CardHeader>
                  <CardTitle>Client Information</CardTitle>
                </CardHeader>
                <CardContent>
                  {(() => {
                    // Replace with real client lookup from your backend or Supabase
                    return null
                  })()}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
