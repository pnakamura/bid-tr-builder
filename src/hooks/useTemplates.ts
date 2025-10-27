import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

// Helper function to format file size
export function formatFileSize(bytes?: number): string {
  if (!bytes) return 'N/A';
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

export interface Template {
  id: string;
  title: string;
  description?: string;
  category: string;
  type: string;
  file_path?: string;
  file_size?: number;
  file_type?: string;
  created_by: string;
  created_at: string;
  updated_at: string;
  is_public: boolean;
  downloads: number;
  metadata: Record<string, any>;
  creator_name?: string;
}

export interface TemplateFilters {
  search?: string;
  category?: string;
  type?: string;
}

export function useTemplates(filters: TemplateFilters = {}) {
  const { toast } = useToast();

  const { data: templates = [], isLoading, error } = useQuery({
    queryKey: ['templates', filters],
    queryFn: async () => {
      let query = supabase
        .from('templates')
        .select(`
          *,
          profiles!created_by (
            nome
          )
        `)
        .order('created_at', { ascending: false });

      // Apply filters
      if (filters.search) {
        query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
      }
      
      if (filters.category && filters.category !== 'all') {
        query = query.eq('category', filters.category);
      }
      
      if (filters.type && filters.type !== 'all') {
        query = query.eq('type', filters.type);
      }

      const { data, error } = await query;
      
      if (error) throw error;

      return data.map(template => ({
        ...template,
        creator_name: template.profiles?.nome || 'Usuário'
      })) as Template[];
    },
    meta: {
      onError: () => {
        toast({
          title: "Erro ao carregar templates",
          description: "Não foi possível carregar os templates. Tente novamente.",
          variant: "destructive"
        });
      }
    }
  });

  return { templates, isLoading, error };
}

export function useCreateTemplate() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (templateData: Omit<Template, 'id' | 'created_at' | 'updated_at' | 'created_by' | 'downloads'>) => {
      if (!user?.id) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('templates')
        .insert({
          ...templateData,
          created_by: user.id
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['templates'] });
      toast({
        title: "Template criado",
        description: "Template criado com sucesso!"
      });
    },
    onError: (error) => {
      toast({
        title: "Erro ao criar template",
        description: error.message || "Não foi possível criar o template.",
        variant: "destructive"
      });
    }
  });
}

export function useUploadTemplate() {
  const { toast } = useToast();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({ file, templateId }: { file: File; templateId: string }) => {
      if (!user?.id) throw new Error('User not authenticated');

      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${templateId}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('templates')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (uploadError) throw uploadError;

      // Update template with file info
      const { error: updateError } = await supabase
        .from('templates')
        .update({
          file_path: fileName,
          file_size: file.size,
          file_type: file.type
        })
        .eq('id', templateId);

      if (updateError) throw updateError;

      return fileName;
    },
    onError: (error) => {
      toast({
        title: "Erro no upload",
        description: error.message || "Não foi possível fazer upload do arquivo.",
        variant: "destructive"
      });
    }
  });
}

export function useDownloadTemplate() {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (template: Template) => {
      if (!template.file_path) throw new Error('Template não possui arquivo');

      // Increment download count
      await supabase.rpc('increment_template_downloads', { 
        template_id: template.id 
      });

      // Get signed URL for download
      const { data, error } = await supabase.storage
        .from('templates')
        .createSignedUrl(template.file_path, 60); // 1 minute expiry

      if (error) throw error;

      // Use the signed URL directly (it's already absolute)
      const downloadUrl = data.signedUrl;
      console.log('🔗 Download URL:', downloadUrl);

      // Trigger download using fetch to avoid Chrome blocking
      const response = await fetch(downloadUrl);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = template.title;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up blob URL
      window.URL.revokeObjectURL(blobUrl);

      return downloadUrl;
    },
    onSuccess: (_, template) => {
      toast({
        title: "Download iniciado",
        description: `O template "${template.title}" está sendo baixado.`
      });
    },
    onError: (error) => {
      toast({
        title: "Erro no download",
        description: error.message || "Não foi possível baixar o template.",
        variant: "destructive"
      });
    }
  });
}

export function useDeleteTemplate() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (templateId: string) => {
      // First get the template to get file path
      const { data: template, error: getError } = await supabase
        .from('templates')
        .select('file_path')
        .eq('id', templateId)
        .single();

      if (getError) throw getError;

      // Delete file from storage if exists
      if (template.file_path) {
        const { error: storageError } = await supabase.storage
          .from('templates')
          .remove([template.file_path]);
        
        if (storageError) console.warn('Error deleting file:', storageError);
      }

      // Delete template record
      const { error: deleteError } = await supabase
        .from('templates')
        .delete()
        .eq('id', templateId);

      if (deleteError) throw deleteError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['templates'] });
      toast({
        title: "Template excluído",
        description: "Template excluído com sucesso!"
      });
    },
    onError: (error) => {
      toast({
        title: "Erro ao excluir template",
        description: error.message || "Não foi possível excluir o template.",
        variant: "destructive"
      });
    }
  });
}