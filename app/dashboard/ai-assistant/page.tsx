"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { DashboardHeader } from "@/components/dashboard-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Bot,
  Send,
  Sparkles,
  FileText,
  Code,
  Mail,
  MessageSquare,
  Lightbulb,
  Zap,
  Copy,
  RefreshCw,
  Wand2,
} from "lucide-react"
import { toast } from "@/components/ui/use-toast"

interface Message {
  id: string
  type: "user" | "assistant"
  content: string
  timestamp: Date
  contentType?: "text" | "code" | "email" | "social"
}

interface ContentTemplate {
  id: string
  name: string
  description: string
  category: string
  icon: any
  prompt: string
}

const contentTemplates: ContentTemplate[] = [
  {
    id: "blog-post",
    name: "Blog Post",
    description: "Create engaging blog posts for your website",
    category: "Content",
    icon: FileText,
    prompt:
      "Write a professional blog post about [TOPIC]. Include an engaging introduction, main points, and a compelling conclusion. Make it SEO-friendly and engaging for readers.",
  },
  {
    id: "social-media",
    name: "Social Media Post",
    description: "Generate social media content for various platforms",
    category: "Social",
    icon: MessageSquare,
    prompt:
      "Create engaging social media posts for [PLATFORM] about [TOPIC]. Include relevant hashtags and call-to-action. Make it engaging and shareable.",
  },
  {
    id: "email-campaign",
    name: "Email Campaign",
    description: "Design email marketing campaigns",
    category: "Marketing",
    icon: Mail,
    prompt:
      "Create a professional email marketing campaign for [PRODUCT/SERVICE]. Include subject line, engaging content, and clear call-to-action. Make it conversion-focused.",
  },
  {
    id: "product-description",
    name: "Product Description",
    description: "Write compelling product descriptions",
    category: "E-commerce",
    icon: Sparkles,
    prompt:
      "Write a compelling product description for [PRODUCT]. Highlight key features, benefits, and unique selling points. Make it persuasive and conversion-focused.",
  },
  {
    id: "code-snippet",
    name: "Code Generation",
    description: "Generate code snippets and solutions",
    category: "Development",
    icon: Code,
    prompt:
      "Generate clean, well-documented code for [FUNCTIONALITY] using [PROGRAMMING LANGUAGE]. Include comments and best practices.",
  },
  {
    id: "creative-brief",
    name: "Creative Brief",
    description: "Create detailed creative briefs for projects",
    category: "Design",
    icon: Lightbulb,
    prompt:
      "Create a comprehensive creative brief for [PROJECT TYPE]. Include objectives, target audience, key messages, visual direction, and deliverables.",
  },
]

const mockConversations = [
  {
    id: "1",
    title: "Website Copy for TechCorp",
    lastMessage: "Here's the updated homepage copy with your revisions...",
    timestamp: new Date("2024-01-15T10:30:00"),
    messageCount: 12,
  },
  {
    id: "2",
    title: "Social Media Campaign Ideas",
    lastMessage: "I've generated 10 creative social media post ideas...",
    timestamp: new Date("2024-01-14T15:45:00"),
    messageCount: 8,
  },
  {
    id: "3",
    title: "Email Newsletter Template",
    lastMessage: "The email template is ready with responsive design...",
    timestamp: new Date("2024-01-13T09:15:00"),
    messageCount: 6,
  },
]

export default function AIAssistantPage() {
  const { user } = useAuth()
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "assistant",
      content: `Hello ${user?.name}! I'm your DigiAdda AI Assistant. I can help you with content creation, copywriting, code generation, creative briefs, and much more. What would you like to work on today?`,
      timestamp: new Date(),
    },
  ])
  const [inputMessage, setInputMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<ContentTemplate | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: inputMessage,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputMessage("")
    setIsLoading(true)

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: "assistant",
        content: generateAIResponse(inputMessage),
        timestamp: new Date(),
        contentType: detectContentType(inputMessage),
      }
      setMessages((prev) => [...prev, aiResponse])
      setIsLoading(false)
    }, 1500)
  }

  const generateAIResponse = (input: string): string => {
    const lowerInput = input.toLowerCase()

    if (lowerInput.includes("blog") || lowerInput.includes("article")) {
      return `# How to Boost Your Digital Presence in 2024

## Introduction
In today's competitive digital landscape, having a strong online presence is crucial for business success. Here are the key strategies that will help you stand out.

## Key Strategies

### 1. Content Marketing Excellence
- Create valuable, relevant content consistently
- Focus on solving your audience's problems
- Use storytelling to connect emotionally

### 2. Social Media Optimization
- Choose platforms where your audience is active
- Maintain consistent branding across channels
- Engage authentically with your community

### 3. SEO Best Practices
- Optimize for user intent, not just keywords
- Focus on page speed and mobile experience
- Build quality backlinks through valuable content

## Conclusion
Building a strong digital presence takes time and consistency, but the results are worth the investment. Start with one strategy and gradually expand your efforts.

Would you like me to expand on any of these points or help you create content for a specific platform?`
    }

    if (lowerInput.includes("social media") || lowerInput.includes("post")) {
      return `🚀 **Social Media Content Package**

**LinkedIn Post:**
"Excited to share our latest project milestone! Our team just delivered an amazing website redesign that increased client conversions by 40%. 

Key takeaways:
✅ User-centered design matters
✅ Performance optimization is crucial  
✅ Collaboration drives results

What's your biggest web design challenge? Let's discuss! 👇

#WebDesign #DigitalAgency #ClientSuccess"

**Instagram Caption:**
"Behind the scenes at DigiAdda! ✨ 

Our creative team is cooking up something special for our amazing clients. From wireframes to final designs, every pixel matters.

What's your favorite part of the creative process? 

#DigitalAgency #CreativeProcess #TeamWork #Design"

**Twitter Thread:**
"🧵 5 Web Design Trends That Actually Convert:

1/ Minimalist layouts with clear CTAs
2/ Mobile-first responsive design  
3/ Fast loading speeds (under 3 seconds)
4/ Accessible color contrasts
5/ Micro-interactions that delight users

Which trend has worked best for your business?"

Would you like me to create content for other platforms or adjust the tone?`
    }

    if (lowerInput.includes("email") || lowerInput.includes("newsletter")) {
      return `📧 **Email Campaign: "Transform Your Digital Presence"**

**Subject Line Options:**
1. "Ready to 10x your online impact? (5-min read)"
2. "The digital strategy that changed everything"
3. "Your competitors don't want you to see this"

**Email Content:**

Hi [First Name],

Are you tired of your website feeling like a ghost town?

You're not alone. 73% of businesses struggle with low online engagement, but here's the thing – it doesn't have to be that way.

**The Problem:**
Most businesses focus on looking good instead of converting visitors into customers.

**The Solution:**
Our proven 3-step Digital Transformation Framework:

🎯 **Step 1: Audit & Strategy**
We analyze your current digital footprint and identify conversion opportunities.

🚀 **Step 2: Design & Optimize**  
Create user-centered designs that guide visitors toward action.

📈 **Step 3: Test & Scale**
Continuously optimize based on real user data.

**Real Results:**
- TechCorp: 150% increase in leads
- StartupXYZ: 200% boost in conversions
- Fashion Co: 300% growth in online sales

Ready to transform your digital presence?

[Book Your Free Strategy Call →]

Best regards,
The DigiAdda Team

P.S. This offer is only available for the next 48 hours!

Would you like me to create variations or adjust the tone?`
    }

    if (lowerInput.includes("code") || lowerInput.includes("javascript") || lowerInput.includes("react")) {
      return `\`\`\`javascript
// React Component: Interactive Contact Form
import React, { useState } from 'react';
import { toast } from 'react-hot-toast';

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success('Message sent successfully!');
        setFormData({ name: '', email: '', message: '' });
      } else {
        throw new Error('Failed to send message');
      }
    } catch (error) {
      toast.error('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Contact Us</h2>
      
      <div className="mb-4">
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
          Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="mb-6">
        <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          required
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isSubmitting ? 'Sending...' : 'Send Message'}
      </button>
    </form>
  );
};

export default ContactForm;
\`\`\`

This React component includes:
- Form state management with hooks
- Input validation and error handling
- Loading states for better UX
- Toast notifications for feedback
- Responsive design with Tailwind CSS
- Accessibility features

Would you like me to add more features or create a different component?`
    }

    // Default response
    return `I'd be happy to help you with that! I can assist with:

🎨 **Content Creation:**
- Blog posts and articles
- Social media content
- Email campaigns
- Product descriptions

💻 **Development:**
- Code snippets and solutions
- Technical documentation
- API integrations

📝 **Business Content:**
- Creative briefs
- Project proposals
- Marketing copy
- Brand messaging

🚀 **Strategy & Planning:**
- Content calendars
- Campaign ideas
- SEO optimization
- User experience improvements

What specific type of content would you like me to help you create? You can also use one of the templates below for quick starts!`
  }

  const detectContentType = (input: string): "text" | "code" | "email" | "social" => {
    const lowerInput = input.toLowerCase()
    if (lowerInput.includes("code") || lowerInput.includes("javascript") || lowerInput.includes("react")) return "code"
    if (lowerInput.includes("email") || lowerInput.includes("newsletter")) return "email"
    if (lowerInput.includes("social") || lowerInput.includes("post")) return "social"
    return "text"
  }

  const handleTemplateSelect = (template: ContentTemplate) => {
    setSelectedTemplate(template)
    setInputMessage(template.prompt)
  }

  const handleCopyContent = (content: string) => {
    navigator.clipboard.writeText(content)
    toast({
      title: "Copied!",
      description: "Content copied to clipboard",
    })
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className="flex-1 flex flex-col">
      <DashboardHeader
        title="DigiAdda AI Assistant"
        description="Your intelligent content creation and development companion"
      />

      <div className="flex-1 p-4 md:p-8 pt-6">
        <Tabs defaultValue="chat" className="h-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="chat">AI Chat</TabsTrigger>
            <TabsTrigger value="templates">Content Templates</TabsTrigger>
            <TabsTrigger value="history">Chat History</TabsTrigger>
          </TabsList>

          {/* Chat Tab */}
          <TabsContent value="chat" className="h-full mt-6">
            <div className="grid gap-6 lg:grid-cols-4 h-full">
              {/* Chat Area */}
              <div className="lg:col-span-3">
                <Card className="modern-card h-full flex flex-col">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg">
                        <Bot className="h-6 w-6 text-purple-600" />
                      </div>
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          DigiAdda AI Assistant
                          <Badge className="bg-green-100 text-green-800">Online</Badge>
                        </CardTitle>
                        <CardDescription>Powered by advanced AI for content creation</CardDescription>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="flex-1 flex flex-col">
                    {/* Messages */}
                    <ScrollArea className="flex-1 pr-4 mb-4">
                      <div className="space-y-4">
                        {messages.map((message) => (
                          <div
                            key={message.id}
                            className={`flex gap-3 ${message.type === "user" ? "justify-end" : "justify-start"}`}
                          >
                            {message.type === "assistant" && (
                              <Avatar className="h-8 w-8">
                                <AvatarFallback className="bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700">
                                  <Bot className="h-4 w-4" />
                                </AvatarFallback>
                              </Avatar>
                            )}
                            <div
                              className={`max-w-[80%] p-3 rounded-lg ${
                                message.type === "user"
                                  ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white"
                                  : "bg-gray-50 border"
                              }`}
                            >
                              <div className="prose prose-sm max-w-none">
                                {message.content.includes("```") ? (
                                  <pre className="bg-gray-900 text-green-400 p-3 rounded text-xs overflow-x-auto">
                                    <code>{message.content.replace(/```\w*\n?|\n?```/g, "")}</code>
                                  </pre>
                                ) : (
                                  <div className="whitespace-pre-wrap">{message.content}</div>
                                )}
                              </div>
                              <div className="flex items-center justify-between mt-2">
                                <span className="text-xs opacity-70">{message.timestamp.toLocaleTimeString()}</span>
                                {message.type === "assistant" && (
                                  <div className="flex gap-1">
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      className="h-6 w-6 p-0"
                                      onClick={() => handleCopyContent(message.content)}
                                    >
                                      <Copy className="h-3 w-3" />
                                    </Button>
                                    <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                                      <RefreshCw className="h-3 w-3" />
                                    </Button>
                                  </div>
                                )}
                              </div>
                            </div>
                            {message.type === "user" && (
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={user?.avatar || "/placeholder.svg"} />
                                <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
                              </Avatar>
                            )}
                          </div>
                        ))}
                        {isLoading && (
                          <div className="flex gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback className="bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700">
                                <Bot className="h-4 w-4" />
                              </AvatarFallback>
                            </Avatar>
                            <div className="bg-gray-50 border p-3 rounded-lg">
                              <div className="flex items-center gap-2">
                                <div className="animate-spin">
                                  <RefreshCw className="h-4 w-4" />
                                </div>
                                <span className="text-sm text-muted-foreground">AI is thinking...</span>
                              </div>
                            </div>
                          </div>
                        )}
                        <div ref={messagesEndRef} />
                      </div>
                    </ScrollArea>

                    {/* Input Area */}
                    <div className="space-y-3">
                      {selectedTemplate && (
                        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <selectedTemplate.icon className="h-4 w-4 text-blue-600" />
                              <span className="text-sm font-medium text-blue-800">
                                Using template: {selectedTemplate.name}
                              </span>
                            </div>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => setSelectedTemplate(null)}
                              className="h-6 w-6 p-0"
                            >
                              ×
                            </Button>
                          </div>
                        </div>
                      )}
                      <div className="flex gap-2">
                        <Textarea
                          value={inputMessage}
                          onChange={(e) => setInputMessage(e.target.value)}
                          onKeyPress={handleKeyPress}
                          placeholder="Ask me anything about content creation, development, or business strategy..."
                          className="flex-1 min-h-[60px] resize-none"
                          disabled={isLoading}
                        />
                        <Button
                          onClick={handleSendMessage}
                          disabled={!inputMessage.trim() || isLoading}
                          className="gradient-button px-4"
                        >
                          <Send className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Quick Actions Sidebar */}
              <div className="space-y-4">
                <Card className="modern-card">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full justify-start"
                      onClick={() => setInputMessage("Create a blog post about digital marketing trends")}
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      Blog Post
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full justify-start"
                      onClick={() => setInputMessage("Generate social media content for LinkedIn")}
                    >
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Social Media
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full justify-start"
                      onClick={() => setInputMessage("Create an email marketing campaign")}
                    >
                      <Mail className="h-4 w-4 mr-2" />
                      Email Campaign
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full justify-start"
                      onClick={() => setInputMessage("Generate React component code")}
                    >
                      <Code className="h-4 w-4 mr-2" />
                      Code Generation
                    </Button>
                  </CardContent>
                </Card>

                <Card className="modern-card">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">AI Capabilities</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-xs text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Sparkles className="h-3 w-3" />
                        Content Creation
                      </div>
                      <div className="flex items-center gap-2">
                        <Code className="h-3 w-3" />
                        Code Generation
                      </div>
                      <div className="flex items-center gap-2">
                        <Lightbulb className="h-3 w-3" />
                        Creative Ideas
                      </div>
                      <div className="flex items-center gap-2">
                        <Zap className="h-3 w-3" />
                        Quick Solutions
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Templates Tab */}
          <TabsContent value="templates" className="mt-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {contentTemplates.map((template) => (
                <Card key={template.id} className="modern-card cursor-pointer hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg">
                        <template.icon className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <CardTitle className="text-sm">{template.name}</CardTitle>
                        <Badge variant="outline" className="text-xs">
                          {template.category}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-3">{template.description}</p>
                    <Button size="sm" className="w-full gradient-button" onClick={() => handleTemplateSelect(template)}>
                      <Wand2 className="h-4 w-4 mr-2" />
                      Use Template
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* History Tab */}
          <TabsContent value="history" className="mt-6">
            <Card className="modern-card">
              <CardHeader>
                <CardTitle>Recent Conversations</CardTitle>
                <CardDescription>Your recent AI assistant conversations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockConversations.map((conversation) => (
                    <div key={conversation.id} className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium text-sm">{conversation.title}</h4>
                          <p className="text-xs text-muted-foreground mt-1">{conversation.lastMessage}</p>
                        </div>
                        <div className="text-right">
                          <Badge variant="outline" className="text-xs">
                            {conversation.messageCount} messages
                          </Badge>
                          <p className="text-xs text-muted-foreground mt-1">
                            {conversation.timestamp.toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
