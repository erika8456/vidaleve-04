import { AlertTriangle, Crown, CreditCard } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom'

interface PlanRestrictionBannerProps {
  currentPlan: string
  requiredPlan: string
  featureName: string
}

export function PlanRestrictionBanner({ currentPlan, requiredPlan, featureName }: PlanRestrictionBannerProps) {
  const navigate = useNavigate()

  const handleUpgrade = () => {
    navigate('/assinatura')
  }

  return (
    <Alert className="mb-6 border-orange-200 bg-orange-50 text-orange-800 dark:border-orange-800 dark:bg-orange-950 dark:text-orange-100">
      <AlertTriangle className="h-4 w-4 text-orange-600 dark:text-orange-400" />
      <AlertDescription className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <span>
            <strong>Funcionalidade Restrita:</strong> {featureName}
          </span>
          <span className="text-sm">
            Seu plano atual ({currentPlan}) não inclui acesso a esta funcionalidade. 
            {requiredPlan === 'Elite' && (
              <span className="inline-flex items-center ml-1">
                Faça upgrade para <Crown className="w-4 h-4 mx-1" /> Elite
              </span>
            )}
          </span>
        </div>
        <Button 
          onClick={handleUpgrade}
          size="sm" 
          className="bg-orange-600 hover:bg-orange-700 text-white dark:bg-orange-600 dark:hover:bg-orange-700"
        >
          <CreditCard className="h-4 w-4 mr-2" />
          Fazer Upgrade
        </Button>
      </AlertDescription>
    </Alert>
  )
}