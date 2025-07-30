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

  const isLastDay = daysRemaining <= 1
  const alertClass = isLastDay 
    ? "mb-6 border-red-200 bg-red-50 text-red-800 dark:border-red-800 dark:bg-red-950 dark:text-red-100"
    : "mb-6 border-orange-200 bg-orange-50 text-orange-800 dark:border-orange-800 dark:bg-orange-950 dark:text-orange-100"

  const iconClass = isLastDay ? "h-4 w-4 text-red-600 dark:text-red-400" : "h-4 w-4 text-orange-600 dark:text-orange-400"
  const buttonClass = isLastDay 
    ? "bg-red-600 hover:bg-red-700 text-white dark:bg-red-600 dark:hover:bg-red-700"
    : "bg-orange-600 hover:bg-orange-700 text-white dark:bg-orange-600 dark:hover:bg-orange-700"

  return (
    <Alert className={alertClass}>
      {isLastDay ? <AlertTriangle className={iconClass} /> : <Clock className={iconClass} />}
      <AlertDescription className="flex items-center justify-between">
        <span>
          <strong>
            {isLastDay ? "⚠️ ÚLTIMO DIA DE TESTE!" : "Período de teste:"}
          </strong>{" "}
          {daysRemaining} {daysRemaining === 1 ? 'dia restante' : 'dias restantes'}
          {isLastDay && " - Assine agora para não perder o acesso!"}
        </span>
        <Button 
          onClick={handleUpgrade}
          size="sm" 
          className={buttonClass}
        >
          {isLastDay ? "Assinar Urgente!" : "Assinar Agora"}
        </Button>
      </AlertDescription>
    </Alert>
  )
}