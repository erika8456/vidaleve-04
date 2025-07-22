import { useState, useEffect } from 'react'
import { supabase } from '@/integrations/supabase/client'

interface StreakData {
  currentStreak: number
  longestStreak: number
  lastActivityDate: string | null
  totalActiveDays: number
}

export function useStreakTracking() {
  const [streakData, setStreakData] = useState<StreakData>({
    currentStreak: 0,
    longestStreak: 0,
    lastActivityDate: null,
    totalActiveDays: 0
  })

  useEffect(() => {
    loadStreakData()
  }, [])

  const loadStreakData = () => {
    const saved = localStorage.getItem('streakData')
    if (saved) {
      try {
        const data = JSON.parse(saved)
        setStreakData(data)
        updateStreakIfNeeded(data)
      } catch (error) {
        console.error('Error loading streak data:', error)
      }
    }
  }

  const updateStreakIfNeeded = (data: StreakData) => {
    const today = new Date().toDateString()
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toDateString()
    
    if (data.lastActivityDate) {
      const lastDate = new Date(data.lastActivityDate).toDateString()
      
      // If last activity was yesterday, maintain streak
      // If last activity was today, no change needed
      // If last activity was before yesterday, reset streak
      if (lastDate !== today && lastDate !== yesterday) {
        const resetData = {
          ...data,
          currentStreak: 0
        }
        setStreakData(resetData)
        localStorage.setItem('streakData', JSON.stringify(resetData))
      }
    }
  }

  const recordActivity = () => {
    const today = new Date().toDateString()
    
    setStreakData(prev => {
      // Don't count multiple activities on the same day
      if (prev.lastActivityDate === today) {
        return prev
      }

      const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toDateString()
      const lastDate = prev.lastActivityDate ? new Date(prev.lastActivityDate).toDateString() : null
      
      let newStreak = prev.currentStreak
      
      if (lastDate === yesterday) {
        // Consecutive day
        newStreak = prev.currentStreak + 1
      } else if (lastDate === today) {
        // Same day, no change
        newStreak = prev.currentStreak
      } else {
        // Gap in days, start new streak
        newStreak = 1
      }

      const newData = {
        currentStreak: newStreak,
        longestStreak: Math.max(prev.longestStreak, newStreak),
        lastActivityDate: today,
        totalActiveDays: prev.totalActiveDays + (lastDate === today ? 0 : 1)
      }

      localStorage.setItem('streakData', JSON.stringify(newData))
      return newData
    })
  }

  return {
    ...streakData,
    recordActivity
  }
}