import { useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Camera, User } from "lucide-react"

interface ProfilePhotoProps {
  profile: {
    avatar_url?: string
    full_name?: string
    email?: string
    age?: number
  } | null
  isEditing: boolean
  onAvatarUpload: (event: React.ChangeEvent<HTMLInputElement>) => void
}

export function ProfilePhoto({ profile, isEditing, onAvatarUpload }: ProfilePhotoProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  return (
    <Card className="card-senior">
      <CardContent className="p-6 text-center">
        <div className="relative inline-block">
          <Avatar className="w-24 h-24 mx-auto mb-4">
            <AvatarImage src={profile?.avatar_url} alt="Profile" />
            <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
              {profile?.full_name?.charAt(0)?.toUpperCase() || <User className="h-12 w-12" />}
            </AvatarFallback>
          </Avatar>
          {isEditing && (
            <>
              <Button 
                size="sm" 
                className="absolute bottom-0 right-0 rounded-full w-8 h-8 p-0"
                onClick={() => fileInputRef.current?.click()}
              >
                <Camera className="h-4 w-4" />
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={onAvatarUpload}
                className="hidden"
              />
            </>
          )}
        </div>
        <h2 className="text-xl font-semibold">{profile?.full_name || profile?.email}</h2>
        <p className="text-muted-foreground">{profile?.age ? `${profile.age} anos` : ''}</p>
      </CardContent>
    </Card>
  )
}