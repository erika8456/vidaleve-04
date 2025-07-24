-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create profiles table for user data
CREATE TABLE public.profiles (
  id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  email TEXT,
  avatar_url TEXT,
  age INTEGER,
  height INTEGER,
  current_weight DECIMAL,
  target_weight DECIMAL,
  activity_level TEXT,
  medical_conditions TEXT,
  dietary_preferences TEXT,
  dietary_restrictions TEXT,
  goals TEXT,
  trial_end TIMESTAMP WITH TIME ZONE DEFAULT (now() + interval '4 days'),
  is_trial_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  PRIMARY KEY (id)
);

-- Create meals table
CREATE TABLE public.meals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  calories INTEGER DEFAULT 0,
  protein DECIMAL DEFAULT 0,
  carbs DECIMAL DEFAULT 0,
  fat DECIMAL DEFAULT 0,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create daily meal plans table
CREATE TABLE public.daily_meal_plans (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  breakfast_meal_id UUID REFERENCES public.meals(id),
  lunch_meal_id UUID REFERENCES public.meals(id),
  snack_meal_id UUID REFERENCES public.meals(id),
  dinner_meal_id UUID REFERENCES public.meals(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, date)
);

-- Create meal completions table
CREATE TABLE public.meal_completions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  meal_id UUID NOT NULL REFERENCES public.meals(id) ON DELETE CASCADE,
  meal_type TEXT NOT NULL,
  completed_date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, meal_id, meal_type, completed_date)
);

-- Create user progress table
CREATE TABLE public.user_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  weight DECIMAL NOT NULL,
  recorded_date DATE NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, recorded_date)
);

-- Create user streaks table
CREATE TABLE public.user_streaks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  last_activity_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id)
);

-- Create notifications table
CREATE TABLE public.notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT DEFAULT 'info',
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create cart items table
CREATE TABLE public.cart_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_name TEXT NOT NULL,
  price DECIMAL NOT NULL,
  quantity INTEGER DEFAULT 1,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create image bank table
CREATE TABLE public.image_bank (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  filename TEXT NOT NULL,
  original_name TEXT NOT NULL,
  file_size INTEGER,
  mime_type TEXT,
  url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public) 
VALUES ('avatars', 'avatars', true) 
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public) 
VALUES ('image-bank', 'image-bank', false) 
ON CONFLICT (id) DO NOTHING;

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_meal_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meal_completions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_streaks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.image_bank ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile" ON public.profiles
FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON public.profiles
FOR INSERT WITH CHECK (auth.uid() = id);

-- RLS Policies for meals (public read, admin write)
CREATE POLICY "Anyone can view meals" ON public.meals
FOR SELECT USING (true);

-- RLS Policies for daily meal plans
CREATE POLICY "Users can view their own meal plans" ON public.daily_meal_plans
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own meal plans" ON public.daily_meal_plans
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own meal plans" ON public.daily_meal_plans
FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for meal completions
CREATE POLICY "Users can view their own completions" ON public.meal_completions
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own completions" ON public.meal_completions
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own completions" ON public.meal_completions
FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for user progress
CREATE POLICY "Users can view their own progress" ON public.user_progress
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own progress" ON public.user_progress
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own progress" ON public.user_progress
FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for user streaks
CREATE POLICY "Users can view their own streaks" ON public.user_streaks
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own streaks" ON public.user_streaks
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own streaks" ON public.user_streaks
FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for notifications
CREATE POLICY "Users can view their own notifications" ON public.notifications
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications" ON public.notifications
FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for cart items
CREATE POLICY "Users can view their own cart" ON public.cart_items
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own cart items" ON public.cart_items
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own cart items" ON public.cart_items
FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own cart items" ON public.cart_items
FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for image bank
CREATE POLICY "Users can view their own images" ON public.image_bank
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can upload their own images" ON public.image_bank
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own images" ON public.image_bank
FOR DELETE USING (auth.uid() = user_id);

-- Storage policies for avatars
CREATE POLICY "Avatar images are publicly accessible" ON storage.objects
FOR SELECT USING (bucket_id = 'avatars');

CREATE POLICY "Users can upload their own avatar" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own avatar" ON storage.objects
FOR UPDATE USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Storage policies for image bank
CREATE POLICY "Users can view their own images in bank" ON storage.objects
FOR SELECT USING (bucket_id = 'image-bank' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can upload to their image bank" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'image-bank' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete from their image bank" ON storage.objects
FOR DELETE USING (bucket_id = 'image-bank' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_streaks_updated_at
  BEFORE UPDATE ON public.user_streaks
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email)
  );
  
  INSERT INTO public.user_streaks (user_id)
  VALUES (NEW.id);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for new user registration
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Insert some sample meals
INSERT INTO public.meals (name, description, calories, protein, carbs, fat) VALUES
('Aveia com Frutas', 'Aveia integral com banana e morangos', 320, 12, 55, 8),
('Salada de Quinoa', 'Salada nutritiva com quinoa, vegetais e azeite', 380, 14, 42, 16),
('Peito de Frango Grelhado', 'Peito de frango com legumes no vapor', 420, 35, 15, 18),
('Smoothie Verde', 'Smoothie com espinafre, banana e proteína', 280, 25, 30, 5),
('Salmão com Brócolis', 'Salmão grelhado com brócolis e batata doce', 450, 32, 25, 22),
('Iogurte com Granola', 'Iogurte natural com granola caseira', 250, 15, 35, 8);

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.profiles;
ALTER PUBLICATION supabase_realtime ADD TABLE public.daily_meal_plans;
ALTER PUBLICATION supabase_realtime ADD TABLE public.meal_completions;
ALTER PUBLICATION supabase_realtime ADD TABLE public.user_progress;
ALTER PUBLICATION supabase_realtime ADD TABLE public.user_streaks;
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
ALTER PUBLICATION supabase_realtime ADD TABLE public.cart_items;
ALTER PUBLICATION supabase_realtime ADD TABLE public.image_bank;