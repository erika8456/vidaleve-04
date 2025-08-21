import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Smartphone, Download, Apple, Globe } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"

const BaixarApp = () => {
  const navigate = useNavigate()
  
  // Detect user's platform
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent)
  const isAndroid = /Android/.test(navigator.userAgent)
  
  const handleDownloadAndroid = () => {
    // For now, redirect to app info since APK generation requires build process
    toast.info('Em breve o download direto do APK estará disponível!')
  }
  
  const handleDownloadiOS = () => {
    // For now, redirect to app info since App Store requires publishing
    toast.info('Em breve na App Store!')
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
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Button 
                  onClick={handleDownloadAndroid}
                  className="w-full mb-4"
                  variant={isAndroid ? "default" : "outline"}
                >
                  <Download className="h-4 w-4 mr-2" />
                  {isAndroid ? 'Baixar para seu Android' : 'Baixar APK'}
                </Button>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Instalação direta (APK)</li>
                  <li>• Funciona offline</li>
                  <li>• Atualizações automáticas</li>
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