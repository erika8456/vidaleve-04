import { Layout } from '@/components/Layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Clock, Trophy, Calendar } from 'lucide-react'
import { useExercises } from '@/hooks/useExercises'
import { useTrialNotifications } from '@/hooks/useTrialNotifications'
import { useSubscription } from '@/hooks/useSubscription'
import { useNavigate } from 'react-router-dom'

const difficultyColors = {
  easy: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100',
  medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100',
  hard: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100'
}

const dayNames = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado']

// Sistema de imagens dinâmicas que mudam por dia
const getDynamicImageForExercise = (exerciseId: string, day: number) => {
  const imageVariations = [
    'photo-1544367567-0f2fcb009e0b', // Yoga woman
    'photo-1571019613454-1cb2f99b2d8b', // HIIT workout
    'photo-1584464491033-06628f3a6b7b', // Strength training
    'photo-1506629905607-0e2b5d3cc8e7', // Pilates
    'photo-1593079831268-3381b0db4a77', // Stretching
    'photo-1517836357463-d25dfeac3438', // CrossTraining
    'photo-1518611012118-696072aa579a', // Push ups
    'photo-1550259979-ed79b48d2a30', // Squats
    'photo-1571019614242-c5c5dee9f50b', // Running
    'photo-1581009146145-b5ef050c2e1e'  // Gym workout
  ]
  
  // Combina o ID do exercício com o dia para gerar uma variação consistente
  const hash = exerciseId.split('').reduce((a, b) => a + b.charCodeAt(0), 0)
  const index = (hash + day) % imageVariations.length
  return imageVariations[index]
}

export default function Exercicios() {
  const { exercises, todayExercise, loading } = useExercises()
  const { hasAccess } = useTrialNotifications()
  const { hasAccess: hasSubscriptionAccess } = useSubscription()
  const navigate = useNavigate()

  const currentDay = new Date().getDate() // Pega o dia atual para variar as imagens

  if (!hasAccess) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <Card className="max-w-md mx-auto text-center">
            <CardHeader>
              <CardTitle className="text-red-600">Acesso Expirado</CardTitle>
              <CardDescription>
                Seu período de teste expirou. Assine um plano para continuar usando o app.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => navigate('/assinatura')}>
                Assinar Agora
              </Button>
            </CardContent>
          </Card>
        </div>
      </Layout>
    )
  }

  // Verificação adicional para exercícios premium
  const canAccessAdvancedExercises = hasSubscriptionAccess('exercises')

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded w-48"></div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {[...Array(7)].map((_, i) => (
                <div key={i} className="h-64 bg-muted rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-2 mb-6">
          <Trophy className="h-6 w-6 text-primary" />
          <h1 className="text-3xl font-bold">Exercícios Diários</h1>
        </div>

        {todayExercise && (
          <Card className="mb-8 border-primary">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                <CardTitle className="text-primary">Exercício de Hoje</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <img
                    src={`https://images.unsplash.com/${getDynamicImageForExercise(todayExercise.id, currentDay)}?auto=format&fit=crop&w=400&q=80`}
                    alt={`${todayExercise.name} - Pessoa exercitando`}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <p className="text-xs text-muted-foreground mt-2 text-center">
                    Exercício do dia - Imagem atualizada diariamente
                  </p>
                </div>
                <div className="space-y-4">
                  <h3 className="text-2xl font-semibold">{todayExercise.name}</h3>
                  <p className="text-muted-foreground">{todayExercise.description}</p>
                  
                  <div className="flex gap-2">
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {todayExercise.duration_minutes} min
                    </Badge>
                    <Badge className={difficultyColors[todayExercise.difficulty_level as keyof typeof difficultyColors]}>
                      {todayExercise.difficulty_level === 'easy' ? 'Fácil' : 
                       todayExercise.difficulty_level === 'medium' ? 'Médio' : 'Difícil'}
                    </Badge>
                  </div>

                  <div className="bg-muted p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">Instruções:</h4>
                    <p className="text-sm">{todayExercise.instructions}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <h2 className="text-2xl font-semibold mb-4">Programa Semanal</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {exercises.map((exercise) => {
            const isAdvancedExercise = exercise.difficulty_level === 'hard'
            const hasAccess = canAccessAdvancedExercises || !isAdvancedExercise
            
            return (
              <Card key={exercise.id} className={`overflow-hidden ${!hasAccess ? 'opacity-60' : ''}`}>
                <div className="aspect-video relative">
                  <img
                    src={`https://images.unsplash.com/${getDynamicImageForExercise(exercise.id, currentDay)}?auto=format&fit=crop&w=400&q=80`}
                    alt={`${exercise.name} - Pessoa fazendo exercício`}
                    className="w-full h-full object-cover"
                  />
                  <Badge className="absolute top-2 left-2">
                    {dayNames[exercise.day_of_week]}
                  </Badge>
                  {!hasAccess && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <Badge variant="destructive">Premium/Elite</Badge>
                    </div>
                  )}
                </div>
                <CardHeader>
                  <CardTitle className="text-lg">{exercise.name}</CardTitle>
                  <CardDescription>{exercise.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <div className="flex gap-2">
                      <Badge variant="outline" className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {exercise.duration_minutes} min
                      </Badge>
                      <Badge className={difficultyColors[exercise.difficulty_level as keyof typeof difficultyColors]}>
                        {exercise.difficulty_level === 'easy' ? 'Fácil' : 
                         exercise.difficulty_level === 'medium' ? 'Médio' : 'Difícil'}
                      </Badge>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2 line-clamp-2">
                    {hasAccess ? exercise.instructions : 'Upgrade para ver instruções completas'}
                  </p>
                  {!hasAccess && (
                    <Button 
                      size="sm" 
                      className="w-full mt-2" 
                      onClick={() => navigate('/assinatura')}
                    >
                      Desbloquear Exercício
                    </Button>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </Layout>
  )
}