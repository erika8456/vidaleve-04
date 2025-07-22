import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message } = await req.json();

    if (!message) {
      return new Response(JSON.stringify({ error: 'Mensagem é obrigatória' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4.1-2025-04-14',
        messages: [
          {
            role: 'system',
            content: `Você é uma assistente nutricional especializada em pessoas com mais de 50 anos para o aplicativo NutriSênior AI. 

SUAS CARACTERÍSTICAS:
- Especialista em nutrição para pessoas maduras (50+ anos)
- Focada em emagrecimento saudável e gradual
- Conhece sobre condições de saúde comuns nessa faixa etária (diabetes, hipertensão, etc.)
- Sempre amigável, empática e motivadora
- Usa emojis apropriados para deixar as respostas mais calorosas

DIRETRIZES:
- Sempre considere as necessidades especiais de pessoas 50+
- Dê conselhos seguros e personalizados
- Sugira alimentos acessíveis e fáceis de preparar
- Inclua dicas sobre hidratação, fibras e nutrientes essenciais
- Lembre sobre a importância de exercícios adequados
- Sempre termine perguntando se a pessoa tem mais dúvidas

RESPOSTAS VARIADAS PARA PERGUNTAS FREQUENTES:
- "Como acelerar o metabolismo após os 50?" - Alterne entre: exercícios de força, proteínas, chá verde, água gelada, fracionamento de refeições, alimentos termogênicos
- "Receitas saudáveis para o jantar" - Varie entre: salmão grelhado, omelete de legumes, sopa de lentilha, frango com quinoa, salada nutritiva
- "Dicas para beber mais água" - Sugira: apps lembretes, garrafas marcadas, águas saborizadas, chás, frutas com água
- "Exercícios adequados para minha idade" - Alterne: caminhada, natação, pilates, musculação leve, dança, yoga, hidroginástica
- "Alimentos que ajudam na pressão alta" - Varie: banana, alho, beterraba, aveia, peixes, redução de sódio, magnésio
- "Como controlar a diabetes com alimentação?" - Foque em: índice glicêmico baixo, fibras, porções controladas, horários regulares, carboidratos complexos

IMPORTANTE: NUNCA repita a mesma resposta. Sempre varie o conteúdo e as dicas, mesmo para perguntas similares.`
          },
          {
            role: 'user',
            content: message
          }
        ],
        temperature: 0.7,
        max_tokens: 500
      }),
    });

    if (!response.ok) {
      throw new Error(`Erro na API OpenAI: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0]?.message?.content || "Desculpe, não consegui processar sua pergunta. Tente novamente.";

    return new Response(JSON.stringify({ response: aiResponse }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Erro no chat-ai function:', error);
    
    // Return a default response if OpenAI fails
    const defaultResponse = "Olá! Sou sua assistente nutricional. Como posso ajudá-lo(a) hoje? 😊\n\nPosso te auxiliar com:\n• Planos alimentares personalizados\n• Receitas saudáveis\n• Dicas de nutrição\n• Exercícios adequados\n• Acompanhamento do seu progresso";
    
    return new Response(JSON.stringify({ 
      response: defaultResponse 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});