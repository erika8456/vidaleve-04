import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.5';

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
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    // Get the authenticated user
    const { data: { user } } = await supabaseClient.auth.getUser();
    if (!user) {
      return new Response(JSON.stringify({ error: 'Não autorizado' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { date, regenerate } = await req.json();
    const targetDate = date || new Date().toISOString().split('T')[0];

    console.log('Generating meal plan for user:', user.id, 'date:', targetDate);

    // Get recently used meal IDs to avoid repetition (last 7 days)
    const { data: recentPlans } = await supabaseClient
      .from('daily_meal_plans')
      .select('breakfast_meal_id, lunch_meal_id, snack_meal_id, dinner_meal_id')
      .eq('user_id', user.id)
      .gte('date', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0])
      .neq('date', targetDate);

    const recentMealIds = recentPlans ? recentPlans.flatMap(plan => 
      [plan.breakfast_meal_id, plan.lunch_meal_id, plan.snack_meal_id, plan.dinner_meal_id]
    ).filter(Boolean) : [];

    // Check if meal plan already exists for this date
    const { data: existingPlan } = await supabaseClient
      .from('daily_meal_plans')
      .select('*')
      .eq('user_id', user.id)
      .eq('date', targetDate)
      .single();

    if (existingPlan && !regenerate) {
      // Return existing plan with meal details
      const { data: planWithMeals } = await supabaseClient
        .from('daily_meal_plans')
        .select(`
          *,
          breakfast_meal:breakfast_meal_id(id, name, description, ingredients, instructions, calories),
          lunch_meal:lunch_meal_id(id, name, description, ingredients, instructions, calories),
          snack_meal:snack_meal_id(id, name, description, ingredients, instructions, calories),
          dinner_meal:dinner_meal_id(id, name, description, ingredients, instructions, calories)
        `)
        .eq('id', existingPlan.id)
        .single();

      return new Response(JSON.stringify({ 
        message: 'Plano de refeições já existe para esta data',
        plan: planWithMeals.data 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Get all available meals by type
    const { data: meals, error: mealsError } = await supabaseClient
      .from('meals')
      .select('*');

    if (mealsError || !meals) {
      console.error('Error fetching meals:', mealsError);
      return new Response(JSON.stringify({ error: 'Erro ao buscar refeições' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Helper function to get random meal avoiding recent selections
    const getRandomMeal = (mealsByType: any[], excludeIds: string[]) => {
      const availableMeals = mealsByType.filter(meal => !excludeIds.includes(meal.id));
      const mealsToChooseFrom = availableMeals.length > 0 ? availableMeals : mealsByType;
      return mealsToChooseFrom[Math.floor(Math.random() * mealsToChooseFrom.length)];
    };

    // Separate meals by type
    const breakfastMeals = meals.filter(meal => meal.type === 'cafe_manha');
    const lunchMeals = meals.filter(meal => meal.type === 'almoco');
    const snackMeals = meals.filter(meal => meal.type === 'lanche');
    const dinnerMeals = meals.filter(meal => meal.type === 'jantar');

    // Randomly select one meal from each type, avoiding recent selections
    const selectedBreakfast = getRandomMeal(breakfastMeals, recentMealIds);
    const selectedLunch = getRandomMeal(lunchMeals, recentMealIds);
    const selectedSnack = getRandomMeal(snackMeals, recentMealIds);
    const selectedDinner = getRandomMeal(dinnerMeals, recentMealIds);

    // Create or update the meal plan
    let newPlan, planError;

    const planData = {
      user_id: user.id,
      date: targetDate,
      breakfast_meal_id: selectedBreakfast?.id,
      lunch_meal_id: selectedLunch?.id,
      snack_meal_id: selectedSnack?.id,
      dinner_meal_id: selectedDinner?.id,
    };

    if (existingPlan) {
      // Update existing plan
      const { data, error } = await supabaseClient
        .from('daily_meal_plans')
        .update(planData)
        .eq('id', existingPlan.id)
        .select(`
          *,
          breakfast_meal:breakfast_meal_id(id, name, description, ingredients, instructions, calories),
          lunch_meal:lunch_meal_id(id, name, description, ingredients, instructions, calories),
          snack_meal:snack_meal_id(id, name, description, ingredients, instructions, calories),
          dinner_meal:dinner_meal_id(id, name, description, ingredients, instructions, calories)
        `)
        .single();
      newPlan = data;
      planError = error;
    } else {
      // Create new plan
      const { data, error } = await supabaseClient
        .from('daily_meal_plans')
        .insert(planData)
        .select(`
          *,
          breakfast_meal:breakfast_meal_id(id, name, description, ingredients, instructions, calories),
          lunch_meal:lunch_meal_id(id, name, description, ingredients, instructions, calories),
          snack_meal:snack_meal_id(id, name, description, ingredients, instructions, calories),
          dinner_meal:dinner_meal_id(id, name, description, ingredients, instructions, calories)
        `)
        .single();
      newPlan = data;
      planError = error;
    }

    if (planError) {
      console.error('Error creating meal plan:', planError);
      return new Response(JSON.stringify({ error: 'Erro ao criar plano de refeições' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('Meal plan created successfully:', newPlan);

    return new Response(JSON.stringify({ 
      message: 'Plano de refeições gerado com sucesso!',
      plan: newPlan 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in generate-meal-plan function:', error);
    return new Response(JSON.stringify({ 
      error: 'Erro interno do servidor',
      details: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});