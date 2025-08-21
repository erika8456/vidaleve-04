-- Fix critical privilege escalation in promote_user_to_admin function
-- This function now only allows self-promotion for allowlisted emails
CREATE OR REPLACE FUNCTION public.promote_user_to_admin(user_email text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
    target_user_id uuid;
    caller_user_id uuid;
    caller_email text;
BEGIN
    -- Get the caller's information
    caller_user_id := auth.uid();
    
    IF caller_user_id IS NULL THEN
        RAISE EXCEPTION 'Authentication required';
    END IF;
    
    -- Get caller's email from auth.users
    SELECT email INTO caller_email
    FROM auth.users
    WHERE id = caller_user_id;
    
    -- Only allow self-promotion and only for allowlisted emails
    IF caller_email != user_email THEN
        RAISE EXCEPTION 'Can only promote your own account';
    END IF;
    
    -- Allowlist of emails that can be promoted to admin
    IF user_email NOT IN ('chacalabuata@gmail.com') THEN
        RAISE EXCEPTION 'Email not authorized for admin promotion';
    END IF;
    
    -- Get the user ID from auth.users by email
    SELECT id INTO target_user_id
    FROM auth.users
    WHERE email = user_email
    LIMIT 1;
    
    -- If user exists and is not already an admin, add them
    IF target_user_id IS NOT NULL THEN
        INSERT INTO public.admins (user_id, email, role)
        VALUES (target_user_id, user_email, 'admin')
        ON CONFLICT (user_id) DO NOTHING;
    END IF;
END;
$function$;

-- Revoke execute from public and anon roles
REVOKE EXECUTE ON FUNCTION public.promote_user_to_admin(text) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.promote_user_to_admin(text) FROM anon;
-- Grant only to authenticated users (they still need to pass the allowlist check)
GRANT EXECUTE ON FUNCTION public.promote_user_to_admin(text) TO authenticated;

-- Add missing UPDATE and DELETE policies for app-files storage bucket
CREATE POLICY "Admins can update app files" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'app-files' AND is_admin());

CREATE POLICY "Admins can delete app files" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'app-files' AND is_admin());