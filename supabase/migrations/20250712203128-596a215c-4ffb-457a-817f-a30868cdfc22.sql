-- Check if trigger exists and recreate if needed
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Recreate trigger for new user registration
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();