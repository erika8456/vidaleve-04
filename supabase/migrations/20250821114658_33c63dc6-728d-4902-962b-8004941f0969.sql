-- Fix payment security vulnerability: Remove email-based access to subscribers table
-- Drop existing policies that allow email-based access
DROP POLICY IF EXISTS "select_own_subscription" ON public.subscribers;
DROP POLICY IF EXISTS "users_can_insert_own_subscription" ON public.subscribers;
DROP POLICY IF EXISTS "users_can_select_own_subscription" ON public.subscribers;
DROP POLICY IF EXISTS "users_can_update_own_subscription" ON public.subscribers;

-- Create secure policies that only use user_id for access control
-- Users can only select their own subscription data
CREATE POLICY "users_can_select_own_subscription" 
ON public.subscribers 
FOR SELECT 
TO authenticated
USING (auth.uid() = user_id OR is_admin());

-- Users can only insert their own subscription data
CREATE POLICY "users_can_insert_own_subscription" 
ON public.subscribers 
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Users can only update their own subscription data
CREATE POLICY "users_can_update_own_subscription" 
ON public.subscribers 
FOR UPDATE 
TO authenticated
USING (auth.uid() = user_id OR is_admin())
WITH CHECK (auth.uid() = user_id OR is_admin());

-- Edge functions with service role key can perform all operations (bypasses RLS)
-- This policy ensures service role operations work for automated subscription updates
CREATE POLICY "service_role_full_access" 
ON public.subscribers 
FOR ALL 
TO service_role
USING (true)
WITH CHECK (true);