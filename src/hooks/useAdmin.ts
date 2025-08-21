import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/integrations/supabase/client'

export function useAdmin() {
  const { user, loading } = useAuth()
  const [isAdmin, setIsAdmin] = useState<boolean>(false)
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!user) {
        setIsAdmin(false)
        setChecking(false)
        return
      }

      try {
        const { data, error } = await supabase
          .from('admins')
          .select('role')
          .eq('user_id', user.id)
          .single()

        setIsAdmin(!error && data?.role === 'admin')
      } catch (error) {
        console.error('Error checking admin status:', error)
        setIsAdmin(false)
      } finally {
        setChecking(false)
      }
    }

    if (!loading) {
      checkAdminStatus()
    }
  }, [user, loading])

  return { isAdmin, checking }
}