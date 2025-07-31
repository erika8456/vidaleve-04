import { useEffect } from 'react'
import { useTrialStatus } from './useTrialStatus'
import { useToast } from '@/hooks/use-toast'

export function useTrialNotifications() {
  const { daysRemaining, isTrialActive } = useTrialStatus()
  const { toast } = useToast()

  useEffect(() => {
    if (isTrialActive && daysRemaining === 1) {
      toast({
        title: "⚠️ Último dia de teste!",
        description: "Seu período de teste termina amanhã. Assine agora para continuar usando o app!",
        variant: "destructive",
      })
    }
  }, [daysRemaining, isTrialActive, toast])

  // Block access if trial expired
  const hasAccess = isTrialActive || daysRemaining > 0

  return {
    hasAccess,
    daysRemaining,
    isTrialActive
  }
}