import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  created_at: string;
  link?: string;
}

export const useNotifications = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // For now, we'll create mock notifications based on TR status changes
  // In a real implementation, you'd have a notifications table in Supabase
  const { data: notifications, isLoading } = useQuery({
    queryKey: ['notifications', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];

      // Fetch recent TRs to generate notifications
      const { data: trs } = await supabase
        .from('termos_referencia')
        .select('*')
        .eq('created_by', user.id)
        .order('created_at', { ascending: false })
        .limit(10);

      const mockNotifications: Notification[] = [];

      trs?.forEach(tr => {
        if (tr.status === 'concluido' && tr.google_docs_url) {
          mockNotifications.push({
            id: `tr-${tr.id}-concluido`,
            title: 'TR Processado com Sucesso',
            message: `O TR "${tr.title}" foi processado e o documento está disponível.`,
            type: 'success',
            read: false,
            created_at: tr.n8n_processed_at || tr.created_at,
            link: '/meus-trs',
          });
        } else if (tr.status === 'erro') {
          mockNotifications.push({
            id: `tr-${tr.id}-erro`,
            title: 'Erro no Processamento',
            message: `Houve um erro ao processar o TR "${tr.title}".`,
            type: 'error',
            read: false,
            created_at: tr.n8n_processed_at || tr.created_at,
            link: '/meus-trs',
          });
        }
      });

      return mockNotifications.sort((a, b) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    },
    enabled: !!user?.id,
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  const unreadCount = notifications?.filter(n => !n.read).length || 0;

  // Mark notification as read (mock implementation)
  const markAsRead = useMutation({
    mutationFn: async (notificationId: string) => {
      // In a real implementation, update the notifications table
      return notificationId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  // Mark all as read
  const markAllAsRead = useMutation({
    mutationFn: async () => {
      // In a real implementation, update all notifications
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  return {
    notifications: notifications || [],
    unreadCount,
    isLoading,
    markAsRead: markAsRead.mutate,
    markAllAsRead: markAllAsRead.mutate,
  };
};
