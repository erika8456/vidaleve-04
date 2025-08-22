import { useState, useEffect } from 'react'
import { toast } from 'sonner'

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export function useInstallManager() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [isInstallable, setIsInstallable] = useState(false)
  const [isInstalled, setIsInstalled] = useState(false)

  useEffect(() => {
    // Check if app is already installed
    const checkIfInstalled = () => {
      if (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) {
        setIsInstalled(true)
        setIsInstallable(false)
        return true
      }
      return false
    }

    // Initial check
    if (checkIfInstalled()) return

    // Listen for install prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
      setIsInstallable(true)
      console.log('PWA install prompt captured')
    }

    // Listen for successful installation
    const handleAppInstalled = () => {
      setIsInstalled(true)
      setIsInstallable(false)
      setDeferredPrompt(null)
      toast.success('🎉 App instalado com sucesso! Você pode encontrá-lo na tela inicial.')
      console.log('PWA installed successfully')
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.addEventListener('appinstalled', handleAppInstalled)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('appinstalled', handleAppInstalled)
    }
  }, [])

  const installApp = async () => {
    if (!deferredPrompt) {
      // Show manual installation instructions
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent)
      const isAndroid = /Android/.test(navigator.userAgent)
      
      if (isIOS) {
        toast.info('Para instalar: toque no botão compartilhar (⎍) e selecione "Adicionar à Tela de Início"')
      } else if (isAndroid) {
        toast.info('Para instalar: toque no menu do navegador (⋮) e selecione "Adicionar à tela inicial"')
      } else {
        toast.info('Procure pela opção "Instalar app" no menu do seu navegador')
      }
      return
    }

    try {
      await deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice
      
      if (outcome === 'accepted') {
        toast.success('Instalação iniciada...')
      } else {
        toast.info('Instalação cancelada')
      }
      
      setDeferredPrompt(null)
      setIsInstallable(false)
    } catch (error) {
      console.error('Error during PWA installation:', error)
      toast.error('Erro na instalação. Tente novamente.')
    }
  }

  return {
    isInstallable,
    isInstalled,
    installApp,
    canInstall: isInstallable && !isInstalled
  }
}