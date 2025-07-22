import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Edit } from 'lucide-react'

interface WeightEditDialogProps {
  currentWeight: number
  onUpdateWeight: (weight: number) => void
  trigger?: React.ReactNode
}

export function WeightEditDialog({ currentWeight, onUpdateWeight, trigger }: WeightEditDialogProps) {
  const [weight, setWeight] = useState(currentWeight.toString())
  const [open, setOpen] = useState(false)

  const handleSave = () => {
    const newWeight = parseFloat(weight)
    if (newWeight > 0 && newWeight <= 300) {
      onUpdateWeight(newWeight)
      setOpen(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
            <Edit className="h-3 w-3" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Atualizar Peso Atual</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="weight">Peso atual (kg)</Label>
            <Input
              id="weight"
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder="Ex: 75.5"
              min="30"
              max="300"
              step="0.1"
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSave} className="gradient-primary text-white">
              Salvar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}