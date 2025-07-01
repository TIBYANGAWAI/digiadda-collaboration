"use client"

import type React from "react"

import { useState, useRef, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Upload, File, ImageIcon, Video, FileText, Download, Trash2 } from "lucide-react"
import { FileUploadService, type UploadedFile, type FileUploadProgress } from "@/lib/file-upload"
import { useToast } from "@/hooks/use-toast"

interface FileUploadProps {
  projectId?: string
  onFileUploaded?: (file: UploadedFile) => void
  maxFileSize?: number // in MB
  allowedTypes?: string[]
  multiple?: boolean
}

export function FileUpload({
  projectId,
  onFileUploaded,
  maxFileSize = 10,
  allowedTypes = [],
  multiple = true,
}: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [uploadingFiles, setUploadingFiles] = useState<Map<string, FileUploadProgress>>(new Map())
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const files = e.dataTransfer.files
    if (files.length > 0) {
      handleFileUpload(files)
    }
  }, [])

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      handleFileUpload(files)
    }
  }, [])

  const validateFile = (file: File): string | null => {
    // Check file size
    if (file.size > maxFileSize * 1024 * 1024) {
      return `File size must be less than ${maxFileSize}MB`
    }

    // Check file type
    if (allowedTypes.length > 0 && !allowedTypes.some((type) => file.type.includes(type))) {
      return `File type not allowed. Allowed types: ${allowedTypes.join(", ")}`
    }

    return null
  }

  const handleFileUpload = async (files: FileList) => {
    const validFiles: File[] = []

    // Validate files
    Array.from(files).forEach((file) => {
      const error = validateFile(file)
      if (error) {
        toast({
          title: "Upload Error",
          description: `${file.name}: ${error}`,
          variant: "destructive",
        })
      } else {
        validFiles.push(file)
      }
    })

    if (validFiles.length === 0) return

    // Upload files
    for (const file of validFiles) {
      const fileId = `${file.name}-${Date.now()}`

      try {
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

        const uploadedFile = await FileUploadService.uploadFile(file, {
          projectId,
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

        setUploadedFiles((prev) => [...prev, uploadedFile])
        setUploadingFiles((prev) => {
          const newMap = new Map(prev)
          newMap.delete(fileId)
          return newMap
        })

        onFileUploaded?.(uploadedFile)

        toast({
          title: "Upload Successful",
          description: `${file.name} has been uploaded successfully.`,
        })
      } catch (error) {
        setUploadingFiles((prev) => {
          const newMap = new Map(prev)
          newMap.delete(fileId)
          return newMap
        })

        toast({
          title: "Upload Failed",
          description: `Failed to upload ${file.name}`,
          variant: "destructive",
        })
      }
    }
  }

  const removeFile = (fileId: string) => {
    FileUploadService.deleteFile(fileId)
    setUploadedFiles((prev) => prev.filter((file) => file.id !== fileId))
  }

  const getFileIcon = (type: string) => {
    if (type.startsWith("image/")) return <ImageIcon className="h-4 w-4" />
    if (type.startsWith("video/")) return <Video className="h-4 w-4" />
    if (type.includes("pdf") || type.includes("document")) return <FileText className="h-4 w-4" />
    return <File className="h-4 w-4" />
  }

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <Card className="modern-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5 text-pink-500" />
            File Upload
          </CardTitle>
          <CardDescription>Upload files for your project. Max size: {maxFileSize}MB per file.</CardDescription>
        </CardHeader>
        <CardContent>
          <div
            className={`file-upload-area ${isDragging ? "dragover" : ""}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-lg font-medium mb-2">Drop files here or click to upload</p>
            <p className="text-sm text-muted-foreground mb-4">Support for images, documents, videos, and more</p>
            <Button className="gradient-button">Choose Files</Button>

            <input
              ref={fileInputRef}
              type="file"
              multiple={multiple}
              onChange={handleFileSelect}
              className="hidden"
              accept={allowedTypes.length > 0 ? allowedTypes.join(",") : undefined}
            />
          </div>

          {/* Upload Progress */}
          {uploadingFiles.size > 0 && (
            <div className="mt-6 space-y-3">
              <h4 className="font-medium">Uploading Files</h4>
              {Array.from(uploadingFiles.values()).map((upload) => (
                <div key={upload.fileId} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{upload.fileId.split("-")[0]}</span>
                    <span className="text-sm text-muted-foreground">{upload.progress}%</span>
                  </div>
                  <Progress value={upload.progress} className="h-2" />
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Uploaded Files */}
      {uploadedFiles.length > 0 && (
        <Card className="modern-card">
          <CardHeader>
            <CardTitle>Uploaded Files</CardTitle>
            <CardDescription>{uploadedFiles.length} files uploaded</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {uploadedFiles.map((file) => (
                <div key={file.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    {getFileIcon(file.type)}
                    <div>
                      <p className="font-medium">{file.name}</p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>{FileUploadService.formatFileSize(file.size)}</span>
                        <span>•</span>
                        <span>{file.uploadedAt.toLocaleDateString()}</span>
                        {file.tags && file.tags.length > 0 && (
                          <>
                            <span>•</span>
                            <div className="flex gap-1">
                              {file.tags.map((tag, index) => (
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
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => removeFile(file.id)}>
                      <Trash2 className="h-4 w-4" />
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
