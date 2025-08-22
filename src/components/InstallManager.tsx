import { useState, useEffect } from 'react'
import { toast } from 'sonner'

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

// PWA Telemetry (anonymous usage events)
const trackPWAEvent = (event: string, data?: any) => {
  try {
    // Simple anonymous telemetry - no PII
    console.log(`PWA Event: ${event}`, data)
    // Could send to analytics service here
  } catch (error) {
    // Silent fail for telemetry
  }
}

export function useInstallManager() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [isInstallable, setIsInstallable] = useState(false)
  const [isInstalled, setIsInstalled] = useState(false)

  useEffect(() => {
    // Check if app is already installed
    const checkIfInstalled = () => {
      const isStandalone = window.matchMedia && window.matchMedia('(display-mode: standalone)').matches
      const isIOSStandalone = (window.navigator as any).standalone === true
      
      if (isStandalone || isIOSStandalone) {
        setIsInstalled(true)
        setIsInstallable(false)
        trackPWAEvent('pwa_already_installed')
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
      trackPWAEvent('pwa_install_prompt_shown')
      console.log('PWA install prompt captured')
    }

    // Listen for successful installation
    const handleAppInstalled = () => {
      setIsInstalled(true)
      setIsInstallable(false)
      setDeferredPrompt(null)
      trackPWAEvent('pwa_appinstalled')
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
      // Show manual installation instructions for different platforms
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent)
      const isAndroid = /Android/.test(navigator.userAgent)
      
      trackPWAEvent('pwa_manual_install_shown', { platform: isIOS ? 'ios' : isAndroid ? 'android' : 'desktop' })
      
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
      
      trackPWAEvent(outcome === 'accepted' ? 'pwa_install_accepted' : 'pwa_install_dismissed')
      
      if (outcome === 'accepted') {
        toast.success('Instalação iniciada...')
      } else {
        toast.info('Instalação cancelada')
      }
      
      setDeferredPrompt(null)
      setIsInstallable(false)
    } catch (error) {
      console.error('Error during PWA installation:', error)
      trackPWAEvent('pwa_install_error', { error: error.message })
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