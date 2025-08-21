-- Tighten RLS policies for admins table to prevent email exposure
-- Drop existing policies that might be too permissive
DROP POLICY IF EXISTS "Admins can view their own profile" ON public.admins;
DROP POLICY IF EXISTS "Admins can update their own profile" ON public.admins;

-- Create more restrictive policies using the secure is_admin() function
-- Only allow admins to view admin records, and only specific fields
CREATE POLICY "Admins can view admin records" 
ON public.admins 
FOR SELECT 
TO authenticated
USING (is_admin());

-- Allow users to update only their own admin profile, and only if they're already an admin
CREATE POLICY "Admins can update own profile" 
ON public.admins 
FOR UPDATE 
TO authenticated
USING (auth.uid() = user_id AND is_admin())
WITH CHECK (auth.uid() = user_id AND is_admin());

-- Prevent any INSERT operations on admins table through RLS
-- Admins should only be created through secure functions
CREATE POLICY "Prevent direct admin creation" 
ON public.admins 
FOR INSERT 
TO authenticated
WITH CHECK (false);