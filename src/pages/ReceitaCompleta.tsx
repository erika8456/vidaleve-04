import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  ArrowLeft,
  Clock, 
  Target,
  Users,
  ChefHat,
  Coffee,
  Utensils,
  Apple,
  Star,
  Heart
} from "lucide-react"

const receitaExemplo = {
  nome: "Omelete de Espinafre",
  tipo: "Café da Manhã",
  ingredientes: [
    "2 ovos orgânicos",
    "1 xícara de espinafre fresco",
    "1 fatia de queijo branco light",
    "1 colher de chá de azeite extravirgem",
    "Sal rosa a gosto",
    "Pimenta-do-reino moída na hora",
    "1 pitada de noz-moscada"
  ],
  modo_preparo: [
    "Lave bem o espinafre e retire os talos mais grossos",
    "Em uma frigideira antiaderente, aqueça metade do azeite em fogo médio",
    "Refogue o espinafre até murchar (cerca de 2 minutos)",
    "Em uma tigela, bata os ovos com sal, pimenta e noz-moscada",
    "Retire o espinafre da frigideira e reserve",
    "Na mesma frigideira, adicione o restante do azeite",
    "Despeje os ovos batidos e deixe cozinhar por 1 minuto",
    "Adicione o espinafre em uma metade da omelete",
    "Coloque o queijo por cima do espinafre",
    "Dobre a omelete ao meio e sirva imediatamente"
  ],
  calorias: 280,
  tempo: "15 min",
  porcoes: 1,
  dificuldade: "Fácil",
  dicas: [
    "Use ovos sempre frescos para melhor sabor",
    "Não refogue demais o espinafre para manter as vitaminas",
    "Se preferir, substitua o queijo por cottage",
    "Sirva com uma fatia de pão integral torrado"
  ],
  beneficios: [
    "Rico em proteínas de alto valor biológico",
    "Fonte de ferro e ácido fólico do espinafre",
    "Baixo em carboidratos",
    "Ajuda na manutenção da massa muscular"
  ]
}

const getIconByType = (tipo: string) => {
  switch (tipo) {
    case "Café da Manhã":
      return <Coffee className="h-6 w-6" />
    case "Almoço":
      return <Utensils className="h-6 w-6" />
    case "Jantar":
      return <ChefHat className="h-6 w-6" />
    default:
      return <Apple className="h-6 w-6" />
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

export default function ReceitaCompleta() {
  const navigate = useNavigate()
  const [isFavorite, setIsFavorite] = useState(false)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button 
          variant="outline" 
          size="icon"
          onClick={() => navigate('/meu-plano')}
          className="h-10 w-10"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            {getIconByType(receitaExemplo.tipo)}
            <h1 className="text-3xl font-bold text-foreground">{receitaExemplo.nome}</h1>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsFavorite(!isFavorite)}
              className={isFavorite ? "text-red-500" : "text-muted-foreground"}
            >
              <Heart className={`h-6 w-6 ${isFavorite ? "fill-current" : ""}`} />
            </Button>
          </div>
          <Badge className={getColorByType(receitaExemplo.tipo)}>
            {receitaExemplo.tipo}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Ingredientes */}
          <Card className="card-senior">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Apple className="h-6 w-6 text-primary" />
                Ingredientes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {receitaExemplo.ingredientes.map((ingrediente, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span className="text-lg">{ingrediente}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Modo de Preparo */}
          <Card className="card-senior">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ChefHat className="h-6 w-6 text-primary" />
                Modo de Preparo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="space-y-4">
                {receitaExemplo.modo_preparo.map((passo, index) => (
                  <li key={index} className="flex gap-4">
                    <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 mt-1">
                      {index + 1}
                    </div>
                    <span className="text-lg leading-relaxed">{passo}</span>
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>

          {/* Dicas */}
          <Card className="card-senior">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-6 w-6 text-primary" />
                Dicas do Chef
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {receitaExemplo.dicas.map((dica, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <Star className="h-5 w-5 text-yellow-500 mt-0.5 flex-shrink-0" />
                    <span className="text-lg">{dica}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Info Nutricional */}
          <Card className="card-senior">
            <CardHeader>
              <CardTitle>Informações</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-primary" />
                  <span>Calorias</span>
                </div>
                <span className="font-bold text-primary">{receitaExemplo.calorias} kcal</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" />
                  <span>Tempo</span>
                </div>
                <span className="font-bold">{receitaExemplo.tempo}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  <span>Porções</span>
                </div>
                <span className="font-bold">{receitaExemplo.porcoes}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ChefHat className="h-5 w-5 text-primary" />
                  <span>Dificuldade</span>
                </div>
                <span className="font-bold">{receitaExemplo.dificuldade}</span>
              </div>
            </CardContent>
          </Card>

          {/* Benefícios */}
          <Card className="card-senior">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-6 w-6 text-primary" />
                Benefícios
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {receitaExemplo.beneficios.map((beneficio, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-sm leading-relaxed">{beneficio}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Ações */}
          <div className="space-y-3">
            <Button className="w-full btn-senior gradient-primary text-white">
              Adicionar ao Carrinho
            </Button>
            <Button variant="outline" className="w-full btn-senior">
              Compartilhar Receita
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}