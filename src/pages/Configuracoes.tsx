import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Bell, Shield, Moon, Sun, User, Database, Trash2 } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"

export default function Configuracoes() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)
  const [darkMode, setDarkMode] = useState(false)
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [pushNotifications, setPushNotifications] = useState(false)

  const handleSaveSettings = () => {
    toast.success("Configurações salvas com sucesso!")
  }

  const handleDataExport = () => {
    toast.success("Exportação de dados iniciada! Você receberá um email em breve.")
  }

  const handleAccountDelete = () => {
    toast.error("Para excluir sua conta, entre em contato com o suporte.")
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Configurações</h1>
        <p className="text-lg text-muted-foreground mt-2">
          Gerencie suas preferências e configurações da conta
        </p>
      </div>

      {/* Notificações */}
      <Card className="card-senior">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-primary" />
            Notificações
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="notifications">Notificações Gerais</Label>
              <p className="text-sm text-muted-foreground">
                Receba notificações sobre refeições e progresso
              </p>
            </div>
            <Switch
              id="notifications"
              checked={notificationsEnabled}
              onCheckedChange={setNotificationsEnabled}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="email-notifications">Notificações por Email</Label>
              <p className="text-sm text-muted-foreground">
                Receba lembretes e dicas por email
              </p>
            </div>
            <Switch
              id="email-notifications"
              checked={emailNotifications}
              onCheckedChange={setEmailNotifications}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="push-notifications">Notificações Push</Label>
              <p className="text-sm text-muted-foreground">
                Receba notificações no navegador
              </p>
            </div>
            <Switch
              id="push-notifications"
              checked={pushNotifications}
              onCheckedChange={setPushNotifications}
            />
          </div>
        </CardContent>
      </Card>

      {/* Aparência */}
      <Card className="card-senior">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Moon className="h-5 w-5 text-primary" />
            Aparência
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="dark-mode">Modo Escuro</Label>
              <p className="text-sm text-muted-foreground">
                Alterne entre tema claro e escuro
              </p>
            </div>
            <Switch
              id="dark-mode"
              checked={darkMode}
              onCheckedChange={setDarkMode}
            />
          </div>
        </CardContent>
      </Card>

      {/* Privacidade */}
      <Card className="card-senior">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            Privacidade e Dados
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Exportar Dados</Label>
            <p className="text-sm text-muted-foreground">
              Baixe uma cópia de todos os seus dados
            </p>
            <Button variant="outline" onClick={handleDataExport}>
              <Database className="h-4 w-4 mr-2" />
              Exportar Dados
            </Button>
          </div>

          <Separator />

          <div className="space-y-2">
            <Label className="text-destructive">Zona de Perigo</Label>
            <p className="text-sm text-muted-foreground">
              Ações irreversíveis da conta
            </p>
            <Button variant="destructive" onClick={handleAccountDelete}>
              <Trash2 className="h-4 w-4 mr-2" />
              Excluir Conta
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Salvar Configurações */}
      <div className="flex justify-end">
        <Button onClick={handleSaveSettings} className="btn-senior gradient-primary text-white">
          Salvar Configurações
        </Button>
      </div>
    </div>
  )
}