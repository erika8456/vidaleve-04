import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useCart } from "@/hooks/useCart"
import { useStreakTracking } from "@/hooks/useStreakTracking"
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

const receitas = [
  {
    nome: "Omelete de Espinafre",
    tipo: "Café da Manhã",
    ingredientes: ["2 ovos", "1 xícara de espinafre", "1 fatia de queijo branco", "1 colher de azeite"],
    modo_preparo: "Bata os ovos, refogue o espinafre e faça a omelete. Adicione o queijo e sirva quente.",
    calorias: 280,
    tempo: "15 min"
  },
  {
    nome: "Salmão Grelhado com Quinoa",
    tipo: "Almoço",
    ingredientes: ["150g de salmão", "1/2 xícara de quinoa", "Brócolis", "Cenoura", "Azeite"],
    modo_preparo: "Grelhe o salmão, cozinhe a quinoa e refogue os legumes. Tempere com azeite e ervas.",
    calorias: 520,
    tempo: "25 min"
  },
  {
    nome: "Sopa de Legumes com Frango",
    tipo: "Jantar",
    ingredientes: ["100g de peito de frango", "Abobrinha", "Cenoura", "Batata doce", "Caldo de legumes"],
    modo_preparo: "Cozinhe todos os ingredientes no caldo até ficarem macios. Tempere a gosto.",
    calorias: 310,
    tempo: "30 min"
  },
  {
    nome: "Smoothie Verde",
    tipo: "Lanche",
    ingredientes: ["1 banana", "1 xícara de espinafre", "1 maçã", "Água de coco", "Chia"],
    modo_preparo: "Bata todos os ingredientes no liquidificador até obter consistência cremosa.",
    calorias: 180,
    tempo: "5 min"
  }
]

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

  const handleAddToCart = (receita: any) => {
    addToCart({
      id: `receita-${receita.nome.toLowerCase().replace(/\s+/g, '-')}`,
      name: receita.nome,
      price: 2.99 // Preço exemplo para receitas
    })
    recordActivity() // Record activity when user interacts with meals
  }

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
            <TabsList className="grid w-full grid-cols-7 mb-6">
              {days.map((day) => {
                const dayDate = new Date()
                dayDate.setDate(dayDate.getDate() + days.indexOf(day) - new Date().getDay() + 1)
                const isToday = dayDate.toDateString() === new Date().toDateString()
                
                return (
                  <TabsTrigger 
                    key={day.id} 
                    value={day.id}
                    className={`text-sm p-3 ${isToday ? 'ring-2 ring-primary' : ''}`}
                  >
                    <div className="text-center">
                      <div className="font-semibold">{day.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {dayDate.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}
                      </div>
                      {isToday && <div className="text-xs text-primary font-bold">Hoje</div>}
                    </div>
                  </TabsTrigger>
                )
              })}
            </TabsList>

            {days.map((day) => (
              <TabsContent key={day.id} value={day.id} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {receitas.map((receita, index) => (
                    <Card key={index} className="border border-border hover:shadow-[var(--shadow-medium)] transition-shadow">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {getIconByType(receita.tipo)}
                            <CardTitle className="text-lg">{receita.nome}</CardTitle>
                          </div>
                          <Badge className={getColorByType(receita.tipo)}>
                            {receita.tipo}
                          </Badge>
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
                            onClick={() => navigate('/receita-completa')}
                          >
                            Ver Receita Completa
                          </Button>
                          <Button 
                            size="sm"
                            className="gradient-primary text-white"
                            onClick={() => handleAddToCart(receita)}
                          >
                            <ShoppingCart className="h-4 w-4" />
                          </Button>
                        </div>
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