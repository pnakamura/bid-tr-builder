import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.4';

interface N8NPayload {
  tr_data: {
    title: string;
    type: string;
    description: string;
    objective: string;
    scope: string;
    requirements: string;
    technical_criteria: string;
    experience_criteria: string;
    technical_weight: number;
    experience_weight: number;
    duration: string;
    budget: string;
  };
  template_data: {
    id: string;
    title: string;
    category: string;
    file_url?: string;
  };
  user_data: {
    id: string;
    email: string;
    nome: string;
  };
  request_id: string;
  timestamp: string;
}

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
    // Get Supabase credentials
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

    // Create Supabase client
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get user from auth header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (authError || !user) {
      throw new Error('Unauthorized');
    }

    // Parse request body
    const { tr_data, template_id } = await req.json();

    // Fetch template information
    const { data: template, error: templateError } = await supabase
      .from('templates')
      .select('*')
      .eq('id', template_id)
      .single();

    if (templateError || !template) {
      throw new Error('Template not found');
    }

    // Get user profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('nome, email')
      .eq('id', user.id)
      .single();

    // Generate signed URL if template has a file
    let fileUrl = null;
    if (template.file_path) {
      const { data: signedUrlData } = await supabase.storage
        .from('templates')
        .createSignedUrl(template.file_path, 3600);
      
      fileUrl = signedUrlData?.signedUrl || null;
    }

    // Generate unique request ID
    const requestId = crypto.randomUUID();

    // 1. INSERT TR into database with 'processando' status BEFORE sending to N8N
    const { data: trRecord, error: insertError } = await supabase
      .from('termos_referencia')
      .insert({
        created_by: user.id,
        template_id: template_id,
        n8n_request_id: requestId,
        status: 'processando',
        title: tr_data.title,
        type: tr_data.type,
        description: tr_data.description,
        objective: tr_data.objective,
        scope: tr_data.scope,
        requirements: tr_data.requirements,
        technical_criteria: tr_data.technical_criteria,
        experience_criteria: tr_data.experience_criteria,
        technical_weight: tr_data.technical_weight,
        experience_weight: tr_data.experience_weight,
        duration: tr_data.duration,
        budget: tr_data.budget,
      })
      .select()
      .single();

    if (insertError) {
      console.error('Error inserting TR:', insertError);
      throw new Error(`Failed to create TR record: ${insertError.message}`);
    }

    console.log('TR record created with ID:', trRecord.id);

    // 2. Prepare N8N payload
    const n8nPayload: N8NPayload = {
      tr_data,
      template_data: {
        id: template.id,
        title: template.title,
        category: template.category,
        file_url: fileUrl || undefined,
      },
      user_data: {
        id: user.id,
        email: profile?.email || user.email || '',
        nome: profile?.nome || user.user_metadata?.nome || user.email || '',
      },
      request_id: requestId,
      timestamp: new Date().toISOString(),
    };

    // 3. Start background processing with N8N
    const backgroundProcessing = async () => {
      console.log('Background task started - Sending payload to N8N:', JSON.stringify(n8nPayload, null, 2));
      
      const n8nWebhookUrl = 'https://postgres-n8n.wuzmwk.easypanel.host/webhook/00c47da5-c066-48c5-8002-0719d0a0a6da';
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 180000); // 3 minutes timeout

      let n8nResponse;
      let n8nResult;
      
      try {
        console.log('[Background] Sending request to N8N webhook...');
        
        n8nResponse = await fetch(n8nWebhookUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(n8nPayload),
          signal: controller.signal,
        });

        clearTimeout(timeoutId);
        
        console.log('[Background] N8N webhook response status:', n8nResponse.status);
        console.log('[Background] N8N webhook response headers:', Object.fromEntries(n8nResponse.headers.entries()));
        
        n8nResult = await n8nResponse.json();
        
        console.log('[Background] N8N response received:', JSON.stringify(n8nResult, null, 2));
        console.log('[Background] N8N response ok:', n8nResponse.ok);
        console.log('[Background] N8N result is array:', Array.isArray(n8nResult));
        console.log('[Background] N8N result length:', Array.isArray(n8nResult) ? n8nResult.length : 'N/A');
        
      } catch (fetchError) {
        clearTimeout(timeoutId);
        
        console.error('[Background] N8N request failed:', fetchError);
        
        // Update TR with error status
        await supabase
          .from('termos_referencia')
          .update({
            status: 'erro',
            error_message: `Erro ao processar documento: ${fetchError.message || 'Timeout - processamento excedeu 3 minutos'}`,
            n8n_processed_at: new Date().toISOString(),
          })
          .eq('id', trRecord.id);

        console.log('[Background] TR updated with error status due to N8N failure');
        return;
      }

      // Update TR record with N8N response
      const isSuccess = n8nResponse.ok && Array.isArray(n8nResult) && n8nResult.length > 0;
      const googleDocsUrl = isSuccess ? n8nResult[0]?.localizacao : null;
      
      console.log('[Background] Processing N8N response:');
      console.log('[Background]   - isSuccess:', isSuccess);
      console.log('[Background]   - googleDocsUrl:', googleDocsUrl);
      console.log('[Background]   - Status to set:', isSuccess ? 'concluido' : 'erro');
      
      const { error: updateError } = await supabase
        .from('termos_referencia')
        .update({
          status: isSuccess ? 'concluido' : 'erro',
          google_docs_url: googleDocsUrl,
          n8n_response: n8nResult,
          n8n_processed_at: new Date().toISOString(),
          error_message: !isSuccess ? JSON.stringify(n8nResult) : null,
        })
        .eq('id', trRecord.id);

      if (updateError) {
        console.error('[Background] Error updating TR:', updateError);
      } else {
        console.log('[Background] TR successfully updated with status:', isSuccess ? 'concluido' : 'erro');
      }
    };

    // Register background task (will continue after response is sent)
    EdgeRuntime.waitUntil(backgroundProcessing());

    // 4. Return IMMEDIATE response to frontend
    console.log('Returning immediate response to frontend - TR is processing in background');
    
    return new Response(
      JSON.stringify({
        success: true,
        request_id: requestId,
        tr_id: trRecord.id,
        status: 'processando',
        message: 'TR criado com sucesso! O documento está sendo processado e estará disponível em breve.',
        processing: true,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    console.error('Error in send-to-n8n function:', error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || 'Unknown error occurred',
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
