import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Message, MessageAttachment } from '../types';
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

  // Upload files helper
  const uploadFiles = async (files: File[]): Promise<MessageAttachment[]> => {
    const attachments: MessageAttachment[] = [];

    // Check if bucket exists
    const { data: buckets, error: bucketError } = await supabase.storage.listBuckets();
    if (bucketError) {
      console.error('Bucket list error:', bucketError);
      throw new Error('Impossibile accedere allo storage. Verifica la configurazione.');
    }

    const bucketExists = buckets?.some(b => b.id === 'message-attachments');
    if (!bucketExists) {
      throw new Error('Il bucket di storage non esiste. Esegui la migrazione del database.');
    }

    for (const file of files) {
      // Generate unique file path: request/{requestId}/{timestamp}-{filename}
      const timestamp = Date.now();
      const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
      const filePath = `request/${requestId}/${timestamp}-${sanitizedFileName}`;

      // Upload file to storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('message-attachments')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (uploadError) {
        console.error('Upload error:', uploadError);
        
        // Provide more specific error messages
        let errorMessage = `Impossibile caricare ${file.name}`;
        if (uploadError.message.includes('new row violates row-level security policy')) {
          errorMessage = 'Non hai i permessi per caricare file. Verifica di essere autenticato.';
        } else if (uploadError.message.includes('Bucket not found')) {
          errorMessage = 'Il bucket di storage non esiste. Contatta l\'amministratore.';
        } else if (uploadError.message.includes('The resource already exists')) {
          errorMessage = `Il file ${file.name} esiste già.`;
        } else {
          errorMessage = `${errorMessage}: ${uploadError.message}`;
        }
        
        throw new Error(errorMessage);
      }

      if (!uploadData) {
        throw new Error(`Upload fallito per ${file.name}: nessun dato restituito`);
      }

      // For private buckets, we need to generate a signed URL
      const { data: signedUrlData, error: urlError } = await supabase.storage
        .from('message-attachments')
        .createSignedUrl(filePath, 31536000); // 1 year expiry

      if (urlError) {
        console.error('Signed URL error:', urlError);
        // Fallback to public URL if signed URL fails
        const { data: urlData } = supabase.storage
          .from('message-attachments')
          .getPublicUrl(filePath);
        
        attachments.push({
          id: uploadData.path,
          name: file.name,
          url: urlData.publicUrl,
          type: file.type,
          size: file.size,
          uploaded_at: new Date().toISOString(),
        });
      } else {
        attachments.push({
          id: uploadData.path,
          name: file.name,
          url: signedUrlData?.signedUrl || '',
          type: file.type,
          size: file.size,
          uploaded_at: new Date().toISOString(),
        });
      }
    }

    return attachments;
  };

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async ({ body, files }: { body: string; files?: File[] }) => {
      let attachmentsJson: Json = null;

      // Upload files if provided
      if (files && files.length > 0) {
        try {
          const attachments = await uploadFiles(files);
          attachmentsJson = attachments as unknown as Json;
        } catch (error) {
          toast({
            title: 'Errore upload',
            description: error instanceof Error ? error.message : 'Impossibile caricare i file.',
            variant: 'destructive',
          });
          throw error;
        }
      }

      // Allow empty body if attachments are present
      const messageBody = body.trim() || (attachmentsJson ? '📎 Allegato' : ' ');
      
      const { data, error } = await supabase.rpc('send_valuation_message', {
        p_request_id: requestId,
        p_body: messageBody,
        p_attachments: attachmentsJson,
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
      } else if (error.message.includes('bucket')) {
        toast({
          title: 'Errore Storage',
          description: error.message,
          variant: 'destructive',
        });
      } else if (error.message.includes('permessi') || error.message.includes('permessi')) {
        toast({
          title: 'Errore Permessi',
          description: error.message,
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Errore',
          description: error.message || 'Impossibile inviare il messaggio.',
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
    sendMessage: (params: { body: string; files?: File[] }) => sendMessageMutation.mutate(params),
    isSending: sendMessageMutation.isPending,
    markAsRead: markReadMutation.mutate,
    isMarkingRead: markReadMutation.isPending,
  };
}
