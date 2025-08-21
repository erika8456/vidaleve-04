import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { supabase } from '@/integrations/supabase/client'
import { useAuth } from '@/contexts/AuthContext'
import { SUBSCRIPTION_PLANS } from '@/config/plans'
import { toast } from 'sonner'
import { Users, Euro, Trash2, LogOut, RefreshCw, Crown } from 'lucide-react'

interface UserData {
  id: string
  email: string
  full_name: string
  created_at: string
  is_trial_active: boolean
  trial_end: string
  subscription_tier: string
  subscribed: boolean
}

interface StatsData {
  totalUsers: number
  activeTrials: number
  expiredTrials: number
  basicSubscribers: number
  premiumSubscribers: number
  eliteSubscribers: number
  totalRevenue: number
}

export default function AdminDashboard() {
  const [users, setUsers] = useState<UserData[]>([])
  const [stats, setStats] = useState<StatsData>({
    totalUsers: 0,
    activeTrials: 0,
    expiredTrials: 0,
    basicSubscribers: 0,
    premiumSubscribers: 0,
    eliteSubscribers: 0,
    totalRevenue: 0
  })
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const { user, signOut } = useAuth()

  useEffect(() => {
    // Check if user is authenticated and is an admin
    if (!user) {
      navigate('/admin/login')
      return
    }

    // Verify admin status
    const checkAdminStatus = async () => {
      const { data, error } = await supabase
        .from('admins')
        .select('role')
        .eq('user_id', user.id)
        .single()

      if (error || !data) {
        toast.error('Acesso negado: não é um administrador')
        navigate('/admin/login')
        return
      }
    }

    checkAdminStatus()
    fetchUsersData()

    // Setup realtime subscription for new users
    const channel = supabase
      .channel('admin-realtime')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'profiles'
      }, () => {
        fetchUsersData()
        toast.success('Novo usuário registrado!')
      })
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'subscribers'
      }, () => {
        fetchUsersData()
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [navigate, user])

  const fetchUsersData = async () => {
    try {
      setLoading(true)
      
      // Buscar dados dos usuários com informações de assinatura
      const { data: profiles, error } = await supabase
        .from('profiles')
        .select(`
          id, email, full_name, created_at, is_trial_active, trial_end,
          subscribers(subscription_tier, subscribed)
        `)
        .order('created_at', { ascending: false })

      console.log('Profiles data:', profiles)

      if (error) {
        toast.error('Erro ao carregar dados dos usuários')
        console.error(error)
        return
      }

      // Transform data to include subscription info
      const usersWithSubscription = profiles?.map(profile => {
        const subscriberData = (profile.subscribers as any)?.[0]
        return {
          ...profile,
          subscription_tier: subscriberData?.subscription_tier || 'trial',
          subscribed: subscriberData?.subscribed || false
        }
      }) || []

      console.log('Users with subscription:', usersWithSubscription)
      setUsers(usersWithSubscription)

      // Calcular estatísticas
      const totalUsers = usersWithSubscription.length
      const activeTrials = usersWithSubscription.filter(p => 
        p.subscription_tier === 'trial' && p.is_trial_active
      ).length
      const basicSubscribers = usersWithSubscription.filter(p => 
        p.subscription_tier === 'basic' && p.subscribed
      ).length
      const premiumSubscribers = usersWithSubscription.filter(p => 
        p.subscription_tier === 'premium' && p.subscribed
      ).length
      const eliteSubscribers = usersWithSubscription.filter(p => 
        p.subscription_tier === 'elite' && p.subscribed
      ).length
      const expiredTrials = usersWithSubscription.filter(p => 
        p.subscription_tier === 'trial' && !p.is_trial_active
      ).length
      
      // Calcular receita real baseada nos preços dos planos
      const totalRevenue = (basicSubscribers * SUBSCRIPTION_PLANS.basic.price) + 
                          (premiumSubscribers * SUBSCRIPTION_PLANS.premium.price) + 
                          (eliteSubscribers * SUBSCRIPTION_PLANS.elite.price)

      setStats({
        totalUsers,
        activeTrials,
        expiredTrials,
        basicSubscribers,
        premiumSubscribers,
        eliteSubscribers,
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

  const handleLogout = async () => {
    await signOut()
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-4 mb-8">
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
              <Users className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{stats.activeTrials}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Assinantes Basic</CardTitle>
              <Users className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.basicSubscribers}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Assinantes Premium</CardTitle>
              <Users className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">{stats.premiumSubscribers}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Assinantes Elite</CardTitle>
              <Crown className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{stats.eliteSubscribers}</div>
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
              <p className="text-xs text-muted-foreground">Basic: €{SUBSCRIPTION_PLANS.basic.price} | Premium: €{SUBSCRIPTION_PLANS.premium.price} | Elite: €{SUBSCRIPTION_PLANS.elite.price}</p>
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
                  <TableHead>Plano</TableHead>
                  <TableHead>Status</TableHead>
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
                      <Badge 
                        variant={
                          user.subscription_tier === 'elite' ? "default" :
                          user.subscription_tier === 'premium' ? "secondary" :
                          user.subscription_tier === 'basic' ? "secondary" : 
                          "outline"
                        }
                        className={
                          user.subscription_tier === 'elite' ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200" :
                          user.subscription_tier === 'premium' ? "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200" :
                          user.subscription_tier === 'basic' ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" : 
                          ""
                        }
                      >
                        {user.subscription_tier === 'elite' && <Crown className="w-3 h-3 mr-1" />}
                        {user.subscription_tier === 'elite' ? 'Elite' : 
                         user.subscription_tier === 'premium' ? 'Premium' :
                         user.subscription_tier === 'basic' ? 'Basic' : 'Trial'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={
                        user.subscribed ? "default" :
                        user.is_trial_active && !isTrialExpired(user.trial_end) ? "secondary" : 
                        "destructive"
                      }>
                        {user.subscribed ? "Assinante" : 
                         user.is_trial_active && !isTrialExpired(user.trial_end) ? "Trial Ativo" : "Expirado"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {user.subscription_tier === 'trial' ? formatDate(user.trial_end) : '-'}
                    </TableCell>
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