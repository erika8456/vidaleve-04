import { useState, useEffect } from 'react'

interface Notification {
  id: string
  title: string
  message: string
  timestamp: Date
  read: boolean
}

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      title: 'Novo plano disponível',
      message: 'Seu plano semanal foi atualizado com receitas especiais para diabetes.',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 horas atrás
      read: false
    },
    {
      id: '2',
      title: 'Lembrete de refeição',
      message: 'Hora do almoço! Não se esqueça do salmão grelhado.',
      timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 min atrás
      read: false
    }
  ])

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

  return {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead
  }
}