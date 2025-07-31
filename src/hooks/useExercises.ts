import { useState, useEffect } from 'react'
import { supabase } from '@/integrations/supabase/client'

interface Exercise {
  id: string
  name: string
  description: string
  image_url: string
  instructions: string
  duration_minutes: number
  difficulty_level: string
  day_of_week: number
}

export function useExercises() {
  const [exercises, setExercises] = useState<Exercise[]>([])
  const [todayExercise, setTodayExercise] = useState<Exercise | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchExercises()
  }, [])

  const fetchExercises = async () => {
    try {
      const { data, error } = await supabase
        .from('exercises')
        .select('*')
        .order('day_of_week')

      if (error) throw error

      setExercises(data || [])
      
      // Get today's exercise
      const today = new Date().getDay()
      const todayEx = data?.find(ex => ex.day_of_week === today)
      setTodayExercise(todayEx || null)
    } catch (error) {
      console.error('Erro ao buscar exercícios:', error)
    } finally {
      setLoading(false)
    }
  }

  return {
    exercises,
    todayExercise,
    loading,
    refetch: fetchExercises
  }
}