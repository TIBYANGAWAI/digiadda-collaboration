"use client"

import { useAuth } from "@/contexts/auth-context"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  LayoutDashboard,
  Users,
  UserCheck,
  FolderOpen,
  CheckSquare,
  MessageSquare,
  FileImage,
  BarChart3,
  LogOut,
  ChevronUp,
  Crown,
  User,
  Calendar,
  Receipt,
  Settings,
  Bot,
  Shield,
  Clock,
  FileText,
  Upload,
  DollarSign,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"

const adminNavItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Team Members",
    url: "/dashboard/team",
    icon: Users,
  },
  {
    title: "Clients",
    url: "/dashboard/clients",
    icon: UserCheck,
  },
  {
    title: "Projects",
    url: "/dashboard/projects",
    icon: FolderOpen,
  },
  {
    title: "Tasks",
    url: "/dashboard/tasks",
    icon: CheckSquare,
  },
  {
    title: "Calendar",
    url: "/dashboard/calendar",
    icon: Calendar,
  },
  {
    title: "Assets",
    url: "/dashboard/assets",
    icon: FileImage,
  },
  {
    title: "Chat",
    url: "/dashboard/chat",
    icon: MessageSquare,
  },
  {
    title: "Invoices",
    url: "/dashboard/invoices",
    icon: Receipt,
  },
  {
    title: "AI Assistant",
    url: "/dashboard/ai-assistant",
    icon: Bot,
  },
  {
    title: "Time Tracking",
    url: "/dashboard/time-tracking",
    icon: Clock,
  },
  {
    title: "Analytics",
    url: "/dashboard/analytics",
    icon: BarChart3,
  },
  {
    title: "Permissions",
    url: "/dashboard/permissions",
    icon: Shield,
  },
  {
    title: "Settings",
    url: "/dashboard/settings",
    icon: Settings,
  },
]

const teamNavItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Team Member Panel",
    url: "/dashboard/team-member",
    icon: CheckSquare,
  },
  {
    title: "My Tasks",
    url: "/dashboard/my-tasks",
    icon: CheckSquare,
  },
  {
    title: "Projects",
    url: "/dashboard/projects",
    icon: FolderOpen,
  },
  {
    title: "Calendar",
    url: "/dashboard/calendar",
    icon: Calendar,
  },
  {
    title: "Time Tracking",
    url: "/dashboard/time-tracking",
    icon: Clock,
  },
  {
    title: "AI Assistant",
    url: "/dashboard/ai-assistant",
    icon: Bot,
  },
  {
    title: "Chat",
    url: "/dashboard/chat",
    icon: MessageSquare,
  },
]

// Streamlined client navigation - only essential features
const clientNavItems = [
  {
    title: "Dashboard",
    url: "/dashboard/client",
    icon: LayoutDashboard,
  },
  {
    title: "Tasks & Updates",
    url: "/dashboard/client#tasks",
    icon: CheckSquare,
  },
  {
    title: "Files & Media",
    url: "/dashboard/client#files",
    icon: Upload,
  },
  {
    title: "Messages",
    url: "/dashboard/client#chat",
    icon: MessageSquare,
  },
  {
    title: "Submit Brief",
    url: "/dashboard/client#brief",
    icon: FileText,
  },
  {
    title: "Invoices",
    url: "/dashboard/client#invoices",
    icon: DollarSign,
  },
]

export function AppSidebar() {
  const { user, logout } = useAuth()

  if (!user) return null

  const getNavItems = () => {
    switch (user.role) {
      case "super_admin":
      case "sub_admin":
        return adminNavItems
      case "client":
        return clientNavItems
      default:
        return teamNavItems
    }
  }

  const navItems = getNavItems()

  const getRoleIcon = () => {
    switch (user.role) {
      case "super_admin":
        return <Crown className="h-4 w-4 text-yellow-500" />
      case "sub_admin":
        return <Shield className="h-4 w-4 text-blue-500" />
      case "client":
        return <UserCheck className="h-4 w-4 text-green-500" />
      default:
        return <User className="h-4 w-4" />
    }
  }

  const getRoleLabel = () => {
    switch (user.role) {
      case "super_admin":
        return "Super Admin Panel"
      case "sub_admin":
        return "Sub Admin Panel"
      case "client":
        return "Client Portal"
      default:
        return "Team Member Panel"
    }
  }

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-3 px-2 py-3">
          <Image
            src="/digiadda-logo.png"
            alt="DigiAdda Logo"
            width={120}
            height={40}
            className="object-contain"
            priority
          />
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="flex items-center gap-2">
            {getRoleIcon()}
            {getRoleLabel()}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton className="w-full">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={user.avatar || "/placeholder.svg"} />
                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col items-start">
                    <span className="text-sm font-medium">{user.name}</span>
                    <span className="text-xs text-muted-foreground capitalize">{user.role.replace("_", " ")}</span>
                  </div>
                  <ChevronUp className="ml-auto h-4 w-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="top" className="w-[--radix-popper-anchor-width]">
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/profile">
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={logout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
