"use client"

import { useState } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, dateFnsLocalizer } from "react-big-calendar"
import { format, parse, startOfWeek, getDay } from "date-fns"
import { enUS } from "date-fns/locale"
import "react-big-calendar/lib/css/react-big-calendar.css"
import type { CalendarEvent } from "@/lib/types"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Clock, Users } from "lucide-react"

const locales = {
  "en-US": enUS,
}

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
})

// Mock calendar events
const mockEvents: CalendarEvent[] = [
  {
    id: "1",
    title: "Design Review Meeting",
    description: "Review homepage designs with client",
    startDate: new Date(2024, 0, 15, 10, 0),
    endDate: new Date(2024, 0, 15, 11, 0),
    type: "meeting",
    attendees: ["john@digiadda.com", "sarah@digiadda.com"],
    projectId: "1",
  },
  {
    id: "2",
    title: "Website Launch Deadline",
    description: "Final deadline for website project",
    startDate: new Date(2024, 0, 20, 23, 59),
    endDate: new Date(2024, 0, 20, 23, 59),
    type: "deadline",
    projectId: "1",
  },
  {
    id: "3",
    title: "Complete API Documentation",
    description: "Finish writing API documentation",
    startDate: new Date(2024, 0, 18, 9, 0),
    endDate: new Date(2024, 0, 18, 17, 0),
    type: "task",
    taskId: "3",
  },
]

export default function CalendarPage() {
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null)
  const [view, setView] = useState<"month" | "week" | "day">("month")

  const eventStyleGetter = (event: CalendarEvent) => {
    let backgroundColor = "#3174ad"

    switch (event.type) {
      case "task":
        backgroundColor = "#10b981"
        break
      case "meeting":
        backgroundColor = "#f59e0b"
        break
      case "deadline":
        backgroundColor = "#ef4444"
        break
      case "reminder":
        backgroundColor = "#8b5cf6"
        break
    }

    return {
      style: {
        backgroundColor,
        borderRadius: "4px",
        opacity: 0.8,
        color: "white",
        border: "0px",
        display: "block",
      },
    }
  }

  const handleSelectEvent = (event: CalendarEvent) => {
    setSelectedEvent(event)
  }

  const getEventTypeIcon = (type: string) => {
    switch (type) {
      case "task":
        return "📋"
      case "meeting":
        return "👥"
      case "deadline":
        return "⏰"
      case "reminder":
        return "🔔"
      default:
        return "📅"
    }
  }

  return (
    <div className="flex-1 flex flex-col">
      <DashboardHeader title="Calendar" description="Manage your tasks, meetings, and deadlines" />

      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant={view === "month" ? "default" : "outline"} size="sm" onClick={() => setView("month")}>
              Month
            </Button>
            <Button variant={view === "week" ? "default" : "outline"} size="sm" onClick={() => setView("week")}>
              Week
            </Button>
            <Button variant={view === "day" ? "default" : "outline"} size="sm" onClick={() => setView("day")}>
              Day
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded"></div>
                <span>Tasks</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-yellow-500 rounded"></div>
                <span>Meetings</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded"></div>
                <span>Deadlines</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-purple-500 rounded"></div>
                <span>Reminders</span>
              </div>
            </div>
          </div>
        </div>

        <Card>
          <CardContent className="p-6">
            <div style={{ height: "600px" }}>
              <Calendar
                localizer={localizer}
                events={mockEvents.map((event) => ({
                  ...event,
                  start: event.startDate,
                  end: event.endDate,
                }))}
                startAccessor="start"
                endAccessor="end"
                view={view}
                onView={setView}
                onSelectEvent={handleSelectEvent}
                eventPropGetter={eventStyleGetter}
                popup
                showMultiDayTimes
                step={30}
                timeslots={2}
              />
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Events */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Events</CardTitle>
              <CardDescription>Your next scheduled events</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {mockEvents
                .filter((event) => event.startDate > new Date())
                .sort((a, b) => a.startDate.getTime() - b.startDate.getTime())
                .slice(0, 5)
                .map((event) => (
                  <div key={event.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <span className="text-lg">{getEventTypeIcon(event.type)}</span>
                      <div>
                        <p className="font-medium">{event.title}</p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          <span>{format(event.startDate, "MMM d, h:mm a")}</span>
                        </div>
                      </div>
                    </div>
                    <Badge variant="outline" className="capitalize">
                      {event.type}
                    </Badge>
                  </div>
                ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Today's Schedule</CardTitle>
              <CardDescription>Events scheduled for today</CardDescription>
            </CardHeader>
            <CardContent>
              {mockEvents.filter((event) => format(event.startDate, "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd"))
                .length === 0 ? (
                <p className="text-muted-foreground text-center py-8">No events scheduled for today</p>
              ) : (
                <div className="space-y-4">
                  {mockEvents
                    .filter((event) => format(event.startDate, "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd"))
                    .map((event) => (
                      <div key={event.id} className="flex items-center gap-3 p-3 border rounded-lg">
                        <span className="text-lg">{getEventTypeIcon(event.type)}</span>
                        <div className="flex-1">
                          <p className="font-medium">{event.title}</p>
                          <p className="text-sm text-muted-foreground">
                            {format(event.startDate, "h:mm a")} - {format(event.endDate, "h:mm a")}
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Event Details Dialog */}
        <Dialog open={!!selectedEvent} onOpenChange={() => setSelectedEvent(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <span className="text-lg">{selectedEvent && getEventTypeIcon(selectedEvent.type)}</span>
                {selectedEvent?.title}
              </DialogTitle>
            </DialogHeader>
            {selectedEvent && (
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Description</h4>
                  <p className="text-muted-foreground">{selectedEvent.description || "No description provided"}</p>
                </div>

                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span className="text-sm">
                    {format(selectedEvent.startDate, "MMM d, yyyy h:mm a")} - {format(selectedEvent.endDate, "h:mm a")}
                  </span>
                </div>

                {selectedEvent.attendees && selectedEvent.attendees.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Users className="h-4 w-4" />
                      <span className="text-sm font-medium">Attendees</span>
                    </div>
                    <div className="space-y-1">
                      {selectedEvent.attendees.map((attendee, index) => (
                        <p key={index} className="text-sm text-muted-foreground">
                          {attendee}
                        </p>
                      ))}
                    </div>
                  </div>
                )}

                <Badge variant="outline" className="capitalize">
                  {selectedEvent.type}
                </Badge>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
