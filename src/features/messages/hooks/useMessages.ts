import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Message } from '../types';
import { useEffect } from 'react';
import { toast } from '@/hooks/use-toast';
import { Json } from '@/integrations/supabase/types';

export function useMessages(requestId: string) {
  const queryClient = useQueryClient();

  // Fetch messages
  const messagesQuery = useQuery({
    queryKey: ['messages', requestId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('valuation_messages')
        .select('*')
        .eq('request_id', requestId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      return (data || []) as Message[];
    },
    enabled: !!requestId,
  });

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async ({ body, attachments }: { body: string; attachments?: Json }) => {
      const { data, error } = await supabase.rpc('send_valuation_message', {
        p_request_id: requestId,
        p_body: body,
        p_attachments: attachments ?? null,
      });

      if (error) {
        // Handle specific error codes
        if (error.message.includes('MESSAGING_LOCKED')) {
          throw new Error('MESSAGING_LOCKED');
        }
        if (error.message.includes('ACCESS_DENIED')) {
          throw new Error('ACCESS_DENIED');
        }
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages', requestId] });
      queryClient.invalidateQueries({ queryKey: ['request', requestId] });
      queryClient.invalidateQueries({ queryKey: ['valuation-requests'] });
    },
    onError: (error: Error) => {
      if (error.message === 'MESSAGING_LOCKED') {
        toast({
          title: 'Messaggi disabilitati',
          description: 'Non puoi inviare messaggi in questo stato.',
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Errore',
          description: 'Impossibile inviare il messaggio.',
          variant: 'destructive',
        });
      }
    },
  });

  // Mark thread as read mutation
  const markReadMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.rpc('mark_thread_read', {
        p_request_id: requestId,
      });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['request', requestId] });
      queryClient.invalidateQueries({ queryKey: ['valuation-requests'] });
    },
  });

  // Real-time subscription
  useEffect(() => {
    if (!requestId) return;

    const channel = supabase
      .channel(`messages-${requestId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'valuation_messages',
          filter: `request_id=eq.${requestId}`,
        },
        (payload) => {
          const newMessage = payload.new as Message;
          queryClient.setQueryData<Message[]>(['messages', requestId], (old) => {
            if (!old) return [newMessage];
            if (old.some((m) => m.id === newMessage.id)) return old;
            return [...old, newMessage];
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [requestId, queryClient]);

  return {
    messages: messagesQuery.data || [],
    isLoading: messagesQuery.isLoading,
    error: messagesQuery.error,
    sendMessage: sendMessageMutation.mutate,
    isSending: sendMessageMutation.isPending,
    markAsRead: markReadMutation.mutate,
    isMarkingRead: markReadMutation.isPending,
  };
}
