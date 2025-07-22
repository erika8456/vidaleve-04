import { useState, useEffect } from 'react'
import { supabase } from '@/integrations/supabase/client'

interface TrialStatus {
  daysRemaining: number
  isTrialActive: boolean
  isLoading: boolean
}

export function useTrialStatus(): TrialStatus {
  const [trialStatus, setTrialStatus] = useState<TrialStatus>({
    daysRemaining: 0,
    isTrialActive: false,
    isLoading: true
  })

  useEffect(() => {
    async function fetchTrialStatus() {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        
        if (!user) {
          setTrialStatus({ daysRemaining: 0, isTrialActive: false, isLoading: false })
          return
        }

        const { data: profile } = await supabase
          .from('profiles')
          .select('trial_end, is_trial_active')
          .eq('id', user.id)
          .single()

        if (profile?.trial_end) {
          const trialEnd = new Date(profile.trial_end)
          const now = new Date()
          const diffTime = trialEnd.getTime() - now.getTime()
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
          
          setTrialStatus({
            daysRemaining: Math.max(0, diffDays),
            isTrialActive: profile.is_trial_active && diffDays > 0,
            isLoading: false
          })
        } else {
          setTrialStatus({ daysRemaining: 0, isTrialActive: false, isLoading: false })
        }
      } catch (error) {
        console.error('Erro ao buscar status do trial:', error)
        setTrialStatus({ daysRemaining: 0, isTrialActive: false, isLoading: false })
      }
    }

    fetchTrialStatus()
  }, [])

  return trialStatus
}