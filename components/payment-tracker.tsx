"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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
import { Plus, DollarSign, Calendar, CreditCard } from "lucide-react"
import type { PaymentRecord, Invoice } from "@/lib/types"
import { format } from "date-fns"

interface PaymentTrackerProps {
  invoice: Invoice
  onPaymentAdded: (payment: PaymentRecord) => void
}

export function PaymentTracker({ invoice, onPaymentAdded }: PaymentTrackerProps) {
  const [isAddingPayment, setIsAddingPayment] = useState(false)
  const [paymentForm, setPaymentForm] = useState({
    amount: invoice.total,
    paymentDate: new Date().toISOString().split("T")[0],
    paymentMethod: "",
    reference: "",
    notes: "",
  })

  const handleAddPayment = () => {
    const newPayment: PaymentRecord = {
      id: Date.now().toString(),
      invoiceId: invoice.id,
      amount: paymentForm.amount,
      paymentDate: new Date(paymentForm.paymentDate),
      paymentMethod: paymentForm.paymentMethod,
      reference: paymentForm.reference,
      notes: paymentForm.notes,
      createdBy: "admin", // In real app, use current user ID
    }

    onPaymentAdded(newPayment)
    setIsAddingPayment(false)
    setPaymentForm({
      amount: 0,
      paymentDate: new Date().toISOString().split("T")[0],
      paymentMethod: "",
      reference: "",
      notes: "",
    })
  }

  const totalPaid = invoice.paymentHistory.reduce((sum, payment) => sum + payment.amount, 0)
  const remainingBalance = invoice.total - totalPaid
  const isFullyPaid = remainingBalance <= 0

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Payment Tracking
            </CardTitle>
            <CardDescription>Track payments for invoice {invoice.invoiceNumber}</CardDescription>
          </div>

          {!isFullyPaid && (
            <Dialog open={isAddingPayment} onOpenChange={setIsAddingPayment}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Payment
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Record Payment</DialogTitle>
                  <DialogDescription>Add a payment record for invoice {invoice.invoiceNumber}</DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="amount">Payment Amount</Label>
                      <Input
                        id="amount"
                        type="number"
                        min="0"
                        max={remainingBalance}
                        step="0.01"
                        value={paymentForm.amount}
                        onChange={(e) =>
                          setPaymentForm({
                            ...paymentForm,
                            amount: Number.parseFloat(e.target.value) || 0,
                          })
                        }
                      />
                      <p className="text-xs text-muted-foreground">Remaining balance: ${remainingBalance.toFixed(2)}</p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="paymentDate">Payment Date</Label>
                      <Input
                        id="paymentDate"
                        type="date"
                        value={paymentForm.paymentDate}
                        onChange={(e) =>
                          setPaymentForm({
                            ...paymentForm,
                            paymentDate: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="paymentMethod">Payment Method</Label>
                    <Select
                      value={paymentForm.paymentMethod}
                      onValueChange={(value) =>
                        setPaymentForm({
                          ...paymentForm,
                          paymentMethod: value,
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select payment method" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                        <SelectItem value="credit_card">Credit Card</SelectItem>
                        <SelectItem value="paypal">PayPal</SelectItem>
                        <SelectItem value="stripe">Stripe</SelectItem>
                        <SelectItem value="check">Check</SelectItem>
                        <SelectItem value="cash">Cash</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="reference">Reference/Transaction ID</Label>
                    <Input
                      id="reference"
                      placeholder="e.g., TXN-123456"
                      value={paymentForm.reference}
                      onChange={(e) =>
                        setPaymentForm({
                          ...paymentForm,
                          reference: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notes">Notes (Optional)</Label>
                    <Textarea
                      id="notes"
                      placeholder="Additional payment notes..."
                      value={paymentForm.notes}
                      onChange={(e) =>
                        setPaymentForm({
                          ...paymentForm,
                          notes: e.target.value,
                        })
                      }
                      rows={2}
                    />
                  </div>
                </div>

                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddingPayment(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddPayment}>Record Payment</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Payment Summary */}
        <div className="grid gap-4 md:grid-cols-3">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">${invoice.total.toFixed(2)}</div>
            <div className="text-sm text-blue-600">Invoice Total</div>
          </div>

          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">${totalPaid.toFixed(2)}</div>
            <div className="text-sm text-green-600">Amount Paid</div>
          </div>

          <div className="text-center p-4 bg-orange-50 rounded-lg">
            <div className="text-2xl font-bold text-orange-600">${remainingBalance.toFixed(2)}</div>
            <div className="text-sm text-orange-600">Remaining Balance</div>
          </div>
        </div>

        {/* Payment Status */}
        <div className="flex items-center justify-center">
          <Badge
            className={`text-lg px-4 py-2 ${
              isFullyPaid
                ? "bg-green-100 text-green-800"
                : remainingBalance < invoice.total
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-red-100 text-red-800"
            }`}
          >
            {isFullyPaid ? "Fully Paid" : remainingBalance < invoice.total ? "Partially Paid" : "Unpaid"}
          </Badge>
        </div>

        {/* Payment History */}
        {invoice.paymentHistory.length > 0 && (
          <div>
            <h4 className="font-medium mb-3">Payment History</h4>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead>Reference</TableHead>
                  <TableHead>Notes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoice.paymentHistory.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        {format(payment.paymentDate, "MMM d, yyyy")}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">${payment.amount.toFixed(2)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <CreditCard className="h-4 w-4 text-muted-foreground" />
                        {payment.paymentMethod.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                      </div>
                    </TableCell>
                    <TableCell>{payment.reference || "-"}</TableCell>
                    <TableCell className="max-w-32 truncate">{payment.notes || "-"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        {/* No Payments Message */}
        {invoice.paymentHistory.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <DollarSign className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No payments recorded yet</p>
            <p className="text-sm">Add a payment record to track invoice payments</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
