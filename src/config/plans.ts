export const SUBSCRIPTION_PLANS = {
  basic: {
    name: 'Basic',
    price: 7.99,
    currency: 'EUR',
    features: ['Planos de Refeição', 'Acompanhamento de Peso', 'Receitas Básicas'],
  },
  premium: {
    name: 'Premium', 
    price: 12.99,
    currency: 'EUR',
    features: ['Todas do Basic', 'Exercícios', 'Receitas Premium', 'Analytics Avançados'],
  },
  elite: {
    name: 'Elite',
    price: 19.99, 
    currency: 'EUR',
    features: ['Todas do Premium', 'Suporte Prioritário', 'Conteúdo Exclusivo'],
  },
} as const;

export type PlanType = keyof typeof SUBSCRIPTION_PLANS;