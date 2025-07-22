import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("No authorization header");
    }

    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error } = await supabaseClient.auth.getUser(token);
    
    if (error || !user) {
      throw new Error("User not authenticated");
    }

    // Get user profile
    const { data: profile, error: profileError } = await supabaseClient
      .from("profiles")
      .select("trial_end, subscription_active")
      .eq("id", user.id)
      .single();

    if (profileError) {
      throw new Error("Profile not found");
    }

    const now = new Date();
    const trialEnd = new Date(profile.trial_end);
    const isTrialExpired = trialEnd < now && !profile.subscription_active;

    return new Response(
      JSON.stringify({
        trial_expired: isTrialExpired,
        trial_end: profile.trial_end,
        subscription_active: profile.subscription_active,
        days_remaining: isTrialExpired ? 0 : Math.ceil((trialEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      }
    );
  }
});