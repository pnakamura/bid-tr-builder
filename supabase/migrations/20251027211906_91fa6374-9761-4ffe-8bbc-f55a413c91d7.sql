-- Create termos_referencia table for storing TR documents
CREATE TABLE public.termos_referencia (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Relationships
  created_by uuid NOT NULL,
  template_id uuid REFERENCES public.templates(id) ON DELETE SET NULL,
  
  -- TR Data
  title text NOT NULL,
  type text NOT NULL,
  description text NOT NULL,
  objective text NOT NULL,
  scope text NOT NULL,
  requirements text,
  technical_criteria text NOT NULL,
  experience_criteria text NOT NULL,
  technical_weight integer NOT NULL DEFAULT 70,
  experience_weight integer NOT NULL DEFAULT 30,
  duration text NOT NULL,
  budget text NOT NULL,
  
  -- Status and tracking
  status text NOT NULL DEFAULT 'processando',
  -- values: 'processando', 'concluido', 'erro'
  
  -- N8N Response
  n8n_request_id text NOT NULL,
  google_docs_url text,
  n8n_response jsonb,
  n8n_processed_at timestamp with time zone,
  error_message text,
  
  -- Metadata
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  
  -- Constraints
  CONSTRAINT valid_status CHECK (status IN ('processando', 'concluido', 'erro')),
  CONSTRAINT valid_weights CHECK (technical_weight + experience_weight = 100)
);

-- Indexes for performance
CREATE INDEX idx_termos_referencia_created_by ON public.termos_referencia(created_by);
CREATE INDEX idx_termos_referencia_status ON public.termos_referencia(status);
CREATE INDEX idx_termos_referencia_created_at ON public.termos_referencia(created_at DESC);
CREATE INDEX idx_termos_referencia_n8n_request_id ON public.termos_referencia(n8n_request_id);

-- Trigger for updated_at
CREATE TRIGGER update_termos_referencia_updated_at
  BEFORE UPDATE ON public.termos_referencia
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- RLS Policies
ALTER TABLE public.termos_referencia ENABLE ROW LEVEL SECURITY;

-- Users can view their own TRs
CREATE POLICY "Usuários podem ver seus próprios TRs"
  ON public.termos_referencia
  FOR SELECT
  USING (auth.uid() = created_by OR is_admin_or_gestor(auth.uid()));

-- Users can create their own TRs
CREATE POLICY "Usuários podem criar TRs"
  ON public.termos_referencia
  FOR INSERT
  WITH CHECK (auth.uid() = created_by);

-- Users can update their own TRs
CREATE POLICY "Usuários podem atualizar seus TRs"
  ON public.termos_referencia
  FOR UPDATE
  USING (auth.uid() = created_by OR is_admin_or_gestor(auth.uid()));

-- Only admins can delete
CREATE POLICY "Admins podem deletar TRs"
  ON public.termos_referencia
  FOR DELETE
  USING (has_role(auth.uid(), 'admin'::user_role));