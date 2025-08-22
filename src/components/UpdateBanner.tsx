import { useEffect, useState } from "react"
import { RefreshCw, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { toast } from "sonner"

export function UpdateBanner() {
  const [showUpdate, setShowUpdate] = useState(false)
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    if (!('serviceWorker' in navigator)) return

    const registerSW = async () => {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js')
        
        // Check for updates on page load
        registration.update()

        // Listen for new service worker
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing
          if (!newWorker) return

          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              setShowUpdate(true)
            }
          })
        })

        // Listen for controller change (when new SW takes control)
        navigator.serviceWorker.addEventListener('controllerchange', () => {
          if (refreshing) return
          window.location.reload()
        })

      } catch (error) {
        console.log('SW registration failed:', error)
      }
    }

    registerSW()
  }, [refreshing])

  const handleUpdate = async () => {
    if (!navigator.serviceWorker.controller) return
    
    setRefreshing(true)
    
    // Send skip waiting message to the new service worker
    const registration = await navigator.serviceWorker.getRegistration()
    if (registration?.waiting) {
      registration.waiting.postMessage({ type: 'SKIP_WAITING' })
    }
    
    toast.success("Atualizando app...")
  }

  const handleDismiss = () => {
    setShowUpdate(false)
    // Store dismissal for this session
    sessionStorage.setItem('update-dismissed', 'true')
  }

  // Don't show if dismissed this session
  if (sessionStorage.getItem('update-dismissed') === 'true') return null
  
  if (!showUpdate) return null

  return (
    <Card className="fixed top-4 left-4 right-4 z-50 bg-primary text-primary-foreground shadow-lg md:left-auto md:right-4 md:max-w-sm">
      <div className="flex items-center gap-3 p-4">
        <div className="flex-shrink-0">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
            <RefreshCw className="h-5 w-5" />
          </div>
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-sm">Nova versão disponível!</h3>
          <p className="text-xs opacity-90">
            Atualize para ter as últimas melhorias
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="secondary"
            onClick={handleUpdate}
            disabled={refreshing}
            className="flex-shrink-0"
          >
            {refreshing ? (
              <RefreshCw className="h-4 w-4 mr-1 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4 mr-1" />
            )}
            Atualizar
          </Button>
          
          <Button
            size="sm"
            variant="ghost"
            onClick={handleDismiss}
            className="flex-shrink-0 text-white hover:bg-white/10"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  )
}