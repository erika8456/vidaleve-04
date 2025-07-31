-- Create exercises table
CREATE TABLE public.exercises (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  instructions TEXT,
  duration_minutes INTEGER DEFAULT 30,
  difficulty_level TEXT DEFAULT 'medium',
  day_of_week INTEGER, -- 0=Sunday, 1=Monday, etc.
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create exercise_reminders table
CREATE TABLE public.exercise_reminders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  reminder_time TIME NOT NULL DEFAULT '09:00:00',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exercise_reminders ENABLE ROW LEVEL SECURITY;

-- Exercise policies (read-only for users)
CREATE POLICY "Anyone can view exercises" 
ON public.exercises 
FOR SELECT 
USING (true);

-- Exercise reminders policies
CREATE POLICY "Users can view their own reminders" 
ON public.exercise_reminders 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own reminders" 
ON public.exercise_reminders 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reminders" 
ON public.exercise_reminders 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Add trigger for updated_at
CREATE TRIGGER update_exercise_reminders_updated_at
BEFORE UPDATE ON public.exercise_reminders
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample exercises with Portuguese names
INSERT INTO public.exercises (name, description, instructions, duration_minutes, difficulty_level, day_of_week, image_url) VALUES
('Caminhada Matinal', 'Uma caminhada energizante para começar o dia', 'Caminhe por 30 minutos em ritmo moderado. Mantenha a postura ereta e respire profundamente.', 30, 'easy', 1, 'photo-1500673922987-e212871fec22'),
('Alongamentos', 'Exercícios de flexibilidade e relaxamento', 'Faça alongamentos suaves focando nos principais grupos musculares. Mantenha cada posição por 30 segundos.', 20, 'easy', 2, 'photo-1523712999610-f77fbcfc3843'),
('Exercícios Funcionais', 'Treino para fortalecer o corpo todo', 'Realize agachamentos, flexões e pranchas. 3 séries de 10 repetições cada exercício.', 45, 'medium', 3, 'photo-1487058792275-0ad4aaf24ca7'),
('Yoga', 'Prática de yoga para equilibrio mente-corpo', 'Siga uma sequência de posturas de yoga focando na respiração e concentração.', 40, 'medium', 4, 'photo-1465146344425-f00d5f5c8f07'),
('Corrida Ligeira', 'Exercício cardiovascular moderado', 'Corra por 25 minutos mantendo um ritmo confortável onde ainda consegue conversar.', 25, 'medium', 5, 'photo-1439886183900-e79ec0057170'),
('Hidroginástica', 'Exercícios aquáticos de baixo impacto', 'Realize movimentos de aqua fitness na piscina, ideal para articulações.', 35, 'easy', 6, 'photo-1441057206919-63d19fac2369'),
('Descanso Ativo', 'Dia de recuperação com movimento suave', 'Faça uma caminhada leve ou exercícios de respiração. Foque no relaxamento.', 15, 'easy', 0, 'photo-1485833077593-4278bba3f11f');

-- Update meals with Portuguese dishes
UPDATE public.meals SET 
  name = 'Aveia com Frutas Portuguesas',
  description = 'Aveia cremosa com pêra rocha e canela',
  ingredients = 'Aveia, leite, pêra rocha, canela, mel, nozes',
  instructions = 'Cozinhe a aveia com leite. Adicione pêra cortada, canela e mel. Finalize com nozes.'
WHERE type = 'cafe_manha' AND id IN (SELECT id FROM meals WHERE type = 'cafe_manha' LIMIT 1);

INSERT INTO public.meals (name, description, ingredients, instructions, type, calories, protein, carbs, fat, image_url) VALUES
('Bacalhau à Brás', 'Prato tradicional português com bacalhau desfiado', 'Bacalhau, batata palha, ovos, cebola, azeitonas, salsa', 'Refogue a cebola, adicione o bacalhau e ovos mexidos. Finalize com batata palha e azeitonas.', 'almoco', 420, 35, 25, 18, 'photo-1498936178812-4b2e558d2937'),
('Caldo Verde', 'Sopa tradicional portuguesa com couve e chouriço', 'Couve portuguesa, batata, chouriço, cebola, azeite', 'Cozinhe as batatas, triture, adicione couve cortada finamente e chouriço em rodelas.', 'jantar', 280, 12, 30, 14, 'photo-1452960962994-acf4fd70b632'),
('Sardinhas Assadas', 'Sardinhas grelhadas com salada', 'Sardinhas frescas, pimento assado, tomate, cebola, azeite, oregãos', 'Grelhe as sardinhas e sirva com salada de pimentos assados e tomate.', 'almoco', 350, 28, 8, 22, 'photo-1493962853295-0fd70327578a'),
('Pastéis de Nata', 'Doce tradicional português (ocasionalmente)', 'Massa folhada, natas, ovos, açúcar, canela', 'Doce tradicional para ocasiões especiais. Consuma com moderação.', 'lanche', 200, 4, 18, 13, 'photo-1535268647677-300dbf3d78d1'),
('Bifana', 'Sanduíche português com lombo de porco', 'Lombo de porco, pão, alho, vinho branco, mostarda', 'Tempere o lombo e grelhe. Sirva no pão com mostarda.', 'lanche', 380, 25, 32, 16, 'photo-1501286353178-1ec881214838'),
('Caldeirada de Peixe', 'Ensopado português com peixe e legumes', 'Peixe variado, batata, tomate, pimento, cebola, coentros', 'Refogue os legumes, adicione o peixe em camadas e cozinhe lentamente.', 'jantar', 320, 30, 20, 12, 'photo-1469041797191-50ace28483c3'),
('Francesinha', 'Sanduíche do Porto com molho especial', 'Pão, fiambre, linguiça, bife, queijo, molho francesinha', 'Monte o sanduíche em camadas, cubra com queijo e molho quente.', 'almoco', 580, 35, 40, 28, 'photo-1452378174528-3090a4bba7b2'),
('Açorda de Marisco', 'Prato tradicional com pão e marisco', 'Pão alentejano, camarão, amêijoas, alho, coentros, ovos', 'Refogue o marisco, adicione pão embebido em caldo e ovos escalfados.', 'jantar', 390, 32, 35, 15, 'photo-1487252665478-49b61b47f302');