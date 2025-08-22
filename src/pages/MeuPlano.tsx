import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useCart } from "@/hooks/useCart"
import { useStreakTracking } from "@/hooks/useStreakTracking"
import { useSubscription } from "@/hooks/useSubscription"
import { 
  Calendar, 
  Clock, 
  Users, 
  Target,
  RefreshCw,
  ChefHat,
  Apple,
  Coffee,
  Utensils,
  ShoppingCart
} from "lucide-react"

const getReceitasByPlan = (tier: string) => {
  const basicReceitas = [
    {
      nome: "Omelete Simples",
      tipo: "Café da Manhã",
      ingredientes: ["2 ovos", "Sal", "Pimenta"],
      modo_preparo: "Bata os ovos e faça a omelete básica.",
      calorias: 200,
      tempo: "10 min",
      plan: "basic"
    },
    {
      nome: "Frango Grelhado",
      tipo: "Almoço",
      ingredientes: ["150g de peito de frango", "Temperos básicos"],
      modo_preparo: "Grelhe o frango com temperos.",
      calorias: 300,
      tempo: "20 min",
      plan: "basic"
    }
  ]

  const premiumReceitas = [
    ...basicReceitas,
    {
      nome: "Omelete de Espinafre Gourmet",
      tipo: "Café da Manhã",
      ingredientes: ["2 ovos orgânicos", "1 xícara de espinafre baby", "Queijo de cabra", "Azeite extravirgem", "Ervas finas"],
      modo_preparo: "Refogue o espinafre com azeite, bata os ovos com ervas e faça omelete cremosa. Finalize com queijo de cabra.",
      calorias: 320,
      tempo: "15 min",
      plan: "premium"
    },
    {
      nome: "Salmão Grelhado com Quinoa",
      tipo: "Almoço",
      ingredientes: ["150g de salmão selvagem", "1/2 xícara de quinoa tricolor", "Aspargos", "Tomate cereja", "Molho de limão siciliano"],
      modo_preparo: "Grelhe o salmão, prepare quinoa fluffy e refogue legumes. Finalize com molho cítrico.",
      calorias: 520,
      tempo: "25 min",
      plan: "premium"
    },
    {
      nome: "Bowl Mediterrâneo",
      tipo: "Jantar",
      ingredientes: ["Quinoa", "Grão de bico", "Pepino", "Tomate", "Azeitonas", "Feta", "Azeite"],
      modo_preparo: "Monte bowl colorido com todos ingredientes frescos.",
      calorias: 380,
      tempo: "15 min",
      plan: "premium"
    },
    {
      nome: "Smoothie Superfoods",
      tipo: "Lanche",
      ingredientes: ["Açaí", "Banana", "Spirulina", "Chia", "Leite de coco", "Mel"],
      modo_preparo: "Bata todos ingredientes para smoothie nutritivo.",
      calorias: 250,
      tempo: "5 min",
      plan: "premium"
    }
  ]

  const eliteReceitas = [
    ...premiumReceitas,
    {
      nome: "Tartare de Atum com Abacate",
      tipo: "Café da Manhã",
      ingredientes: ["Atum sashimi", "Abacate", "Gengibre", "Wasabi", "Gergelim preto", "Molho ponzu"],
      modo_preparo: "Corte atum em cubos, misture com temperos orientais e sirva sobre abacate.",
      calorias: 380,
      tempo: "20 min",
      plan: "elite"
    },
    {
      nome: "Lagosta Grelhada com Risotto",
      tipo: "Almoço",
      ingredientes: ["Cauda de lagosta", "Arroz arbóreo", "Vinho branco", "Parmesão", "Açafrão", "Manteiga"],
      modo_preparo: "Prepare risotto cremoso e grelhe lagosta com perfeição.",
      calorias: 650,
      tempo: "45 min",
      plan: "elite"
    },
    {
      nome: "Filé Mignon ao Molho Trufado",
      tipo: "Jantar",
      ingredientes: ["Filé mignon", "Trufa negra", "Vinho tinto", "Cogumelos", "Manteiga", "Ervas"],
      modo_preparo: "Grelhe filé ao ponto e prepare molho sofisticado com trufa.",
      calorias: 550,
      tempo: "35 min",
      plan: "elite"
    }
  ]

  if (tier === 'elite') return eliteReceitas
  if (tier === 'premium') return premiumReceitas
  return basicReceitas
}

const getIconByType = (tipo: string) => {
  switch (tipo) {
    case "Café da Manhã":
      return <Coffee className="h-5 w-5" />
    case "Almoço":
      return <Utensils className="h-5 w-5" />
    case "Jantar":
      return <ChefHat className="h-5 w-5" />
    default:
      return <Apple className="h-5 w-5" />
  }
}

const getColorByType = (tipo: string) => {
  switch (tipo) {
    case "Café da Manhã":
      return "bg-orange-100 text-orange-800"
    case "Almoço":
      return "bg-blue-100 text-blue-800"
    case "Jantar":
      return "bg-purple-100 text-purple-800"
    default:
      return "bg-green-100 text-green-800"
  }
}

export default function MeuPlano() {
  const navigate = useNavigate()
  const [selectedDay, setSelectedDay] = useState("segunda")
  const { addToCart } = useCart()
  const { recordActivity } = useStreakTracking()
  const { hasAccess, subscription_tier } = useSubscription()

  const handleAddToCart = (receita: any) => {
    if (!hasAccess('premium-recipes') && receita.plan !== 'basic') {
      alert('Esta receita está disponível apenas para assinantes Premium ou Elite!')
      return
    }
    
    addToCart({
      id: `receita-${receita.nome.toLowerCase().replace(/\s+/g, '-')}`,
      name: receita.nome,
      price: receita.plan === 'elite' ? 9.99 : receita.plan === 'premium' ? 4.99 : 2.99
    })
    recordActivity()
  }

  const handleViewRecipe = (receita: any) => {
    if (!hasAccess('premium-recipes') && receita.plan !== 'basic') {
      alert('Esta receita está disponível apenas para assinantes Premium ou Elite!')
      return
    }
    navigate('/receita-completa')
  }

  const receitas = getReceitasByPlan(subscription_tier)

  const days = [
    { id: "segunda", name: "Segunda", date: "18/03" },
    { id: "terca", name: "Terça", date: "19/03" },
    { id: "quarta", name: "Quarta", date: "20/03" },
    { id: "quinta", name: "Quinta", date: "21/03" },
    { id: "sexta", name: "Sexta", date: "22/03" },
    { id: "sabado", name: "Sábado", date: "23/03" },
    { id: "domingo", name: "Domingo", date: "24/03" }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Meu Plano Alimentar</h1>
          <p className="text-lg text-muted-foreground">
            Semana de 18 a 24 de Março • Plano personalizado para emagrecimento
          </p>
        </div>
        <Button 
          className="btn-senior gradient-primary text-white"
          onClick={() => window.location.reload()}
        >
          <RefreshCw className="h-5 w-5 mr-2" />
          Gerar Novo Plano
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="card-senior">
          <CardContent className="p-4 text-center">
            <Target className="h-8 w-8 text-primary mx-auto mb-2" />
            <h3 className="font-semibold">Meta Calórica</h3>
            <p className="text-2xl font-bold text-primary">1.350 kcal/dia</p>
          </CardContent>
        </Card>
        
        <Card className="card-senior">
          <CardContent className="p-4 text-center">
            <Users className="h-8 w-8 text-primary mx-auto mb-2" />
            <h3 className="font-semibold">Refeições</h3>
            <p className="text-2xl font-bold text-primary">4 por dia</p>
          </CardContent>
        </Card>
        
        <Card className="card-senior">
          <CardContent className="p-4 text-center">
            <Calendar className="h-8 w-8 text-primary mx-auto mb-2" />
            <h3 className="font-semibold">Duração</h3>
            <p className="text-2xl font-bold text-primary">7 dias</p>
          </CardContent>
        </Card>
        
        <Card className="card-senior">
          <CardContent className="p-4 text-center">
            <ChefHat className="h-8 w-8 text-primary mx-auto mb-2" />
            <h3 className="font-semibold">Receitas</h3>
            <p className="text-2xl font-bold text-primary">28 opções</p>
          </CardContent>
        </Card>
      </div>

      {/* Daily Plan */}
      <Card className="card-senior">
        <CardHeader>
          <CardTitle className="text-xl">Plano Semanal</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={selectedDay} onValueChange={setSelectedDay}>
            <TabsList className="flex w-full overflow-x-auto no-scrollbar mb-6 md:grid md:grid-cols-7">
              {days.map((day) => {
                const dayDate = new Date()
                dayDate.setDate(dayDate.getDate() + days.indexOf(day) - new Date().getDay() + 1)
                const isToday = dayDate.toDateString() === new Date().toDateString()
                
                return (
                  <TabsTrigger 
                    key={day.id} 
                    value={day.id}
                    className={`text-sm p-3 min-w-[85px] flex-shrink-0 ${isToday ? 'ring-2 ring-primary' : ''}`}
                  >
                    <div className="text-center">
                      <div className="font-semibold">
                        {day.name}
                        {isToday && <span className="text-primary"> (Hoje)</span>}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {dayDate.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}
                      </div>
                    </div>
                  </TabsTrigger>
                )
              })}
            </TabsList>

            {days.map((day) => (
              <TabsContent key={day.id} value={day.id} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {receitas.map((receita, index) => (
                    <Card key={index} className={`border border-border hover:shadow-[var(--shadow-medium)] transition-shadow ${receita.plan === 'elite' ? 'border-yellow-400 bg-gradient-to-br from-yellow-50 to-orange-50' : receita.plan === 'premium' ? 'border-purple-400 bg-gradient-to-br from-purple-50 to-pink-50' : ''}`}>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {getIconByType(receita.tipo)}
                            <CardTitle className="text-lg">{receita.nome}</CardTitle>
                          </div>
                          <div className="flex gap-2">
                            <Badge className={getColorByType(receita.tipo)}>
                              {receita.tipo}
                            </Badge>
                            {receita.plan === 'elite' && (
                              <Badge className="bg-yellow-100 text-yellow-800">Elite</Badge>
                            )}
                            {receita.plan === 'premium' && (
                              <Badge className="bg-purple-100 text-purple-800">Premium</Badge>
                            )}
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Target className="h-4 w-4" />
                            {receita.calorias} kcal
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {receita.tempo}
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="font-semibold mb-2">Ingredientes:</h4>
                          <ul className="text-sm text-muted-foreground space-y-1">
                            {receita.ingredientes.slice(0, 3).map((ingrediente, i) => (
                              <li key={i}>• {ingrediente}</li>
                            ))}
                            {receita.ingredientes.length > 3 && (
                              <li className="font-medium">+ {receita.ingredientes.length - 3} mais</li>
                            )}
                          </ul>
                        </div>
                        
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            className="flex-1"
                            onClick={() => handleViewRecipe(receita)}
                            disabled={!hasAccess('premium-recipes') && receita.plan !== 'basic'}
                          >
                            Ver Receita Completa
                          </Button>
                          <Button 
                            size="sm"
                            className="gradient-primary text-white"
                            onClick={() => handleAddToCart(receita)}
                            disabled={!hasAccess('premium-recipes') && receita.plan !== 'basic'}
                          >
                            <ShoppingCart className="h-4 w-4" />
                          </Button>
                        </div>
                        
                        {!hasAccess('premium-recipes') && receita.plan !== 'basic' && (
                          <div className="text-center text-sm text-muted-foreground bg-muted p-2 rounded">
                            Disponível apenas para assinantes {receita.plan === 'elite' ? 'Elite' : 'Premium'}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}