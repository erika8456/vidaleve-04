import { useState, useEffect } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { toast } from 'sonner'

interface WeightData {
  currentWeight: number
  targetWeight: number
  initialWeight: number
}

export function useWeightTracking() {
  const [weightData, setWeightData] = useState<WeightData>({
    currentWeight: 78,
    targetWeight: 70,
    initialWeight: 85
  })

  const updateCurrentWeight = async (newWeight: number) => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      // Update locally first
      setWeightData(prev => ({ ...prev, currentWeight: newWeight }))
      
      // Store in user profile (you can extend this later)
      localStorage.setItem('currentWeight', newWeight.toString())
      
      toast.success('Peso atualizado com sucesso!')
    } catch (error) {
      console.error('Erro ao atualizar peso:', error)
      toast.error('Erro ao atualizar peso')
    }
  }

  const updateTargetWeight = async (newTarget: number) => {
    try {
      setWeightData(prev => ({ ...prev, targetWeight: newTarget }))
      localStorage.setItem('targetWeight', newTarget.toString())
      toast.success('Meta de peso atualizada!')
    } catch (error) {
      console.error('Erro ao atualizar meta:', error)
      toast.error('Erro ao atualizar meta')
    }
  }

  useEffect(() => {
    // Load saved weights from localStorage
    const savedCurrent = localStorage.getItem('currentWeight')
    const savedTarget = localStorage.getItem('targetWeight')
    const savedInitial = localStorage.getItem('initialWeight')
    
    if (savedCurrent || savedTarget || savedInitial) {
      setWeightData({
        currentWeight: savedCurrent ? parseFloat(savedCurrent) : 78,
        targetWeight: savedTarget ? parseFloat(savedTarget) : 70,
        initialWeight: savedInitial ? parseFloat(savedInitial) : 85
      })
    }
  }, [])

  const progressPercentage = ((weightData.initialWeight - weightData.currentWeight) / (weightData.initialWeight - weightData.targetWeight)) * 100
  
  return {
    ...weightData,
    progressPercentage: Math.max(0, Math.min(100, progressPercentage)),
    updateCurrentWeight,
    updateTargetWeight
  }
}