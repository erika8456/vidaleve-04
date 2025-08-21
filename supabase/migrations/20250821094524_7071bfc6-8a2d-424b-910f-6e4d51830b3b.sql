-- Create secure admin check helper function
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT EXISTS (
    SELECT 1 
    FROM public.admins 
    WHERE user_id = auth.uid()
  )
$$;

-- Drop overly permissive subscribers policies
DROP POLICY IF EXISTS "insert_subscription" ON public.subscribers;
DROP POLICY IF EXISTS "update_own_subscription" ON public.subscribers;

-- Create strict subscribers policies
CREATE POLICY "users_can_insert_own_subscription" 
ON public.subscribers 
FOR INSERT 
WITH CHECK (auth.uid() = user_id OR auth.email() = email);

CREATE POLICY "users_can_select_own_subscription" 
ON public.subscribers 
FOR SELECT 
USING (auth.uid() = user_id OR auth.email() = email OR public.is_admin());

CREATE POLICY "users_can_update_own_subscription" 
ON public.subscribers 
FOR UPDATE 
USING (auth.uid() = user_id OR auth.email() = email OR public.is_admin())
WITH CHECK (auth.uid() = user_id OR auth.email() = email OR public.is_admin());

-- Add admin policies for profiles
CREATE POLICY "admins_can_view_all_profiles" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = id OR public.is_admin());

-- Add unique constraints to prevent spoofing
ALTER TABLE public.subscribers 
ADD CONSTRAINT unique_user_id UNIQUE (user_id);

-- Make user_id NOT NULL for better security
ALTER TABLE public.subscribers 
ALTER COLUMN user_id SET NOT NULL;