import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

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
  template: {
    id: string;
    title: string;
    category: string;
    type: string;
    file_download_url: string;
    metadata: Record<string, any>;
  };
  user: {
    id: string;
    name: string;
    email: string;
  };
  timestamp: string;
  request_id: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { tr_data, template_id } = await req.json();
    
    // Get user info from auth header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (authError || !user) {
      throw new Error('Invalid user token');
    }

    // Get user profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('nome, email')
      .eq('id', user.id)
      .single();

    // Get template info
    const { data: template, error: templateError } = await supabase
      .from('templates')
      .select('*')
      .eq('id', template_id)
      .single();

    if (templateError || !template) {
      throw new Error('Template not found or access denied');
    }

    // Generate signed URL for template file
    let fileDownloadUrl = '';
    if (template.file_path) {
      const { data: signedUrl } = await supabase.storage
        .from('templates')
        .createSignedUrl(template.file_path, 3600); // 1 hour expiry

      if (signedUrl) {
        fileDownloadUrl = signedUrl.signedUrl;
      }
    }

    // Prepare N8N payload
    const requestId = crypto.randomUUID();
    const payload: N8NPayload = {
      tr_data,
      template: {
        id: template.id,
        title: template.title,
        category: template.category,
        type: template.type,
        file_download_url: fileDownloadUrl,
        metadata: template.metadata || {}
      },
      user: {
        id: user.id,
        name: profile?.nome || user.email || 'Unknown',
        email: profile?.email || user.email || ''
      },
      timestamp: new Date().toISOString(),
      request_id: requestId
    };

    console.log('Sending payload to N8N:', JSON.stringify(payload, null, 2));

    // Send to N8N webhook
    const n8nResponse = await fetch(
      'https://postgres-n8n.wuzmwk.easypanel.host/webhook/00c47da5-c066-48c5-8002-0719d0a0a6da',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      }
    );

    if (!n8nResponse.ok) {
      throw new Error(`N8N webhook failed: ${n8nResponse.status} ${n8nResponse.statusText}`);
    }

    const n8nResult = await n8nResponse.json().catch(() => ({}));
    
    console.log('N8N response:', n8nResult);

    return new Response(JSON.stringify({
      success: true,
      request_id: requestId,
      message: 'TR enviado com sucesso para processamento',
      n8n_response: n8nResult
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in send-to-n8n function:', error);
    
    return new Response(JSON.stringify({
      success: false,
      error: error.message || 'Erro interno do servidor'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});