import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ImageUpload } from "@/components/ImageUpload"
import { useImageBank } from "@/hooks/useImageBank"
import { Badge } from "@/components/ui/badge"
import { Trash2, Download, Copy, ImageIcon, HardDrive } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

const ImageBank = () => {
  const { 
    images, 
    isLoading, 
    removeImage, 
    clearAllImages, 
    totalSize, 
    formatSize, 
    count 
  } = useImageBank()
  const { toast } = useToast()

  const copyImageUrl = async (url: string, imageName: string) => {
    try {
      await navigator.clipboard.writeText(url)
      toast({
        title: "URL copiada",
        description: `URL da imagem ${imageName} copiada para a área de transferência`
      })
    } catch (error) {
      toast({
        title: "Erro ao copiar",
        description: "Não foi possível copiar a URL da imagem",
        variant: "destructive"
      })
    }
  }

  const downloadImage = (url: string, name: string) => {
    const link = document.createElement('a')
    link.href = url
    link.download = name
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleClearAll = () => {
    if (window.confirm('Tem certeza que deseja remover todas as imagens?')) {
      clearAllImages()
      toast({
        title: "Banco de imagens limpo",
        description: "Todas as imagens foram removidas"
      })
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center">Carregando banco de imagens...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Banco de Imagens</h1>
          <p className="text-xl text-muted-foreground">
            Gerencie suas imagens carregadas
          </p>
        </div>

        {/* Stats */}
        <Card>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <ImageIcon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{count}</p>
                  <p className="text-muted-foreground">Imagens</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center">
                  <HardDrive className="h-6 w-6 text-secondary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{formatSize(totalSize)}</p>
                  <p className="text-muted-foreground">Espaço usado</p>
                </div>
              </div>

              <div className="flex items-center justify-end">
                <Button 
                  variant="outline" 
                  onClick={handleClearAll}
                  disabled={count === 0}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Limpar Tudo
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Upload Section */}
        <ImageUpload className="mb-8" />

        {/* Images Gallery */}
        {images.length > 0 ? (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ImageIcon className="h-6 w-6" />
                Suas Imagens ({count})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {images.map((image) => (
                  <Card key={image.id} className="overflow-hidden">
                    <div className="aspect-square overflow-hidden">
                      <img
                        src={image.url}
                        alt={image.name}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                      />
                    </div>
                    
                    <CardContent className="p-4 space-y-3">
                      <div>
                        <h4 className="font-medium truncate" title={image.name}>
                          {image.name}
                        </h4>
                        <div className="flex items-center justify-between mt-1">
                          <Badge variant="secondary" className="text-xs">
                            {formatSize(image.size)}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {new Date(image.timestamp).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 text-xs"
                          onClick={() => copyImageUrl(image.url, image.name)}
                        >
                          <Copy className="h-3 w-3 mr-1" />
                          Copiar
                        </Button>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 text-xs"
                          onClick={() => downloadImage(image.url, image.name)}
                        >
                          <Download className="h-3 w-3 mr-1" />
                          Baixar
                        </Button>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-destructive hover:text-destructive"
                          onClick={() => removeImage(image.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="p-12 text-center">
              <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <ImageIcon className="h-10 w-10 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Nenhuma imagem encontrada</h3>
              <p className="text-muted-foreground">
                Carregue suas primeiras imagens usando o upload acima
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

export default ImageBank