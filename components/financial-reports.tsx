"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart,
} from "recharts"
import { TrendingUp, TrendingDown, DollarSign, Users, FileText, Download, Target } from "lucide-react"

// Mock financial data
const monthlyRevenue = [
  { month: "Jan", revenue: 45000, expenses: 12000, profit: 33000 },
  { month: "Feb", revenue: 52000, expenses: 15000, profit: 37000 },
  { month: "Mar", revenue: 48000, expenses: 13000, profit: 35000 },
  { month: "Apr", revenue: 61000, expenses: 18000, profit: 43000 },
  { month: "May", revenue: 55000, expenses: 16000, profit: 39000 },
  { month: "Jun", revenue: 67000, expenses: 20000, profit: 47000 },
]

const clientRevenue = [
  { name: "TechCorp", value: 125000, percentage: 35 },
  { name: "StartupXYZ", value: 89000, percentage: 25 },
  { name: "Fashion Co", value: 67000, percentage: 19 },
  { name: "HealthTech", value: 45000, percentage: 13 },
  { name: "Others", value: 28000, percentage: 8 },
]

const projectTypes = [
  { name: "Web Development", value: 145000, count: 12 },
  { name: "Mobile Apps", value: 98000, count: 8 },
  { name: "Branding", value: 76000, count: 15 },
  { name: "SEO/Marketing", value: 54000, count: 20 },
  { name: "Consulting", value: 32000, count: 6 },
]

const paymentMethods = [
  { method: "Bank Transfer", amount: 189000, percentage: 45 },
  { method: "Credit Card", amount: 126000, percentage: 30 },
  { method: "PayPal", amount: 84000, percentage: 20 },
  { method: "Stripe", value: 21000, percentage: 5 },
]

const COLORS = ["#ec4899", "#8b5cf6", "#06b6d4", "#10b981", "#f59e0b", "#ef4444"]

interface FinancialMetric {
  title: string
  value: string
  change: number
  icon: React.ElementType
  color: string
}

const financialMetrics: FinancialMetric[] = [
  {
    title: "Total Revenue",
    value: "$354,000",
    change: 12.5,
    icon: DollarSign,
    color: "text-green-600",
  },
  {
    title: "Outstanding Invoices",
    value: "$45,200",
    change: -8.2,
    icon: FileText,
    color: "text-orange-600",
  },
  {
    title: "Active Clients",
    value: "28",
    change: 15.3,
    icon: Users,
    color: "text-blue-600",
  },
  {
    title: "Average Project Value",
    value: "$12,600",
    change: 7.8,
    icon: Target,
    color: "text-purple-600",
  },
]

export function FinancialReports() {
  const [selectedPeriod, setSelectedPeriod] = useState("6months")
  const [selectedCurrency, setSelectedCurrency] = useState("USD")

  const exportReport = (type: string) => {
    console.log(`Exporting ${type} report...`)
    // In a real app, this would generate and download the report
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold gradient-text">Financial Reports</h2>
          <p className="text-muted-foreground">Comprehensive financial analytics and insights</p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1month">Last Month</SelectItem>
              <SelectItem value="3months">Last 3 Months</SelectItem>
              <SelectItem value="6months">Last 6 Months</SelectItem>
              <SelectItem value="1year">Last Year</SelectItem>
            </SelectContent>
          </Select>
          <Select value={selectedCurrency} onValueChange={setSelectedCurrency}>
            <SelectTrigger className="w-24">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="USD">USD</SelectItem>
              <SelectItem value="EUR">EUR</SelectItem>
              <SelectItem value="GBP">GBP</SelectItem>
            </SelectContent>
          </Select>
          <Button className="gradient-button">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {financialMetrics.map((metric, index) => (
          <Card key={index} className="modern-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
              <metric.icon className={`h-4 w-4 ${metric.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metric.value}</div>
              <div className="flex items-center text-xs text-muted-foreground">
                {metric.change > 0 ? (
                  <TrendingUp className="h-3 w-3 text-green-600 mr-1" />
                ) : (
                  <TrendingDown className="h-3 w-3 text-red-600 mr-1" />
                )}
                <span className={metric.change > 0 ? "text-green-600" : "text-red-600"}>
                  {Math.abs(metric.change)}%
                </span>
                <span className="ml-1">from last period</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="clients">Clients</TabsTrigger>
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="modern-card">
              <CardHeader>
                <CardTitle>Revenue vs Profit Trend</CardTitle>
                <CardDescription>Monthly revenue and profit comparison</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={monthlyRevenue}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, ""]} />
                    <Area type="monotone" dataKey="revenue" stackId="1" stroke="#ec4899" fill="url(#revenueGradient)" />
                    <Area type="monotone" dataKey="profit" stackId="2" stroke="#8b5cf6" fill="url(#profitGradient)" />
                    <defs>
                      <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ec4899" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#ec4899" stopOpacity={0.1} />
                      </linearGradient>
                      <linearGradient id="profitGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.1} />
                      </linearGradient>
                    </defs>
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="modern-card">
              <CardHeader>
                <CardTitle>Top Clients by Revenue</CardTitle>
                <CardDescription>Revenue distribution by client</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={clientRevenue}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={120}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {clientRevenue.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, "Revenue"]} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="mt-4 space-y-2">
                  {clientRevenue.map((client, index) => (
                    <div key={client.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: COLORS[index % COLORS.length] }}
                        />
                        <span className="text-sm">{client.name}</span>
                      </div>
                      <div className="text-sm font-medium">${client.value.toLocaleString()}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Stats */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card className="modern-card">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Cash Flow</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Inflow</span>
                    <span className="font-medium text-green-600">+$89,400</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Outflow</span>
                    <span className="font-medium text-red-600">-$23,100</span>
                  </div>
                  <div className="border-t pt-2">
                    <div className="flex justify-between">
                      <span className="font-medium">Net Cash Flow</span>
                      <span className="font-bold text-green-600">+$66,300</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="modern-card">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Outstanding</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Overdue</span>
                    <span className="font-medium text-red-600">$12,400</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Due Soon</span>
                    <span className="font-medium text-orange-600">$32,800</span>
                  </div>
                  <div className="border-t pt-2">
                    <div className="flex justify-between">
                      <span className="font-medium">Total Outstanding</span>
                      <span className="font-bold">$45,200</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="modern-card">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Profit Margin</span>
                    <span className="font-medium">73.2%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Collection Rate</span>
                    <span className="font-medium">94.8%</span>
                  </div>
                  <div className="border-t pt-2">
                    <div className="flex justify-between">
                      <span className="font-medium">Growth Rate</span>
                      <span className="font-bold text-green-600">+12.5%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Revenue Tab */}
        <TabsContent value="revenue" className="space-y-6">
          <Card className="modern-card">
            <CardHeader>
              <CardTitle>Monthly Revenue Breakdown</CardTitle>
              <CardDescription>Detailed revenue analysis by month</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={monthlyRevenue}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, ""]} />
                  <Bar dataKey="revenue" fill="url(#barGradient)" radius={[4, 4, 0, 0]} />
                  <defs>
                    <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ec4899" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.8} />
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Other tabs would be implemented similarly */}
      </Tabs>
    </div>
  )
}
