import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface N8NCallbackPayload {
  request_id: string;
  status: string;
  localizacao?: string;
  error?: string;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('N8N Callback received');

    // Parse request body
    const payload: N8NCallbackPayload = await req.json();
    console.log('Payload:', JSON.stringify(payload, null, 2));

    // Validate required fields
    if (!payload.request_id) {
      console.error('Missing request_id in payload');
      return new Response(
        JSON.stringify({ error: 'Missing request_id' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400 
        }
      );
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Find TR by request_id
    const { data: trRecord, error: findError } = await supabase
      .from('termos_referencia')
      .select('*')
      .eq('n8n_request_id', payload.request_id)
      .single();

    if (findError || !trRecord) {
      console.error('TR not found for request_id:', payload.request_id, findError);
      return new Response(
        JSON.stringify({ error: 'TR not found', request_id: payload.request_id }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 404 
        }
      );
    }

    console.log('Found TR:', trRecord.id);

    // Determine final status and prepare update data
    const isSuccess = payload.status === 'TR criado com sucesso' && payload.localizacao;
    const updateData: any = {
      status: isSuccess ? 'concluido' : 'erro',
      n8n_response: payload,
      n8n_processed_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    if (isSuccess && payload.localizacao) {
      updateData.google_docs_url = payload.localizacao;
      console.log('Success! Google Docs URL:', payload.localizacao);
    } else {
      updateData.error_message = payload.error || 'Erro desconhecido no processamento';
      console.log('Error processing TR:', updateData.error_message);
    }

    // Update TR in database
    const { error: updateError } = await supabase
      .from('termos_referencia')
      .update(updateData)
      .eq('id', trRecord.id);

    if (updateError) {
      console.error('Error updating TR:', updateError);
      return new Response(
        JSON.stringify({ error: 'Failed to update TR', details: updateError }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500 
        }
      );
    }

    console.log('TR updated successfully:', trRecord.id);

    // Return success response
    return new Response(
      JSON.stringify({ 
        success: true, 
        tr_id: trRecord.id,
        status: updateData.status,
        message: 'TR atualizado com sucesso'
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error('Error in n8n-callback function:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error', 
        details: error.message 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});
