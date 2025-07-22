-- Create storage bucket for profile images
INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true);

-- Create policies for avatar uploads
CREATE POLICY "Avatar images are publicly accessible" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'avatars');

CREATE POLICY "Users can upload their own avatar" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own avatar" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own avatar" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Add profile fields to profiles table
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS avatar_url TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS age INTEGER;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS height INTEGER;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS current_weight DECIMAL(5,2);
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS target_weight DECIMAL(5,2);
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS activity_level TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS medical_conditions TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS dietary_preferences TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS dietary_restrictions TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS goals TEXT;