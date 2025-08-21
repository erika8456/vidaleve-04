-- Insert a super admin user for testing (promote the existing user)
INSERT INTO public.admins (user_id, email, role)
SELECT id, email, 'admin' 
FROM auth.users 
WHERE email = 'chacalabuata@gmail.com'
ON CONFLICT (user_id) DO NOTHING;