"use client"

import type React from "react"

import { useState, useCallback, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Upload,
  File,
  ImageIcon,
  Video,
  FileText,
  Download,
  Share,
  Trash2,
  Eye,
  AlertCircle,
  CheckCircle,
  Cloud,
  Zap,
} from "lucide-react"
import { BlobStorageService, type BlobFile, type UploadProgress } from "@/lib/blob-storage"
import { toast } from "@/hooks/use-toast"

interface EnhancedFileUploadProps {
  onFileUploaded?: (file: BlobFile) => void
  onFilesUploaded?: (files: BlobFile[]) => void
  maxFileSize?: number // in MB
  maxFiles?: number
  acceptedTypes?: string[]
  multiple?: boolean
  projectId?: string
  showRecentFiles?: boolean
}

export function EnhancedFileUpload({
  onFileUploaded,
  onFilesUploaded,
  maxFileSize = 50,
  maxFiles = 10,
  acceptedTypes = [],
  multiple = true,
  projectId,
  showRecentFiles = true,
}: EnhancedFileUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [uploadingFiles, setUploadingFiles] = useState<Map<string, UploadProgress>>(new Map())
  const [uploadedFiles, setUploadedFiles] = useState<BlobFile[]>([])
  const [recentFiles, setRecentFiles] = useState<BlobFile[]>([])
  const [tags, setTags] = useState("")
  const [description, setDescription] = useState("")
  const [error, setError] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Load recent files on component mount
  useState(() => {
    if (showRecentFiles) {
      const files = BlobStorageService.getAllFiles()
      setRecentFiles(files.slice(0, 5))
    }
  })

  const validateFile = (file: File): string | null => {
    if (file.size > maxFileSize * 1024 * 1024) {
      return `File size must be less than ${maxFileSize}MB`
    }

    if (acceptedTypes.length > 0 && !acceptedTypes.some((type) => file.type.includes(type))) {
      return `File type not supported. Accepted types: ${acceptedTypes.join(", ")}`
    }

    return null
  }

  const handleFileUpload = useCallback(
    async (files: FileList) => {
      setError("")

      if (files.length > maxFiles) {
        setError(`Maximum ${maxFiles} files allowed`)
        return
      }

      const validFiles: File[] = []
      const errors: string[] = []

      Array.from(files).forEach((file) => {
        const error = validateFile(file)
        if (error) {
          errors.push(`${file.name}: ${error}`)
        } else {
          validFiles.push(file)
        }
      })

      if (errors.length > 0) {
        setError(errors.join("\n"))
        return
      }

      try {
        const uploadPromises = validFiles.map(async (file) => {
          const fileId = `${Date.now()}-${file.name}`

          // Add to uploading files
          setUploadingFiles(
            (prev) =>
              new Map(
                prev.set(fileId, {
                  fileId,
                  progress: 0,
                  status: "uploading",
                }),
              ),
          )

          const uploadedFile = await BlobStorageService.uploadFile(file, {
            projectId,
            tags: tags ? tags.split(",").map((t) => t.trim()) : [],
            description,
            onProgress: (progress) => {
              setUploadingFiles(
                (prev) =>
                  new Map(
                    prev.set(fileId, {
                      fileId,
                      progress,
                      status: "uploading",
                    }),
                  ),
              )
            },
          })

          // Remove from uploading and add to uploaded
          setUploadingFiles((prev) => {
            const newMap = new Map(prev)
            newMap.delete(fileId)
            return newMap
          })

          setUploadedFiles((prev) => [uploadedFile, ...prev])
          onFileUploaded?.(uploadedFile)

          return uploadedFile
        })

        const results = await Promise.all(uploadPromises)
        onFilesUploaded?.(results)

        // Clear form
        setTags("")
        setDescription("")
        if (fileInputRef.current) {
          fileInputRef.current.value = ""
        }

        toast({
          title: "Upload Successful",
          description: `${results.length} file(s) uploaded to cloud storage`,
        })
      } catch (error) {
        setError(error instanceof Error ? error.message : "Upload failed")
        toast({
          title: "Upload Failed",
          description: "Failed to upload files to cloud storage",
          variant: "destructive",
        })
      }
    },
    [maxFiles, maxFileSize, acceptedTypes, projectId, tags, description, onFileUploaded, onFilesUploaded],
  )

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)
      if (e.dataTransfer.files) {
        handleFileUpload(e.dataTransfer.files)
      }
    },
    [handleFileUpload],
  )

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        handleFileUpload(e.target.files)
      }
    },
    [handleFileUpload],
  )

  const handleDeleteFile = async (fileId: string) => {
    try {
      const success = await BlobStorageService.deleteFile(fileId)
      if (success) {
        setUploadedFiles((prev) => prev.filter((f) => f.id !== fileId))
        setRecentFiles((prev) => prev.filter((f) => f.id !== fileId))
        toast({
          title: "File Deleted",
          description: "File has been permanently deleted from cloud storage",
        })
      } else {
        throw new Error("Failed to delete file")
      }
    } catch (error) {
      toast({
        title: "Delete Failed",
        description: "Failed to delete file from cloud storage",
        variant: "destructive",
      })
    }
  }

  const handleShareFile = async (fileId: string) => {
    try {
      const shareUrl = await BlobStorageService.shareFile(fileId)
      if (shareUrl) {
        await navigator.clipboard.writeText(shareUrl)
        toast({
          title: "Link Copied",
          description: "File sharing link copied to clipboard",
        })
      }
    } catch (error) {
      toast({
        title: "Share Failed",
        description: "Failed to generate sharing link",
        variant: "destructive",
      })
    }
  }

  const getFileIcon = (type: string) => {
    if (type.startsWith("image/")) return <ImageIcon className="h-4 w-4 text-green-600" />
    if (type.startsWith("video/")) return <Video className="h-4 w-4 text-blue-600" />
    if (type.includes("pdf") || type.includes("document")) return <FileText className="h-4 w-4 text-red-600" />
    return <File className="h-4 w-4 text-gray-600" />
  }

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <Card className="modern-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Cloud className="h-5 w-5 text-blue-500" />
            Cloud File Upload
          </CardTitle>
          <CardDescription>Upload files to secure cloud storage with automatic backup and CDN delivery</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Error Display */}
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Upload Form */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="tags">Tags (comma-separated)</Label>
              <Input
                id="tags"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="design, mockup, final"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="project">Project</Label>
              <Select value={projectId || ""}>
                <SelectTrigger>
                  <SelectValue placeholder="Select project (optional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Website Redesign</SelectItem>
                  <SelectItem value="2">Mobile App</SelectItem>
                  <SelectItem value="3">Brand Identity</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of the files..."
              rows={2}
            />
          </div>

          {/* Drag & Drop Area */}
          <div
            className={`border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer ${
              isDragging
                ? "border-blue-400 bg-blue-50 scale-105"
                : "border-gray-300 hover:border-blue-400 hover:bg-gray-50"
            }`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              multiple={multiple}
              onChange={handleFileSelect}
              className="hidden"
              accept={acceptedTypes.join(",")}
            />

            <div className="flex flex-col items-center gap-4">
              <div className="p-4 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full">
                <Upload className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <p className="text-lg font-semibold">Drop files here or click to upload</p>
                <p className="text-sm text-muted-foreground">
                  Maximum {maxFileSize}MB per file, up to {maxFiles} files
                </p>
                {acceptedTypes.length > 0 && (
                  <p className="text-xs text-muted-foreground mt-1">Supported: {acceptedTypes.join(", ")}</p>
                )}
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Zap className="h-3 w-3" />
                <span>Powered by Vercel Blob Storage</span>
              </div>
            </div>
          </div>

          {/* Upload Progress */}
          {uploadingFiles.size > 0 && (
            <div className="space-y-3">
              <h4 className="font-medium">Uploading Files</h4>
              {Array.from(uploadingFiles.entries()).map(([fileId, progress]) => (
                <div key={fileId} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="truncate">{fileId.split("-").slice(1).join("-")}</span>
                    <span>{progress.progress}%</span>
                  </div>
                  <Progress value={progress.progress} className="h-2" />
                </div>
              ))}
            </div>
          )}

          {/* Recently Uploaded Files */}
          {uploadedFiles.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <h4 className="font-medium">Successfully Uploaded</h4>
              </div>
              <div className="space-y-2">
                {uploadedFiles.map((file) => (
                  <div key={file.id} className="flex items-center justify-between p-3 border rounded-lg bg-green-50">
                    <div className="flex items-center gap-3">
                      {getFileIcon(file.type)}
                      <div>
                        <p className="font-medium text-sm">{file.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {BlobStorageService.formatFileSize(file.size)} • Uploaded to cloud
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button size="sm" variant="ghost" onClick={() => window.open(file.url, "_blank")}>
                        <Eye className="h-3 w-3" />
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => handleShareFile(file.id)}>
                        <Share className="h-3 w-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDeleteFile(file.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Files */}
      {showRecentFiles && recentFiles.length > 0 && (
        <Card className="modern-card">
          <CardHeader>
            <CardTitle className="text-lg">Recent Files</CardTitle>
            <CardDescription>Your recently uploaded files from cloud storage</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {recentFiles.map((file) => (
                <div key={file.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                  <div className="flex items-center gap-3">
                    {getFileIcon(file.type)}
                    <div>
                      <p className="font-medium text-sm">{file.name}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>{BlobStorageService.formatFileSize(file.size)}</span>
                        <span>•</span>
                        <span>{file.uploadedAt.toLocaleDateString()}</span>
                        {file.tags && file.tags.length > 0 && (
                          <>
                            <span>•</span>
                            <div className="flex gap-1">
                              {file.tags.slice(0, 2).map((tag, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button size="sm" variant="ghost" onClick={() => window.open(file.url, "_blank")}>
                      <Eye className="h-3 w-3" />
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => handleShareFile(file.id)}>
                      <Share className="h-3 w-3" />
                    </Button>
                    <Button size="sm" variant="ghost">
                      <Download className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
