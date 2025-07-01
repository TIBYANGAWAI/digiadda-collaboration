"use client"

import { useState } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Shield, Users, Settings, Lock, Crown, UserCheck, Edit, Save, AlertTriangle } from "lucide-react"
import type { Permission, User as UserType } from "@/lib/types"

// Mock permissions data
const mockPermissions: Permission[] = [
  { id: "1", name: "manage_team", description: "Add, edit, and remove team members", module: "team" },
  { id: "2", name: "manage_clients", description: "Add, edit, and remove clients", module: "clients" },
  { id: "3", name: "manage_projects", description: "Create, edit, and delete projects", module: "projects" },
  { id: "4", name: "manage_tasks", description: "Create, assign, and manage tasks", module: "tasks" },
  { id: "5", name: "manage_invoices", description: "Create, edit, and send invoices", module: "invoices" },
  { id: "6", name: "view_analytics", description: "Access analytics and reports", module: "analytics" },
  { id: "7", name: "manage_assets", description: "Upload, organize, and delete assets", module: "assets" },
  { id: "8", name: "manage_permissions", description: "Modify user roles and permissions", module: "permissions" },
  { id: "9", name: "view_financial", description: "Access financial reports and data", module: "financial" },
  { id: "10", name: "manage_settings", description: "Modify system settings", module: "settings" },
]

const mockUsers: UserType[] = [
  {
    id: "1",
    name: "Admin User",
    email: "admin@digiadda.com",
    role: "super_admin",
    avatar: "/placeholder.svg?height=40&width=40",
    createdAt: new Date(),
    permissions: mockPermissions,
  },
  {
    id: "2",
    name: "John Developer",
    email: "john@digiadda.com",
    role: "team_member",
    avatar: "/placeholder.svg?height=40&width=40",
    createdAt: new Date(),
    permissions: mockPermissions.filter((p) => ["manage_tasks", "manage_assets", "view_analytics"].includes(p.name)),
  },
  {
    id: "3",
    name: "Sarah Designer",
    email: "sarah@digiadda.com",
    role: "team_member",
    avatar: "/placeholder.svg?height=40&width=40",
    createdAt: new Date(),
    permissions: mockPermissions.filter((p) => ["manage_tasks", "manage_assets", "manage_projects"].includes(p.name)),
  },
  {
    id: "4",
    name: "Mike Manager",
    email: "mike@digiadda.com",
    role: "sub_admin",
    avatar: "/placeholder.svg?height=40&width=40",
    createdAt: new Date(),
    permissions: mockPermissions.filter((p) => !["manage_permissions", "manage_settings"].includes(p.name)),
  },
]

const roleTemplates = {
  super_admin: {
    name: "Super Admin",
    description: "Full access to all features and settings",
    permissions: mockPermissions.map((p) => p.id),
    color: "bg-yellow-100 text-yellow-800",
    icon: Crown,
  },
  sub_admin: {
    name: "Sub Admin",
    description: "Administrative access with some restrictions",
    permissions: mockPermissions
      .filter((p) => !["manage_permissions", "manage_settings"].includes(p.name))
      .map((p) => p.id),
    color: "bg-blue-100 text-blue-800",
    icon: Shield,
  },
  team_member: {
    name: "Team Member",
    description: "Standard team member access",
    permissions: mockPermissions
      .filter((p) => ["manage_tasks", "manage_assets", "view_analytics"].includes(p.name))
      .map((p) => p.id),
    color: "bg-green-100 text-green-800",
    icon: UserCheck,
  },
  client: {
    name: "Client",
    description: "Limited access for client users",
    permissions: mockPermissions.filter((p) => ["view_analytics"].includes(p.name)).map((p) => p.id),
    color: "bg-purple-100 text-purple-800",
    icon: UserCheck,
  },
}

export default function PermissionsPage() {
  const [users, setUsers] = useState<UserType[]>(mockUsers)
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null)
  const [editingPermissions, setEditingPermissions] = useState<string[]>([])
  const [isEditing, setIsEditing] = useState(false)

  const handleEditPermissions = (user: UserType) => {
    setSelectedUser(user)
    setEditingPermissions(user.permissions?.map((p) => p.id) || [])
    setIsEditing(true)
  }

  const handleSavePermissions = () => {
    if (!selectedUser) return

    const updatedUsers = users.map((user) => {
      if (user.id === selectedUser.id) {
        return {
          ...user,
          permissions: mockPermissions.filter((p) => editingPermissions.includes(p.id)),
        }
      }
      return user
    })

    setUsers(updatedUsers)
    setIsEditing(false)
    setSelectedUser(null)
    setEditingPermissions([])
  }

  const togglePermission = (permissionId: string) => {
    if (editingPermissions.includes(permissionId)) {
      setEditingPermissions(editingPermissions.filter((id) => id !== permissionId))
    } else {
      setEditingPermissions([...editingPermissions, permissionId])
    }
  }

  const applyRoleTemplate = (role: keyof typeof roleTemplates) => {
    setEditingPermissions(roleTemplates[role].permissions)
  }

  const getRoleIcon = (role: string) => {
    const template = roleTemplates[role as keyof typeof roleTemplates]
    if (template) {
      const IconComponent = template.icon
      return <IconComponent className="h-4 w-4" />
    }
    return <UserCheck className="h-4 w-4" />
  }

  const getRoleColor = (role: string) => {
    const template = roleTemplates[role as keyof typeof roleTemplates]
    return template?.color || "bg-gray-100 text-gray-800"
  }

  const getPermissionsByModule = () => {
    const modules: Record<string, Permission[]> = {}
    mockPermissions.forEach((permission) => {
      if (!modules[permission.module]) {
        modules[permission.module] = []
      }
      modules[permission.module].push(permission)
    })
    return modules
  }

  return (
    <div className="flex-1 flex flex-col">
      <DashboardHeader
        title="Permissions & Roles"
        description="Manage user roles and permissions across your workspace"
      />

      <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="modern-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <div className="p-2 bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg">
                <Users className="h-4 w-4 text-blue-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold gradient-text">{users.length}</div>
              <p className="text-xs text-muted-foreground">Active users</p>
            </CardContent>
          </Card>

          <Card className="modern-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Admins</CardTitle>
              <div className="p-2 bg-gradient-to-r from-yellow-100 to-orange-100 rounded-lg">
                <Crown className="h-4 w-4 text-yellow-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold gradient-text">
                {users.filter((u) => u.role === "super_admin" || u.role === "sub_admin").length}
              </div>
              <p className="text-xs text-muted-foreground">Administrative users</p>
            </CardContent>
          </Card>

          <Card className="modern-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Permissions</CardTitle>
              <div className="p-2 bg-gradient-to-r from-green-100 to-blue-100 rounded-lg">
                <Shield className="h-4 w-4 text-green-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold gradient-text">{mockPermissions.length}</div>
              <p className="text-xs text-muted-foreground">Available permissions</p>
            </CardContent>
          </Card>

          <Card className="modern-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Modules</CardTitle>
              <div className="p-2 bg-gradient-to-r from-pink-100 to-purple-100 rounded-lg">
                <Settings className="h-4 w-4 text-pink-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold gradient-text">{Object.keys(getPermissionsByModule()).length}</div>
              <p className="text-xs text-muted-foreground">System modules</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="users" className="space-y-6">
          <TabsList>
            <TabsTrigger value="users">User Permissions</TabsTrigger>
            <TabsTrigger value="roles">Role Templates</TabsTrigger>
            <TabsTrigger value="modules">Permission Modules</TabsTrigger>
          </TabsList>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {users.map((user) => (
                <Card key={user.id} className="modern-card">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={user.avatar || "/placeholder.svg"} />
                          <AvatarFallback className="bg-gradient-to-r from-pink-100 to-purple-100 text-pink-700">
                            {user.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle className="text-lg">{user.name}</CardTitle>
                          <CardDescription>{user.email}</CardDescription>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => handleEditPermissions(user)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Role:</span>
                      <Badge className={getRoleColor(user.role)}>
                        <div className="flex items-center gap-1">
                          {getRoleIcon(user.role)}
                          {roleTemplates[user.role as keyof typeof roleTemplates]?.name || user.role}
                        </div>
                      </Badge>
                    </div>

                    <div>
                      <span className="text-sm font-medium">Permissions:</span>
                      <div className="mt-2 space-y-1">
                        {user.permissions?.slice(0, 3).map((permission) => (
                          <div key={permission.id} className="flex items-center gap-2 text-xs">
                            <div className="w-2 h-2 bg-green-500 rounded-full" />
                            <span>{permission.description}</span>
                          </div>
                        ))}
                        {user.permissions && user.permissions.length > 3 && (
                          <p className="text-xs text-muted-foreground">
                            +{user.permissions.length - 3} more permissions
                          </p>
                        )}
                      </div>
                    </div>

                    <Button className="w-full gradient-button" size="sm" onClick={() => handleEditPermissions(user)}>
                      Manage Permissions
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Role Templates Tab */}
          <TabsContent value="roles" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              {Object.entries(roleTemplates).map(([key, template]) => (
                <Card key={key} className="modern-card">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gradient-to-r from-pink-100 to-purple-100 rounded-lg">
                        <template.icon className="h-5 w-5 text-pink-600" />
                      </div>
                      <div>
                        <CardTitle>{template.name}</CardTitle>
                        <CardDescription>{template.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <span className="text-sm font-medium">Permissions ({template.permissions.length}):</span>
                      <div className="mt-2 space-y-1">
                        {mockPermissions
                          .filter((p) => template.permissions.includes(p.id))
                          .slice(0, 4)
                          .map((permission) => (
                            <div key={permission.id} className="flex items-center gap-2 text-xs">
                              <div className="w-2 h-2 bg-green-500 rounded-full" />
                              <span>{permission.description}</span>
                            </div>
                          ))}
                        {template.permissions.length > 4 && (
                          <p className="text-xs text-muted-foreground">
                            +{template.permissions.length - 4} more permissions
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t">
                      <span className="text-sm text-muted-foreground">
                        {users.filter((u) => u.role === key).length} users
                      </span>
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Permission Modules Tab */}
          <TabsContent value="modules" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {Object.entries(getPermissionsByModule()).map(([module, permissions]) => (
                <Card key={module} className="modern-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 capitalize">
                      <Settings className="h-5 w-5 text-pink-500" />
                      {module}
                    </CardTitle>
                    <CardDescription>{permissions.length} permissions</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {permissions.map((permission) => (
                      <div key={permission.id} className="flex items-start gap-3 p-2 border rounded-lg">
                        <div className="p-1 bg-green-100 rounded">
                          <Lock className="h-3 w-3 text-green-600" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">{permission.name.replace("_", " ")}</p>
                          <p className="text-xs text-muted-foreground">{permission.description}</p>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Edit Permissions Modal */}
        {isEditing && selectedUser && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <Card className="w-full max-w-4xl max-h-[80vh] overflow-hidden">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-pink-500" />
                  Edit Permissions - {selectedUser.name}
                </CardTitle>
                <CardDescription>Manage permissions for {selectedUser.email}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Role Templates */}
                <div>
                  <Label className="text-sm font-medium">Quick Apply Role Template:</Label>
                  <div className="flex gap-2 mt-2">
                    {Object.entries(roleTemplates).map(([key, template]) => (
                      <Button
                        key={key}
                        variant="outline"
                        size="sm"
                        onClick={() => applyRoleTemplate(key as keyof typeof roleTemplates)}
                      >
                        <template.icon className="h-3 w-3 mr-1" />
                        {template.name}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Permissions by Module */}
                <div className="space-y-4 max-h-96 overflow-y-auto custom-scrollbar">
                  {Object.entries(getPermissionsByModule()).map(([module, permissions]) => (
                    <div key={module} className="space-y-3">
                      <h4 className="font-medium capitalize flex items-center gap-2">
                        <Settings className="h-4 w-4 text-pink-500" />
                        {module} Module
                      </h4>
                      <div className="grid gap-2 md:grid-cols-2">
                        {permissions.map((permission) => (
                          <div key={permission.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                            <Switch
                              checked={editingPermissions.includes(permission.id)}
                              onCheckedChange={() => togglePermission(permission.id)}
                            />
                            <div className="flex-1">
                              <p className="text-sm font-medium">{permission.name.replace("_", " ")}</p>
                              <p className="text-xs text-muted-foreground">{permission.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Warning */}
                <div className="flex items-start gap-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium text-yellow-800">Permission Changes</p>
                    <p className="text-yellow-700">
                      Changes to permissions will take effect immediately. Users may need to refresh their browser to
                      see updated access.
                    </p>
                  </div>
                </div>
              </CardContent>
              <div className="flex items-center justify-between p-6 border-t">
                <div className="text-sm text-muted-foreground">
                  {editingPermissions.length} of {mockPermissions.length} permissions selected
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setIsEditing(false)}>
                    Cancel
                  </Button>
                  <Button className="gradient-button" onClick={handleSavePermissions}>
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
