"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Download, PrinterIcon as Print, ArrowLeft } from "lucide-react"
import Link from "next/link"
import type { Invoice } from "@/lib/types"
import { format } from "date-fns"
import Image from "next/image"

// Mock invoice data (in real app, fetch from API)
const mockInvoice: Invoice = {
  id: "1",
  invoiceNumber: "INV-2024-001",
  clientId: "client-1",
  projectId: "1",
  items: [
    {
      id: "1",
      description: "Website Design & Development",
      quantity: 1,
      rate: 5000,
      amount: 5000,
      taxable: true,
      category: "Development",
    },
    {
      id: "2",
      description: "SEO Optimization",
      quantity: 3,
      rate: 500,
      amount: 1500,
      taxable: true,
      category: "Marketing",
    },
  ],
  subtotal: 6500,
  tax: 650,
  taxRate: 10,
  total: 7150,
  status: "sent",
  dueDate: new Date("2024-02-15"),
  issueDate: new Date("2024-01-15"),
  createdAt: new Date("2024-01-15"),
  currency: "USD",
  terms: "Payment due within 30 days of invoice date. Late payments may incur additional fees.",
  paymentHistory: [],
}

const mockClient = {
  name: "TechCorp Inc.",
  email: "billing@techcorp.com",
  address: "123 Business Ave\nSuite 100\nNew York, NY 10001",
  phone: "+1 (555) 123-4567",
}

const companyInfo = {
  name: "DigiAdda",
  tagline: "Digital Marketing Agency",
  address: "456 Creative Street\nSuite 200\nSan Francisco, CA 94102",
  phone: "+1 (555) 987-6543",
  email: "hello@digiadda.com",
  website: "www.digiadda.com",
}

export default function InvoicePDFPage() {
  const params = useParams()
  const [invoice, setInvoice] = useState<Invoice | null>(null)

  useEffect(() => {
    // In real app, fetch invoice by ID
    setInvoice(mockInvoice)
  }, [params.id])

  const handleDownloadPDF = () => {
    // In a real application, you would use a library like jsPDF or Puppeteer
    // to generate and download the PDF
    window.print()
  }

  const handlePrint = () => {
    window.print()
  }

  if (!invoice) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with actions */}
      <div className="bg-white border-b px-4 py-3 print:hidden">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Button variant="ghost" asChild>
            <Link href="/dashboard/invoices">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Invoices
            </Link>
          </Button>

          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={handlePrint}>
              <Print className="h-4 w-4 mr-2" />
              Print
            </Button>
            <Button onClick={handleDownloadPDF}>
              <Download className="h-4 w-4 mr-2" />
              Download PDF
            </Button>
          </div>
        </div>
      </div>

      {/* Invoice Content */}
      <div className="max-w-4xl mx-auto p-8 print:p-0">
        <Card className="print:shadow-none print:border-none">
          <CardContent className="p-8 print:p-8">
            {/* Header */}
            <div className="flex items-start justify-between mb-8">
              <div className="flex items-center gap-4">
                <Image
                  src="/digiadda-logo.png"
                  alt="DigiAdda Logo"
                  width={150}
                  height={50}
                  className="object-contain"
                />
              </div>

              <div className="text-right">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">INVOICE</h1>
                <p className="text-lg font-semibold text-gray-700">{invoice.invoiceNumber}</p>
              </div>
            </div>

            {/* Company and Client Info */}
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">From:</h3>
                <div className="text-gray-700">
                  <p className="font-semibold">{companyInfo.name}</p>
                  <p className="text-sm text-gray-600 mb-2">{companyInfo.tagline}</p>
                  <div className="text-sm space-y-1">
                    {companyInfo.address.split("\n").map((line, index) => (
                      <p key={index}>{line}</p>
                    ))}
                    <p>{companyInfo.phone}</p>
                    <p>{companyInfo.email}</p>
                    <p>{companyInfo.website}</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Bill To:</h3>
                <div className="text-gray-700">
                  <p className="font-semibold">{mockClient.name}</p>
                  <div className="text-sm space-y-1 mt-2">
                    {mockClient.address.split("\n").map((line, index) => (
                      <p key={index}>{line}</p>
                    ))}
                    <p>{mockClient.phone}</p>
                    <p>{mockClient.email}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Invoice Details */}
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="font-medium">Invoice Date:</span>
                    <span>{format(invoice.issueDate, "MMMM d, yyyy")}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Due Date:</span>
                    <span>{format(invoice.dueDate, "MMMM d, yyyy")}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Status:</span>
                    <span className="capitalize font-semibold">{invoice.status}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Invoice Items */}
            <div className="mb-8">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-gray-300">
                    <th className="text-left py-3 font-semibold">Description</th>
                    <th className="text-center py-3 font-semibold w-20">Qty</th>
                    <th className="text-right py-3 font-semibold w-24">Rate</th>
                    <th className="text-right py-3 font-semibold w-24">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {invoice.items.map((item, index) => (
                    <tr key={item.id} className="border-b border-gray-200">
                      <td className="py-4">
                        <div>
                          <p className="font-medium">{item.description}</p>
                          {item.category && <p className="text-sm text-gray-600">{item.category}</p>}
                        </div>
                      </td>
                      <td className="text-center py-4">{item.quantity}</td>
                      <td className="text-right py-4">${item.rate.toLocaleString()}</td>
                      <td className="text-right py-4 font-medium">${item.amount.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Totals */}
            <div className="flex justify-end mb-8">
              <div className="w-64">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>${invoice.subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax ({invoice.taxRate}%):</span>
                    <span>${invoice.tax.toLocaleString()}</span>
                  </div>
                  <div className="border-t pt-2">
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total:</span>
                      <span>
                        ${invoice.total.toLocaleString()} {invoice.currency}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Status */}
            {invoice.status === "paid" && invoice.paidAt && (
              <div className="mb-8 p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="font-semibold text-green-800">Payment Received</span>
                </div>
                <p className="text-sm text-green-700 mt-1">
                  Paid on {format(invoice.paidAt, "MMMM d, yyyy")}
                  {invoice.paymentMethod && ` via ${invoice.paymentMethod}`}
                  {invoice.paymentReference && ` (Ref: ${invoice.paymentReference})`}
                </p>
              </div>
            )}

            {/* Terms and Conditions */}
            {invoice.terms && (
              <div className="border-t pt-6">
                <h4 className="font-semibold text-gray-900 mb-2">Terms & Conditions</h4>
                <p className="text-sm text-gray-700 leading-relaxed">{invoice.terms}</p>
              </div>
            )}

            {/* Footer */}
            <div className="border-t pt-6 mt-8 text-center text-sm text-gray-600">
              <p>Thank you for your business!</p>
              <p className="mt-2">
                For questions about this invoice, please contact us at {companyInfo.email} or {companyInfo.phone}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          body {
            background: white !important;
          }
          .print\\:hidden {
            display: none !important;
          }
          .print\\:p-0 {
            padding: 0 !important;
          }
          .print\\:p-8 {
            padding: 2rem !important;
          }
          .print\\:shadow-none {
            box-shadow: none !important;
          }
          .print\\:border-none {
            border: none !important;
          }
        }
      `}</style>
    </div>
  )
}
