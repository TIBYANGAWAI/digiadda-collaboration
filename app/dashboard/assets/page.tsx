"use client"

import { useState } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { EnhancedFileUpload } from "@/components/enhanced-file-upload"
import {
  Upload,
  Download,
  Trash2,
  Search,
  Grid,
  List,
  ImageIcon,
  Video,
  FileText,
  File,
  Folder,
  Eye,
  Share,
} from "lucide-react"
import type { Asset } from "@/lib/types"
import { FileUploadService } from "@/lib/file-upload"

// ...existing code...
// Dummy/mock assets, projects, and stats removed. Please fetch real assets, projects, and stats from your backend or Supabase here.

export default function AssetsPage() {
  const [assets, setAssets] = useState<Asset[]>([])
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedProject, setSelectedProject] = useState<string>("all")
  const [selectedType, setSelectedType] = useState<string>("all")

  const getFileIcon = (type: string) => {
    switch (type) {
      case "image":
        return <ImageIcon className="h-4 w-4" />
      case "video":
        return <Video className="h-4 w-4" />
      case "document":
        return <FileText className="h-4 w-4" />
      default:
        return <File className="h-4 w-4" />
    }
  }

  const getFileTypeColor = (type: string) => {
    switch (type) {
      case "image":
        return "bg-green-100 text-green-800"
      case "video":
        return "bg-blue-100 text-blue-800"
      case "document":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const filteredAssets = assets.filter((asset) => {
    const matchesSearch =
      asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.tags?.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesProject = selectedProject === "all" || asset.projectId === selectedProject
    const matchesType = selectedType === "all" || asset.type === selectedType

    return matchesSearch && matchesProject && matchesType
  })

  const handleFileUploaded = (file: any) => {
    const newAsset: Asset = {
      id: file.id,
      name: file.name,
      type: file.type.startsWith("image/") ? "image" : file.type.startsWith("video/") ? "video" : "document",
      url: file.url,
      size: file.size,
      uploadedBy: file.uploadedBy,
      createdAt: file.uploadedAt,
      tags: file.tags || [],
      projectId: file.projectId,
    }
    setAssets([newAsset, ...assets])
  }

  const handleDeleteAsset = (id: string) => {
    setAssets(assets.filter((asset) => asset.id !== id))
  }

  return (
    <div className="flex-1 flex flex-col">
      <DashboardHeader title="Asset Management" description="Manage and organize all your project files and assets" />

      <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="modern-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Assets</CardTitle>
              <div className="p-2 bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg">
                <Folder className="h-4 w-4 text-blue-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold gradient-text">{assetStats.totalAssets}</div>
              <p className="text-xs text-muted-foreground">Files uploaded</p>
            </CardContent>
          </Card>

          <Card className="modern-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Storage Used</CardTitle>
              <div className="p-2 bg-gradient-to-r from-green-100 to-blue-100 rounded-lg">
                <Upload className="h-4 w-4 text-green-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold gradient-text">{assetStats.totalSize}</div>
              <p className="text-xs text-muted-foreground">Of 10 GB limit</p>
            </CardContent>
          </Card>

          <Card className="modern-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Images</CardTitle>
              <div className="p-2 bg-gradient-to-r from-pink-100 to-purple-100 rounded-lg">
                <ImageIcon className="h-4 w-4 text-pink-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold gradient-text">{assetStats.imagesCount}</div>
              <p className="text-xs text-muted-foreground">Image files</p>
            </CardContent>
          </Card>

          <Card className="modern-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Videos</CardTitle>
              <div className="p-2 bg-gradient-to-r from-yellow-100 to-orange-100 rounded-lg">
                <Video className="h-4 w-4 text-yellow-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold gradient-text">{assetStats.videosCount}</div>
              <p className="text-xs text-muted-foreground">Video files</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="browse" className="space-y-6">
          <TabsList>
            <TabsTrigger value="browse">Browse Assets</TabsTrigger>
            <TabsTrigger value="upload">Upload Files</TabsTrigger>
          </TabsList>

          <TabsContent value="browse" className="space-y-6">
            {/* Filters and Search */}
            <Card className="modern-card">
              <CardContent className="p-4">
                <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                  <div className="flex flex-1 gap-4 items-center">
                    <div className="relative flex-1 max-w-sm">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search assets..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>

                    <select
                      value={selectedProject}
                      onChange={(e) => setSelectedProject(e.target.value)}
                      className="px-3 py-2 border rounded-md text-sm"
                    >
                      <option value="all">All Projects</option>
                      {/* Replace with real projects from your backend or Supabase */}
                    </select>

                    <select
                      value={selectedType}
                      onChange={(e) => setSelectedType(e.target.value)}
                      className="px-3 py-2 border rounded-md text-sm"
                    >
                      <option value="all">All Types</option>
                      <option value="image">Images</option>
                      <option value="video">Videos</option>
                      <option value="document">Documents</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant={viewMode === "grid" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setViewMode("grid")}
                    >
                      <Grid className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={viewMode === "list" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setViewMode("list")}
                    >
                      <List className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Assets Display */}
            {viewMode === "grid" ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filteredAssets.map((asset) => (
                  <Card key={asset.id} className="modern-card group">
                    <CardContent className="p-4">
                      <div className="aspect-video bg-gray-100 rounded-lg mb-3 flex items-center justify-center overflow-hidden">
                        {asset.type === "image" ? (
                          <img
                            src={asset.url || "/placeholder.svg"}
                            alt={asset.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="flex flex-col items-center gap-2">
                            {getFileIcon(asset.type)}
                            <span className="text-xs text-muted-foreground">
                              {FileUploadService.getFileTypeIcon(asset.type)}
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-sm truncate">{asset.name}</h4>
                          <Badge className={getFileTypeColor(asset.type)}>{asset.type}</Badge>
                        </div>

                        <div className="text-xs text-muted-foreground">
                          <p>{FileUploadService.formatFileSize(asset.size)}</p>
                          <p>{asset.createdAt.toLocaleDateString()}</p>
                        </div>

                        {asset.tags && asset.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {asset.tags.slice(0, 2).map((tag, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                            {asset.tags.length > 2 && (
                              <Badge variant="outline" className="text-xs">
                                +{asset.tags.length - 2}
                              </Badge>
                            )}
                          </div>
                        )}

                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button size="sm" variant="outline" className="flex-1">
                            <Eye className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="outline" className="flex-1">
                            <Download className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="outline" className="flex-1">
                            <Share className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1 text-red-600 hover:text-red-700"
                            onClick={() => handleDeleteAsset(asset.id)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="modern-card">
                <CardContent className="p-0">
                  <div className="divide-y">
                    {filteredAssets.map((asset) => (
                      <div key={asset.id} className="p-4 hover:bg-gray-50 transition-colors">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-gray-100 rounded-lg">{getFileIcon(asset.type)}</div>
                            <div>
                              <h4 className="font-medium">{asset.name}</h4>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <span>{FileUploadService.formatFileSize(asset.size)}</span>
                                <span>•</span>
                                <span>{asset.createdAt.toLocaleDateString()}</span>
                                <span>•</span>
                                <Badge className={getFileTypeColor(asset.type)}>{asset.type}</Badge>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            {asset.tags && asset.tags.length > 0 && (
                              <div className="flex gap-1">
                                {asset.tags.slice(0, 3).map((tag, index) => (
                                  <Badge key={index} variant="outline" className="text-xs">
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            )}

                            <div className="flex gap-1">
                              <Button size="sm" variant="ghost">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="ghost">
                                <Download className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="ghost">
                                <Share className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="text-red-600 hover:text-red-700"
                                onClick={() => handleDeleteAsset(asset.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="upload">
            <EnhancedFileUpload
              onFileUploaded={handleFileUploaded}
              maxFileSize={50}
              multiple={true}
              projectId={selectedProject !== "all" ? selectedProject : undefined}
              showRecentFiles={true}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
