import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Smartphone, Download, X } from "lucide-react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"

export function DownloadAppBanner() {
  const [isVisible, setIsVisible] = useState(true)
  const navigate = useNavigate()

  // Don't show if user dismissed it
  if (!isVisible) return null

  // Detect mobile device
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
  
  // Don't show on desktop
  if (!isMobile) return null

  return (
    <Card className="fixed bottom-4 left-4 right-4 z-50 bg-gradient-to-r from-primary to-primary-variant text-primary-foreground shadow-lg">
      <div className="flex items-center gap-3 p-4">
        <div className="flex-shrink-0">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
            <Smartphone className="h-5 w-5" />
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-sm">Baixe nosso app!</h3>
          <p className="text-xs opacity-90">
            Tenha o Vida Leve sempre com você
          </p>
        </div>
        <Button
          size="sm"
          variant="secondary"
          onClick={() => navigate('/baixar-app')}
          className="flex-shrink-0"
        >
          <Download className="h-4 w-4 mr-1" />
          Baixar
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => setIsVisible(false)}
          className="flex-shrink-0 text-white hover:bg-white/10"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </Card>
  )
}