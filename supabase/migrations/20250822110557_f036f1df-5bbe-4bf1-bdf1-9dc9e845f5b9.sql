
-- 1) Fix admins table policies: remove recursion and prevent client updates via RLS

-- Drop existing admins policies that reference is_admin() or allow client updates
DROP POLICY IF EXISTS "Admins can view admin records" ON public.admins;
DROP POLICY IF EXISTS "Admins can update own profile" ON public.admins;

-- Ensure direct client-side INSERT is blocked (recreate to be explicit)
DROP POLICY IF EXISTS "Prevent direct admin creation" ON public.admins;
CREATE POLICY "Prevent direct admin creation"
  ON public.admins
  FOR INSERT
  TO authenticated
  WITH CHECK (false);

-- Allow authenticated users to read ONLY their own admin row
-- This safely enables "am I admin?" checks without recursion
CREATE POLICY "Users can read own admin row"
  ON public.admins
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- (Intentionally do not add an UPDATE policy; only service_role/edge functions should modify admins)


-- 2) Storage: remove public read access for the app-files bucket if it's not needed anymore
-- This stops anyone from reading files from that bucket
DROP POLICY IF EXISTS "Anyone can view app files" ON storage.objects;
