-- Tornar todos os templates existentes públicos para que apareçam no formulário
UPDATE public.templates 
SET is_public = true, updated_at = now()
WHERE is_public = false;