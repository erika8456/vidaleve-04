import { AlertTriangle, Clock } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { useTrialStatus } from '@/hooks/useTrialStatus'
import { useNavigate } from 'react-router-dom'

export function TrialBanner() {
  const { daysRemaining, isTrialActive, isLoading } = useTrialStatus()
  const navigate = useNavigate()

  if (isLoading || !isTrialActive) return null

  const handleUpgrade = () => {
    navigate('/assinatura')
  }

  return (
    <Alert className="mb-6 border-orange-200 bg-orange-50 text-orange-800">
      <Clock className="h-4 w-4 text-orange-600" />
      <AlertDescription className="flex items-center justify-between">
        <span>
          <strong>Período de teste:</strong> {daysRemaining} {daysRemaining === 1 ? 'dia restante' : 'dias restantes'}
        </span>
        <Button 
          onClick={handleUpgrade}
          size="sm" 
          className="bg-orange-600 hover:bg-orange-700 text-white"
        >
          Assinar Agora
        </Button>
      </AlertDescription>
    </Alert>
  )
}