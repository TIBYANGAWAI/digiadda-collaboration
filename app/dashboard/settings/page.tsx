"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { toast } from "@/hooks/use-toast"
import {
  Settings,
  User,
  Bell,
  Shield,
  Palette,
  Database,
  Mail,
  Download,
  Upload,
  Trash2,
  Save,
  Eye,
  EyeOff,
  Key,
  Smartphone,
  Monitor,
  Moon,
  Sun,
  Volume2,
  VolumeX,
  CheckCircle,
  AlertCircle,
} from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { supportedCurrencies } from "@/lib/currency"

interface CompanySettings {
  name: string
  logo: string
  address: string
  phone: string
  email: string
  website: string
  taxId: string
  currency: string
  timezone: string
  dateFormat: string
  language: string
}

interface NotificationSettings {
  emailNotifications: boolean
  pushNotifications: boolean
  smsNotifications: boolean
  taskReminders: boolean
  projectUpdates: boolean
  invoiceAlerts: boolean
  teamMessages: boolean
  clientMessages: boolean
  systemUpdates: boolean
  marketingEmails: boolean
}

interface SecuritySettings {
  twoFactorAuth: boolean
  sessionTimeout: number
  passwordExpiry: number
  loginNotifications: boolean
  deviceTracking: boolean
  ipWhitelist: string[]
}

interface AppearanceSettings {
  theme: "light" | "dark" | "system"
  primaryColor: string
  secondaryColor: string
  fontSize: "small" | "medium" | "large"
  compactMode: boolean
  animations: boolean
  soundEffects: boolean
}

interface FormErrors {
  [key: string]: string
}

export default function SettingsPage() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState("profile")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})
  const [successMessage, setSuccessMessage] = useState("")

  // Profile Settings
  const [profileData, setProfileData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: "",
    bio: "",
    location: "",
    website: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  // Company Settings
  const [companySettings, setCompanySettings] = useState<CompanySettings>({
    name: "DigiAdda",
    logo: "/digiadda-logo.png",
    address: "123 Business Street, Suite 100, San Francisco, CA 94102",
    phone: "+1 (555) 123-4567",
    email: "hello@digiadda.com",
    website: "https://digiadda.com",
    taxId: "12-3456789",
    currency: "USD",
    timezone: "America/Los_Angeles",
    dateFormat: "MM/DD/YYYY",
    language: "en",
  })

  // Notification Settings
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    taskReminders: true,
    projectUpdates: true,
    invoiceAlerts: true,
    teamMessages: true,
    clientMessages: true,
    systemUpdates: true,
    marketingEmails: false,
  })

  // Security Settings
  const [securitySettings, setSecuritySettings] = useState<SecuritySettings>({
    twoFactorAuth: false,
    sessionTimeout: 30,
    passwordExpiry: 90,
    loginNotifications: true,
    deviceTracking: true,
    ipWhitelist: [],
  })

  // Appearance Settings
  const [appearanceSettings, setAppearanceSettings] = useState<AppearanceSettings>({
    theme: "light",
    primaryColor: "#ec4899",
    secondaryColor: "#8b5cf6",
    fontSize: "medium",
    compactMode: false,
    animations: true,
    soundEffects: true,
  })

  // Load settings from localStorage on component mount
  useEffect(() => {
    const loadSettings = () => {
      try {
        const savedProfile = localStorage.getItem("digiadda_profile_settings")
        if (savedProfile) {
          setProfileData({ ...profileData, ...JSON.parse(savedProfile) })
        }

        const savedCompany = localStorage.getItem("digiadda_company_settings")
        if (savedCompany) {
          setCompanySettings(JSON.parse(savedCompany))
        }

        const savedNotifications = localStorage.getItem("digiadda_notification_settings")
        if (savedNotifications) {
          setNotificationSettings(JSON.parse(savedNotifications))
        }

        const savedSecurity = localStorage.getItem("digiadda_security_settings")
        if (savedSecurity) {
          setSecuritySettings(JSON.parse(savedSecurity))
        }

        const savedAppearance = localStorage.getItem("digiadda_appearance_settings")
        if (savedAppearance) {
          const appearance = JSON.parse(savedAppearance)
          setAppearanceSettings(appearance)
          applyTheme(appearance.theme)
          applyFontSize(appearance.fontSize)
        }
      } catch (error) {
        console.error("Error loading settings:", error)
      }
    }

    loadSettings()
  }, [])

  // Apply theme changes immediately
  const applyTheme = (theme: string) => {
    const root = document.documentElement
    if (theme === "dark") {
      root.classList.add("dark")
    } else if (theme === "light") {
      root.classList.remove("dark")
    } else {
      // System theme
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
      if (prefersDark) {
        root.classList.add("dark")
      } else {
        root.classList.remove("dark")
      }
    }
  }

  // Apply font size changes
  const applyFontSize = (fontSize: string) => {
    const root = document.documentElement
    root.classList.remove("text-sm", "text-base", "text-lg")
    switch (fontSize) {
      case "small":
        root.classList.add("text-sm")
        break
      case "large":
        root.classList.add("text-lg")
        break
      default:
        root.classList.add("text-base")
    }
  }

  // Validation functions
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const validatePassword = (password: string) => {
    return password.length >= 8 && /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)
  }

  const validatePhone = (phone: string) => {
    const phoneRegex = /^\+?[\d\s\-$$$$]+$/
    return phone === "" || phoneRegex.test(phone)
  }

  const validateWebsite = (website: string) => {
    if (website === "") return true
    try {
      new URL(website)
      return true
    } catch {
      return false
    }
  }

  // Clear messages after 5 seconds
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(""), 5000)
      return () => clearTimeout(timer)
    }
  }, [successMessage])

  const handleAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrors({ ...errors, avatar: "File size must be less than 5MB" })
        return
      }

      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        // In a real app, you'd upload to a server
        localStorage.setItem("digiadda_user_avatar", result)
        toast({
          title: "Avatar Updated",
          description: "Your profile picture has been updated successfully.",
        })
        setErrors({ ...errors, avatar: "" })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleCompanyLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrors({ ...errors, logo: "File size must be less than 5MB" })
        return
      }

      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setCompanySettings({ ...companySettings, logo: result })
        toast({
          title: "Logo Updated",
          description: "Company logo has been updated successfully.",
        })
        setErrors({ ...errors, logo: "" })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSaveProfile = async () => {
    setIsLoading(true)
    setErrors({})

    // Validation
    const newErrors: FormErrors = {}

    if (!profileData.name.trim()) {
      newErrors.name = "Name is required"
    }

    if (!profileData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!validateEmail(profileData.email)) {
      newErrors.email = "Please enter a valid email address"
    }

    if (profileData.phone && !validatePhone(profileData.phone)) {
      newErrors.phone = "Please enter a valid phone number"
    }

    if (profileData.website && !validateWebsite(profileData.website)) {
      newErrors.website = "Please enter a valid website URL"
    }

    // Password validation if changing password
    if (profileData.newPassword) {
      if (!profileData.currentPassword) {
        newErrors.currentPassword = "Current password is required"
      }
      if (!validatePassword(profileData.newPassword)) {
        newErrors.newPassword = "Password must be at least 8 characters with uppercase, lowercase, and number"
      }
      if (profileData.newPassword !== profileData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match"
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      setIsLoading(false)
      return
    }

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Save to localStorage
      const profileToSave = { ...profileData }
      delete profileToSave.currentPassword
      delete profileToSave.newPassword
      delete profileToSave.confirmPassword

      localStorage.setItem("digiadda_profile_settings", JSON.stringify(profileToSave))

      // Clear password fields
      setProfileData({
        ...profileData,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      })

      setSuccessMessage("Profile updated successfully!")
      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully.",
      })
    } catch (error) {
      setErrors({ general: "Error saving profile. Please try again." })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSaveCompany = async () => {
    setIsLoading(true)
    setErrors({})

    // Validation
    const newErrors: FormErrors = {}

    if (!companySettings.name.trim()) {
      newErrors.companyName = "Company name is required"
    }

    if (!companySettings.email.trim()) {
      newErrors.companyEmail = "Company email is required"
    } else if (!validateEmail(companySettings.email)) {
      newErrors.companyEmail = "Please enter a valid email address"
    }

    if (companySettings.website && !validateWebsite(companySettings.website)) {
      newErrors.companyWebsite = "Please enter a valid website URL"
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      setIsLoading(false)
      return
    }

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      localStorage.setItem("digiadda_company_settings", JSON.stringify(companySettings))
      setSuccessMessage("Company settings saved successfully!")
      toast({
        title: "Company Settings Updated",
        description: "Your company settings have been saved successfully.",
      })
    } catch (error) {
      setErrors({ general: "Error saving company settings. Please try again." })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSaveNotifications = async () => {
    setIsLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      localStorage.setItem("digiadda_notification_settings", JSON.stringify(notificationSettings))
      setSuccessMessage("Notification settings saved successfully!")
      toast({
        title: "Notifications Updated",
        description: "Your notification preferences have been saved.",
      })
    } catch (error) {
      setErrors({ general: "Error saving notification settings. Please try again." })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSaveSecurity = async () => {
    setIsLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      localStorage.setItem("digiadda_security_settings", JSON.stringify(securitySettings))
      setSuccessMessage("Security settings saved successfully!")
      toast({
        title: "Security Updated",
        description: "Your security settings have been saved successfully.",
      })
    } catch (error) {
      setErrors({ general: "Error saving security settings. Please try again." })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSaveAppearance = async () => {
    setIsLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      localStorage.setItem("digiadda_appearance_settings", JSON.stringify(appearanceSettings))

      // Apply changes immediately
      applyTheme(appearanceSettings.theme)
      applyFontSize(appearanceSettings.fontSize)

      setSuccessMessage("Appearance settings saved successfully!")
      toast({
        title: "Appearance Updated",
        description: "Your appearance preferences have been applied.",
      })
    } catch (error) {
      setErrors({ general: "Error saving appearance settings. Please try again." })
    } finally {
      setIsLoading(false)
    }
  }

  const handleExportData = () => {
    try {
      const data = {
        profile: profileData,
        company: companySettings,
        notifications: notificationSettings,
        security: securitySettings,
        appearance: appearanceSettings,
        exportDate: new Date().toISOString(),
      }

      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `digiadda_data_export_${new Date().toISOString().split("T")[0]}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      toast({
        title: "Data Exported",
        description: "Your data has been exported successfully.",
      })
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Failed to export data. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleDeleteAccount = () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete your account? This action cannot be undone and will permanently delete all your data.",
    )

    if (confirmed) {
      const doubleConfirmed = window.confirm(
        "This is your final warning. Deleting your account will permanently remove all projects, tasks, files, and settings. Type 'DELETE' to confirm.",
      )

      if (doubleConfirmed) {
        // In a real app, this would call an API to delete the account
        localStorage.clear()
        toast({
          title: "Account Deletion Initiated",
          description: "Your account deletion request has been processed.",
          variant: "destructive",
        })
      }
    }
  }

  // Handle theme change with immediate application
  const handleThemeChange = (theme: "light" | "dark" | "system") => {
    const newAppearance = { ...appearanceSettings, theme }
    setAppearanceSettings(newAppearance)
    applyTheme(theme)
  }

  // Handle font size change with immediate application
  const handleFontSizeChange = (fontSize: "small" | "medium" | "large") => {
    const newAppearance = { ...appearanceSettings, fontSize }
    setAppearanceSettings(newAppearance)
    applyFontSize(fontSize)
  }

  return (
    <div className="flex-1 flex flex-col">
      <DashboardHeader
        title="Settings"
        description="Manage your account, preferences, and workspace settings"
        showSearch={false}
      />

      <div className="flex-1 p-4 md:p-8 pt-6">
        {/* Success Message */}
        {successMessage && (
          <Alert className="mb-6 border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">{successMessage}</AlertDescription>
          </Alert>
        )}

        {/* General Error Message */}
        {errors.general && (
          <Alert className="mb-6 border-red-200 bg-red-50" variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{errors.general}</AlertDescription>
          </Alert>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="company">Company</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="appearance">Appearance</TabsTrigger>
            <TabsTrigger value="data">Data & Privacy</TabsTrigger>
          </TabsList>

          {/* Profile Settings */}
          <TabsContent value="profile" className="space-y-6">
            <Card className="modern-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5 text-pink-500" />
                  Profile Information
                </CardTitle>
                <CardDescription>Update your personal information and profile details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Avatar Section */}
                <div className="flex items-center gap-6">
                  <div className="relative">
                    <Avatar className="h-24 w-24">
                      <AvatarImage src={user?.avatar || "/placeholder.svg"} />
                      <AvatarFallback className="bg-gradient-to-r from-pink-100 to-purple-100 text-pink-700 text-2xl">
                        {user?.name?.charAt(0) || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarUpload}
                      className="hidden"
                      id="avatar-upload"
                    />
                    <label htmlFor="avatar-upload">
                      <Button variant="outline" size="sm" asChild>
                        <span className="cursor-pointer">
                          <Upload className="h-4 w-4 mr-2" />
                          Upload New
                        </span>
                      </Button>
                    </label>
                  </div>
                  <div>
                    <h3 className="font-semibold">Profile Picture</h3>
                    <p className="text-sm text-muted-foreground">
                      Upload a new profile picture. Recommended size: 400x400px, Max: 5MB
                    </p>
                    {errors.avatar && <p className="text-sm text-red-600 mt-1">{errors.avatar}</p>}
                  </div>
                </div>

                <Separator />

                {/* Basic Information */}
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      value={profileData.name}
                      onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                      placeholder="Enter your full name"
                      className={errors.name ? "border-red-500" : ""}
                    />
                    {errors.name && <p className="text-sm text-red-600">{errors.name}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                      placeholder="Enter your email"
                      className={errors.email ? "border-red-500" : ""}
                    />
                    {errors.email && <p className="text-sm text-red-600">{errors.email}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      value={profileData.phone}
                      onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                      placeholder="Enter your phone number"
                      className={errors.phone ? "border-red-500" : ""}
                    />
                    {errors.phone && <p className="text-sm text-red-600">{errors.phone}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={profileData.location}
                      onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                      placeholder="Enter your location"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    value={profileData.bio}
                    onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                    placeholder="Tell us about yourself..."
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    value={profileData.website}
                    onChange={(e) => setProfileData({ ...profileData, website: e.target.value })}
                    placeholder="https://yourwebsite.com"
                    className={errors.website ? "border-red-500" : ""}
                  />
                  {errors.website && <p className="text-sm text-red-600">{errors.website}</p>}
                </div>

                <Separator />

                {/* Password Change */}
                <div className="space-y-4">
                  <h3 className="font-semibold">Change Password</h3>
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword">Current Password</Label>
                      <div className="relative">
                        <Input
                          id="currentPassword"
                          type={showPassword ? "text" : "password"}
                          value={profileData.currentPassword}
                          onChange={(e) => setProfileData({ ...profileData, currentPassword: e.target.value })}
                          placeholder="Enter current password"
                          className={errors.currentPassword ? "border-red-500" : ""}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-2 top-1/2 transform -translate-y-1/2"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                      {errors.currentPassword && <p className="text-sm text-red-600">{errors.currentPassword}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="newPassword">New Password</Label>
                      <Input
                        id="newPassword"
                        type={showPassword ? "text" : "password"}
                        value={profileData.newPassword}
                        onChange={(e) => setProfileData({ ...profileData, newPassword: e.target.value })}
                        placeholder="Enter new password"
                        className={errors.newPassword ? "border-red-500" : ""}
                      />
                      {errors.newPassword && <p className="text-sm text-red-600">{errors.newPassword}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm Password</Label>
                      <Input
                        id="confirmPassword"
                        type={showPassword ? "text" : "password"}
                        value={profileData.confirmPassword}
                        onChange={(e) => setProfileData({ ...profileData, confirmPassword: e.target.value })}
                        placeholder="Confirm new password"
                        className={errors.confirmPassword ? "border-red-500" : ""}
                      />
                      {errors.confirmPassword && <p className="text-sm text-red-600">{errors.confirmPassword}</p>}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Password must be at least 8 characters long and contain uppercase, lowercase, and number.
                  </p>
                </div>

                <div className="flex justify-end">
                  <Button className="gradient-button" onClick={handleSaveProfile} disabled={isLoading}>
                    <Save className="h-4 w-4 mr-2" />
                    {isLoading ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Company Settings */}
          <TabsContent value="company" className="space-y-6">
            <Card className="modern-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5 text-pink-500" />
                  Company Information
                </CardTitle>
                <CardDescription>Manage your company details and branding</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="companyName">Company Name *</Label>
                    <Input
                      id="companyName"
                      value={companySettings.name}
                      onChange={(e) => setCompanySettings({ ...companySettings, name: e.target.value })}
                      placeholder="Enter company name"
                      className={errors.companyName ? "border-red-500" : ""}
                    />
                    {errors.companyName && <p className="text-sm text-red-600">{errors.companyName}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="companyEmail">Company Email *</Label>
                    <Input
                      id="companyEmail"
                      type="email"
                      value={companySettings.email}
                      onChange={(e) => setCompanySettings({ ...companySettings, email: e.target.value })}
                      placeholder="Enter company email"
                      className={errors.companyEmail ? "border-red-500" : ""}
                    />
                    {errors.companyEmail && <p className="text-sm text-red-600">{errors.companyEmail}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="companyPhone">Phone Number</Label>
                    <Input
                      id="companyPhone"
                      value={companySettings.phone}
                      onChange={(e) => setCompanySettings({ ...companySettings, phone: e.target.value })}
                      placeholder="Enter phone number"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="companyWebsite">Website</Label>
                    <Input
                      id="companyWebsite"
                      value={companySettings.website}
                      onChange={(e) => setCompanySettings({ ...companySettings, website: e.target.value })}
                      placeholder="https://yourcompany.com"
                      className={errors.companyWebsite ? "border-red-500" : ""}
                    />
                    {errors.companyWebsite && <p className="text-sm text-red-600">{errors.companyWebsite}</p>}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="companyAddress">Address</Label>
                  <Textarea
                    id="companyAddress"
                    value={companySettings.address}
                    onChange={(e) => setCompanySettings({ ...companySettings, address: e.target.value })}
                    placeholder="Enter company address"
                    rows={2}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="taxId">Tax ID</Label>
                  <Input
                    id="taxId"
                    value={companySettings.taxId}
                    onChange={(e) => setCompanySettings({ ...companySettings, taxId: e.target.value })}
                    placeholder="Enter tax identification number"
                  />
                </div>

                <Separator />

                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="currency">Default Currency</Label>
                    <Select
                      value={companySettings.currency}
                      onValueChange={(value) => setCompanySettings({ ...companySettings, currency: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {supportedCurrencies.map((currency) => (
                          <SelectItem key={currency.code} value={currency.code}>
                            {currency.symbol} {currency.code} - {currency.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="timezone">Timezone</Label>
                    <Select
                      value={companySettings.timezone}
                      onValueChange={(value) => setCompanySettings({ ...companySettings, timezone: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="America/Los_Angeles">Pacific Time (PT)</SelectItem>
                        <SelectItem value="America/Denver">Mountain Time (MT)</SelectItem>
                        <SelectItem value="America/Chicago">Central Time (CT)</SelectItem>
                        <SelectItem value="America/New_York">Eastern Time (ET)</SelectItem>
                        <SelectItem value="Europe/London">London (GMT)</SelectItem>
                        <SelectItem value="Europe/Paris">Paris (CET)</SelectItem>
                        <SelectItem value="Asia/Tokyo">Tokyo (JST)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dateFormat">Date Format</Label>
                    <Select
                      value={companySettings.dateFormat}
                      onValueChange={(value) => setCompanySettings({ ...companySettings, dateFormat: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                        <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                        <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button className="gradient-button" onClick={handleSaveCompany} disabled={isLoading}>
                    <Save className="h-4 w-4 mr-2" />
                    {isLoading ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notification Settings */}
          <TabsContent value="notifications" className="space-y-6">
            <Card className="modern-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5 text-pink-500" />
                  Notification Preferences
                </CardTitle>
                <CardDescription>Choose how you want to be notified about updates</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Notification Channels */}
                <div className="space-y-4">
                  <h3 className="font-semibold">Notification Channels</h3>
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Mail className="h-4 w-4 text-blue-500" />
                        <span className="font-medium">Email</span>
                      </div>
                      <Switch
                        checked={notificationSettings.emailNotifications}
                        onCheckedChange={(checked) =>
                          setNotificationSettings({ ...notificationSettings, emailNotifications: checked })
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Smartphone className="h-4 w-4 text-green-500" />
                        <span className="font-medium">Push</span>
                      </div>
                      <Switch
                        checked={notificationSettings.pushNotifications}
                        onCheckedChange={(checked) =>
                          setNotificationSettings({ ...notificationSettings, pushNotifications: checked })
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Smartphone className="h-4 w-4 text-purple-500" />
                        <span className="font-medium">SMS</span>
                      </div>
                      <Switch
                        checked={notificationSettings.smsNotifications}
                        onCheckedChange={(checked) =>
                          setNotificationSettings({ ...notificationSettings, smsNotifications: checked })
                        }
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Notification Types */}
                <div className="space-y-4">
                  <h3 className="font-semibold">Notification Types</h3>
                  <div className="space-y-3">
                    {[
                      {
                        key: "taskReminders",
                        label: "Task Reminders",
                        description: "Get notified about upcoming task deadlines",
                      },
                      {
                        key: "projectUpdates",
                        label: "Project Updates",
                        description: "Receive updates when projects are modified",
                      },
                      {
                        key: "invoiceAlerts",
                        label: "Invoice Alerts",
                        description: "Get notified about invoice status changes",
                      },
                      {
                        key: "teamMessages",
                        label: "Team Messages",
                        description: "Receive notifications for team chat messages",
                      },
                      {
                        key: "clientMessages",
                        label: "Client Messages",
                        description: "Get notified when clients send messages",
                      },
                      {
                        key: "systemUpdates",
                        label: "System Updates",
                        description: "Receive notifications about system maintenance",
                      },
                      {
                        key: "marketingEmails",
                        label: "Marketing Emails",
                        description: "Receive promotional emails and newsletters",
                      },
                    ].map((item) => (
                      <div key={item.key} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">{item.label}</p>
                          <p className="text-sm text-muted-foreground">{item.description}</p>
                        </div>
                        <Switch
                          checked={notificationSettings[item.key as keyof NotificationSettings] as boolean}
                          onCheckedChange={(checked) =>
                            setNotificationSettings({
                              ...notificationSettings,
                              [item.key]: checked,
                            })
                          }
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button className="gradient-button" onClick={handleSaveNotifications} disabled={isLoading}>
                    <Save className="h-4 w-4 mr-2" />
                    {isLoading ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Settings */}
          <TabsContent value="security" className="space-y-6">
            <Card className="modern-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-pink-500" />
                  Security & Privacy
                </CardTitle>
                <CardDescription>Manage your account security and privacy settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Two-Factor Authentication */}
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Key className="h-5 w-5 text-green-500" />
                    <div>
                      <p className="font-medium">Two-Factor Authentication</p>
                      <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={securitySettings.twoFactorAuth ? "default" : "secondary"}>
                      {securitySettings.twoFactorAuth ? "Enabled" : "Disabled"}
                    </Badge>
                    <Switch
                      checked={securitySettings.twoFactorAuth}
                      onCheckedChange={(checked) =>
                        setSecuritySettings({ ...securitySettings, twoFactorAuth: checked })
                      }
                    />
                  </div>
                </div>

                {/* Session Settings */}
                <div className="space-y-4">
                  <h3 className="font-semibold">Session Management</h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                      <Select
                        value={securitySettings.sessionTimeout.toString()}
                        onValueChange={(value) =>
                          setSecuritySettings({ ...securitySettings, sessionTimeout: Number.parseInt(value) })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="15">15 minutes</SelectItem>
                          <SelectItem value="30">30 minutes</SelectItem>
                          <SelectItem value="60">1 hour</SelectItem>
                          <SelectItem value="120">2 hours</SelectItem>
                          <SelectItem value="480">8 hours</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="passwordExpiry">Password Expiry (days)</Label>
                      <Select
                        value={securitySettings.passwordExpiry.toString()}
                        onValueChange={(value) =>
                          setSecuritySettings({ ...securitySettings, passwordExpiry: Number.parseInt(value) })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="30">30 days</SelectItem>
                          <SelectItem value="60">60 days</SelectItem>
                          <SelectItem value="90">90 days</SelectItem>
                          <SelectItem value="180">180 days</SelectItem>
                          <SelectItem value="365">1 year</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Security Notifications */}
                <div className="space-y-4">
                  <h3 className="font-semibold">Security Notifications</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">Login Notifications</p>
                        <p className="text-sm text-muted-foreground">
                          Get notified when someone logs into your account
                        </p>
                      </div>
                      <Switch
                        checked={securitySettings.loginNotifications}
                        onCheckedChange={(checked) =>
                          setSecuritySettings({ ...securitySettings, loginNotifications: checked })
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">Device Tracking</p>
                        <p className="text-sm text-muted-foreground">
                          Track and manage devices that access your account
                        </p>
                      </div>
                      <Switch
                        checked={securitySettings.deviceTracking}
                        onCheckedChange={(checked) =>
                          setSecuritySettings({ ...securitySettings, deviceTracking: checked })
                        }
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button className="gradient-button" onClick={handleSaveSecurity} disabled={isLoading}>
                    <Save className="h-4 w-4 mr-2" />
                    {isLoading ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Appearance Settings */}
          <TabsContent value="appearance" className="space-y-6">
            <Card className="modern-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="h-5 w-5 text-pink-500" />
                  Appearance & Display
                </CardTitle>
                <CardDescription>Customize the look and feel of your workspace</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Theme Selection */}
                <div className="space-y-4">
                  <h3 className="font-semibold">Theme</h3>
                  <div className="grid gap-3 md:grid-cols-3">
                    {[
                      { value: "light", label: "Light", icon: Sun },
                      { value: "dark", label: "Dark", icon: Moon },
                      { value: "system", label: "System", icon: Monitor },
                    ].map((theme) => (
                      <div
                        key={theme.value}
                        className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                          appearanceSettings.theme === theme.value ? "border-pink-500 bg-pink-50" : "hover:bg-gray-50"
                        }`}
                        onClick={() => handleThemeChange(theme.value as any)}
                      >
                        <div className="flex items-center gap-3">
                          <theme.icon className="h-5 w-5" />
                          <span className="font-medium">{theme.label}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Font Size */}
                <div className="space-y-4">
                  <h3 className="font-semibold">Font Size</h3>
                  <div className="grid gap-3 md:grid-cols-3">
                    {[
                      { value: "small", label: "Small" },
                      { value: "medium", label: "Medium" },
                      { value: "large", label: "Large" },
                    ].map((size) => (
                      <div
                        key={size.value}
                        className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                          appearanceSettings.fontSize === size.value ? "border-pink-500 bg-pink-50" : "hover:bg-gray-50"
                        }`}
                        onClick={() => handleFontSizeChange(size.value as any)}
                      >
                        <span className="font-medium">{size.label}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Display Options */}
                <div className="space-y-4">
                  <h3 className="font-semibold">Display Options</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">Compact Mode</p>
                        <p className="text-sm text-muted-foreground">Reduce spacing and padding for more content</p>
                      </div>
                      <Switch
                        checked={appearanceSettings.compactMode}
                        onCheckedChange={(checked) =>
                          setAppearanceSettings({ ...appearanceSettings, compactMode: checked })
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">Animations</p>
                        <p className="text-sm text-muted-foreground">Enable smooth transitions and animations</p>
                      </div>
                      <Switch
                        checked={appearanceSettings.animations}
                        onCheckedChange={(checked) =>
                          setAppearanceSettings({ ...appearanceSettings, animations: checked })
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        {appearanceSettings.soundEffects ? (
                          <Volume2 className="h-4 w-4 text-green-500" />
                        ) : (
                          <VolumeX className="h-4 w-4 text-gray-400" />
                        )}
                        <div>
                          <p className="font-medium">Sound Effects</p>
                          <p className="text-sm text-muted-foreground">Play sounds for notifications and actions</p>
                        </div>
                      </div>
                      <Switch
                        checked={appearanceSettings.soundEffects}
                        onCheckedChange={(checked) =>
                          setAppearanceSettings({ ...appearanceSettings, soundEffects: checked })
                        }
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button className="gradient-button" onClick={handleSaveAppearance} disabled={isLoading}>
                    <Save className="h-4 w-4 mr-2" />
                    {isLoading ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Data & Privacy */}
          <TabsContent value="data" className="space-y-6">
            <Card className="modern-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5 text-pink-500" />
                  Data & Privacy
                </CardTitle>
                <CardDescription>Manage your data, privacy settings, and account deletion</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Data Export */}
                <div className="space-y-4">
                  <h3 className="font-semibold">Data Export</h3>
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Export Your Data</p>
                        <p className="text-sm text-muted-foreground">
                          Download a copy of all your data including projects, tasks, and files
                        </p>
                      </div>
                      <Button variant="outline" onClick={handleExportData}>
                        <Download className="h-4 w-4 mr-2" />
                        Export Data
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Privacy Settings */}
                <div className="space-y-4">
                  <h3 className="font-semibold">Privacy Settings</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">Analytics & Usage Data</p>
                        <p className="text-sm text-muted-foreground">Help improve our service by sharing usage data</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">Crash Reports</p>
                        <p className="text-sm text-muted-foreground">
                          Automatically send crash reports to help fix bugs
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">Feature Updates</p>
                        <p className="text-sm text-muted-foreground">
                          Get notified about new features and improvements
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </div>

                {/* Danger Zone */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-red-600">Danger Zone</h3>
                  <div className="p-4 border border-red-200 rounded-lg bg-red-50">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-red-800">Delete Account</p>
                        <p className="text-sm text-red-600">
                          Permanently delete your account and all associated data. This action cannot be undone.
                        </p>
                      </div>
                      <Button variant="destructive" onClick={handleDeleteAccount}>
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete Account
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
