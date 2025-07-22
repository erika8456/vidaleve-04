import { useState, useEffect } from "react"
import { useProfile } from "@/hooks/useProfile"
import { ProfileHeader } from "@/components/profile/ProfileHeader"
import { ProfilePhoto } from "@/components/profile/ProfilePhoto"
import { PersonalDataCard } from "@/components/profile/PersonalDataCard"
import { GoalsCard } from "@/components/profile/GoalsCard"
import { MedicalCard } from "@/components/profile/MedicalCard"
import { PreferencesCard } from "@/components/profile/PreferencesCard"

export default function Perfil() {
  const { profile, loading, saving, updateProfile, uploadAvatar } = useProfile()
  const [isEditing, setIsEditing] = useState(false)

  const [formData, setFormData] = useState({
    full_name: "",
    age: "",
    height: "",
    current_weight: "",
    target_weight: "",
    activity_level: "",
    medical_conditions: "",
    dietary_preferences: "",
    dietary_restrictions: "",
    goals: ""
  })

  // Update form data when profile loads
  useEffect(() => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || "",
        age: profile.age?.toString() || "",
        height: profile.height?.toString() || "",
        current_weight: profile.current_weight?.toString() || "",
        target_weight: profile.target_weight?.toString() || "",
        activity_level: profile.activity_level || "",
        medical_conditions: profile.medical_conditions || "",
        dietary_preferences: profile.dietary_preferences || "",
        dietary_restrictions: profile.dietary_restrictions || "",
        goals: profile.goals || ""
      })
    }
  }, [profile])

  const handleSave = async () => {
    const success = await updateProfile({
      full_name: formData.full_name,
      age: formData.age ? parseInt(formData.age) : undefined,
      height: formData.height ? parseInt(formData.height) : undefined,
      current_weight: formData.current_weight ? parseFloat(formData.current_weight) : undefined,
      target_weight: formData.target_weight ? parseFloat(formData.target_weight) : undefined,
      activity_level: formData.activity_level,
      medical_conditions: formData.medical_conditions,
      dietary_preferences: formData.dietary_preferences,
      dietary_restrictions: formData.dietary_restrictions,
      goals: formData.goals
    })
    
    if (success) {
      setIsEditing(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      await uploadAvatar(file)
    }
  }

  if (loading) {
    return <div className="flex justify-center items-center h-64">Carregando...</div>
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <ProfileHeader
        isEditing={isEditing}
        saving={saving}
        onEdit={() => setIsEditing(true)}
        onSave={handleSave}
        onCancel={() => setIsEditing(false)}
      />

      <ProfilePhoto
        profile={profile}
        isEditing={isEditing}
        onAvatarUpload={handleAvatarUpload}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PersonalDataCard
          profile={profile}
          formData={formData}
          isEditing={isEditing}
          onInputChange={handleInputChange}
        />

        <GoalsCard
          profile={profile}
          formData={formData}
          isEditing={isEditing}
          onInputChange={handleInputChange}
        />

        <MedicalCard
          profile={profile}
          formData={formData}
          isEditing={isEditing}
          onInputChange={handleInputChange}
        />

        <PreferencesCard
          profile={profile}
          formData={formData}
          isEditing={isEditing}
          onInputChange={handleInputChange}
        />
      </div>
    </div>
  )
}