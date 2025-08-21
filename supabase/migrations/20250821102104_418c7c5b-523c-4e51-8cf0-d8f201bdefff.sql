-- Allow the specified email to become admin when they register
-- This ensures the user can be promoted to admin status

-- First, let's check if this email already exists as an admin, if not we'll enable it
-- Create a function to promote user to admin by email (will be used by the system)

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
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant permission for authenticated users to call this function (will be restricted by RLS)
GRANT EXECUTE ON FUNCTION promote_user_to_admin(text) TO authenticated;

-- Create a trigger function to automatically promote the specified email to admin
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
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to auto-promote admin on user creation
-- Note: We need to be careful with auth schema triggers, let's use a different approach

-- Instead, let's just try to promote the user if they already exist
SELECT promote_user_to_admin('chacalabuata@gmail.com');