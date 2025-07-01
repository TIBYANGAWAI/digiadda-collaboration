"use client"

import { useState, useEffect } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Play, Pause, Square, Clock, Plus, Calendar, BarChart3 } from "lucide-react"

interface TimeEntry {
  id: string
  project: string
  task: string
  startTime: Date
  endTime?: Date
  duration: number // in minutes
  description: string
  isRunning: boolean
}

const mockTimeEntries: TimeEntry[] = [
  {
    id: "1",
    project: "Website Redesign",
    task: "Homepage Design",
    startTime: new Date(Date.now() - 1000 * 60 * 120),
    endTime: new Date(Date.now() - 1000 * 60 * 60),
    duration: 120,
    description: "Working on hero section layout",
    isRunning: false,
  },
  {
    id: "2",
    project: "Mobile App",
    task: "API Integration",
    startTime: new Date(Date.now() - 1000 * 60 * 90),
    endTime: new Date(Date.now() - 1000 * 60 * 30),
    duration: 90,
    description: "Implementing authentication endpoints",
    isRunning: false,
  },
  {
    id: "3",
    project: "Brand Identity",
    task: "Logo Design",
    startTime: new Date(Date.now() - 1000 * 60 * 45),
    duration: 45,
    description: "Creating logo variations",
    isRunning: true,
  },
]

export default function TimeTrackingPage() {
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>(mockTimeEntries)
  const [activeTimer, setActiveTimer] = useState<string | null>("3")
  const [currentTime, setCurrentTime] = useState(new Date())
  const [isManualEntryOpen, setIsManualEntryOpen] = useState(false)
  const [manualEntry, setManualEntry] = useState({
    project: "",
    task: "",
    duration: "",
    description: "",
    date: new Date().toISOString().split("T")[0],
  })

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours}h ${mins}m`
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  const getCurrentDuration = (entry: TimeEntry) => {
    if (!entry.isRunning) return entry.duration
    const elapsed = Math.floor((currentTime.getTime() - entry.startTime.getTime()) / 1000 / 60)
    return elapsed
  }

  const handleStartTimer = (project: string, task: string) => {
    const newEntry: TimeEntry = {
      id: Date.now().toString(),
      project,
      task,
      startTime: new Date(),
      duration: 0,
      description: "",
      isRunning: true,
    }
    setTimeEntries([newEntry, ...timeEntries])
    setActiveTimer(newEntry.id)
  }

  const handleStopTimer = (entryId: string) => {
    setTimeEntries(
      timeEntries.map((entry) => {
        if (entry.id === entryId && entry.isRunning) {
          const duration = Math.floor((currentTime.getTime() - entry.startTime.getTime()) / 1000 / 60)
          return {
            ...entry,
            endTime: new Date(),
            duration,
            isRunning: false,
          }
        }
        return entry
      }),
    )
    setActiveTimer(null)
  }

  const handleAddManualEntry = () => {
    const newEntry: TimeEntry = {
      id: Date.now().toString(),
      project: manualEntry.project,
      task: manualEntry.task,
      startTime: new Date(manualEntry.date),
      endTime: new Date(manualEntry.date),
      duration: Number.parseInt(manualEntry.duration) || 0,
      description: manualEntry.description,
      isRunning: false,
    }
    setTimeEntries([newEntry, ...timeEntries])
    setManualEntry({
      project: "",
      task: "",
      duration: "",
      description: "",
      date: new Date().toISOString().split("T")[0],
    })
    setIsManualEntryOpen(false)
  }

  const getTotalTimeToday = () => {
    const today = new Date().toDateString()
    return timeEntries
      .filter((entry) => entry.startTime.toDateString() === today)
      .reduce((total, entry) => total + getCurrentDuration(entry), 0)
  }

  const getTotalTimeThisWeek = () => {
    const weekStart = new Date()
    weekStart.setDate(weekStart.getDate() - weekStart.getDay())
    return timeEntries
      .filter((entry) => entry.startTime >= weekStart)
      .reduce((total, entry) => total + getCurrentDuration(entry), 0)
  }

  const getProjectBreakdown = () => {
    const breakdown: { [key: string]: number } = {}
    timeEntries.forEach((entry) => {
      breakdown[entry.project] = (breakdown[entry.project] || 0) + getCurrentDuration(entry)
    })
    return Object.entries(breakdown).map(([project, minutes]) => ({
      project,
      minutes,
      percentage: Math.round((minutes / getTotalTimeThisWeek()) * 100) || 0,
    }))
  }

  const activeEntry = timeEntries.find((entry) => entry.id === activeTimer)

  return (
    <div className="flex-1 flex flex-col">
      <DashboardHeader title="Time Tracking" description="Track time spent on projects and tasks" showSearch={false} />

      <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Today</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatDuration(getTotalTimeToday())}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">This Week</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatDuration(getTotalTimeThisWeek())}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Entries</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{timeEntries.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{new Set(timeEntries.map((e) => e.project)).size}</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Timer Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Active Timer */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-blue-500" />
                  Active Timer
                </CardTitle>
              </CardHeader>
              <CardContent>
                {activeEntry ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-lg">{activeEntry.project}</h3>
                        <p className="text-muted-foreground">{activeEntry.task}</p>
                      </div>
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        Running
                      </Badge>
                    </div>
                    <div className="text-center">
                      <div className="text-4xl font-bold text-blue-600 mb-2">
                        {formatDuration(getCurrentDuration(activeEntry))}
                      </div>
                      <p className="text-sm text-muted-foreground">Started at {formatTime(activeEntry.startTime)}</p>
                    </div>
                    <div className="flex justify-center">
                      <Button onClick={() => handleStopTimer(activeEntry.id)} variant="destructive">
                        <Square className="h-4 w-4 mr-2" />
                        Stop Timer
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-muted-foreground mb-4">No active timer</p>
                    <div className="space-y-2">
                      <Button onClick={() => handleStartTimer("Website Redesign", "Homepage Design")}>
                        <Play className="h-4 w-4 mr-2" />
                        Start Timer
                      </Button>
                      <p className="text-xs text-muted-foreground">Quick start with recent project</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Time Entries */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Recent Time Entries</CardTitle>
                  <Dialog open={isManualEntryOpen} onOpenChange={setIsManualEntryOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Manual Entry
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add Manual Time Entry</DialogTitle>
                        <DialogDescription>Add time that was tracked outside the system.</DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                          <Label htmlFor="manual-project">Project</Label>
                          <Select
                            value={manualEntry.project}
                            onValueChange={(value) => setManualEntry({ ...manualEntry, project: value })}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select project" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Website Redesign">Website Redesign</SelectItem>
                              <SelectItem value="Mobile App">Mobile App</SelectItem>
                              <SelectItem value="Brand Identity">Brand Identity</SelectItem>
                              <SelectItem value="E-commerce Platform">E-commerce Platform</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="manual-task">Task</Label>
                          <Input
                            id="manual-task"
                            value={manualEntry.task}
                            onChange={(e) => setManualEntry({ ...manualEntry, task: e.target.value })}
                            placeholder="Enter task name"
                          />
                        </div>
                        <div className="grid gap-4 md:grid-cols-2">
                          <div className="grid gap-2">
                            <Label htmlFor="manual-duration">Duration (minutes)</Label>
                            <Input
                              id="manual-duration"
                              type="number"
                              value={manualEntry.duration}
                              onChange={(e) => setManualEntry({ ...manualEntry, duration: e.target.value })}
                              placeholder="Enter duration"
                            />
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="manual-date">Date</Label>
                            <Input
                              id="manual-date"
                              type="date"
                              value={manualEntry.date}
                              onChange={(e) => setManualEntry({ ...manualEntry, date: e.target.value })}
                            />
                          </div>
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="manual-description">Description</Label>
                          <Input
                            id="manual-description"
                            value={manualEntry.description}
                            onChange={(e) => setManualEntry({ ...manualEntry, description: e.target.value })}
                            placeholder="Enter description"
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button onClick={handleAddManualEntry}>Add Entry</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {timeEntries.slice(0, 10).map((entry) => (
                    <div key={entry.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium">{entry.project}</h4>
                          <span className="text-sm text-muted-foreground">•</span>
                          <span className="text-sm text-muted-foreground">{entry.task}</span>
                          {entry.isRunning && (
                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                              Running
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{entry.description}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {formatTime(entry.startTime)}
                          {entry.endTime && ` - ${formatTime(entry.endTime)}`}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">{formatDuration(getCurrentDuration(entry))}</div>
                        {entry.isRunning && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleStopTimer(entry.id)}
                            className="mt-2"
                          >
                            <Pause className="h-3 w-3 mr-1" />
                            Stop
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Start</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  className="w-full justify-start"
                  variant="outline"
                  onClick={() => handleStartTimer("Website Redesign", "Homepage Design")}
                  disabled={!!activeTimer}
                >
                  <Play className="h-4 w-4 mr-2" />
                  Website Redesign
                </Button>
                <Button
                  className="w-full justify-start"
                  variant="outline"
                  onClick={() => handleStartTimer("Mobile App", "API Development")}
                  disabled={!!activeTimer}
                >
                  <Play className="h-4 w-4 mr-2" />
                  Mobile App
                </Button>
                <Button
                  className="w-full justify-start"
                  variant="outline"
                  onClick={() => handleStartTimer("Brand Identity", "Logo Design")}
                  disabled={!!activeTimer}
                >
                  <Play className="h-4 w-4 mr-2" />
                  Brand Identity
                </Button>
              </CardContent>
            </Card>

            {/* Project Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle>Project Breakdown</CardTitle>
                <CardDescription>Time distribution this week</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {getProjectBreakdown().map((item) => (
                  <div key={item.project}>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="font-medium">{item.project}</span>
                      <span>{formatDuration(item.minutes)}</span>
                    </div>
                    <Progress value={item.percentage} className="h-2" />
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
