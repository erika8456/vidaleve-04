-- Remove email column from admins table to prevent email harvesting
-- The email is already available in auth.users and doesn't need to be duplicated

ALTER TABLE public.admins DROP COLUMN IF EXISTS email;