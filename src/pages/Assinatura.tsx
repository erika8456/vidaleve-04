import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useNavigate } from "react-router-dom"
import { Check, Crown, Star, Zap, ArrowRight } from "lucide-react"

const plans = [
  {
    name: "Básico",
    price: "4",
    period: "mês",
    description: "Perfeito para começar sua jornada",
    features: [
      "Plano alimentar personalizado",
      "Chat com IA básico",
      "Receitas saudáveis",
      "Suporte por email"
    ],
    icon: Star,
    popular: false,
    link: "https://buy.stripe.com/7sY4gAdg68xkgDg9r92sM02"
  },
  {
    name: "Premium",
    price: "10",
    period: "mês",
    description: "Mais completo e personalizado",
    features: [
      "Tudo do plano Básico",
      "Chat IA avançado 24h",
      "Planos semanais personalizados",
      "Acompanhamento nutricional",
      "Relatórios de progresso",
      "Suporte prioritário"
    ],
    icon: Crown,
    popular: true,
    link: "https://buy.stripe.com/14AcN6eka00O3Qu5aT2sM04"
  },
  {
    name: "Elite",
    price: "35",
    period: "mês",
    description: "Experiência premium completa",
    features: [
      "Tudo do plano Premium",
      "Consultoria nutricional individual",
      "Planos adaptados a condições médicas",
      "Videochamadas com nutricionistas",
      "Lista de compras automática",
      "Acesso antecipado a novidades"
    ],
    icon: Zap,
    popular: false,
    link: "https://buy.stripe.com/14AaEYeka14SgDgbzh2sM05"
  }
]

const Assinatura = () => {
  const navigate = useNavigate()
  const [selectedPlan, setSelectedPlan] = useState("")

  const handleSubscribe = (planName: string, price: string, link: string) => {
    setSelectedPlan(planName)
    // Abre o link do Stripe em uma nova aba
    window.open(link, '_blank')
    // Reset após um tempo
    setTimeout(() => setSelectedPlan(""), 2000)
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-primary-foreground font-bold text-3xl">VL</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Escolha seu Plano
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Selecione o plano ideal para sua jornada de emagrecimento saudável
          </p>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {plans.map((plan) => {
            const IconComponent = plan.icon
            return (
              <Card 
                key={plan.name} 
                className={`card-senior relative ${
                  plan.popular 
                    ? 'ring-2 ring-primary shadow-[var(--shadow-medium)]' 
                    : ''
                }`}
              >
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground">
                    Mais Popular
                  </Badge>
                )}
                
                <CardHeader className="text-center pb-4">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <IconComponent className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <div className="mt-4">
                    <span className="text-4xl font-bold">€{plan.price}</span>
                    <span className="text-muted-foreground">/{plan.period}</span>
                  </div>
                  <p className="text-muted-foreground mt-2">{plan.description}</p>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                        <span className="text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Button 
                    onClick={() => handleSubscribe(plan.name, plan.price, plan.link)}
                    className={`w-full btn-senior ${
                      plan.popular 
                        ? 'gradient-primary text-white' 
                        : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                    }`}
                    disabled={selectedPlan === plan.name}
                  >
                    {selectedPlan === plan.name ? 'Processando...' : 'Assinar Agora'}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Guarantee Section */}
        <Card className="card-senior bg-muted/50 text-center">
          <CardContent className="pt-6">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-2xl font-bold mb-2">Garantia de 7 dias</h3>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Experimente qualquer plano por 7 dias. Se não ficar satisfeito, 
              devolvemos 100% do seu dinheiro, sem perguntas.
            </p>
          </CardContent>
        </Card>

        {/* Back Button */}
        <div className="text-center mt-8">
          <Button 
            variant="outline" 
            onClick={() => navigate(-1)}
            className="btn-senior"
          >
            Voltar
          </Button>
        </div>
      </div>
    </div>
  )
}

export default Assinatura