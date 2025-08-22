import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Smartphone, Plus, Apple, Globe, Monitor, Share, Link, Download } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"
import { useEffect, useState } from "react"

const BaixarApp = () => {
  const navigate = useNavigate()
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [isInstallable, setIsInstallable] = useState(false)
  
  // Detect user's platform
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent)
  const isAndroid = /Android/.test(navigator.userAgent)
  const isMobile = isIOS || isAndroid
  
  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setIsInstallable(true)
    }
    
    window.addEventListener('beforeinstallprompt', handler)
    
    // Check if app is already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstallable(false)
    }
    
    return () => {
      window.removeEventListener('beforeinstallprompt', handler)
    }
  }, [])
  
  const handleInstallPWA = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice
      
      if (outcome === 'accepted') {
        toast.success('App instalado com sucesso!')
      } else {
        toast.info('Instalação cancelada')
      }
      
      setDeferredPrompt(null)
      setIsInstallable(false)
    } else {
      // Manual installation instructions
      if (isAndroid) {
        toast.info('Para instalar: toque no menu do navegador (⋮) e selecione "Adicionar à tela inicial"')
      } else if (isIOS) {
        toast.info('Para instalar: toque no botão compartilhar (⎍) e selecione "Adicionar à Tela de Início"')
      } else {
        toast.info('Busque pela opção "Instalar app" no menu do seu navegador')
      }
    }
  }
  
  const handleOpenInBrowser = () => {
    if (isIOS) {
      toast.info('Abra este link no Safari para melhor experiência de instalação PWA')
    } else {
      toast.info('Use o Chrome ou Edge for melhor experiência de instalação')
    }
    window.open(window.location.href, '_blank')
  }

  const handleDirectDownload = () => {
    const appUrl = window.location.origin
    window.open(appUrl, '_blank')
    toast.success('App aberto em nova aba!')
  }

  const handleShareApp = async () => {
    const appUrl = window.location.origin
    const shareData = {
      title: 'App Vida Leve',
      text: 'Baixe o app Vida Leve - Sua nutrição personalizada!',
      url: appUrl
    }

    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData)
        toast.success('App compartilhado!')
      } catch (error) {
        if (error.name !== 'AbortError') {
          // Fallback to copy
          handleCopyLink()
        }
      }
    } else {
      // Fallback to copy
      handleCopyLink()
    }
  }

  const handleCopyLink = async () => {
    const appUrl = window.location.origin
    try {
      await navigator.clipboard.writeText(appUrl)
      toast.success('Link copiado para área de transferência!')
    } catch (error) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea')
      textArea.value = appUrl
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      toast.success('Link copiado!')
    }
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
              Instale o App Vida Leve
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Acesse sua nutrição personalizada diretamente da tela inicial do seu dispositivo. 
              Funciona offline e sincroniza automaticamente!
            </p>
          </div>

          {/* Installation Options */}
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            {/* PWA Installation */}
            <Card className="relative overflow-hidden">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <Plus className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle>Instalação Direta</CardTitle>
                    <p className="text-muted-foreground">Funciona em todos os dispositivos</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Button 
                  onClick={handleInstallPWA}
                  className="w-full mb-4"
                  variant="default"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  {isInstallable ? 'Instalar App' : 'Ver Instruções de Instalação'}
                </Button>
                
                <div className="space-y-3 text-sm text-muted-foreground">
                  <div>
                    <strong className="text-foreground">Como instalar:</strong>
                    {isAndroid && (
                      <ul className="mt-1 space-y-1">
                        <li>• Toque no menu do navegador (⋮)</li>
                        <li>• Selecione "Adicionar à tela inicial"</li>
                        <li>• Confirme a instalação</li>
                      </ul>
                    )}
                    {isIOS && (
                      <ul className="mt-1 space-y-1">
                        <li>• Toque no botão compartilhar (⎍)</li>
                        <li>• Selecione "Adicionar à Tela de Início"</li>
                        <li>• Confirme a instalação</li>
                      </ul>
                    )}
                    {!isMobile && (
                      <ul className="mt-1 space-y-1">
                        <li>• Procure pelo ícone de instalação na barra de endereços</li>
                        <li>• Clique em "Instalar" quando aparecer</li>
                        <li>• Ou use o menu do navegador</li>
                      </ul>
                    )}
                  </div>
                </div>

                <ul className="text-sm text-muted-foreground space-y-1 mt-4">
                  <li>• Acesso instantâneo da tela inicial</li>
                  <li>• Funciona offline</li>
                  <li>• Atualizações automáticas</li>
                  <li>• Sem ocupar espaço extra</li>
                </ul>
              </CardContent>
            </Card>

            {/* Browser Access */}
            <Card className="relative overflow-hidden">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                    <Globe className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <CardTitle>Navegador</CardTitle>
                    <p className="text-muted-foreground">Acesso via browser</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Button 
                  onClick={handleOpenInBrowser}
                  className="w-full mb-4"
                  variant="outline"
                >
                  <Globe className="h-4 w-4 mr-2" />
                  Abrir no Navegador
                </Button>
                
                <div className="text-sm text-muted-foreground mb-4">
                  <strong className="text-foreground">Navegadores recomendados:</strong>
                  <ul className="mt-1 space-y-1">
                    {isIOS && <li>• Safari (melhor experiência no iOS)</li>}
                    {isAndroid && <li>• Chrome (melhor experiência no Android)</li>}
                    {!isMobile && (
                      <>
                        <li>• Chrome ou Edge (desktop)</li>
                        <li>• Firefox também suportado</li>
                      </>
                    )}
                  </ul>
                </div>

                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Sem instalação necessária</li>
                  <li>• Funciona em qualquer dispositivo</li>
                  <li>• Sincronização em tempo real</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Direct Download & Share Options */}
          <Card className="mb-12">
            <CardHeader>
              <CardTitle className="text-center">Acesso Direto ao App</CardTitle>
              <p className="text-center text-muted-foreground">
                Abra o app diretamente ou compartilhe com amigos
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <Button 
                  onClick={handleDirectDownload}
                  className="w-full"
                  variant="default"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Baixar App (Link Direto)
                </Button>
                
                <Button 
                  onClick={handleShareApp}
                  className="w-full"
                  variant="outline"
                >
                  <Share className="h-4 w-4 mr-2" />
                  Compartilhar
                </Button>
                
                <Button 
                  onClick={handleCopyLink}
                  className="w-full"
                  variant="outline"
                >
                  <Link className="h-4 w-4 mr-2" />
                  Copiar Link
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Features */}
          <Card className="mb-12">
            <CardHeader>
              <CardTitle>Vantagens do App Instalado:</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Smartphone className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">Interface Nativa</h3>
                  <p className="text-sm text-muted-foreground">
                    Experiência de app nativo, sem barreiras do navegador
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Monitor className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">Funciona Offline</h3>
                  <p className="text-sm text-muted-foreground">
                    Acesse seus planos e receitas mesmo sem internet
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Globe className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">Sempre Atualizado</h3>
                  <p className="text-sm text-muted-foreground">
                    Atualizações automáticas e dados sincronizados
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Instructions */}
          <div className="text-center">
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