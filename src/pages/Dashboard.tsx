import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Activity, Target, Calendar, TrendingDown, MessageCircle, BookOpen, Apple, Clock, Edit, Trophy } from "lucide-react";
import { TrialBanner } from "@/components/TrialBanner";
import { WeightEditDialog } from "@/components/WeightEditDialog";
import { useNavigate } from "react-router-dom";
import { useWeightTracking } from "@/hooks/useWeightTracking";
import { useTodayMeals } from "@/hooks/useTodayMeals";
import { useProfile } from "@/hooks/useProfile";
import { useStreakTracking } from "@/hooks/useStreakTracking";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useTrialNotifications } from "@/hooks/useTrialNotifications";
import { useExerciseReminders } from "@/hooks/useExerciseReminders";
export default function Dashboard() {
  const navigate = useNavigate();
  const {
    currentWeight,
    targetWeight,
    initialWeight,
    progressPercentage,
    updateCurrentWeight
  } = useWeightTracking();
  const {
    todayMeals,
    loading: mealsLoading
  } = useTodayMeals();
  
  const { profile } = useProfile();
  const { currentStreak, recordActivity } = useStreakTracking();
  const { hasAccess } = useTrialNotifications();
  
  // Initialize exercise reminders
  useExerciseReminders();
  const handleChatClick = () => {
    navigate('/chat');
  };
  const handleViewPlanClick = () => {
    navigate('/plano-refeicoes');
  };

  const handleExerciseClick = () => {
    navigate('/exercicios');
  };
  const handleGeneratePlanClick = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('generate-meal-plan', {
        body: { 
          date: new Date().toISOString().split('T')[0],
          regenerate: true
        }
      })

      if (error) {
        console.error('Generate plan error:', error)
        toast.error('Erro ao gerar plano de refeições')
        return
      }

      console.log('Plan generated:', data)
      toast.success('Novo plano gerado com sucesso!')
      
      // Refresh the meals data
      setTimeout(() => {
        window.location.reload()
      }, 1000)
    } catch (error) {
      console.error('Erro:', error)
      toast.error('Erro ao gerar plano')
    }
  };

  if (!hasAccess) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-md mx-auto text-center">
          <CardHeader>
            <CardTitle className="text-red-600">Acesso Expirado</CardTitle>
            <p className="text-muted-foreground">
              Seu período de teste expirou. Assine um plano para continuar usando o app.
            </p>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate('/assinatura')}>
              Assinar Agora
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return <div className="space-y-6">
      <TrialBanner />
      
      {/* Welcome Section */}
      <div className="gradient-primary rounded-xl p-6 text-white">
        <h1 className="text-3xl font-bold mb-2">
          Olá, {profile?.full_name || 'Bem-vindo(a)'}! 👋
        </h1>
        <p className="text-lg opacity-90">
          {profile?.full_name && currentStreak > 0 
            ? "Você está indo muito bem! Continue firme no seu objetivo." 
            : "Bem-vindo! Complete seu perfil e comece sua jornada saudável."
          }
        </p>
      </div>

      {/* Progress Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="card-senior">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Peso Atual
            </CardTitle>
            <div className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              <WeightEditDialog currentWeight={currentWeight} onUpdateWeight={updateCurrentWeight} trigger={<Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                    <Edit className="h-3 w-3" />
                  </Button>} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{currentWeight} kg</div>
            <p className="text-sm text-muted-foreground">
              Meta: {targetWeight} kg
            </p>
          </CardContent>
        </Card>

        <Card className="card-senior">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Progresso
            </CardTitle>
            <Target className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">
              {profile?.current_weight && profile?.target_weight 
                ? progressPercentage.toFixed(0) 
                : '0'
              }%
            </div>
            <Progress 
              value={profile?.current_weight && profile?.target_weight ? progressPercentage : 0} 
              className="mt-2" 
            />
          </CardContent>
        </Card>

        <Card className="card-senior">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Perdidos
            </CardTitle>
            <div className="flex items-center gap-2">
              <TrendingDown className="h-5 w-5 text-primary" />
              <WeightEditDialog currentWeight={currentWeight} onUpdateWeight={updateCurrentWeight} trigger={<Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                    <Edit className="h-3 w-3" />
                  </Button>} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{(initialWeight - currentWeight).toFixed(1)} kg</div>
            <p className="text-sm text-muted-foreground">
              Desde o início
            </p>
          </CardContent>
        </Card>

        <Card className="card-senior">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Dias Seguidos
            </CardTitle>
            <Calendar className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{currentStreak}</div>
            <p className="text-sm text-muted-foreground">
              Seguindo o plano
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="card-senior hover:shadow-[var(--shadow-medium)] transition-shadow cursor-pointer">
          <CardContent className="p-6 text-center">
            <MessageCircle className="h-12 w-12 text-primary mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Chat com IA</h3>
            <p className="text-muted-foreground mb-4">
              Tire suas dúvidas e receba dicas personalizadas
            </p>
            <Button className="btn-senior w-full" onClick={handleChatClick}>
              Conversar Agora
            </Button>
          </CardContent>
        </Card>

        <Card className="card-senior hover:shadow-[var(--shadow-medium)] transition-shadow cursor-pointer">
          <CardContent className="p-6 text-center">
            <BookOpen className="h-12 w-12 text-primary mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Meu Plano</h3>
            <p className="text-muted-foreground mb-4">
              Veja suas refeições e receitas da semana
            </p>
            <Button className="btn-senior w-full" variant="outline" onClick={handleViewPlanClick}>
              Ver Plano
            </Button>
          </CardContent>
        </Card>

        <Card className="card-senior hover:shadow-[var(--shadow-medium)] transition-shadow cursor-pointer">
          <CardContent className="p-6 text-center">
            <Trophy className="h-12 w-12 text-primary mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Exercícios</h3>
            <p className="text-muted-foreground mb-4">
              Veja seus exercícios diários e mantenha-se ativo
            </p>
            <Button className="btn-senior w-full" variant="outline" onClick={handleExerciseClick}>
              Ver Exercícios
            </Button>
          </CardContent>
        </Card>

        <Card className="card-senior hover:shadow-[var(--shadow-medium)] transition-shadow cursor-pointer">
          <CardContent className="p-6 text-center">
            <Apple className="h-12 w-12 text-primary mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Gerar Novo Plano</h3>
            <p className="text-muted-foreground mb-4">
              Crie um novo plano alimentar personalizado
            </p>
            <Button className="btn-senior w-full gradient-primary text-white" onClick={handleGeneratePlanClick}>
              Gerar Plano
            </Button>
          </CardContent>
        </Card>

        <Card className="card-senior hover:shadow-[var(--shadow-medium)] transition-shadow cursor-pointer">
          <CardContent className="p-6 text-center">
            <Target className="h-12 w-12 text-primary mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Assinatura</h3>
            <p className="text-muted-foreground mb-4">
              Gerencie sua assinatura e benefícios
            </p>
            <Button className="btn-senior w-full" variant="outline" onClick={() => navigate('/assinatura')}>
              Ver Assinatura
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Today's Meals */}
      <Card className="card-senior">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <Clock className="h-6 w-6 text-primary" />
            Refeições de Hoje
          </CardTitle>
        </CardHeader>
        <CardContent>
          {mealsLoading ? <div className="text-center py-4">
              <p className="text-muted-foreground">Carregando refeições...</p>
            </div> : todayMeals.length > 0 ? <div className="space-y-4">
              {todayMeals.map((meal, index) => <div key={meal.meal.id} className={`flex items-center justify-between p-4 rounded-lg ${meal.isCompleted ? 'bg-accent border-l-4 border-l-primary' : index === 0 && !meal.isCompleted ? 'bg-orange-50 border-l-4 border-l-orange-500' : 'bg-muted'} ${!meal.isCompleted && index > 0 ? 'opacity-60' : ''}`}>
                  <div>
                    <h4 className="font-semibold">{meal.typeLabel}</h4>
                    <p className="text-sm text-muted-foreground">{meal.meal.name}</p>
                  </div>
                  <div className="text-right">
                    <p className={`font-semibold ${meal.isCompleted ? 'text-primary' : index === 0 && !meal.isCompleted ? 'text-orange-600' : 'text-muted-foreground'}`}>
                      {meal.isCompleted ? '✓ Concluído' : index === 0 && !meal.isCompleted ? '⏰ Próximo' : 'Pendente'}
                    </p>
                    <p className="text-sm text-muted-foreground">{meal.calories} kcal</p>
                  </div>
                </div>)}
            </div> : <div className="text-center py-8">
              <p className="text-muted-foreground mb-2">Nenhuma refeição planejada para hoje</p>
              <Button variant="outline" onClick={handleGeneratePlanClick} className="mt-2">
                Gerar Plano de Hoje
              </Button>
            </div>}
        </CardContent>
      </Card>
    </div>;
}