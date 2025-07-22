-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create meals table for storing different meal options
CREATE TABLE public.meals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('cafe_manha', 'almoco', 'lanche', 'jantar')),
  description TEXT,
  ingredients TEXT[],
  instructions TEXT,
  calories INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create daily_meal_plans table for user meal plans
CREATE TABLE public.daily_meal_plans (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  date DATE NOT NULL,
  breakfast_meal_id UUID REFERENCES public.meals(id),
  lunch_meal_id UUID REFERENCES public.meals(id),
  snack_meal_id UUID REFERENCES public.meals(id),
  dinner_meal_id UUID REFERENCES public.meals(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, date)
);

-- Create meal_completions table to track completed meals
CREATE TABLE public.meal_completions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  meal_id UUID NOT NULL REFERENCES public.meals(id),
  meal_type TEXT NOT NULL CHECK (meal_type IN ('cafe_manha', 'almoco', 'lanche', 'jantar')),
  completed_date DATE NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, meal_id, meal_type, completed_date)
);

-- Enable Row Level Security
ALTER TABLE public.meals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_meal_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meal_completions ENABLE ROW LEVEL SECURITY;

-- Create policies for meals (public read access)
CREATE POLICY "Anyone can view meals" 
ON public.meals 
FOR SELECT 
USING (true);

-- Create policies for daily_meal_plans
CREATE POLICY "Users can view their own meal plans" 
ON public.daily_meal_plans 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own meal plans" 
ON public.daily_meal_plans 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own meal plans" 
ON public.daily_meal_plans 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create policies for meal_completions
CREATE POLICY "Users can view their own meal completions" 
ON public.meal_completions 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own meal completions" 
ON public.meal_completions 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own meal completions" 
ON public.meal_completions 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own meal completions" 
ON public.meal_completions 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_meals_updated_at
BEFORE UPDATE ON public.meals
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_daily_meal_plans_updated_at
BEFORE UPDATE ON public.daily_meal_plans
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();