-- Create templates table
CREATE TABLE public.templates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  type TEXT NOT NULL,
  file_path TEXT, -- Path in Supabase Storage
  file_size BIGINT,
  file_type TEXT,
  created_by UUID NOT NULL REFERENCES profiles(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  is_public BOOLEAN DEFAULT false,
  downloads INTEGER DEFAULT 0,
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Enable Row Level Security
ALTER TABLE public.templates ENABLE ROW LEVEL SECURITY;

-- Create policies for templates
CREATE POLICY "Users can view public templates or their own" 
ON public.templates 
FOR SELECT 
USING (is_public = true OR created_by = auth.uid() OR is_admin_or_gestor(auth.uid()));

CREATE POLICY "Authenticated users can create templates" 
ON public.templates 
FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL AND created_by = auth.uid());

CREATE POLICY "Users can update their own templates" 
ON public.templates 
FOR UPDATE 
USING (created_by = auth.uid() OR is_admin_or_gestor(auth.uid()));

CREATE POLICY "Users can delete their own templates" 
ON public.templates 
FOR DELETE 
USING (created_by = auth.uid() OR has_role(auth.uid(), 'admin'));

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_templates_updated_at
BEFORE UPDATE ON public.templates
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create storage bucket for templates
INSERT INTO storage.buckets (id, name, public, allowed_mime_types) 
VALUES (
  'templates', 
  'templates', 
  false,
  ARRAY['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain', 'application/vnd.oasis.opendocument.text']
);

-- Create storage policies for templates bucket
CREATE POLICY "Users can view templates they have access to" 
ON storage.objects 
FOR SELECT 
USING (
  bucket_id = 'templates' AND 
  (
    auth.uid()::text = (storage.foldername(name))[1] OR
    EXISTS (
      SELECT 1 FROM public.templates 
      WHERE file_path = name AND (is_public = true OR created_by = auth.uid() OR is_admin_or_gestor(auth.uid()))
    )
  )
);

CREATE POLICY "Users can upload templates to their folder" 
ON storage.objects 
FOR INSERT 
WITH CHECK (
  bucket_id = 'templates' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can update their own template files" 
ON storage.objects 
FOR UPDATE 
USING (
  bucket_id = 'templates' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own template files" 
ON storage.objects 
FOR DELETE 
USING (
  bucket_id = 'templates' AND 
  (
    auth.uid()::text = (storage.foldername(name))[1] OR
    has_role(auth.uid(), 'admin')
  )
);

-- Create function to update download count
CREATE OR REPLACE FUNCTION public.increment_template_downloads(template_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.templates 
  SET downloads = downloads + 1, updated_at = now()
  WHERE id = template_id;
END;
$$;