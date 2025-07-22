import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Heart } from "lucide-react"

interface MedicalCardProps {
  profile: {
    medical_conditions?: string
    dietary_restrictions?: string
  } | null
  formData: {
    medical_conditions: string
    dietary_restrictions: string
  }
  isEditing: boolean
  onInputChange: (field: string, value: string) => void
}

export function MedicalCard({ profile, formData, isEditing, onInputChange }: MedicalCardProps) {
  return (
    <Card className="card-senior">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Heart className="h-5 w-5 text-primary" />
          Condições Médicas
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="condicoes">Condições Médicas</Label>
          {isEditing ? (
            <Textarea
              id="condicoes"
              value={formData.medical_conditions}
              onChange={(e) => onInputChange('medical_conditions', e.target.value)}
              rows={3}
            />
          ) : (
            <p className="text-base">{profile?.medical_conditions || 'Nenhuma informada'}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="restricoes">Restrições Alimentares</Label>
          {isEditing ? (
            <Textarea
              id="restricoes"
              value={formData.dietary_restrictions}
              onChange={(e) => onInputChange('dietary_restrictions', e.target.value)}
              rows={2}
            />
          ) : (
            <p className="text-base">{profile?.dietary_restrictions || 'Nenhuma informada'}</p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}