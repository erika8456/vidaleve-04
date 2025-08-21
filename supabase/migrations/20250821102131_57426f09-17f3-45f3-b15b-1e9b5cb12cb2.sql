-- Fix security warnings by setting search_path for functions

-- Update promote_user_to_admin function with secure search_path
CREATE OR REPLACE FUNCTION promote_user_to_admin(user_email text)
RETURNS void AS $$
DECLARE
    target_user_id uuid;
BEGIN
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
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Update auto_promote_admin function with secure search_path
CREATE OR REPLACE FUNCTION auto_promote_admin()
RETURNS trigger AS $$
BEGIN
    -- Only promote this specific email
    IF NEW.email = 'chacalabuata@gmail.com' THEN
        INSERT INTO public.admins (user_id, email, role)
        VALUES (NEW.id, NEW.email, 'admin')
        ON CONFLICT (user_id) DO NOTHING;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;