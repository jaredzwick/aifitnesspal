import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
};

interface Database {
  public: {
    Tables: {
      nutrition_entries: {
        Row: {
          id: string;
          user_id: string;
          date: string;
          total_calories: number;
          total_protein: number;
          total_carbs: number;
          total_fat: number;
          total_fiber: number | null;
          water_intake: number | null;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          date: string;
          total_calories?: number;
          total_protein?: number;
          total_carbs?: number;
          total_fat?: number;
          total_fiber?: number;
          water_intake?: number;
          notes?: string;
        };
        Update: {
          total_calories?: number;
          total_protein?: number;
          total_carbs?: number;
          total_fat?: number;
          total_fiber?: number;
          water_intake?: number;
          notes?: string;
        };
      };
      foods: {
        Row: {
          id: string;
          name: string;
          brand: string | null;
          barcode: string | null;
          calories_per_100g: number;
          protein_per_100g: number;
          carbs_per_100g: number;
          fat_per_100g: number;
          fiber_per_100g: number | null;
          sugar_per_100g: number | null;
          sodium_per_100g: number | null;
          serving_size: number | null;
          serving_unit: string | null;
          created_by: string | null;
          created_at: string;
        };
        Insert: {
          name: string;
          brand?: string;
          barcode?: string;
          calories_per_100g: number;
          protein_per_100g: number;
          carbs_per_100g: number;
          fat_per_100g: number;
          fiber_per_100g?: number;
          sugar_per_100g?: number;
          sodium_per_100g?: number;
          serving_size?: number;
          serving_unit?: string;
          created_by?: string;
        };
        Update: {
          name?: string;
          brand?: string;
          barcode?: string;
          calories_per_100g?: number;
          protein_per_100g?: number;
          carbs_per_100g?: number;
          fat_per_100g?: number;
          fiber_per_100g?: number;
          sugar_per_100g?: number;
          sodium_per_100g?: number;
          serving_size?: number;
          serving_unit?: string;
        };
      };
      meals: {
        Row: {
          id: string;
          nutrition_entry_id: string;
          meal_type: string;
          name: string | null;
          consumed_at: string | null;
          created_at: string;
        };
        Insert: {
          nutrition_entry_id: string;
          meal_type: string;
          name?: string;
          consumed_at?: string;
        };
        Update: {
          meal_type?: string;
          name?: string;
          consumed_at?: string;
        };
      };
      meal_foods: {
        Row: {
          id: string;
          meal_id: string;
          food_id: string;
          quantity: number;
          unit: string;
          added_at: string | null;
          created_at: string;
        };
        Insert: {
          meal_id: string;
          food_id: string;
          quantity: number;
          unit: string;
          added_at?: string;
        };
        Update: {
          quantity?: number;
          unit?: string;
          added_at?: string;
        };
      };
    };
  };
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient<Database>(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    const { data: user } = await supabaseClient.auth.getUser();
    if (!user.user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const url = new URL(req.url);
    const segments = url.pathname.split('/').filter(Boolean);
    const resource = segments[segments.length - 1];
    const resourceId = segments.length > 2 ? segments[segments.length - 1] : null;

    switch (req.method) {
      case 'GET':
        if (resource === 'entries') {
          // Get nutrition entries with date filter
          const date = url.searchParams.get('date');
          const startDate = url.searchParams.get('start_date');
          const endDate = url.searchParams.get('end_date');
          const limit = url.searchParams.get('limit');

          let query = supabaseClient
            .from('nutrition_entries')
            .select(`
              *,
              meals (
                *,
                meal_foods (
                  *,
                  foods (*)
                )
              )
            `)
            .eq('user_id', user.user.id)
            .order('date', { ascending: false });

          if (date) {
            query = query.eq('date', date);
          } else if (startDate && endDate) {
            query = query.gte('date', startDate).lte('date', endDate);
          }

          if (limit) {
            query = query.limit(parseInt(limit));
          }

          const { data, error } = await query;
          if (error) throw error;

          return new Response(JSON.stringify(data), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });

        } else if (resource === 'foods') {
          // Search foods
          const search = url.searchParams.get('search');
          const barcode = url.searchParams.get('barcode');
          const popular = url.searchParams.get('popular');
          const recent = url.searchParams.get('recent');
          const limit = parseInt(url.searchParams.get('limit') || '50');

          let query = supabaseClient
            .from('foods')
            .select('*')
            .order('name');

          if (search) {
            query = query.or(`name.ilike.%${search}%,brand.ilike.%${search}%`);
          }
          if (barcode) {
            query = query.eq('barcode', barcode);
          }
          if (popular === 'true') {
            // Get most used foods - would need usage tracking
            query = query.order('created_at', { ascending: false });
          }
          if (recent === 'true') {
            // Get recently added foods by user
            query = query.eq('created_by', user.user.id).order('created_at', { ascending: false });
          }

          const { data, error } = await query.limit(limit);
          if (error) throw error;

          return new Response(JSON.stringify(data), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });

        } else if (resource === 'meals') {
          // Get meals for nutrition entry
          const nutritionEntryId = url.searchParams.get('nutrition_entry_id');
          
          if (!nutritionEntryId) {
            return new Response(JSON.stringify({ error: 'nutrition_entry_id required' }), {
              status: 400,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            });
          }

          const { data, error } = await supabaseClient
            .from('meals')
            .select(`
              *,
              meal_foods (
                *,
                foods (*)
              ),
              nutrition_entries!inner (
                user_id
              )
            `)
            .eq('nutrition_entry_id', nutritionEntryId)
            .eq('nutrition_entries.user_id', user.user.id)
            .order('created_at');

          if (error) throw error;

          return new Response(JSON.stringify(data), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });

        } else if (resource === 'analytics') {
          // Get nutrition analytics
          const startDate = url.searchParams.get('start_date');
          const endDate = url.searchParams.get('end_date');
          const metric = url.searchParams.get('metric') || 'calories';

          if (!startDate || !endDate) {
            return new Response(JSON.stringify({ error: 'start_date and end_date required' }), {
              status: 400,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            });
          }

          const { data, error } = await supabaseClient
            .from('nutrition_entries')
            .select(`date, total_${metric}`)
            .eq('user_id', user.user.id)
            .gte('date', startDate)
            .lte('date', endDate)
            .order('date');

          if (error) throw error;

          const analytics = data.map(entry => ({
            date: entry.date,
            value: entry[`total_${metric}`] || 0,
          }));

          return new Response(JSON.stringify(analytics), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });

        } else if (resource === 'suggestions') {
          // Get meal suggestions
          const mealType = url.searchParams.get('meal_type');
          const calorieTarget = url.searchParams.get('calorie_target');
          
          // Simple suggestion logic - would be more sophisticated in production
          let query = supabaseClient
            .from('foods')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(10);

          if (calorieTarget) {
            const target = parseInt(calorieTarget);
            query = query.gte('calories_per_100g', target * 0.8).lte('calories_per_100g', target * 1.2);
          }

          const { data, error } = await query;
          if (error) throw error;

          return new Response(JSON.stringify(data), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }
        break;

      case 'POST':
        const requestData = await req.json();

        if (resource === 'entries') {
          // Create or update nutrition entry
          const { data, error } = await supabaseClient
            .from('nutrition_entries')
            .upsert({
              ...requestData,
              user_id: user.user.id,
              updated_at: new Date().toISOString(),
            }, {
              onConflict: 'user_id,date'
            })
            .select()
            .single();

          if (error) throw error;

          return new Response(JSON.stringify(data), {
            status: 201,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });

        } else if (resource === 'meals') {
          // Create meal
          const { data, error } = await supabaseClient
            .from('meals')
            .insert(requestData)
            .select()
            .single();

          if (error) throw error;

          return new Response(JSON.stringify(data), {
            status: 201,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });

        } else if (resource === 'meal-foods') {
          // Add food to meal
          const { data, error } = await supabaseClient
            .from('meal_foods')
            .insert(requestData)
            .select(`
              *,
              foods (*)
            `)
            .single();

          if (error) throw error;

          return new Response(JSON.stringify(data), {
            status: 201,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });

        } else if (resource === 'foods') {
          // Add custom food
          const { data, error } = await supabaseClient
            .from('foods')
            .insert({
              ...requestData,
              created_by: user.user.id,
            })
            .select()
            .single();

          if (error) throw error;

          return new Response(JSON.stringify(data), {
            status: 201,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }
        break;

      case 'PUT':
        const updateData = await req.json();

        if (resource === 'entries' && resourceId) {
          // Update nutrition entry
          const { data, error } = await supabaseClient
            .from('nutrition_entries')
            .update({
              ...updateData,
              updated_at: new Date().toISOString(),
            })
            .eq('id', resourceId)
            .eq('user_id', user.user.id)
            .select()
            .single();

          if (error) throw error;

          return new Response(JSON.stringify(data), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });

        } else if (resource === 'meals' && resourceId) {
          // Update meal
          const { data, error } = await supabaseClient
            .from('meals')
            .update(updateData)
            .eq('id', resourceId)
            .select(`
              *,
              nutrition_entries!inner (
                user_id
              )
            `)
            .eq('nutrition_entries.user_id', user.user.id)
            .single();

          if (error) throw error;

          return new Response(JSON.stringify(data), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });

        } else if (resource === 'meal-foods' && resourceId) {
          // Update meal food
          const { data, error } = await supabaseClient
            .from('meal_foods')
            .update(updateData)
            .eq('id', resourceId)
            .select(`
              *,
              foods (*),
              meals!inner (
                nutrition_entries!inner (
                  user_id
                )
              )
            `)
            .eq('meals.nutrition_entries.user_id', user.user.id)
            .single();

          if (error) throw error;

          return new Response(JSON.stringify(data), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });

        } else if (resource === 'foods' && resourceId) {
          // Update food (only if created by user)
          const { data, error } = await supabaseClient
            .from('foods')
            .update(updateData)
            .eq('id', resourceId)
            .eq('created_by', user.user.id)
            .select()
            .single();

          if (error) throw error;

          return new Response(JSON.stringify(data), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }
        break;

      case 'DELETE':
        if (resource === 'entries' && resourceId) {
          // Delete nutrition entry
          const { error } = await supabaseClient
            .from('nutrition_entries')
            .delete()
            .eq('id', resourceId)
            .eq('user_id', user.user.id);

          if (error) throw error;

          return new Response(JSON.stringify({ success: true }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });

        } else if (resource === 'meals' && resourceId) {
          // Delete meal
          const { error } = await supabaseClient
            .from('meals')
            .delete()
            .eq('id', resourceId)
            .eq('nutrition_entries.user_id', user.user.id);

          if (error) throw error;

          return new Response(JSON.stringify({ success: true }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });

        } else if (resource === 'meal-foods' && resourceId) {
          // Remove food from meal
          const { error } = await supabaseClient
            .from('meal_foods')
            .delete()
            .eq('id', resourceId);

          if (error) throw error;

          return new Response(JSON.stringify({ success: true }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });

        } else if (resource === 'foods' && resourceId) {
          // Delete food (only if created by user)
          const { error } = await supabaseClient
            .from('foods')
            .delete()
            .eq('id', resourceId)
            .eq('created_by', user.user.id);

          if (error) throw error;

          return new Response(JSON.stringify({ success: true }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }
        break;

      default:
        return new Response(JSON.stringify({ error: 'Method not allowed' }), {
          status: 405,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
    }

    return new Response(JSON.stringify({ error: 'Invalid request' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});