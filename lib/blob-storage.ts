import { put, del, list } from "@vercel/blob"

export interface BlobFile {
  id: string
  name: string
  size: number
  type: string
  url: string
  uploadedBy: string
  uploadedAt: Date
  projectId?: string
  tags?: string[]
  description?: string
  pathname: string
}

export interface UploadProgress {
  fileId: string
  progress: number
  status: "uploading" | "completed" | "error"
  error?: string
}

export class BlobStorageService {
  private static uploadProgress = new Map<string, UploadProgress>()

  static async uploadFile(
    file: File,
    options: {
      projectId?: string
      tags?: string[]
      description?: string
      onProgress?: (progress: number) => void
    } = {},
  ): Promise<BlobFile> {
    const fileId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    const pathname = `uploads/${fileId}-${file.name}`

    // Initialize progress tracking
    this.uploadProgress.set(fileId, {
      fileId,
      progress: 0,
      status: "uploading",
    })

    try {
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        const current = this.uploadProgress.get(fileId)
        if (current && current.progress < 90) {
          const newProgress = Math.min(current.progress + 10, 90)
          this.uploadProgress.set(fileId, {
            ...current,
            progress: newProgress,
          })
          options.onProgress?.(newProgress)
        }
      }, 200)

      // Upload to Vercel Blob
      const blob = await put(pathname, file, {
        access: "public",
        addRandomSuffix: false,
      })

      clearInterval(progressInterval)

      // Create file record
      const uploadedFile: BlobFile = {
        id: fileId,
        name: file.name,
        size: file.size,
        type: file.type,
        url: blob.url,
        pathname: blob.pathname,
        uploadedBy: "current-user", // In real app, get from auth context
        uploadedAt: new Date(),
        projectId: options.projectId,
        tags: options.tags,
        description: options.description,
      }

      // Save metadata to localStorage (in real app, save to database)
      const existingFiles = this.getStoredFiles()
      existingFiles.push(uploadedFile)
      localStorage.setItem("digiadda_blob_files", JSON.stringify(existingFiles))

      this.uploadProgress.set(fileId, {
        fileId,
        progress: 100,
        status: "completed",
      })

      options.onProgress?.(100)
      return uploadedFile
    } catch (error) {
      this.uploadProgress.set(fileId, {
        fileId,
        progress: 0,
        status: "error",
        error: error instanceof Error ? error.message : "Upload failed",
      })
      throw error
    }
  }

  static async uploadMultipleFiles(
    files: FileList,
    options: {
      projectId?: string
      tags?: string[]
      onProgress?: (fileId: string, progress: number) => void
    } = {},
  ): Promise<BlobFile[]> {
    const uploadPromises = Array.from(files).map((file) =>
      this.uploadFile(file, {
        ...options,
        onProgress: (progress) => options.onProgress?.(file.name, progress),
      }),
    )

    return Promise.all(uploadPromises)
  }

  static async deleteFile(fileId: string): Promise<boolean> {
    try {
      const files = this.getStoredFiles()
      const fileToDelete = files.find((f) => f.id === fileId)

      if (!fileToDelete) {
        return false
      }

      // Delete from Vercel Blob
      await del(fileToDelete.url)

      // Remove from stored files
      const updatedFiles = files.filter((f) => f.id !== fileId)
      localStorage.setItem("digiadda_blob_files", JSON.stringify(updatedFiles))

      this.uploadProgress.delete(fileId)
      return true
    } catch (error) {
      console.error("Error deleting file:", error)
      return false
    }
  }

  static async listFiles(): Promise<BlobFile[]> {
    try {
      // Get files from Vercel Blob
      const { blobs } = await list()

      // Merge with stored metadata
      const storedFiles = this.getStoredFiles()

      return blobs.map((blob) => {
        const storedFile = storedFiles.find((f) => f.url === blob.url)
        return (
          storedFile || {
            id: blob.pathname,
            name: blob.pathname.split("/").pop() || "Unknown",
            size: blob.size,
            type: "application/octet-stream",
            url: blob.url,
            pathname: blob.pathname,
            uploadedBy: "unknown",
            uploadedAt: blob.uploadedAt,
          }
        )
      }) as BlobFile[]
    } catch (error) {
      console.error("Error listing files:", error)
      return this.getStoredFiles()
    }
  }

  private static getStoredFiles(): BlobFile[] {
    try {
      const stored = localStorage.getItem("digiadda_blob_files")
      return stored ? JSON.parse(stored) : []
    } catch {
      return []
    }
  }

  static getUploadProgress(fileId: string): UploadProgress | undefined {
    return this.uploadProgress.get(fileId)
  }

  static getAllFiles(): BlobFile[] {
    return this.getStoredFiles()
  }

  static getFilesByProject(projectId: string): BlobFile[] {
    return this.getStoredFiles().filter((file) => file.projectId === projectId)
  }

  static getFileTypeIcon(type: string): string {
    if (type.startsWith("image/")) return "🖼️"
    if (type.startsWith("video/")) return "🎥"
    if (type.startsWith("audio/")) return "🎵"
    if (type.includes("pdf")) return "📄"
    if (type.includes("word") || type.includes("document")) return "📝"
    if (type.includes("excel") || type.includes("spreadsheet")) return "📊"
    if (type.includes("powerpoint") || type.includes("presentation")) return "📋"
    if (type.includes("zip") || type.includes("rar")) return "📦"
    return "📁"
  }

  static formatFileSize(bytes: number): string {
    if (bytes === 0) return "0 Bytes"

    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))

    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  static async getFileUrl(fileId: string): Promise<string | null> {
    const files = this.getStoredFiles()
    const file = files.find((f) => f.id === fileId)
    return file?.url || null
  }

  static async shareFile(fileId: string, expiresIn?: number): Promise<string | null> {
    // In a real implementation, you might generate a temporary signed URL
    const file = this.getStoredFiles().find((f) => f.id === fileId)
    return file?.url || null
  }
}
