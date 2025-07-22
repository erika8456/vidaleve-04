import { useState, useEffect } from 'react'
import { supabase } from '@/integrations/supabase/client'

interface Notification {
  id: string
  title: string
  message: string
  timestamp: Date
  read: boolean
  type: 'meal' | 'progress' | 'system' | 'reminder'
}

export function useRealTimeNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([])

  useEffect(() => {
    // Initialize with some sample notifications
    const initialNotifications: Notification[] = [
      {
        id: '1',
        title: 'Lembrete de refeição',
        message: 'Hora do almoço! Não se esqueça do salmão grelhado.',
        timestamp: new Date(Date.now() - 30 * 60 * 1000),
        read: false,
        type: 'meal'
      }
    ]
    setNotifications(initialNotifications)

    // Add meal reminders based on time
    const addMealReminders = () => {
      const now = new Date()
      const hour = now.getHours()
      
      let mealReminder: Notification | null = null
      
      if (hour === 7 || hour === 8) {
        mealReminder = {
          id: `meal-${Date.now()}`,
          title: 'Hora do Café da Manhã! ☕',
          message: 'Comece o dia com energia! Que tal uma omelete de espinafre?',
          timestamp: new Date(),
          read: false,
          type: 'meal'
        }
      } else if (hour === 12 || hour === 13) {
        mealReminder = {
          id: `meal-${Date.now()}`,
          title: 'Hora do Almoço! 🍽️',
          message: 'Mantenha sua alimentação em dia com um salmão grelhado com quinoa.',
          timestamp: new Date(),
          read: false,
          type: 'meal'
        }
      } else if (hour === 19 || hour === 20) {
        mealReminder = {
          id: `meal-${Date.now()}`,
          title: 'Hora do Jantar! 🌙',
          message: 'Uma refeição leve para terminar o dia: sopa de legumes com frango.',
          timestamp: new Date(),
          read: false,
          type: 'meal'
        }
      }

      if (mealReminder) {
        setNotifications(prev => {
          // Check if we already have a recent meal reminder
          const hasRecentMealReminder = prev.some(n => 
            n.type === 'meal' && 
            new Date().getTime() - n.timestamp.getTime() < 2 * 60 * 60 * 1000 // 2 hours
          )
          
          if (!hasRecentMealReminder) {
            return [mealReminder, ...prev].slice(0, 10) // Keep only last 10 notifications
          }
          return prev
        })
      }
    }

    // Check for meal reminders every minute
    const mealInterval = setInterval(addMealReminders, 60000)

    // Add progress notifications randomly
    const addProgressNotifications = () => {
      const progressMessages = [
        'Parabéns! Você está no caminho certo! 🎉',
        'Continue assim! Sua dedicação está fazendo a diferença! 💪',
        'Que progresso incrível! Você está arrasando! ⭐',
        'Cada passo conta! Você está indo muito bem! 🚀'
      ]

      // 20% chance of adding a progress notification every 5 minutes
      if (Math.random() < 0.2) {
        const message = progressMessages[Math.floor(Math.random() * progressMessages.length)]
        const progressNotification: Notification = {
          id: `progress-${Date.now()}`,
          title: 'Progresso Reconhecido',
          message,
          timestamp: new Date(),
          read: false,
          type: 'progress'
        }

        setNotifications(prev => [progressNotification, ...prev].slice(0, 10))
      }
    }

    // Check for progress notifications every 5 minutes
    const progressInterval = setInterval(addProgressNotifications, 5 * 60 * 1000)

    return () => {
      clearInterval(mealInterval)
      clearInterval(progressInterval)
    }
  }, [])

  const unreadCount = notifications.filter(n => !n.read).length

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, read: true }
          : notification
      )
    )
  }

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    )
  }

  const addCustomNotification = (title: string, message: string, type: Notification['type'] = 'system') => {
    const newNotification: Notification = {
      id: `custom-${Date.now()}`,
      title,
      message,
      timestamp: new Date(),
      read: false,
      type
    }
    
    setNotifications(prev => [newNotification, ...prev].slice(0, 10))
  }

  return {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    addCustomNotification
  }
}