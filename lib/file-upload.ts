export interface UploadedFile {
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
}

export interface FileUploadProgress {
  fileId: string
  progress: number
  status: "uploading" | "completed" | "error"
  error?: string
}

export class FileUploadService {
  private static uploadProgress = new Map<string, FileUploadProgress>()
  private static uploadedFiles: UploadedFile[] = []

  static async uploadFile(
    file: File,
    options: {
      projectId?: string
      tags?: string[]
      description?: string
      onProgress?: (progress: number) => void
    } = {},
  ): Promise<UploadedFile> {
    const fileId = Date.now().toString()

    // Initialize progress tracking
    this.uploadProgress.set(fileId, {
      fileId,
      progress: 0,
      status: "uploading",
    })

    try {
      // Simulate file upload with progress
      for (let progress = 0; progress <= 100; progress += 10) {
        await new Promise((resolve) => setTimeout(resolve, 100))

        this.uploadProgress.set(fileId, {
          fileId,
          progress,
          status: "uploading",
        })

        options.onProgress?.(progress)
      }

      // Create uploaded file record
      const uploadedFile: UploadedFile = {
        id: fileId,
        name: file.name,
        size: file.size,
        type: file.type,
        url: URL.createObjectURL(file), // In real app, this would be the server URL
        uploadedBy: "current-user", // In real app, get from auth context
        uploadedAt: new Date(),
        projectId: options.projectId,
        tags: options.tags,
        description: options.description,
      }

      this.uploadedFiles.push(uploadedFile)

      this.uploadProgress.set(fileId, {
        fileId,
        progress: 100,
        status: "completed",
      })

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
  ): Promise<UploadedFile[]> {
    const uploadPromises = Array.from(files).map((file) =>
      this.uploadFile(file, {
        ...options,
        onProgress: (progress) => options.onProgress?.(file.name, progress),
      }),
    )

    return Promise.all(uploadPromises)
  }

  static getUploadProgress(fileId: string): FileUploadProgress | undefined {
    return this.uploadProgress.get(fileId)
  }

  static getAllFiles(): UploadedFile[] {
    return this.uploadedFiles
  }

  static getFilesByProject(projectId: string): UploadedFile[] {
    return this.uploadedFiles.filter((file) => file.projectId === projectId)
  }

  static deleteFile(fileId: string): boolean {
    const index = this.uploadedFiles.findIndex((file) => file.id === fileId)
    if (index > -1) {
      this.uploadedFiles.splice(index, 1)
      this.uploadProgress.delete(fileId)
      return true
    }
    return false
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
}
