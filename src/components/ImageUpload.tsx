import { useState, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Upload, X, ImageIcon } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface ImageUploadProps {
  onImageUpload?: (imageUrl: string) => void
  maxSize?: number // in MB
  accept?: string
  className?: string
}

interface UploadedImage {
  id: string
  file: File
  url: string
  name: string
  size: number
}

export function ImageUpload({ 
  onImageUpload, 
  maxSize = 5, 
  accept = "image/*",
  className = ""
}: ImageUploadProps) {
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const { toast } = useToast()

  const handleFileUpload = useCallback(async (files: FileList | null) => {
    if (!files || files.length === 0) return

    setIsUploading(true)
    const newImages: UploadedImage[] = []

    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      
      // Validate file size
      if (file.size > maxSize * 1024 * 1024) {
        toast({
          title: "Arquivo muito grande",
          description: `${file.name} excede o limite de ${maxSize}MB`,
          variant: "destructive"
        })
        continue
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Tipo de arquivo inválido",
          description: `${file.name} não é uma imagem válida`,
          variant: "destructive"
        })
        continue
      }

      try {
        // Create a blob URL for immediate preview
        const url = URL.createObjectURL(file)
        
        const imageData: UploadedImage = {
          id: `img_${Date.now()}_${i}`,
          file,
          url,
          name: file.name,
          size: file.size
        }

        newImages.push(imageData)

        // Store in localStorage for persistence
        const existingImages = JSON.parse(localStorage.getItem('uploadedImages') || '[]')
        const imageToStore = {
          id: imageData.id,
          name: imageData.name,
          size: imageData.size,
          url: url,
          timestamp: Date.now()
        }
        existingImages.push(imageToStore)
        localStorage.setItem('uploadedImages', JSON.stringify(existingImages))

        if (onImageUpload) {
          onImageUpload(url)
        }
      } catch (error) {
        toast({
          title: "Erro no upload",
          description: `Erro ao processar ${file.name}`,
          variant: "destructive"
        })
      }
    }

    setUploadedImages(prev => [...prev, ...newImages])
    setIsUploading(false)

    if (newImages.length > 0) {
      toast({
        title: "Upload concluído",
        description: `${newImages.length} imagem(ns) carregada(s) com sucesso`
      })
    }
  }, [maxSize, onImageUpload, toast])

  const removeImage = useCallback((imageId: string) => {
    setUploadedImages(prev => {
      const imageToRemove = prev.find(img => img.id === imageId)
      if (imageToRemove) {
        URL.revokeObjectURL(imageToRemove.url)
        
        // Remove from localStorage
        const existingImages = JSON.parse(localStorage.getItem('uploadedImages') || '[]')
        const filteredImages = existingImages.filter((img: any) => img.id !== imageId)
        localStorage.setItem('uploadedImages', JSON.stringify(filteredImages))
      }
      return prev.filter(img => img.id !== imageId)
    })
  }, [])

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Upload Area */}
      <Card className="border-dashed border-2 border-muted-foreground/25 hover:border-muted-foreground/50 transition-colors">
        <CardContent className="p-6">
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
              <Upload className="h-8 w-8 text-primary" />
            </div>
            
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">Carregar Imagens</h3>
              <p className="text-muted-foreground mb-4">
                Arraste e solte suas imagens aqui ou clique para selecionar
              </p>
              <p className="text-sm text-muted-foreground">
                Máximo: {maxSize}MB por arquivo
              </p>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                disabled={isUploading}
                onClick={() => {
                  const input = document.createElement('input')
                  input.type = 'file'
                  input.accept = accept
                  input.multiple = true
                  input.onchange = (e) => {
                    const target = e.target as HTMLInputElement
                    handleFileUpload(target.files)
                  }
                  input.click()
                }}
              >
                {isUploading ? 'Carregando...' : 'Selecionar Arquivos'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Uploaded Images Gallery */}
      {uploadedImages.length > 0 && (
        <Card>
          <CardContent className="p-6">
            <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <ImageIcon className="h-5 w-5" />
              Imagens Carregadas ({uploadedImages.length})
            </h4>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {uploadedImages.map((image) => (
                <div key={image.id} className="relative group">
                  <div className="aspect-square overflow-hidden rounded-lg bg-muted">
                    <img
                      src={image.url}
                      alt={image.name}
                      className="w-full h-full object-cover transition-transform group-hover:scale-105"
                    />
                  </div>
                  
                  <Button
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 h-6 w-6"
                    onClick={() => removeImage(image.id)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                  
                  <div className="mt-2 space-y-1">
                    <p className="text-sm font-medium truncate" title={image.name}>
                      {image.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatFileSize(image.size)}
                    </p>
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