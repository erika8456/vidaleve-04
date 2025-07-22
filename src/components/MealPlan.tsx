import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Clock, Utensils, Users, Calendar } from "lucide-react"
import { supabase } from "@/integrations/supabase/client"
import { toast } from "sonner"

interface Meal {
  id: string
  name: string
  description: string
  ingredients: string[]
  instructions: string
  calories: number
}

interface MealPlan {
  id: string
  date: string
  breakfast_meal?: Meal | null
  lunch_meal?: Meal | null
  snack_meal?: Meal | null
  dinner_meal?: Meal | null
}

interface MealCompletion {
  meal_id: string
  meal_type: string
}

export default function MealPlan() {
  const [mealPlan, setMealPlan] = useState<MealPlan | null>(null)
  const [completions, setCompletions] = useState<MealCompletion[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])

  useEffect(() => {
    loadMealPlan()
    loadCompletions()
    
    // Setup realtime subscriptions
    const mealPlansChannel = supabase
      .channel('meal-plans-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'daily_meal_plans'
      }, () => {
        loadMealPlan()
      })
      .subscribe()

    const completionsChannel = supabase
      .channel('completions-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'meal_completions'
      }, () => {
        loadCompletions()
      })
      .subscribe()

    return () => {
      supabase.removeChannel(mealPlansChannel)
      supabase.removeChannel(completionsChannel)
    }
  }, [selectedDate])

  const loadMealPlan = async () => {
    try {
      const { data, error } = await supabase
        .from('daily_meal_plans')
        .select(`
          *,
          breakfast_meal:breakfast_meal_id(id, name, description, ingredients, instructions, calories),
          lunch_meal:lunch_meal_id(id, name, description, ingredients, instructions, calories),
          snack_meal:snack_meal_id(id, name, description, ingredients, instructions, calories),
          dinner_meal:dinner_meal_id(id, name, description, ingredients, instructions, calories)
        `)
        .eq('date', selectedDate)
        .maybeSingle()

      if (data && !error) {
        setMealPlan(data as any)
      } else {
        setMealPlan(null)
      }
    } catch (error) {
      console.error('Erro ao carregar plano:', error)
    }
  }

  const loadCompletions = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data, error } = await supabase
        .from('meal_completions')
        .select('meal_id, meal_type')
        .eq('completed_date', selectedDate)
        .eq('user_id', user.id)

      if (data) {
        setCompletions(data)
      }
    } catch (error) {
      console.error('Erro ao carregar completions:', error)
    }
  }

  const generateNewPlan = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase.functions.invoke('generate-meal-plan', {
        body: { 
          date: selectedDate,
          regenerate: true // Force new meal selection
        }
      })

      if (error) {
        toast.error('Erro ao gerar plano de refeições')
        return
      }

      if (data?.plan) {
        setMealPlan(data.plan)
        toast.success('Novo plano gerado com sucesso!')
        loadMealPlan() // Reload to get fresh data
      }
    } catch (error) {
      console.error('Erro:', error)
      toast.error('Erro ao gerar plano')
    } finally {
      setLoading(false)
    }
  }

  const toggleMealCompletion = async (mealId: string, mealType: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const isCompleted = completions.some(c => c.meal_id === mealId && c.meal_type === mealType)
      
      if (isCompleted) {
        const { error } = await supabase
          .from('meal_completions')
          .delete()
          .eq('meal_id', mealId)
          .eq('meal_type', mealType)
          .eq('completed_date', selectedDate)
          .eq('user_id', user.id)

        if (!error) {
          setCompletions(prev => prev.filter(c => !(c.meal_id === mealId && c.meal_type === mealType)))
          toast.success('Refeição desmarcada!')
        }
      } else {

        const { error } = await supabase
          .from('meal_completions')
          .insert({
            user_id: user.id,
            meal_id: mealId,
            meal_type: mealType,
            completed_date: selectedDate
          })

        if (!error) {
          setCompletions(prev => [...prev, { meal_id: mealId, meal_type: mealType }])
          toast.success('Refeição concluída!')
        }
      }
    } catch (error) {
      console.error('Erro ao atualizar completion:', error)
      toast.error('Erro ao atualizar refeição')
    }
  }

  const getMealTypeLabel = (type: string) => {
    const labels = {
      'cafe_manha': 'Café da Manhã',
      'almoco': 'Almoço',
      'lanche': 'Lanche',
      'jantar': 'Jantar'
    }
    return labels[type as keyof typeof labels] || type
  }

  const isMealCompleted = (mealId: string, mealType: string) => {
    return completions.some(c => c.meal_id === mealId && c.meal_type === mealType)
  }

  const getTotalCompletedMeals = () => {
    return completions.length
  }

  const renderMealCard = (meal: Meal, type: string) => {
    const isCompleted = isMealCompleted(meal.id, type)
    
    return (
      <Card key={type} className={`p-4 ${isCompleted ? 'bg-green-50 border-green-200' : ''}`}>
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <Utensils className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-lg">{getMealTypeLabel(type)}</h3>
          </div>
          <Button
            size="sm"
            variant={isCompleted ? "default" : "outline"}
            onClick={() => toggleMealCompletion(meal.id, type)}
            className={isCompleted ? "bg-green-600 hover:bg-green-700" : ""}
          >
            {isCompleted ? (
              <>
                <CheckCircle className="h-4 w-4 mr-2" />
                Concluída
              </>
            ) : (
              <>
                <Clock className="h-4 w-4 mr-2" />
                Marcar
              </>
            )}
          </Button>
        </div>

        <h4 className="font-medium text-primary mb-2">{meal.name}</h4>
        <p className="text-sm text-muted-foreground mb-3">{meal.description}</p>

        <div className="space-y-3">
          <div>
            <h5 className="font-medium text-sm mb-1">Ingredientes:</h5>
            <ul className="text-sm text-muted-foreground list-disc list-inside">
              {meal.ingredients.map((ingredient, index) => (
                <li key={index}>{ingredient}</li>
              ))}
            </ul>
          </div>

          <div>
            <h5 className="font-medium text-sm mb-1">Modo de preparo:</h5>
            <p className="text-sm text-muted-foreground">{meal.instructions}</p>
          </div>

          <div className="flex items-center justify-between">
            <Badge variant="secondary">
              {meal.calories} kcal
            </Badge>
          </div>
        </div>
      </Card>
    )
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Calendar className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold">Plano de Refeições</h1>
        </div>
        
        <div className="flex items-center gap-4">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-3 py-2 border rounded-lg"
          />
          <Button 
            onClick={generateNewPlan} 
            disabled={loading}
            className="gradient-primary text-white"
          >
            {loading ? 'Gerando...' : 'Gerar Novo Plano'}
          </Button>
        </div>
      </div>

      {mealPlan ? (
        <>
          <div className="mb-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200">
            <div className="flex items-center gap-2 mb-2">
              <Users className="h-5 w-5 text-green-600" />
              <h2 className="font-semibold text-green-800">Progresso do Dia</h2>
            </div>
            <p className="text-green-700">
              {getTotalCompletedMeals()} de 4 refeições concluídas
              {getTotalCompletedMeals() === 4 && " 🎉 Parabéns! Você completou todas as refeições do dia!"}
            </p>
            <div className="w-full bg-green-200 rounded-full h-2 mt-2">
              <div 
                className="bg-green-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(getTotalCompletedMeals() / 4) * 100}%` }}
              ></div>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {mealPlan.breakfast_meal && renderMealCard(mealPlan.breakfast_meal, 'cafe_manha')}
            {mealPlan.lunch_meal && renderMealCard(mealPlan.lunch_meal, 'almoco')}
            {mealPlan.snack_meal && renderMealCard(mealPlan.snack_meal, 'lanche')}
            {mealPlan.dinner_meal && renderMealCard(mealPlan.dinner_meal, 'jantar')}
          </div>
        </>
      ) : (
        <Card className="p-8 text-center">
          <Utensils className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Nenhum plano encontrado</h2>
          <p className="text-muted-foreground mb-4">
            Gere um plano de refeições personalizado para começar!
          </p>
          <Button 
            onClick={generateNewPlan} 
            disabled={loading}
            className="gradient-primary text-white"
          >
            {loading ? 'Gerando...' : 'Gerar Plano de Refeições'}
          </Button>
        </Card>
      )}
    </div>
  )
}