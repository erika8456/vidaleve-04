import { useEffect, useState } from "react"
import { Download, X, Share } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useInstallManager } from "./InstallManager"
import { toast } from "sonner"

const isiOS = () => /iphone|ipad|ipod/i.test(navigator.userAgent.toLowerCase())
const isStandalone = () => 
  window.matchMedia?.("(display-mode: standalone)").matches || 
  (window.navigator as any).standalone === true

export function InstallPWAButton() {
  const { isInstallable, isInstalled, installApp, canInstall } = useInstallManager()
  const [showIOSInstructions, setShowIOSInstructions] = useState(false)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    // Check if user has dismissed the CTA
    const dismissedUntil = localStorage.getItem('pwa-install-dismissed')
    if (dismissedUntil && new Date().getTime() < parseInt(dismissedUntil)) {
      setDismissed(true)
    }
  }, [])

  if (isInstalled || dismissed) return null

  const handleInstall = async () => {
    if (isiOS()) {
      setShowIOSInstructions(true)
      return
    }

    if (canInstall) {
      await installApp()
    } else {
      toast.info("Procure pela opção 'Instalar app' no menu do seu navegador")
    }
  }

  const handleDismiss = () => {
    setDismissed(true)
    // Dismiss for 7 days
    const dismissUntil = new Date().getTime() + (7 * 24 * 60 * 60 * 1000)
    localStorage.setItem('pwa-install-dismissed', dismissUntil.toString())
  }

  return (
    <>
      {/* Desktop/Android Install Button */}
      <div className="fixed bottom-6 right-6 z-50 md:bottom-8 md:right-8">
        <div className="relative">
          <Button
            onClick={handleInstall}
            className="btn-senior gradient-primary text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300"
            size="lg"
          >
            <Download className="h-5 w-5 mr-2" />
            Baixar App
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDismiss}
            className="absolute -top-2 -right-2 h-6 w-6 p-0 rounded-full bg-muted hover:bg-muted-foreground/20"
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      </div>

      {/* iOS Instructions Modal */}
      <Dialog open={showIOSInstructions} onOpenChange={setShowIOSInstructions}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Share className="h-5 w-5 text-primary" />
              Como instalar no iOS
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="text-center space-y-2">
              <div className="text-6xl">📱</div>
              <p className="text-muted-foreground">
                Para instalar o Vida Leve na sua tela inicial:
              </p>
            </div>
            
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-semibold text-xs">
                  1
                </div>
                <p>Toque no botão <strong>Compartilhar</strong> (⎍) na barra inferior do Safari</p>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-semibold text-xs">
                  2
                </div>
                <p>Role para baixo e selecione <strong>"Adicionar à Tela de Início"</strong></p>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-semibold text-xs">
                  3
                </div>
                <p>Toque em <strong>"Adicionar"</strong> para confirmar</p>
              </div>
            </div>
            
            <div className="text-center pt-2">
              <Button 
                onClick={() => setShowIOSInstructions(false)}
                className="btn-senior"
              >
                Entendi!
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}