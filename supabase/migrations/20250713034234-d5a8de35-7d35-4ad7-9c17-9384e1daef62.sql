-- Insert sample meals
INSERT INTO public.meals (name, type, description, ingredients, instructions, calories) VALUES
-- Café da manhã
('Aveia com Frutas', 'cafe_manha', 'Tigela nutritiva de aveia com frutas frescas', 
 ARRAY['1/2 xícara de aveia', '1 banana', '1/2 xícara de leite', '1 colher de mel', 'Canela'], 
 'Cozinhe a aveia com leite, adicione a banana em fatias, mel e canela.', 350),

('Omelete de Vegetais', 'cafe_manha', 'Omelete proteica com vegetais frescos', 
 ARRAY['2 ovos', '1/4 xícara de espinafre', '1/4 xícara de tomate', '1 fatia de queijo branco'], 
 'Bata os ovos, adicione os vegetais e cozinhe na frigideira.', 280),

('Iogurte com Granola', 'cafe_manha', 'Iogurte natural com granola caseira', 
 ARRAY['1 pote de iogurte natural', '2 colheres de granola', '1/2 xícara de frutas vermelhas'], 
 'Misture o iogurte com a granola e decore com frutas.', 320),

-- Almoço
('Salmão Grelhado', 'almoco', 'Salmão grelhado com legumes no vapor', 
 ARRAY['1 filé de salmão', '1 xícara de brócolis', '1/2 xícara de cenoura', '1/4 xícara de arroz integral'], 
 'Grelhe o salmão e sirva com legumes no vapor e arroz.', 450),

('Frango com Quinoa', 'almoco', 'Peito de frango com quinoa e salada', 
 ARRAY['150g de peito de frango', '1/2 xícara de quinoa', 'Folhas verdes', '1 tomate'], 
 'Grelhe o frango, cozinhe a quinoa e monte a salada.', 420),

('Peixe com Batata Doce', 'almoco', 'Peixe assado com batata doce e salada', 
 ARRAY['1 filé de peixe branco', '1 batata doce média', 'Salada mista', 'Azeite de oliva'], 
 'Asse o peixe e a batata doce, sirva com salada.', 380),

-- Lanche
('Mix de Castanhas', 'lanche', 'Porção de castanhas variadas', 
 ARRAY['10 amêndoas', '5 castanhas do brasil', '10 nozes'], 
 'Misture as castanhas e consuma como lanche.', 200),

('Fruta com Cottage', 'lanche', 'Maçã com queijo cottage', 
 ARRAY['1 maçã', '2 colheres de queijo cottage'], 
 'Corte a maçã e sirva com o queijo cottage.', 150),

('Smoothie Verde', 'lanche', 'Smoothie nutritivo com vegetais', 
 ARRAY['1 xícara de espinafre', '1/2 banana', '1/2 maçã', '1 xícara de água de coco'], 
 'Bata todos os ingredientes no liquidificador.', 180),

-- Jantar
('Sopa de Legumes', 'jantar', 'Sopa cremosa de legumes', 
 ARRAY['1 xícara de abóbora', '1/2 xícara de cenoura', '1/4 xícara de cebola', 'Temperos'], 
 'Refogue os legumes e cozinhe até ficarem macios, bata no liquidificador.', 250),

('Salada de Quinoa', 'jantar', 'Salada refrescante com quinoa', 
 ARRAY['1/2 xícara de quinoa', 'Pepino', 'Tomate', 'Rúcula', 'Azeite de oliva'], 
 'Cozinhe a quinoa, deixe esfriar e misture com os vegetais.', 280),

('Peixe ao Vapor', 'jantar', 'Peixe cozido no vapor com legumes', 
 ARRAY['1 filé de peixe', 'Abobrinha', 'Cenoura', 'Temperos naturais'], 
 'Cozinhe o peixe e legumes no vapor, tempere a gosto.', 300);