"use client"

import { DashboardHeader } from "@/components/dashboard-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart3, TrendingUp, Users, DollarSign, FolderOpen, Target, Award, AlertCircle } from "lucide-react"

export default function AnalyticsPage() {
  const revenueData = {
    thisMonth: 45000,
    lastMonth: 38000,
    growth: 18.4,
    target: 50000,
  }

  const projectData = {
    total: 24,
    active: 8,
    completed: 14,
    overdue: 2,
    onTime: 85,
  }

  const teamData = {
    totalMembers: 12,
    activeToday: 10,
    productivity: 87,
    satisfaction: 9.2,
    avgHoursPerDay: 7.5,
  }

  const clientData = {
    total: 18,
    active: 12,
    satisfaction: 4.6,
    retention: 94,
    newThisMonth: 3,
  }

  return (
    <div className="flex-1 flex flex-col">
      <DashboardHeader
        title="Analytics"
        description="Comprehensive insights into your business performance"
        showSearch={false}
      />

      <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
        {/* Overview Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${revenueData.thisMonth.toLocaleString()}</div>
              <div className="flex items-center text-xs text-muted-foreground">
                <TrendingUp className="h-3 w-3 text-green-600 mr-1" />
                <span className="text-green-600">+{revenueData.growth}%</span>
                <span className="ml-1">from last month</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
              <FolderOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{projectData.active}</div>
              <div className="flex items-center text-xs text-muted-foreground">
                <Target className="h-3 w-3 text-blue-600 mr-1" />
                <span className="text-blue-600">{projectData.onTime}%</span>
                <span className="ml-1">on time</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Team Productivity</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{teamData.productivity}%</div>
              <div className="flex items-center text-xs text-muted-foreground">
                <Award className="h-3 w-3 text-purple-600 mr-1" />
                <span className="text-purple-600">Excellent</span>
                <span className="ml-1">performance</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Client Satisfaction</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{clientData.satisfaction}/5.0</div>
              <div className="flex items-center text-xs text-muted-foreground">
                <TrendingUp className="h-3 w-3 text-green-600 mr-1" />
                <span className="text-green-600">{clientData.retention}%</span>
                <span className="ml-1">retention rate</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Analytics */}
        <Tabs defaultValue="revenue" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="revenue">Revenue</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="team">Team</TabsTrigger>
            <TabsTrigger value="clients">Clients</TabsTrigger>
          </TabsList>

          {/* Revenue Analytics */}
          <TabsContent value="revenue" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Revenue Overview</CardTitle>
                  <CardDescription>Monthly revenue performance and targets</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">This Month</span>
                      <span className="text-lg font-bold">${revenueData.thisMonth.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Target</span>
                      <span className="text-sm">${revenueData.target.toLocaleString()}</span>
                    </div>
                    <Progress value={(revenueData.thisMonth / revenueData.target) * 100} className="h-2" />
                    <p className="text-xs text-muted-foreground">
                      {Math.round((revenueData.thisMonth / revenueData.target) * 100)}% of monthly target achieved
                    </p>
                  </div>

                  <div className="pt-4 border-t">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Growth Rate</span>
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        +{revenueData.growth}%
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Compared to last month (${revenueData.lastMonth.toLocaleString()})
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Revenue Breakdown</CardTitle>
                  <CardDescription>Revenue sources and distribution</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { source: "Web Development", amount: 18000, percentage: 40 },
                    { source: "Mobile Apps", amount: 13500, percentage: 30 },
                    { source: "Design Services", amount: 9000, percentage: 20 },
                    { source: "Consulting", amount: 4500, percentage: 10 },
                  ].map((item) => (
                    <div key={item.source} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{item.source}</span>
                        <span className="text-sm">${item.amount.toLocaleString()}</span>
                      </div>
                      <Progress value={item.percentage} className="h-2" />
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Projects Analytics */}
          <TabsContent value="projects" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Project Status</CardTitle>
                  <CardDescription>Current project distribution and health</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { status: "Active", count: projectData.active, color: "bg-blue-500", percentage: 33 },
                    { status: "Completed", count: projectData.completed, color: "bg-green-500", percentage: 58 },
                    { status: "Overdue", count: projectData.overdue, color: "bg-red-500", percentage: 8 },
                  ].map((item) => (
                    <div key={item.status} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${item.color}`} />
                          <span className="text-sm font-medium">{item.status}</span>
                        </div>
                        <span className="text-sm">{item.count} projects</span>
                      </div>
                      <Progress value={item.percentage} className="h-2" />
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Project Performance</CardTitle>
                  <CardDescription>Delivery metrics and timeline adherence</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">On-Time Delivery</span>
                      <span className="text-lg font-bold">{projectData.onTime}%</span>
                    </div>
                    <Progress value={projectData.onTime} className="h-2" />
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{projectData.completed}</div>
                      <p className="text-xs text-muted-foreground">Completed</p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-red-600">{projectData.overdue}</div>
                      <p className="text-xs text-muted-foreground">Overdue</p>
                    </div>
                  </div>

                  {projectData.overdue > 0 && (
                    <div className="flex items-center gap-2 p-3 bg-red-50 rounded-lg">
                      <AlertCircle className="h-4 w-4 text-red-600" />
                      <span className="text-sm text-red-700">
                        {projectData.overdue} project{projectData.overdue > 1 ? "s" : ""} need immediate attention
                      </span>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Team Analytics */}
          <TabsContent value="team" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Team Performance</CardTitle>
                  <CardDescription>Productivity and engagement metrics</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Overall Productivity</span>
                      <span className="text-lg font-bold">{teamData.productivity}%</span>
                    </div>
                    <Progress value={teamData.productivity} className="h-2" />
                    <p className="text-xs text-muted-foreground">Above industry average (75%)</p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Team Satisfaction</span>
                      <span className="text-lg font-bold">{teamData.satisfaction}/10</span>
                    </div>
                    <Progress value={teamData.satisfaction * 10} className="h-2" />
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{teamData.activeToday}</div>
                      <p className="text-xs text-muted-foreground">Active Today</p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">{teamData.avgHoursPerDay}h</div>
                      <p className="text-xs text-muted-foreground">Avg Hours/Day</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Top Performers</CardTitle>
                  <CardDescription>Team members with outstanding performance</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { name: "Sarah Johnson", role: "UI/UX Designer", score: 95, tasks: 12 },
                    { name: "Mike Chen", role: "Full Stack Developer", score: 92, tasks: 15 },
                    { name: "Emily Davis", role: "Project Manager", score: 89, tasks: 8 },
                    { name: "Alex Rodriguez", role: "Frontend Developer", score: 87, tasks: 11 },
                  ].map((member) => (
                    <div key={member.name} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{member.name}</p>
                        <p className="text-xs text-muted-foreground">{member.role}</p>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                            {member.score}%
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">{member.tasks} tasks completed</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Clients Analytics */}
          <TabsContent value="clients" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Client Metrics</CardTitle>
                  <CardDescription>Client satisfaction and retention insights</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Client Satisfaction</span>
                      <span className="text-lg font-bold">{clientData.satisfaction}/5.0</span>
                    </div>
                    <Progress value={(clientData.satisfaction / 5) * 100} className="h-2" />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Retention Rate</span>
                      <span className="text-lg font-bold">{clientData.retention}%</span>
                    </div>
                    <Progress value={clientData.retention} className="h-2" />
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{clientData.active}</div>
                      <p className="text-xs text-muted-foreground">Active Clients</p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{clientData.newThisMonth}</div>
                      <p className="text-xs text-muted-foreground">New This Month</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Client Health Score</CardTitle>
                  <CardDescription>Risk assessment and relationship status</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { name: "TechCorp", health: 95, status: "Excellent", risk: "Low" },
                    { name: "Fashion Co", health: 88, status: "Good", risk: "Low" },
                    { name: "StartupXYZ", health: 72, status: "Fair", risk: "Medium" },
                    { name: "RetailCorp", health: 65, status: "At Risk", risk: "High" },
                  ].map((client) => (
                    <div key={client.name} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{client.name}</p>
                        <p className="text-xs text-muted-foreground">Health: {client.health}%</p>
                      </div>
                      <div className="text-right">
                        <Badge
                          variant="outline"
                          className={
                            client.risk === "Low"
                              ? "bg-green-50 text-green-700 border-green-200"
                              : client.risk === "Medium"
                                ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                                : "bg-red-50 text-red-700 border-red-200"
                          }
                        >
                          {client.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
