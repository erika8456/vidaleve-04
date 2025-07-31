import { useState, useEffect } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { useAuth } from '@/contexts/AuthContext'

interface SubscriptionData {
  subscribed: boolean
  subscription_tier: string
  subscription_end: string | null
  loading: boolean
}

export function useSubscription() {
  const { user } = useAuth()
  const [subscription, setSubscription] = useState<SubscriptionData>({
    subscribed: false,
    subscription_tier: 'trial',
    subscription_end: null,
    loading: true
  })

  useEffect(() => {
    if (!user) {
      setSubscription(prev => ({ ...prev, loading: false }))
      return
    }

    const fetchSubscription = async () => {
      try {
        const { data } = await supabase
          .from('subscribers')
          .select('subscribed, subscription_tier, subscription_end')
          .eq('user_id', user.id)
          .single()

        if (data) {
          setSubscription({
            subscribed: data.subscribed,
            subscription_tier: data.subscription_tier || 'trial',
            subscription_end: data.subscription_end,
            loading: false
          })
        } else {
          setSubscription({
            subscribed: false,
            subscription_tier: 'trial',
            subscription_end: null,
            loading: false
          })
        }
      } catch (error) {
        console.error('Erro ao buscar assinatura:', error)
        setSubscription(prev => ({ ...prev, loading: false }))
      }
    }

    fetchSubscription()

    // Setup realtime subscription
    const channel = supabase
      .channel('subscription-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'subscribers',
        filter: `user_id=eq.${user.id}`
      }, (payload) => {
        if (payload.new) {
          const newData = payload.new as any
          setSubscription({
            subscribed: newData.subscribed,
            subscription_tier: newData.subscription_tier || 'trial',
            subscription_end: newData.subscription_end,
            loading: false
          })
        }
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [user])

  const hasAccess = (feature: string) => {
    if (subscription.subscription_tier === 'elite') {
      return true
    }
    
    if (subscription.subscription_tier === 'basic') {
      // Basic plan restrictions
      const basicFeatures = ['chat', 'meal-plan', 'weight-tracking']
      return basicFeatures.includes(feature)
    }
    
    // Trial users have limited access
    return feature === 'chat'
  }

  return {
    ...subscription,
    hasAccess
  }
}