-- Create bucket for app downloads
INSERT INTO storage.buckets (id, name, public) 
VALUES ('app-files', 'app-files', true);

-- Create RLS policies for app-files bucket
CREATE POLICY "Anyone can view app files" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'app-files');

CREATE POLICY "Admins can upload app files" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'app-files' AND is_admin());