import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { supabase } from '@/integrations/supabase/client'
import { toast } from 'sonner'
import { Users, Euro, Trash2, LogOut, RefreshCw } from 'lucide-react'

interface UserData {
  id: string
  email: string
  full_name: string
  created_at: string
  is_trial_active: boolean
  trial_end: string
}

interface StatsData {
  totalUsers: number
  activeTrials: number
  expiredTrials: number
  totalRevenue: number
}

export default function AdminDashboard() {
  const [users, setUsers] = useState<UserData[]>([])
  const [stats, setStats] = useState<StatsData>({
    totalUsers: 0,
    activeTrials: 0,
    expiredTrials: 0,
    totalRevenue: 0
  })
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const adminLoggedIn = localStorage.getItem('adminLoggedIn')
    if (!adminLoggedIn) {
      navigate('/admin/login')
      return
    }
    
    fetchUsersData()
  }, [navigate])

  const fetchUsersData = async () => {
    try {
      setLoading(true)
      
      // Buscar dados dos usuários
      const { data: profiles, error } = await supabase
        .from('profiles')
        .select('id, email, full_name, created_at, is_trial_active, trial_end')
        .order('created_at', { ascending: false })

      if (error) {
        toast.error('Erro ao carregar dados dos usuários')
        console.error(error)
        return
      }

      setUsers(profiles || [])

      // Calcular estatísticas
      const totalUsers = profiles?.length || 0
      const activeTrials = profiles?.filter(p => p.is_trial_active).length || 0
      const expiredTrials = totalUsers - activeTrials
      
      // Simulação de receita (€7.99 por usuário ativo)
      const totalRevenue = activeTrials * 7.99

      setStats({
        totalUsers,
        activeTrials,
        expiredTrials,
        totalRevenue
      })

    } catch (error) {
      toast.error('Erro ao carregar dados')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleRemoveUser = async (userId: string, userEmail: string) => {
    if (!confirm(`Tem certeza que deseja remover o usuário ${userEmail}?`)) {
      return
    }

    try {
      // Remover perfil do usuário
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', userId)

      if (error) {
        toast.error('Erro ao remover usuário')
        console.error(error)
        return
      }

      toast.success('Usuário removido com sucesso')
      fetchUsersData() // Recarregar dados
    } catch (error) {
      toast.error('Erro ao remover usuário')
      console.error(error)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('adminLoggedIn')
    navigate('/')
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR')
  }

  const isTrialExpired = (trialEnd: string) => {
    return new Date(trialEnd) < new Date()
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Dashboard Admin</h1>
            <p className="text-muted-foreground">Gestão de usuários e finanças do Vida Leve</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={fetchUsersData} variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Atualizar
            </Button>
            <Button onClick={handleLogout} variant="destructive" size="sm">
              <LogOut className="h-4 w-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Usuários</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalUsers}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Testes Ativos</CardTitle>
              <Users className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.activeTrials}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Testes Expirados</CardTitle>
              <Users className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{stats.expiredTrials}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Receita Mensal</CardTitle>
              <Euro className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">€{stats.totalRevenue.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">€7.99 por usuário ativo</p>
            </CardContent>
          </Card>
        </div>

        {/* Users Table */}
        <Card>
          <CardHeader>
            <CardTitle>Usuários Registrados</CardTitle>
            <CardDescription>
              Lista completa de todos os usuários do aplicativo
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Data de Registro</TableHead>
                  <TableHead>Status do Teste</TableHead>
                  <TableHead>Fim do Teste</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">
                      {user.full_name || 'Nome não informado'}
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{formatDate(user.created_at)}</TableCell>
                    <TableCell>
                      <Badge variant={user.is_trial_active && !isTrialExpired(user.trial_end) ? "default" : "destructive"}>
                        {user.is_trial_active && !isTrialExpired(user.trial_end) ? "Ativo" : "Expirado"}
                      </Badge>
                    </TableCell>
                    <TableCell>{formatDate(user.trial_end)}</TableCell>
                    <TableCell>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleRemoveUser(user.id, user.email)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}