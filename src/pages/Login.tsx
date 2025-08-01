import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const {
        error
      } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password
      });
      if (error) {
        toast.error(error.message);
      } else {
        toast.success("Login realizado com sucesso! Iniciando período de teste de 4 dias.");
        navigate("/dashboard");
      }
    } catch (error) {
      toast.error("Erro no login");
    } finally {
      setLoading(false);
    }
  };
  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };
  return <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-primary-foreground font-bold text-2xl">V</span>
          </div>
          <h1 className="text-3xl font-bold text-primary">Vida Leve</h1>
          <p className="text-muted-foreground mt-2">Entre na sua conta</p>
        </div>

        <Card className="card-senior">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Fazer Login</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-lg">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input id="email" type="email" placeholder="seu@email.com" value={formData.email} onChange={e => handleInputChange('email', e.target.value)} className="pl-10 h-12 text-lg" required />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-lg">Senha</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input id="password" type={showPassword ? "text" : "password"} placeholder="Digite sua senha" value={formData.password} onChange={e => handleInputChange('password', e.target.value)} className="pl-10 pr-10 h-12 text-lg" required />
                  <Button type="button" variant="ghost" size="sm" className="absolute right-1 top-1/2 transform -translate-y-1/2 h-10 w-10" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <Button type="submit" className="btn-senior w-full gradient-primary text-white">
                Entrar
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </form>

            <div className="mt-6 text-center space-y-4">
              <Button variant="link" onClick={() => navigate('/esqueci-senha')} className="text-primary">
                Esqueci minha senha
              </Button>
              
              <div className="text-muted-foreground">
                Não tem conta?{" "}
                <Button variant="link" onClick={() => navigate('/cadastro')} className="text-primary p-0">
                  Cadastre-se
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>;
};
export default Login;