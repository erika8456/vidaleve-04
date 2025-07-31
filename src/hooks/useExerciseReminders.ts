import { useState, useEffect } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { useToast } from '@/hooks/use-toast'

interface ExerciseReminder {
  id: string
  user_id: string
  reminder_time: string
  is_active: boolean
}

export function useExerciseReminders() {
  const [reminder, setReminder] = useState<ExerciseReminder | null>(null)
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    fetchReminder()
    setupReminderNotifications()
  }, [])

  const fetchReminder = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data, error } = await supabase
        .from('exercise_reminders')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle()

      if (error) throw error
      setReminder(data)
    } catch (error) {
      console.error('Erro ao buscar lembrete:', error)
    } finally {
      setLoading(false)
    }
  }

  const setupReminderNotifications = () => {
    const checkTime = () => {
      if (!reminder?.is_active) return
      
      const now = new Date()
      const [hours, minutes] = reminder.reminder_time.split(':')
      const reminderTime = new Date()
      reminderTime.setHours(parseInt(hours), parseInt(minutes), 0, 0)

      // Show notification at reminder time
      if (Math.abs(now.getTime() - reminderTime.getTime()) < 60000) { // Within 1 minute
        toast({
          title: "🏃‍♂️ Hora do exercício!",
          description: "Não se esqueça de fazer seu exercício diário para manter a forma!",
        })
      }
    }

    const interval = setInterval(checkTime, 60000) // Check every minute
    return () => clearInterval(interval)
  }

  const updateReminder = async (time: string, isActive: boolean) => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      if (reminder) {
        const { error } = await supabase
          .from('exercise_reminders')
          .update({ reminder_time: time, is_active: isActive })
          .eq('id', reminder.id)

        if (error) throw error
      } else {
        const { error } = await supabase
          .from('exercise_reminders')
          .insert({ user_id: user.id, reminder_time: time, is_active: isActive })

        if (error) throw error
      }

      await fetchReminder()
    } catch (error) {
      console.error('Erro ao atualizar lembrete:', error)
    }
  }

  return {
    reminder,
    loading,
    updateReminder,
    refetch: fetchReminder
  }
}