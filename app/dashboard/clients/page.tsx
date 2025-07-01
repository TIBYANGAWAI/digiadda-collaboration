"use client"

import { useState } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Edit, Trash2, Mail, Phone, MapPin, Building, DollarSign, Calendar, Users } from "lucide-react"
import type { Client } from "@/lib/types"

// Mock clients data
const mockClients: Client[] = [
  {
    id: "client-1",
    name: "John Smith",
    email: "john@techcorp.com",
    role: "client",
    company: "TechCorp Inc.",
    phone: "+1 (555) 123-4567",
    address: "123 Business Ave, Suite 100, New York, NY 10001",
    avatar: "/placeholder.svg?height=40&width=40",
    createdAt: new Date("2023-01-15"),
    taxId: "12-3456789",
  },
  {
    id: "client-2",
    name: "Sarah Johnson",
    email: "sarah@startupxyz.com",
    role: "client",
    company: "StartupXYZ",
    phone: "+1 (555) 987-6543",
    address: "456 Innovation Drive, San Francisco, CA 94102",
    avatar: "/placeholder.svg?height=40&width=40",
    createdAt: new Date("2023-02-20"),
    taxId: "98-7654321",
  },
  {
    id: "client-3",
    name: "Michael Brown",
    email: "michael@fashionco.com",
    role: "client",
    company: "Fashion Co",
    phone: "+1 (555) 456-7890",
    address: "789 Style Street, Los Angeles, CA 90210",
    avatar: "/placeholder.svg?height=40&width=40",
    createdAt: new Date("2023-03-10"),
  },
]

const mockClientStats = {
  totalClients: 28,
  activeProjects: 15,
  totalRevenue: 485000,
  averageProjectValue: 32333,
}

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>(mockClients)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingClient, setEditingClient] = useState<Client | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    phone: "",
    address: "",
    taxId: "",
    password: "", // Add password field
  })

  const handleAddClient = () => {
    const newClient: Client = {
      id: Date.now().toString(),
      name: formData.name,
      email: formData.email,
      role: "client",
      company: formData.company,
      phone: formData.phone,
      address: formData.address,
      taxId: formData.taxId,
      password: formData.password, // Add password field
      createdAt: new Date(),
    }
    setClients([...clients, newClient])
    setFormData({ name: "", email: "", company: "", phone: "", address: "", taxId: "", password: "" })
    setIsAddDialogOpen(false)
  }

  const handleEditClient = () => {
    if (!editingClient) return

    const updatedClients = clients.map((client) =>
      client.id === editingClient.id
        ? {
            ...client,
            name: formData.name,
            email: formData.email,
            company: formData.company,
            phone: formData.phone,
            address: formData.address,
            taxId: formData.taxId,
          }
        : client,
    )
    setClients(updatedClients)
    setEditingClient(null)
    setFormData({ name: "", email: "", company: "", phone: "", address: "", taxId: "" })
  }

  const handleDeleteClient = (id: string) => {
    setClients(clients.filter((client) => client.id !== id))
  }

  const openEditDialog = (client: Client) => {
    setEditingClient(client)
    setFormData({
      name: client.name,
      email: client.email,
      company: client.company,
      phone: client.phone,
      address: client.address || "",
      taxId: client.taxId || "",
    })
  }

  return (
    <div className="flex-1 flex flex-col">
      <DashboardHeader title="Client Management" description="Manage your clients and their information" />

      <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="modern-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Clients</CardTitle>
              <div className="p-2 bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg">
                <Users className="h-4 w-4 text-blue-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold gradient-text">{mockClientStats.totalClients}</div>
              <p className="text-xs text-muted-foreground">+3 new this month</p>
            </CardContent>
          </Card>

          <Card className="modern-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
              <div className="p-2 bg-gradient-to-r from-green-100 to-blue-100 rounded-lg">
                <Calendar className="h-4 w-4 text-green-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold gradient-text">{mockClientStats.activeProjects}</div>
              <p className="text-xs text-muted-foreground">Across all clients</p>
            </CardContent>
          </Card>

          <Card className="modern-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <div className="p-2 bg-gradient-to-r from-yellow-100 to-orange-100 rounded-lg">
                <DollarSign className="h-4 w-4 text-yellow-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold gradient-text">${mockClientStats.totalRevenue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">+15% from last quarter</p>
            </CardContent>
          </Card>

          <Card className="modern-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Project Value</CardTitle>
              <div className="p-2 bg-gradient-to-r from-pink-100 to-purple-100 rounded-lg">
                <DollarSign className="h-4 w-4 text-pink-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold gradient-text">
                ${mockClientStats.averageProjectValue.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">Per project</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="all" className="space-y-6">
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="all">All Clients</TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="inactive">Inactive</TabsTrigger>
            </TabsList>

            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gradient-button">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Client
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Add New Client</DialogTitle>
                  <DialogDescription>Add a new client to your workspace.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Enter full name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="Enter email address"
                      />
                    </div>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="company">Company *</Label>
                      <Input
                        id="company"
                        value={formData.company}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        placeholder="Enter company name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="Enter phone number"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      placeholder="Enter full address"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="taxId">Tax ID</Label>
                    <Input
                      id="taxId"
                      value={formData.taxId}
                      onChange={(e) => setFormData({ ...formData, taxId: e.target.value })}
                      placeholder="Enter tax identification number"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password *</Label>
                    <Input
                      id="password"
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      placeholder="Create password for client login"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button className="gradient-button" onClick={handleAddClient}>
                    Add Client
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <TabsContent value="all" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {clients.map((client) => (
                <Card key={client.id} className="modern-card">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={client.avatar || "/placeholder.svg"} />
                          <AvatarFallback className="bg-gradient-to-r from-pink-100 to-purple-100 text-pink-700">
                            {client.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle className="text-lg">{client.name}</CardTitle>
                          <CardDescription className="flex items-center gap-1">
                            <Building className="h-3 w-3" />
                            {client.company}
                          </CardDescription>
                        </div>
                      </div>
                      <div className="flex space-x-1">
                        <Button variant="ghost" size="sm" onClick={() => openEditDialog(client)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDeleteClient(client.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2 text-sm">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span className="truncate">{client.email}</span>
                      </div>
                      {client.phone && (
                        <div className="flex items-center space-x-2 text-sm">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <span>{client.phone}</span>
                        </div>
                      )}
                      {client.address && (
                        <div className="flex items-start space-x-2 text-sm">
                          <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                          <span className="text-muted-foreground">{client.address}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t">
                      <Badge variant="outline" className="text-xs">
                        Client since {client.createdAt.getFullYear()}
                      </Badge>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          View Projects
                        </Button>
                        <Button size="sm" className="gradient-button">
                          Contact
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Edit Dialog */}
        <Dialog open={!!editingClient} onOpenChange={() => setEditingClient(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Client</DialogTitle>
              <DialogDescription>Update client information.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="edit-name">Full Name</Label>
                  <Input
                    id="edit-name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-email">Email</Label>
                  <Input
                    id="edit-email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="edit-company">Company</Label>
                  <Input
                    id="edit-company"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-phone">Phone</Label>
                  <Input
                    id="edit-phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-address">Address</Label>
                <Input
                  id="edit-address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-taxId">Tax ID</Label>
                <Input
                  id="edit-taxId"
                  value={formData.taxId}
                  onChange={(e) => setFormData({ ...formData, taxId: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditingClient(null)}>
                Cancel
              </Button>
              <Button className="gradient-button" onClick={handleEditClient}>
                Update Client
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
