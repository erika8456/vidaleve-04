import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Smartphone, Download, Apple, Globe, AlertCircle, Loader2, Settings } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"
import { useAppFiles } from "@/hooks/useAppFiles"
import { useAdmin } from "@/hooks/useAdmin"
import { Alert, AlertDescription } from "@/components/ui/alert"

const BaixarApp = () => {
  const navigate = useNavigate()
  const { apkFile, loading, error } = useAppFiles()
  const { isAdmin } = useAdmin()
  
  // Detect user's platform
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent)
  const isAndroid = /Android/.test(navigator.userAgent)
  
  const handleDownloadAndroid = () => {
    if (!apkFile) {
      toast.error('APK não disponível no momento. Tente novamente mais tarde.')
      return
    }
    
    // Try to download the APK
    const link = document.createElement('a')
    link.href = apkFile.url
    link.download = apkFile.name
    link.target = '_blank'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    toast.success('Download do APK iniciado!')
  }

  const formatFileSize = (bytes: number) => {
    const mb = bytes / (1024 * 1024)
    return `${mb.toFixed(1)} MB`
  }
  
  const handleDownloadiOS = () => {
    // Redirect to App Store or TestFlight
    const appStoreUrl = "https://apps.apple.com/app/vida-leve"
    const testFlightUrl = "https://testflight.apple.com/join/vida-leve"
    
    // For now, use TestFlight for beta testing
    window.open(testFlightUrl, '_blank')
    
    toast.info('Redirecionando para o TestFlight...')
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
              <span className="text-primary-foreground font-bold">VL</span>
            </div>
            <h1 className="text-2xl font-bold">Vida Leve</h1>
          </div>
          <Button
            variant="outline"
            onClick={() => navigate('/')}
          >
            Voltar ao Site
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="py-12 px-6">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Smartphone className="h-10 w-10 text-primary" />
            </div>
            <h1 className="text-4xl font-bold mb-4">
              Baixe o App Vida Leve
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Tenha acesso completo à sua nutrição personalizada direto no seu celular. 
              Disponível para Android e iOS.
            </p>
          </div>

          {/* Error/Loading States */}
          {loading && (
            <div className="flex items-center justify-center gap-3 mb-6">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Carregando informações do app...</span>
            </div>
          )}

          {error && (
            <Alert className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {error}. Entre em contato com o suporte se o problema persistir.
                {isAdmin && (
                  <div className="mt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate('/admin/app-manager')}
                      className="text-xs"
                    >
                      <Settings className="h-3 w-3 mr-1" />
                      Gerenciar APKs
                    </Button>
                  </div>
                )}
              </AlertDescription>
            </Alert>
          )}

          {/* Download Options */}
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            {/* Android */}
            <Card className="relative overflow-hidden">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                    <Globe className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <CardTitle>Android</CardTitle>
                    <p className="text-muted-foreground">Para dispositivos Android 8.0+</p>
                    {apkFile && (
                      <div className="text-xs text-muted-foreground space-y-1">
                        <p>Tamanho: {formatFileSize(apkFile.size)}</p>
                        <p>Versão: {apkFile.name.replace('.apk', '').replace('vida-leve-', '')}</p>
                      </div>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Button 
                  onClick={handleDownloadAndroid}
                  className="w-full mb-4"
                  variant={isAndroid ? "default" : "outline"}
                  disabled={loading || !apkFile}
                >
                  <Download className="h-4 w-4 mr-2" />
                  {loading ? 'Carregando...' : isAndroid ? 'Baixar para seu Android' : 'Baixar APK'}
                </Button>
                
                {isAndroid && (
                  <Alert className="mb-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription className="text-xs">
                      <strong>Instruções para Android:</strong><br />
                      1. Após o download, abra o arquivo APK<br />
                      2. Permita a instalação de "Fontes desconhecidas" se solicitado<br />
                      3. Siga as instruções na tela para completar a instalação
                    </AlertDescription>
                  </Alert>
                )}

                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Instalação direta (APK)</li>
                  <li>• Funciona offline</li>
                  <li>• Todas as funcionalidades</li>
                </ul>
              </CardContent>
            </Card>

            {/* iOS */}
            <Card className="relative overflow-hidden">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                    <Apple className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <CardTitle>iOS</CardTitle>
                    <p className="text-muted-foreground">Para iPhone e iPad</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Button 
                  onClick={handleDownloadiOS}
                  className="w-full mb-4"
                  variant={isIOS ? "default" : "outline"}
                >
                  <Apple className="h-4 w-4 mr-2" />
                  {isIOS ? 'Baixar para seu iPhone' : 'Baixar da App Store'}
                </Button>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Via App Store</li>
                  <li>• Seguro e verificado</li>
                  <li>• Integração com Health</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Features */}
          <Card>
            <CardHeader>
              <CardTitle>O que você terá no app móvel:</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Smartphone className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">Interface Otimizada</h3>
                  <p className="text-sm text-muted-foreground">
                    Design adaptado para facilitar o uso em dispositivos móveis
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Download className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">Acesso Offline</h3>
                  <p className="text-sm text-muted-foreground">
                    Consulte seus planos e receitas mesmo sem internet
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Globe className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">Sincronização</h3>
                  <p className="text-sm text-muted-foreground">
                    Seus dados sempre sincronizados entre web e móvel
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Instructions */}
          <div className="mt-12 text-center">
            <p className="text-muted-foreground mb-4">
              Precisa de ajuda com a instalação?
            </p>
            <Button variant="outline" onClick={() => navigate('/chat')}>
              Falar com Suporte
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default BaixarApp;