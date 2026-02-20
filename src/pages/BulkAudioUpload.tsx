import { useState, useCallback, useRef } from 'react'
import { Upload, X, Music, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface AudioFile {
  id: string
  file: File
  status: 'pending' | 'uploading' | 'success' | 'error'
  progress: number
  error?: string
}

interface BulkAudioUploadProps {
  onUploadComplete?: () => void
}

export default function BulkAudioUpload({ onUploadComplete }: BulkAudioUploadProps) {
  const [files, setFiles] = useState<AudioFile[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const validateAudioFile = (file: File): string | null => {
    const validTypes = ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/ogg', 'audio/m4a', 'audio/aac', 'audio/flac', 'audio/webm']
    const validExtensions = ['.mp3', '.wav', '.ogg', '.m4a', '.aac', '.flac', '.webm']
    
    const hasValidType = validTypes.includes(file.type)
    const hasValidExtension = validExtensions.some(ext => 
      file.name.toLowerCase().endsWith(ext)
    )
    
    if (!hasValidType && !hasValidExtension) {
      return 'Invalid audio file type. Supported formats: MP3, WAV, OGG, M4A, AAC, FLAC, WEBM'
    }
    
    const maxSize = 100 * 1024 * 1024 // 100MB
    if (file.size > maxSize) {
      return `File size exceeds 100MB limit. Current size: ${(file.size / 1024 / 1024).toFixed(2)}MB`
    }
    
    return null
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
  }

  const handleFiles = useCallback((fileList: FileList | null) => {
    if (!fileList) return

    const newFiles: AudioFile[] = []
    
    Array.from(fileList).forEach((file) => {
      const error = validateAudioFile(file)
      newFiles.push({
        id: `${Date.now()}-${Math.random()}`,
        file,
        status: error ? 'error' : 'pending',
        progress: 0,
        error: error || undefined,
      })
    })

    setFiles((prev) => [...prev, ...newFiles])
  }, [])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
    
    const droppedFiles = e.dataTransfer.files
    handleFiles(droppedFiles)
  }, [handleFiles])

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files)
    // Reset input so same file can be selected again
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }, [handleFiles])

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id))
  }

  const simulateUpload = async (audioFile: AudioFile): Promise<AudioFile> => {
    return new Promise((resolve) => {
      const interval = setInterval(() => {
        setFiles((prev) =>
          prev.map((f) => {
            if (f.id === audioFile.id) {
              const newProgress = Math.min(f.progress + Math.random() * 30, 100)
              if (newProgress >= 100) {
                clearInterval(interval)
                setTimeout(() => {
                  const successFile = { ...audioFile, status: 'success' as const, progress: 100 }
                  setFiles((prev) =>
                    prev.map((file) =>
                      file.id === audioFile.id ? successFile : file
                    )
                  )
                  resolve(successFile)
                }, 300)
                return { ...f, progress: 100 }
              }
              return { ...f, progress: newProgress }
            }
            return f
          })
        )
      }, 200)
    })
  }

  const handleUpload = async () => {
    const pendingFiles = files.filter((f) => f.status === 'pending')
    if (pendingFiles.length === 0) return

    setIsUploading(true)

    // Update status to uploading
    setFiles((prev) =>
      prev.map((f) =>
        f.status === 'pending' ? { ...f, status: 'uploading' as const } : f
      )
    )

    // Simulate upload for each file and collect successful uploads
    const successfulUploads = await Promise.all(
      pendingFiles.map((file) => simulateUpload(file))
    )

    // Save successfully uploaded files to localStorage
    if (successfulUploads.length > 0) {
      const existingAudios = JSON.parse(localStorage.getItem('uploadedAudios') || '[]')
      const newAudios = successfulUploads.map((f) => ({
        id: f.id,
        name: f.file.name,
        size: f.file.size,
        uploadedAt: new Date().toISOString(),
      }))
      
      const updatedAudios = [...existingAudios, ...newAudios]
      localStorage.setItem('uploadedAudios', JSON.stringify(updatedAudios))
    }

    setIsUploading(false)

    // Navigate to dashboard after a short delay
    if (successfulUploads.length > 0) {
      setTimeout(() => {
        if (onUploadComplete) {
          onUploadComplete()
        }
      }, 1000)
    }
  }

  const pendingCount = files.filter((f) => f.status === 'pending').length
  const uploadingCount = files.filter((f) => f.status === 'uploading').length
  const successCount = files.filter((f) => f.status === 'success').length

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Music className="h-6 w-6" />
              Bulk Audio Upload
            </CardTitle>
            <CardDescription>
              Upload multiple audio files at once. Supported formats: MP3, WAV, OGG, M4A, AAC, FLAC, WEBM (Max 100MB per file)
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Upload Area */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={cn(
                "border-2 border-dashed rounded-lg p-12 text-center transition-colors cursor-pointer",
                isDragging
                  ? "border-blue-500 bg-blue-50 dark:bg-blue-950"
                  : "border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600",
                "bg-white dark:bg-gray-800"
              )}
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p className="text-lg font-medium mb-2">
                Drag and drop audio files here, or click to browse
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Select multiple files to upload at once
              </p>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="audio/*"
                onChange={handleFileInput}
                className="hidden"
              />
            </div>

            {/* Upload Button */}
            {pendingCount > 0 && (
              <div className="mt-6 flex justify-end">
                <Button
                  onClick={handleUpload}
                  disabled={isUploading || pendingCount === 0}
                  className="min-w-[120px]"
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4 mr-2" />
                      Upload {pendingCount} {pendingCount === 1 ? 'file' : 'files'}
                    </>
                  )}
                </Button>
              </div>
            )}

            {/* Stats */}
            {files.length > 0 && (
              <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                  <div className="text-2xl font-bold">{files.length}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Total</div>
                </div>
                <div className="text-center p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                  <div className="text-2xl font-bold">{pendingCount}</div>
                  <div className="text-sm text-yellow-700 dark:text-yellow-400">Pending</div>
                </div>
                <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="text-2xl font-bold">{uploadingCount}</div>
                  <div className="text-sm text-blue-700 dark:text-blue-400">Uploading</div>
                </div>
                <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="text-2xl font-bold">{successCount}</div>
                  <div className="text-sm text-green-700 dark:text-green-400">Success</div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* File List */}
        {files.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Upload Queue</CardTitle>
              <CardDescription>
                {files.length} {files.length === 1 ? 'file' : 'files'} selected
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {files.map((audioFile) => (
                  <div
                    key={audioFile.id}
                    className={cn(
                      "flex items-center gap-4 p-4 rounded-lg border",
                      audioFile.status === 'error' && "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800",
                      audioFile.status === 'success' && "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800",
                      audioFile.status === 'uploading' && "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800",
                      audioFile.status === 'pending' && "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                    )}
                  >
                    <div className="flex-shrink-0">
                      {audioFile.status === 'success' && (
                        <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                      )}
                      {audioFile.status === 'error' && (
                        <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                      )}
                      {audioFile.status === 'uploading' && (
                        <Loader2 className="h-5 w-5 text-blue-600 dark:text-blue-400 animate-spin" />
                      )}
                      {audioFile.status === 'pending' && (
                        <Music className="h-5 w-5 text-gray-400" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-sm font-medium truncate">
                          {audioFile.file.name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                          {formatFileSize(audioFile.file.size)}
                        </p>
                      </div>

                      {audioFile.status === 'uploading' && (
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${audioFile.progress}%` }}
                          />
                        </div>
                      )}

                      {audioFile.error && (
                        <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                          {audioFile.error}
                        </p>
                      )}

                      {audioFile.status === 'success' && (
                        <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                          Upload completed successfully
                        </p>
                      )}
                    </div>

                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeFile(audioFile.id)}
                      className="flex-shrink-0"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
