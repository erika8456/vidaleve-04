import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/integrations/supabase/client'
import { toast } from 'sonner'

export default function AdminRegister() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { signUp } = useAuth()

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      toast.error('As senhas não coincidem')
      return
    }

    if (password.length < 6) {
      toast.error('A senha deve ter pelo menos 6 caracteres')
      return
    }

    setLoading(true)

    try {
      // Create admin user account
      const { error } = await signUp(email, password, fullName)
      
      if (error) {
        toast.error(error.message)
        return
      }

      // Add user to admins table
      const { data: user } = await supabase.auth.getUser()
      
      if (user.user) {
        const { error: adminError } = await supabase
          .from('admins')
          .insert({
            user_id: user.user.id,
            email: email,
            role: 'admin'
          })

        if (adminError && !adminError.message.includes('duplicate key')) {
          console.error('Error creating admin record:', adminError)
        }
      }

      toast.success('Conta de administrador criada com sucesso!')
      navigate('/admin/login')
    } catch (error) {
      toast.error('Erro ao criar conta de administrador')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Registro Admin</CardTitle>
          <CardDescription>
            Crie sua conta de administrador do Vida Leve
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Nome Completo</Label>
              <Input
                id="fullName"
                type="text"
                placeholder="Digite seu nome completo"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@vidaleve.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                placeholder="Digite sua senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmar Senha</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirme sua senha"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Criando conta...' : 'Criar Conta Admin'}
            </Button>
          </form>
          <div className="mt-4 text-center space-y-2">
            <Button
              variant="link"
              onClick={() => navigate('/admin/login')}
              className="text-sm"
            >
              Já tem uma conta? Fazer login
            </Button>
            <Button
              variant="link"
              onClick={() => navigate('/')}
              className="text-sm text-muted-foreground block"
            >
              Voltar ao app
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}