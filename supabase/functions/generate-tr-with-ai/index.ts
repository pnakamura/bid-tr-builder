import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface GenerateTRRequest {
  template_id: string;
  context?: string;
  custom_prompts?: {
    title?: string;
    description?: string;
    objective?: string;
    scope?: string;
    requirements?: string;
    technical_criteria?: string;
    experience_criteria?: string;
  };
}

interface TRGenerationResponse {
  success: boolean;
  data?: {
    title: string;
    type: string;
    description: string;
    objective: string;
    scope: string;
    requirements: string;
    technical_criteria: string;
    experience_criteria: string;
    duration: string;
    budget: string;
  };
  error?: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const lovableApiKey = Deno.env.get('LOVABLE_API_KEY');

    if (!lovableApiKey) {
      throw new Error('LOVABLE_API_KEY não configurada');
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Autenticação do usuário
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('Autorização necessária');
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      throw new Error('Usuário não autenticado');
    }

    const requestBody: GenerateTRRequest = await req.json();
    const { template_id, context, custom_prompts } = requestBody;

    // Buscar informações do template
    const { data: template, error: templateError } = await supabase
      .from('templates')
      .select('*')
      .eq('id', template_id)
      .single();

    if (templateError || !template) {
      throw new Error('Template não encontrado');
    }

    console.log('Template encontrado:', template.title);

    // Construir prompt do sistema
    const systemPrompt = `Você é um especialista em elaboração de Termos de Referência (TR) para a administração pública brasileira.
Seu objetivo é gerar conteúdo detalhado, profissional e em conformidade com as normas brasileiras de licitação.

Contexto do Template:
- Título: ${template.title}
- Categoria: ${template.category}
- Tipo: ${template.type}
- Descrição: ${template.description || 'Não especificada'}

${context ? `Contexto Adicional do Usuário:\n${context}` : ''}

INSTRUÇÕES IMPORTANTES:
1. Gere conteúdo em português brasileiro formal
2. Use terminologia técnica apropriada para TRs
3. Seja específico e detalhado
4. Siga as melhores práticas de licitação pública
5. Retorne APENAS um objeto JSON válido sem markdown, comentários ou texto adicional
6. O JSON deve conter todos os campos solicitados`;

    // Prompt do usuário
    const userPrompt = `Com base no template "${template.title}" (categoria: ${template.category}, tipo: ${template.type}), gere um Termo de Referência completo.

${custom_prompts ? `Prompts Personalizados:
${custom_prompts.title ? `- Título: ${custom_prompts.title}` : ''}
${custom_prompts.description ? `- Descrição: ${custom_prompts.description}` : ''}
${custom_prompts.objective ? `- Objetivo: ${custom_prompts.objective}` : ''}
${custom_prompts.scope ? `- Escopo: ${custom_prompts.scope}` : ''}
${custom_prompts.requirements ? `- Requisitos: ${custom_prompts.requirements}` : ''}
${custom_prompts.technical_criteria ? `- Critérios Técnicos: ${custom_prompts.technical_criteria}` : ''}
${custom_prompts.experience_criteria ? `- Critérios de Experiência: ${custom_prompts.experience_criteria}` : ''}
` : ''}

Retorne um objeto JSON com a seguinte estrutura (sem markdown, sem comentários):
{
  "title": "Título do TR (máximo 200 caracteres)",
  "type": "${template.type}",
  "description": "Descrição detalhada (2-3 parágrafos)",
  "objective": "Objetivo específico e mensurável",
  "scope": "Escopo detalhado do projeto/serviço",
  "requirements": "Requisitos técnicos e funcionais detalhados",
  "technical_criteria": "Critérios técnicos para avaliação (pontuação, pesos)",
  "experience_criteria": "Critérios de experiência profissional necessária",
  "duration": "Prazo estimado (ex: '6 meses', '120 dias')",
  "budget": "Estimativa de orçamento ou valor de referência"
}`;

    console.log('Chamando Lovable AI...');

    // Chamar Lovable AI
    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${lovableApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error('Erro da IA:', aiResponse.status, errorText);
      
      if (aiResponse.status === 429) {
        throw new Error('Limite de requisições excedido. Tente novamente em alguns instantes.');
      }
      if (aiResponse.status === 402) {
        throw new Error('Créditos insuficientes. Adicione créditos ao workspace Lovable.');
      }
      throw new Error('Erro ao chamar IA: ' + errorText);
    }

    const aiData = await aiResponse.json();
    const generatedContent = aiData.choices[0].message.content;

    console.log('Resposta da IA recebida');

    // Extrair JSON da resposta (remover markdown se presente)
    let cleanedContent = generatedContent.trim();
    if (cleanedContent.startsWith('```json')) {
      cleanedContent = cleanedContent.replace(/```json\n?/, '').replace(/\n?```$/, '');
    } else if (cleanedContent.startsWith('```')) {
      cleanedContent = cleanedContent.replace(/```\n?/, '').replace(/\n?```$/, '');
    }

    const trData = JSON.parse(cleanedContent);

    console.log('TR gerado com sucesso');

    const response: TRGenerationResponse = {
      success: true,
      data: trData,
    };

    return new Response(JSON.stringify(response), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Erro em generate-tr-with-ai:', error);
    
    const response: TRGenerationResponse = {
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido',
    };

    return new Response(JSON.stringify(response), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
