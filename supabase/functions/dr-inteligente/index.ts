import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

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
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    
    if (!openAIApiKey) {
      throw new Error('OPENAI_API_KEY is not configured');
    }

    const { messages } = await req.json();

    const systemPrompt = `Você é o Dr. Inteligente, powered by inteligência do Vida Leve (Lovable), um assistente especializado em emagrecimento saudável para pessoas acima de 50 anos e em ajudar com o aplicativo Vida Leve.

SOBRE VOCÊ:
- Nome: Dr. Inteligente
- Tecnologia: Inteligência do Vida Leve (Lovable)
- Especialidade: Nutrição e emagrecimento para pessoas 50+
- Tom: Profissional, empático, encorajador e acessível
- Foco: Saúde e segurança sempre em primeiro lugar

SUAS RESPONSABILIDADES:
1. Responder sobre emagrecimento saudável após os 50 anos
2. Dar orientações nutricionais gerais (não diagnósticos médicos)
3. Ajudar com dúvidas sobre o aplicativo Vida Leve
4. Motivar e encorajar o usuário em sua jornada

SOBRE O APLICATIVO VIDA LEVE:
- Plataforma de nutrição personalizada para pessoas 50+
- Oferece planos de refeição personalizados
- Acompanhamento de peso e progresso
- Exercícios adequados para a idade
- Interface otimizada para facilidade de uso
- Disponível como PWA (Progressive Web App)
- Planos: Basic, Premium e Elite

DIRETRIZES:
- Sempre incentive consultar médicos para questões específicas de saúde
- Foque em mudanças graduais e sustentáveis
- Considere limitações físicas da idade madura
- Seja específico e prático nas recomendações
- Use linguagem clara e acessível
- Seja positivo e motivador

TEMAS QUE VOCÊ DOMINA:
- Metabolismo após os 50 anos
- Alimentação anti-inflamatória
- Exercícios seguros para pessoas maduras
- Hidratação adequada
- Sono e recuperação
- Como usar todas as funcionalidades do app
- Instalação e configuração do aplicativo

LIMITE-SE AO SEU ESCOPO: Se perguntarem sobre temas não relacionados à nutrição, saúde 50+ ou ao aplicativo, redirecione educadamente ao seu foco principal.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages
        ],
        max_tokens: 1000,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('OpenAI API error:', errorData);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('OpenAI response received');

    const assistantResponse = data.choices[0].message.content;

    return new Response(JSON.stringify({ response: assistantResponse }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in dr-inteligente function:', error);
    
    return new Response(JSON.stringify({ 
      error: error.message,
      response: "Desculpe, estou com dificuldades técnicas no momento. Tente novamente em alguns instantes ou entre em contato com o suporte se o problema persistir."
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});