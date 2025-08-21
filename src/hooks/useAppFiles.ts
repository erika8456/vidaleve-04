import { useState, useEffect } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { toast } from 'sonner'

interface AppFile {
  name: string
  url: string
  size: number
  created_at: string
}

export function useAppFiles() {
  const [apkFile, setApkFile] = useState<AppFile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchLatestAPK = async () => {
    try {
      setLoading(true)
      setError(null)

      // List all APK files from the app-files bucket
      const { data: files, error: listError } = await supabase.storage
        .from('app-files')
        .list('', {
          limit: 10,
          sortBy: { column: 'created_at', order: 'desc' }
        })

      if (listError) {
        console.error('Error listing APK files:', listError)
        setError('Erro ao carregar arquivo do app')
        return
      }

      // Find the latest APK file
      const apkFiles = files?.filter(file => file.name.endsWith('.apk')) || []
      
      if (apkFiles.length === 0) {
        setError('Nenhum APK disponível')
        return
      }

      const latestApk = apkFiles[0]
      
      // Get public URL for the APK
      const { data: urlData } = supabase.storage
        .from('app-files')
        .getPublicUrl(latestApk.name)

      setApkFile({
        name: latestApk.name,
        url: urlData.publicUrl,
        size: latestApk.metadata?.size || 0,
        created_at: latestApk.created_at || ''
      })

    } catch (error) {
      console.error('Error fetching APK:', error)
      setError('Erro ao carregar arquivo do app')
    } finally {
      setLoading(false)
    }
  }

  const uploadAPK = async (file: File): Promise<boolean> => {
    try {
      // Validate file type
      if (!file.name.endsWith('.apk')) {
        toast.error('Por favor, selecione um arquivo APK válido')
        return false
      }

      // Generate unique filename with timestamp
      const timestamp = new Date().toISOString().split('T')[0]
      const fileName = `vida-leve-${timestamp}.apk`

      // Upload file to Supabase storage
      const { error: uploadError } = await supabase.storage
        .from('app-files')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: true,
          contentType: 'application/vnd.android.package-archive'
        })

      if (uploadError) {
        console.error('Upload error:', uploadError)
        toast.error('Erro ao fazer upload do APK')
        return false
      }

      toast.success('APK enviado com sucesso!')
      await fetchLatestAPK() // Refresh the list
      return true

    } catch (error) {
      console.error('Error uploading APK:', error)
      toast.error('Erro ao fazer upload do APK')
      return false
    }
  }

  const deleteAPK = async (fileName: string): Promise<boolean> => {
    try {
      const { error } = await supabase.storage
        .from('app-files')
        .remove([fileName])

      if (error) {
        console.error('Delete error:', error)
        toast.error('Erro ao deletar APK')
        return false
      }

      toast.success('APK deletado com sucesso!')
      await fetchLatestAPK() // Refresh the list
      return true

    } catch (error) {
      console.error('Error deleting APK:', error)
      toast.error('Erro ao deletar APK')
      return false
    }
  }

  useEffect(() => {
    fetchLatestAPK()
  }, [])

  return {
    apkFile,
    loading,
    error,
    uploadAPK,
    deleteAPK,
    refreshAPK: fetchLatestAPK
  }
}