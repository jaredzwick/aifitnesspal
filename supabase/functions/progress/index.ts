import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
};

Deno.serve(async (req) => {
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

    switch (req.method) {
      case 'GET':
        if (resource === 'photos') {
          // Get progress photos
          const { data, error } = await supabaseClient
            .from('progress_photos')
            .select('*')
            .eq('user_id', user.user.id)
            .order('taken_at', { ascending: false });

          if (error) throw error;

          return new Response(JSON.stringify(data), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        } else if (resource === 'measurements') {
          // Get body measurements
          const { data, error } = await supabaseClient
            .from('body_measurements')
            .select('*')
            .eq('user_id', user.user.id)
            .order('measured_at', { ascending: false });

          if (error) throw error;

          return new Response(JSON.stringify(data), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        } else if (resource === 'goals') {
          // Get user goals
          const status = url.searchParams.get('status');
          
          let query = supabaseClient
            .from('user_goals')
            .select('*')
            .eq('user_id', user.user.id)
            .order('created_at', { ascending: false });

          if (status) {
            query = query.eq('status', status);
          }

          const { data, error } = await query;
          if (error) throw error;

          return new Response(JSON.stringify(data), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        } else if (resource === 'achievements') {
          // Get achievements
          const { data, error } = await supabaseClient
            .from('achievements')
            .select('*')
            .eq('user_id', user.user.id)
            .order('earned_at', { ascending: false });

          if (error) throw error;

          return new Response(JSON.stringify(data), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }
        break;

      case 'POST':
        const requestData = await req.json();

        if (resource === 'photos') {
          // Add progress photo metadata (file should be uploaded to storage separately)
          const { data, error } = await supabaseClient
            .from('progress_photos')
            .insert({
              ...requestData,
              user_id: user.user.id,
            })
            .select()
            .single();

          if (error) throw error;

          return new Response(JSON.stringify(data), {
            status: 201,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        } else if (resource === 'measurements') {
          // Add body measurements
          const { data, error } = await supabaseClient
            .from('body_measurements')
            .insert({
              ...requestData,
              user_id: user.user.id,
            })
            .select()
            .single();

          if (error) throw error;

          return new Response(JSON.stringify(data), {
            status: 201,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        } else if (resource === 'goals') {
          // Create new goal
          const { data, error } = await supabaseClient
            .from('user_goals')
            .insert({
              ...requestData,
              user_id: user.user.id,
            })
            .select()
            .single();

          if (error) throw error;

          return new Response(JSON.stringify(data), {
            status: 201,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        } else if (resource === 'achievements') {
          // Award achievement
          const { data, error } = await supabaseClient
            .from('achievements')
            .insert({
              ...requestData,
              user_id: user.user.id,
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
        const id = url.searchParams.get('id');

        if (resource === 'goals') {
          const { data, error } = await supabaseClient
            .from('user_goals')
            .update(updateData)
            .eq('id', id)
            .eq('user_id', user.user.id)
            .select()
            .single();

          if (error) throw error;

          return new Response(JSON.stringify(data), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }
        break;

      case 'DELETE':
        const deleteId = url.searchParams.get('id');

        if (resource === 'photos') {
          const { error } = await supabaseClient
            .from('progress_photos')
            .delete()
            .eq('id', deleteId)
            .eq('user_id', user.user.id);

          if (error) throw error;

          return new Response(JSON.stringify({ success: true }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        } else if (resource === 'goals') {
          const { error } = await supabaseClient
            .from('user_goals')
            .delete()
            .eq('id', deleteId)
            .eq('user_id', user.user.id);

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