import { useState, useEffect } from "react"
import { supabase } from "@/integrations/supabase/client"

interface Meal {
  id: string
  name: string
  description: string
  calories: number
}

interface TodayMeal {
  meal: Meal
  type: string
  typeLabel: string
  isCompleted: boolean
  calories: number
}

export function useTodayMeals() {
  const [todayMeals, setTodayMeals] = useState<TodayMeal[]>([])
  const [loading, setLoading] = useState(true)

  const loadTodayMeals = async () => {
    try {
      const today = new Date().toISOString().split('T')[0]
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      // Get today's meal plan
      const { data: mealPlan } = await supabase
        .from('daily_meal_plans')
        .select(`
          *,
          breakfast_meal:breakfast_meal_id(id, name, description, calories),
          lunch_meal:lunch_meal_id(id, name, description, calories),
          snack_meal:snack_meal_id(id, name, description, calories),
          dinner_meal:dinner_meal_id(id, name, description, calories)
        `)
        .eq('date', today)
        .eq('user_id', user.id)
        .maybeSingle()

      // Get today's completions
      const { data: completions } = await supabase
        .from('meal_completions')
        .select('meal_id, meal_type')
        .eq('completed_date', today)
        .eq('user_id', user.id)

      if (mealPlan) {
        const meals: TodayMeal[] = []
        
        const mealTypes = [
          { key: 'breakfast_meal', type: 'cafe_manha', label: 'Café da Manhã' },
          { key: 'lunch_meal', type: 'almoco', label: 'Almoço' },
          { key: 'snack_meal', type: 'lanche', label: 'Lanche' },
          { key: 'dinner_meal', type: 'jantar', label: 'Jantar' }
        ]

        mealTypes.forEach(({ key, type, label }) => {
          const meal = mealPlan[key as keyof typeof mealPlan] as any
          if (meal) {
            const isCompleted = completions?.some(c => c.meal_id === meal.id && c.meal_type === type) || false
            meals.push({
              meal,
              type,
              typeLabel: label,
              isCompleted,
              calories: meal.calories || 0
            })
          }
        })

        setTodayMeals(meals)
      } else {
        setTodayMeals([])
      }
    } catch (error) {
      console.error('Erro ao carregar refeições de hoje:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadTodayMeals()

    // Setup realtime subscriptions
    const mealPlansChannel = supabase
      .channel('today-meal-plans')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'daily_meal_plans'
      }, () => {
        loadTodayMeals()
      })
      .subscribe()

    const completionsChannel = supabase
      .channel('today-completions')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'meal_completions'
      }, () => {
        loadTodayMeals()
      })
      .subscribe()

    return () => {
      supabase.removeChannel(mealPlansChannel)
      supabase.removeChannel(completionsChannel)
    }
  }, [])

  return { todayMeals, loading, refreshMeals: loadTodayMeals }
}