"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Send, Paperclip, Smile, Phone, Video, MoreVertical, Search, MessageSquare } from "lucide-react"
import type { ChatMessage } from "@/lib/types"
import { formatDistanceToNow } from "date-fns"

// Mock chat data
const mockContacts = [
  {
    id: "1",
    name: "Sarah Designer",
    avatar: "/placeholder.svg?height=40&width=40",
    role: "team_member",
    status: "online",
    lastSeen: new Date(),
    unreadCount: 3,
  },
  {
    id: "2",
    name: "John Developer",
    avatar: "/placeholder.svg?height=40&width=40",
    role: "team_member",
    status: "online",
    lastSeen: new Date(),
    unreadCount: 0,
  },
  {
    id: "3",
    name: "TechCorp Client",
    avatar: "/placeholder.svg?height=40&width=40",
    role: "client",
    status: "away",
    lastSeen: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    unreadCount: 1,
  },
  {
    id: "4",
    name: "Mike Manager",
    avatar: "/placeholder.svg?height=40&width=40",
    role: "team_member",
    status: "offline",
    lastSeen: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    unreadCount: 0,
  },
  {
    id: "5",
    name: "Emma Creative",
    avatar: "/placeholder.svg?height=40&width=40",
    role: "team_member",
    status: "online",
    lastSeen: new Date(),
    unreadCount: 0,
  },
]

const mockMessages: ChatMessage[] = [
  {
    id: "1",
    content: "Hey! I've finished the homepage design. Can you take a look?",
    senderId: "1",
    receiverId: "current-user",
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
    read: false,
    type: "text",
  },
  {
    id: "2",
    content: "I'll review it right now. Thanks for the quick turnaround.",
    senderId: "current-user",
    receiverId: "1",
    timestamp: new Date(Date.now() - 1000 * 60 * 25),
    read: true,
    type: "text",
  },
  {
    id: "3",
    content: "I've attached the latest mockups for your review.",
    senderId: "1",
    receiverId: "current-user",
    timestamp: new Date(Date.now() - 1000 * 60 * 20),
    read: false,
    type: "file",
    attachments: ["homepage_mockup_v3.fig"],
  },
  {
    id: "4",
    content: "Perfect! The design looks amazing. I love the new color scheme.",
    senderId: "current-user",
    receiverId: "1",
    timestamp: new Date(Date.now() - 1000 * 60 * 15),
    read: true,
    type: "text",
  },
  {
    id: "5",
    content: "Thank you! Should I proceed with the mobile version?",
    senderId: "1",
    receiverId: "current-user",
    timestamp: new Date(Date.now() - 1000 * 60 * 10),
    read: false,
    type: "text",
  },
]

export default function ChatPage() {
  const [selectedContact, setSelectedContact] = useState(mockContacts[0])
  const [messages, setMessages] = useState<ChatMessage[]>(mockMessages)
  const [newMessage, setNewMessage] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = () => {
    if (!newMessage.trim()) return

    const message: ChatMessage = {
      id: Date.now().toString(),
      content: newMessage,
      senderId: "current-user",
      receiverId: selectedContact.id,
      timestamp: new Date(),
      read: false,
      type: "text",
    }

    setMessages([...messages, message])
    setNewMessage("")
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "bg-green-500"
      case "away":
        return "bg-yellow-500"
      case "offline":
        return "bg-gray-400"
      default:
        return "bg-gray-400"
    }
  }

  const getStatusText = (status: string, lastSeen: Date) => {
    switch (status) {
      case "online":
        return "Online"
      case "away":
        return "Away"
      case "offline":
        return `Last seen ${formatDistanceToNow(lastSeen, { addSuffix: true })}`
      default:
        return "Unknown"
    }
  }

  const filteredContacts = mockContacts.filter((contact) =>
    contact.name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const currentMessages = messages.filter(
    (msg) =>
      (msg.senderId === selectedContact.id && msg.receiverId === "current-user") ||
      (msg.senderId === "current-user" && msg.receiverId === selectedContact.id),
  )

  return (
    <div className="flex-1 flex flex-col">
      <DashboardHeader
        title="Team Chat"
        description="Communicate with your team and clients in real-time"
        showSearch={false}
      />

      <div className="flex-1 p-4 md:p-8 pt-6">
        <div className="grid gap-6 lg:grid-cols-4 h-[calc(100vh-200px)]">
          {/* Contacts Sidebar */}
          <Card className="modern-card lg:col-span-1">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-pink-500" />
                Conversations
              </CardTitle>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search contacts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[500px] custom-scrollbar">
                <div className="space-y-1 p-3">
                  {filteredContacts.map((contact) => (
                    <div
                      key={contact.id}
                      className={`p-3 rounded-lg cursor-pointer transition-colors ${
                        selectedContact.id === contact.id
                          ? "bg-gradient-to-r from-pink-50 to-purple-50 border border-pink-200"
                          : "hover:bg-gray-50"
                      }`}
                      onClick={() => setSelectedContact(contact)}
                    >
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={contact.avatar || "/placeholder.svg"} />
                            <AvatarFallback className="bg-gradient-to-r from-pink-100 to-purple-100 text-pink-700">
                              {contact.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div
                            className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${getStatusColor(contact.status)}`}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="font-medium text-sm truncate">{contact.name}</p>
                            {contact.unreadCount > 0 && (
                              <Badge className="bg-pink-500 text-white text-xs h-5 w-5 rounded-full p-0 flex items-center justify-center">
                                {contact.unreadCount}
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-1">
                            <Badge variant="outline" className="text-xs capitalize">
                              {contact.role.replace("_", " ")}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {getStatusText(contact.status, contact.lastSeen)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Chat Area */}
          <Card className="modern-card lg:col-span-3 flex flex-col">
            {/* Chat Header */}
            <CardHeader className="pb-3 border-b">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={selectedContact.avatar || "/placeholder.svg"} />
                      <AvatarFallback className="bg-gradient-to-r from-pink-100 to-purple-100 text-pink-700">
                        {selectedContact.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div
                      className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${getStatusColor(selectedContact.status)}`}
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold">{selectedContact.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {getStatusText(selectedContact.status, selectedContact.lastSeen)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm">
                    <Phone className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Video className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>

            {/* Messages */}
            <CardContent className="flex-1 p-0">
              <ScrollArea className="h-[400px] custom-scrollbar">
                <div className="p-4 space-y-4">
                  {currentMessages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.senderId === "current-user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                          message.senderId === "current-user"
                            ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white"
                            : "bg-gray-100 text-gray-900"
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                        {message.attachments && message.attachments.length > 0 && (
                          <div className="mt-2 space-y-1">
                            {message.attachments.map((attachment, index) => (
                              <div key={index} className="flex items-center gap-2 p-2 bg-white/20 rounded-lg">
                                <Paperclip className="h-3 w-3" />
                                <span className="text-xs">{attachment}</span>
                              </div>
                            ))}
                          </div>
                        )}
                        <p
                          className={`text-xs mt-1 ${
                            message.senderId === "current-user" ? "text-white/70" : "text-gray-500"
                          }`}
                        >
                          {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </p>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>
            </CardContent>

            {/* Message Input */}
            <div className="p-4 border-t">
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm">
                  <Paperclip className="h-4 w-4" />
                </Button>
                <div className="flex-1 relative">
                  <Input
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="pr-12"
                  />
                  <Button variant="ghost" size="sm" className="absolute right-2 top-1/2 transform -translate-y-1/2">
                    <Smile className="h-4 w-4" />
                  </Button>
                </div>
                <Button className="gradient-button" size="sm" onClick={handleSendMessage} disabled={!newMessage.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
