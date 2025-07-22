import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { User } from "lucide-react"

interface PersonalDataCardProps {
  profile: {
    full_name?: string
    age?: number
    height?: number
    activity_level?: string
  } | null
  formData: {
    full_name: string
    age: string
    height: string
    activity_level: string
  }
  isEditing: boolean
  onInputChange: (field: string, value: string) => void
}

export function PersonalDataCard({ profile, formData, isEditing, onInputChange }: PersonalDataCardProps) {
  return (
    <Card className="card-senior">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5 text-primary" />
          Dados Pessoais
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="nome">Nome Completo</Label>
          {isEditing ? (
            <Input
              id="nome"
              value={formData.full_name}
              onChange={(e) => onInputChange('full_name', e.target.value)}
              className="text-lg"
            />
          ) : (
            <p className="text-lg font-medium">{profile?.full_name || 'Não informado'}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="idade">Idade</Label>
            {isEditing ? (
              <Input
                id="idade"
                value={formData.age}
                onChange={(e) => onInputChange('age', e.target.value)}
                type="number"
              />
            ) : (
              <p className="text-lg font-medium">{profile?.age ? `${profile.age} anos` : 'Não informado'}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="altura">Altura (cm)</Label>
            {isEditing ? (
              <Input
                id="altura"
                value={formData.height}
                onChange={(e) => onInputChange('height', e.target.value)}
                type="number"
              />
            ) : (
              <p className="text-lg font-medium">{profile?.height ? `${profile.height} cm` : 'Não informado'}</p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="atividade">Nível de Atividade</Label>
          {isEditing ? (
            <Select 
              value={formData.activity_level} 
              onValueChange={(value) => onInputChange('activity_level', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sedentario">Sedentário</SelectItem>
                <SelectItem value="leve">Leve</SelectItem>
                <SelectItem value="moderado">Moderado</SelectItem>
                <SelectItem value="intenso">Intenso</SelectItem>
              </SelectContent>
            </Select>
          ) : (
            <p className="text-lg font-medium capitalize">{profile?.activity_level || 'Não informado'}</p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}