import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Smartphone, Upload, Download, Trash2, AlertCircle, Loader2 } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useAppFiles } from "@/hooks/useAppFiles"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { toast } from "sonner"

const AdminAppManager = () => {
  const navigate = useNavigate()
  const { apkFile, loading, error, uploadAPK, deleteAPK } = useAppFiles()
  const [uploading, setUploading] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      if (!file.name.endsWith('.apk')) {
        toast.error('Por favor, selecione um arquivo APK válido')
        return
      }
      setSelectedFile(file)
    }
  }

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error('Por favor, selecione um arquivo APK')
      return
    }

    setUploading(true)
    const success = await uploadAPK(selectedFile)
    if (success) {
      setSelectedFile(null)
      // Clear the file input
      const fileInput = document.getElementById('apk-file-input') as HTMLInputElement
      if (fileInput) fileInput.value = ''
    }
    setUploading(false)
  }

  const handleDelete = async () => {
    if (!apkFile) return
    
    if (confirm('Tem certeza que deseja deletar este APK? Esta ação não pode ser desfeita.')) {
      await deleteAPK(apkFile.name)
    }
  }

  const formatFileSize = (bytes: number) => {
    const mb = bytes / (1024 * 1024)
    return `${mb.toFixed(1)} MB`
  }

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('pt-BR')
    } catch {
      return 'Data inválida'
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
              <Smartphone className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Gerenciar App</h1>
              <p className="text-sm text-muted-foreground">Administração de arquivos APK</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => navigate('/admin/dashboard')}
            >
              Dashboard Admin
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate('/baixar-app')}
            >
              Ver Página Pública
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="py-8 px-6">
        <div className="max-w-4xl mx-auto space-y-6">
          
          {/* Upload Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Upload de Nova Versão
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="apk-file-input">Selecione o arquivo APK</Label>
                <Input
                  id="apk-file-input"
                  type="file"
                  accept=".apk"
                  onChange={handleFileSelect}
                  disabled={uploading}
                />
                {selectedFile && (
                  <p className="text-sm text-muted-foreground">
                    Arquivo selecionado: {selectedFile.name} ({formatFileSize(selectedFile.size)})
                  </p>
                )}
              </div>

              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Importante:</strong> Certifique-se de que o APK foi assinado corretamente 
                  e testado antes do upload. Este arquivo será disponibilizado publicamente.
                </AlertDescription>
              </Alert>

              <Button
                onClick={handleUpload}
                disabled={!selectedFile || uploading}
                className="w-full"
              >
                {uploading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Fazendo Upload...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    Fazer Upload do APK
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Current APK Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Download className="h-5 w-5" />
                APK Atual
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading && (
                <div className="flex items-center gap-3">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Carregando informações...</span>
                </div>
              )}

              {error && (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {apkFile && !loading && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 p-4 bg-muted rounded-lg">
                    <div>
                      <p className="text-sm font-medium">Nome do Arquivo</p>
                      <p className="text-sm text-muted-foreground">{apkFile.name}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Tamanho</p>
                      <p className="text-sm text-muted-foreground">{formatFileSize(apkFile.size)}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Data de Upload</p>
                      <p className="text-sm text-muted-foreground">{formatDate(apkFile.created_at)}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">URL Pública</p>
                      <p className="text-sm text-muted-foreground truncate">{apkFile.url}</p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => window.open(apkFile.url, '_blank')}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Baixar APK
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={handleDelete}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Deletar APK
                    </Button>
                  </div>
                </div>
              )}

              {!apkFile && !loading && !error && (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Nenhum APK encontrado. Faça o upload da primeira versão acima.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          {/* Instructions */}
          <Card>
            <CardHeader>
              <CardTitle>Instruções de Uso</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p>• <strong>Upload:</strong> Selecione um arquivo APK assinado e clique em "Fazer Upload"</p>
              <p>• <strong>Substituição:</strong> Novos uploads substituirão automaticamente a versão anterior</p>
              <p>• <strong>Nomenclatura:</strong> Os arquivos são nomeados automaticamente com a data atual</p>
              <p>• <strong>Acesso:</strong> O APK fica disponível publicamente na página "/baixar-app"</p>
              <p>• <strong>Segurança:</strong> Certifique-se sempre de testar o APK antes do upload</p>
            </CardContent>
          </Card>

        </div>
      </main>
    </div>
  )
}

export default AdminAppManager