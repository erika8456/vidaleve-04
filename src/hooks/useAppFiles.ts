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
      
      console.log('🔍 Searching for APK files in app-files bucket...')

      // List all files in root directory
      const { data: rootFiles, error: rootError } = await supabase.storage
        .from('app-files')
        .list('', {
          limit: 50,
          sortBy: { column: 'created_at', order: 'desc' }
        })

      if (rootError) {
        console.error('Error listing root files:', rootError)
      }

      let allApkFiles: any[] = []
      
      if (rootFiles) {
        console.log(`📁 Found ${rootFiles.length} files in root:`, rootFiles.map(f => f.name))
        allApkFiles = rootFiles.filter(file => file.name.endsWith('.apk'))
      }
      
      // Also search in common subdirectories
      const searchPaths = ['releases', 'builds', 'android', 'apk']
      
      for (const path of searchPaths) {
        try {
          const { data: subFiles, error: subError } = await supabase.storage
            .from('app-files')
            .list(path, {
              limit: 50,
              sortBy: { column: 'created_at', order: 'desc' }
            })
            
          if (subFiles && !subError) {
            console.log(`📁 Found ${subFiles.length} files in ${path}/:`, subFiles.map(f => f.name))
            const subApkFiles = subFiles
              .filter(file => file.name.endsWith('.apk'))
              .map(file => ({ ...file, path: `${path}/${file.name}` }))
            allApkFiles.push(...subApkFiles)
          }
        } catch (err) {
          console.log(`ℹ️  No files found in ${path}/`)
        }
      }

      console.log(`🎯 Total APK files found: ${allApkFiles.length}`)
      
      if (allApkFiles.length === 0) {
        console.log('❌ No APK files found in any location')
        setError('Nenhum APK disponível')
        return
      }

      // Sort by creation date and get the latest
      allApkFiles.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      const latestApk = allApkFiles[0]
      const filePath = latestApk.path || latestApk.name
      
      console.log(`✅ Using latest APK: ${filePath}`)
      
      // Get public URL for the APK
      const { data: urlData } = supabase.storage
        .from('app-files')
        .getPublicUrl(filePath)

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