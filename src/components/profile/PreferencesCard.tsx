import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Activity } from "lucide-react"

interface PreferencesCardProps {
  profile: {
    dietary_preferences?: string
  } | null
  formData: {
    dietary_preferences: string
  }
  isEditing: boolean
  onInputChange: (field: string, value: string) => void
}

export function PreferencesCard({ profile, formData, isEditing, onInputChange }: PreferencesCardProps) {
  return (
    <Card className="card-senior">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-primary" />
          Preferências Alimentares
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="preferencias">Preferências</Label>
          {isEditing ? (
            <Textarea
              id="preferencias"
              value={formData.dietary_preferences}
              onChange={(e) => onInputChange('dietary_preferences', e.target.value)}
              rows={4}
            />
          ) : (
            <p className="text-base">{profile?.dietary_preferences || 'Nenhuma informada'}</p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}