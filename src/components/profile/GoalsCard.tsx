import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Target } from "lucide-react"

interface GoalsCardProps {
  profile: {
    current_weight?: number
    target_weight?: number
    goals?: string
  } | null
  formData: {
    current_weight: string
    target_weight: string
    goals: string
  }
  isEditing: boolean
  onInputChange: (field: string, value: string) => void
}

export function GoalsCard({ profile, formData, isEditing, onInputChange }: GoalsCardProps) {
  return (
    <Card className="card-senior">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5 text-primary" />
          Metas e Objetivos
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="pesoAtual">Peso Atual (kg)</Label>
            {isEditing ? (
              <Input
                id="pesoAtual"
                value={formData.current_weight}
                onChange={(e) => onInputChange('current_weight', e.target.value)}
                type="number"
                step="0.1"
              />
            ) : (
              <p className="text-lg font-medium">{profile?.current_weight ? `${profile.current_weight} kg` : 'Não informado'}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="pesoMeta">Peso Meta (kg)</Label>
            {isEditing ? (
              <Input
                id="pesoMeta"
                value={formData.target_weight}
                onChange={(e) => onInputChange('target_weight', e.target.value)}
                type="number"
                step="0.1"
              />
            ) : (
              <p className="text-lg font-medium">{profile?.target_weight ? `${profile.target_weight} kg` : 'Não informado'}</p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="objetivo">Objetivo Principal</Label>
          {isEditing ? (
            <Textarea
              id="objetivo"
              value={formData.goals}
              onChange={(e) => onInputChange('goals', e.target.value)}
              rows={3}
            />
          ) : (
            <p className="text-base">{profile?.goals || 'Não informado'}</p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}