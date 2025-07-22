import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, Heart, Users, Target, MessageCircle } from "lucide-react"
import { useNavigate } from "react-router-dom"

const Index = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="gradient-primary text-white py-20 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-3xl font-bold">N</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            NutriSênior AI
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90 max-w-3xl mx-auto leading-relaxed">
            Nutrição inteligente e personalizada para pessoas com mais de 50 anos. 
            Emagreça com saúde e segurança, com o suporte da inteligência artificial.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={() => navigate('/login')}
              className="btn-senior bg-white text-primary hover:bg-white/90 text-xl px-8 py-6"
            >
              Fazer Login
              <ArrowRight className="ml-2 h-6 w-6" />
            </Button>
            <Button 
              onClick={() => navigate('/assinatura')}
              className="btn-senior bg-white/10 text-white border border-white/20 hover:bg-white/20 text-xl px-8 py-6"
            >
              Ver Planos
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Por que escolher o NutriSênior?</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Desenvolvido especificamente para as necessidades nutricionais de pessoas maduras
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="card-senior text-center hover:shadow-[var(--shadow-medium)] transition-shadow">
              <CardHeader>
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-xl">Planos Personalizados</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-lg">
                  Alimentação adaptada às suas condições de saúde, preferências e objetivos específicos.
                </p>
              </CardContent>
            </Card>

            <Card className="card-senior text-center hover:shadow-[var(--shadow-medium)] transition-shadow">
              <CardHeader>
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageCircle className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-xl">Assistente IA 24h</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-lg">
                  Chat inteligente sempre disponível para tirar dúvidas e dar suporte nutricional.
                </p>
              </CardContent>
            </Card>

            <Card className="card-senior text-center hover:shadow-[var(--shadow-medium)] transition-shadow">
              <CardHeader>
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-xl">Resultados Seguros</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-lg">
                  Emagrecimento gradual e saudável, respeitando as limitações da idade madura.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-muted py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Pronto para transformar sua saúde?</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Junte-se a milhares de pessoas que já descobriram como emagrecer com saúde após os 50 anos.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={() => navigate('/cadastro')}
              className="btn-senior gradient-primary text-white text-xl px-8 py-6"
            >
              Criar Conta Grátis
              <ArrowRight className="ml-2 h-6 w-6" />
            </Button>
            <Button 
              onClick={() => navigate('/assinatura')}
              className="btn-senior bg-secondary text-secondary-foreground hover:bg-secondary/80 text-xl px-8 py-6"
            >
              Ver Planos
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary text-primary-foreground py-12 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-xl font-bold">N</span>
          </div>
          <h3 className="text-xl font-semibold mb-2">NutriSênior AI</h3>
          <p className="opacity-80">Nutrição inteligente para uma vida mais saudável</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
