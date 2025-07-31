import { Layout } from '@/components/Layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Clock, Trophy, Calendar } from 'lucide-react'
import { useExercises } from '@/hooks/useExercises'
import { useTrialNotifications } from '@/hooks/useTrialNotifications'
import { useNavigate } from 'react-router-dom'

const difficultyColors = {
  easy: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100',
  medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100',
  hard: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100'
}

const dayNames = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado']

export default function Exercicios() {
  const { exercises, todayExercise, loading } = useExercises()
  const { hasAccess } = useTrialNotifications()
  const navigate = useNavigate()

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
                    src={`https://images.unsplash.com/${todayExercise.image_url}?auto=format&fit=crop&w=400&q=80`}
                    alt={todayExercise.name}
                    className="w-full h-48 object-cover rounded-lg"
                  />
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
          {exercises.map((exercise) => (
            <Card key={exercise.id} className="overflow-hidden">
              <div className="aspect-video relative">
                <img
                  src={`https://images.unsplash.com/${exercise.image_url}?auto=format&fit=crop&w=400&q=80`}
                  alt={exercise.name}
                  className="w-full h-full object-cover"
                />
                <Badge className="absolute top-2 left-2">
                  {dayNames[exercise.day_of_week]}
                </Badge>
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
                  {exercise.instructions}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  )
}