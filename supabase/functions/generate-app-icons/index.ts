import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Verify caller is authenticated and is an admin
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Authorization header required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
      )
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: {
            Authorization: authHeader,
          },
        },
      }
    )

    // Verify caller is authenticated and is an admin
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser()
    if (authError || !user) {
      console.error('Authentication failed:', authError)
      return new Response(
        JSON.stringify({ error: 'Authentication required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
      )
    }

    // Check if caller is an admin
    const { data: adminData, error: adminError } = await supabaseClient
      .from('admins')
      .select('role')
      .eq('user_id', user.id)
      .single()

    if (adminError || !adminData || adminData.role !== 'admin') {
      console.error('Admin verification failed:', adminError, 'User:', user.id)
      return new Response(
        JSON.stringify({ error: 'Admin access required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 403 }
      )
    }

    // Initialize Supabase client for storage operations
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Generate app icon using OpenAI
    const iconPrompt = "A professional mobile app icon for a health and nutrition app called 'Vida Leve' for people over 50. Modern, clean design with a gradient from green to blue, featuring a stylized heart or leaf symbol. Flat design style, no text, suitable for iOS and Android app stores. Ultra high resolution."
    
    const iconResponse = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`
      },
      body: JSON.stringify({
        model: 'gpt-image-1',
        prompt: iconPrompt,
        n: 1,
        size: '1024x1024',
        quality: 'high',
        output_format: 'png'
      })
    })

    if (!iconResponse.ok) {
      throw new Error('Failed to generate app icon')
    }

    const iconData = await iconResponse.json()
    const iconBase64 = iconData.data[0].b64_json
    
    // Generate splash screen
    const splashPrompt = "A beautiful splash screen for 'Vida Leve' nutrition app. Elegant gradient background from soft green to light blue, centered logo area with subtle geometric patterns. Clean, minimalist design for mobile app loading screen. Professional and welcoming aesthetic for health-conscious users over 50. Ultra high resolution."
    
    const splashResponse = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`
      },
      body: JSON.stringify({
        model: 'gpt-image-1',
        prompt: splashPrompt,
        n: 1,
        size: '1024x1536',
        quality: 'high',
        output_format: 'png'
      })
    })

    if (!splashResponse.ok) {
      throw new Error('Failed to generate splash screen')
    }

    const splashData = await splashResponse.json()
    const splashBase64 = splashData.data[0].b64_json

    // Convert base64 to file and upload to Supabase Storage
    const iconBuffer = Uint8Array.from(atob(iconBase64), c => c.charCodeAt(0))
    const splashBuffer = Uint8Array.from(atob(splashBase64), c => c.charCodeAt(0))

    // Upload icon
    const { data: iconUpload, error: iconError } = await supabase.storage
      .from('avatars')
      .upload(`app-assets/icon.png`, iconBuffer, {
        contentType: 'image/png',
        upsert: true
      })

    if (iconError) throw iconError

    // Upload splash screen
    const { data: splashUpload, error: splashError } = await supabase.storage
      .from('avatars')
      .upload(`app-assets/splash.png`, splashBuffer, {
        contentType: 'image/png', 
        upsert: true
      })

    if (splashError) throw splashError

    // Get public URLs
    const { data: iconUrl } = supabase.storage
      .from('avatars')
      .getPublicUrl('app-assets/icon.png')

    const { data: splashUrl } = supabase.storage
      .from('avatars')
      .getPublicUrl('app-assets/splash.png')

    return new Response(
      JSON.stringify({
        success: true,
        iconUrl: iconUrl.publicUrl,
        splashUrl: splashUrl.publicUrl,
        iconBase64: `data:image/png;base64,${iconBase64}`,
        splashBase64: `data:image/png;base64,${splashBase64}`
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error generating app icons:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})