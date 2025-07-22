import { Button } from "@/components/ui/button"
import { Edit3, Save } from "lucide-react"

interface ProfileHeaderProps {
  isEditing: boolean
  saving: boolean
  onEdit: () => void
  onSave: () => void
  onCancel: () => void
}

export function ProfileHeader({ isEditing, saving, onEdit, onSave, onCancel }: ProfileHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Meu Perfil</h1>
        <p className="text-lg text-muted-foreground">
          Gerencie suas informações pessoais e nutricionais
        </p>
      </div>
      {!isEditing ? (
        <Button 
          onClick={onEdit}
          className="btn-senior"
        >
          <Edit3 className="h-5 w-5 mr-2" />
          Editar Perfil
        </Button>
      ) : (
        <div className="flex gap-3">
          <Button 
            variant="outline"
            onClick={onCancel}
            className="btn-senior"
          >
            Cancelar
          </Button>
          <Button 
            onClick={onSave}
            className="btn-senior gradient-primary text-white"
            disabled={saving}
          >
            <Save className="h-5 w-5 mr-2" />
            {saving ? 'Salvando...' : 'Salvar'}
          </Button>
        </div>
      )}
    </div>
  )
}