-- Add missing columns to meals table
ALTER TABLE public.meals 
ADD COLUMN IF NOT EXISTS type TEXT NOT NULL DEFAULT 'cafe_manha',
ADD COLUMN IF NOT EXISTS ingredients TEXT,
ADD COLUMN IF NOT EXISTS instructions TEXT;

-- Create meal type enum for consistency
ALTER TABLE public.meals 
ADD CONSTRAINT meals_type_check 
CHECK (type IN ('cafe_manha', 'almoco', 'lanche', 'jantar'));

-- Insert sample meals for each type if table is empty
DO $$
BEGIN
  IF (SELECT COUNT(*) FROM public.meals WHERE type = 'cafe_manha') = 0 THEN
    INSERT INTO public.meals (name, description, calories, protein, carbs, fat, ingredients, instructions, type) VALUES
    ('Aveia com Frutas', 'Bowl nutritivo de aveia com frutas frescas', 320, 12, 58, 8, 'Aveia em flocos, banana, morango, mel, leite desnatado', 'Misture a aveia com leite morno, adicione as frutas picadas e finalize com mel.', 'cafe_manha'),
    ('Ovos Mexidos com Torrada', 'Ovos mexidos cremosos com torrada integral', 280, 18, 22, 15, '2 ovos, 2 fatias de pão integral, manteiga, sal, pimenta', 'Bata os ovos, tempere e cozinhe em fogo baixo mexendo sempre. Sirva com torrada.', 'cafe_manha');
  END IF;

  IF (SELECT COUNT(*) FROM public.meals WHERE type = 'almoco') = 0 THEN
    INSERT INTO public.meals (name, description, calories, protein, carbs, fat, ingredients, instructions, type) VALUES
    ('Frango Grelhado com Arroz', 'Peito de frango grelhado com arroz integral e legumes', 450, 35, 45, 12, 'Peito de frango, arroz integral, brócolis, cenoura, azeite', 'Tempere o frango e grelhe. Cozinhe o arroz e refogue os legumes.', 'almoco'),
    ('Salmão com Batata Doce', 'Filé de salmão assado com batata doce e salada', 520, 40, 35, 22, 'Filé de salmão, batata doce, rúcula, tomate cereja, azeite', 'Asse o salmão e a batata doce. Monte a salada e tempere.', 'almoco');
  END IF;

  IF (SELECT COUNT(*) FROM public.meals WHERE type = 'lanche') = 0 THEN
    INSERT INTO public.meals (name, description, calories, protein, carbs, fat, ingredients, instructions, type) VALUES
    ('Iogurte com Granola', 'Iogurte natural com granola caseira e frutas', 180, 8, 25, 6, 'Iogurte natural, granola, frutas vermelhas', 'Coloque o iogurte no pote, adicione a granola e as frutas.', 'lanche'),
    ('Mix de Castanhas', 'Porção de castanhas variadas e frutas secas', 220, 6, 12, 18, 'Castanha do Pará, amendoim, damasco seco, uva passa', 'Misture todos os ingredientes em uma porção individual.', 'lanche');
  END IF;

  IF (SELECT COUNT(*) FROM public.meals WHERE type = 'jantar') = 0 THEN
    INSERT INTO public.meals (name, description, calories, protein, carbs, fat, ingredients, instructions, type) VALUES
    ('Sopa de Legumes', 'Sopa cremosa de legumes com frango desfiado', 280, 20, 25, 10, 'Frango desfiado, abóbora, chuchu, cenoura, cebola, alho', 'Refogue os temperos, adicione os legumes e o frango. Cozinhe até ficar macio.', 'jantar'),
    ('Omelete de Espinafre', 'Omelete leve com espinafre e queijo cottage', 240, 22, 8, 14, '3 ovos, espinafre, queijo cottage, tomate, cebola', 'Refogue o espinafre, bata os ovos e faça a omelete. Adicione o queijo.', 'jantar');
  END IF;
END $$;