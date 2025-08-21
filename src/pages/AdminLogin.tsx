import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/integrations/supabase/client'
import { toast } from 'sonner'

export default function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { signIn } = useAuth()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Use Supabase authentication
      const { error } = await signIn(email, password)
      
      if (error) {
        toast.error('Credenciais inválidas')
        return
      }

      // Check if user is an admin
      const { data: adminData, error: adminError } = await supabase
        .from('admins')
        .select('role')
        .eq('email', email)
        .single()

      if (adminError || !adminData) {
        toast.error('Acesso negado: não é um administrador')
        await supabase.auth.signOut()
        return
      }

      toast.success('Login de administrador realizado com sucesso!')
      navigate('/admin/dashboard')
    } catch (error) {
      toast.error('Erro ao fazer login')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Admin Vida Leve</CardTitle>
          <CardDescription>
            Acesso exclusivo para administradores
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email do Admin</Label>
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
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Entrando...' : 'Entrar como Admin'}
            </Button>
          </form>
          <div className="mt-4 text-center">
            <Button
              variant="link"
              onClick={() => navigate('/')}
              className="text-sm text-muted-foreground"
            >
              Voltar ao app
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}