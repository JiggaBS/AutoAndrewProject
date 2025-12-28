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
      
      // Transform database format to Message type
      // Handle both old format (message, sender_id) and new format (body, sender_user_id)
      return (data || []).map((raw: any): Message => ({
        id: raw.id,
        request_id: raw.request_id || requestId,
        sender_user_id: raw.sender_user_id || raw.sender_id || null,
        sender_type: raw.sender_type === 'client' ? 'user' : (raw.sender_type || 'user'),
        body: raw.body || raw.message || '',
        attachments: raw.attachments || null,
        created_at: raw.created_at || new Date().toISOString(),
        read_at: raw.read_at || null,
      }));
    },
    enabled: !!requestId,
  });

  // Upload files helper
  const uploadFiles = async (files: File[]): Promise<MessageAttachment[]> => {
    const attachments: MessageAttachment[] = [];

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
        const errorMsg = uploadError.message.toLowerCase();
        
        if (errorMsg.includes('bucket not found') || errorMsg.includes('does not exist')) {
          errorMessage = 'Il bucket di storage non esiste. Esegui la migrazione del database.';
        } else if (errorMsg.includes('row-level security') || errorMsg.includes('policy')) {
          errorMessage = 'Non hai i permessi per caricare file. Verifica di essere autenticato e di avere accesso a questa richiesta.';
        } else if (errorMsg.includes('already exists') || errorMsg.includes('duplicate')) {
          errorMessage = `Il file ${file.name} esiste già. Prova con un nome diverso.`;
        } else if (errorMsg.includes('file size') || errorMsg.includes('too large')) {
          errorMessage = `Il file ${file.name} è troppo grande. Dimensione massima: 10MB.`;
        } else if (errorMsg.includes('mime type') || errorMsg.includes('content type')) {
          errorMessage = `Tipo di file non supportato per ${file.name}.`;
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
        // For private buckets, we still need a URL - try to get public URL as fallback
        // but it won't work for private buckets, so we'll use the path and generate URL later
        const { data: urlData } = supabase.storage
          .from('message-attachments')
          .getPublicUrl(filePath);
        
        // Store the path - we can generate signed URL when displaying
        attachments.push({
          id: uploadData.path,
          name: file.name,
          url: urlData.publicUrl, // May not work for private bucket, but better than nothing
          type: file.type,
          size: file.size,
          uploaded_at: new Date().toISOString(),
        });
      } else if (signedUrlData?.signedUrl) {
        attachments.push({
          id: uploadData.path,
          name: file.name,
          url: signedUrlData.signedUrl,
          type: file.type,
          size: file.size,
          uploaded_at: new Date().toISOString(),
        });
      } else {
        // Fallback if signed URL generation returns no URL
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
          // Log full error for debugging
          console.error('File upload error:', error);
          const errorMessage = error instanceof Error ? error.message : 'Impossibile caricare i file.';
          
          // Show toast with specific error
          toast({
            title: 'Errore upload',
            description: errorMessage,
            variant: 'destructive',
          });
          
          // Re-throw to prevent message from being sent
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
          // Validate payload
          if (!payload.new) {
            console.error('Received null payload.new in realtime subscription');
            return;
          }

          const rawMessage = payload.new as any;
          
          // Validate required fields
          if (!rawMessage.id) {
            console.error('Received message without id:', rawMessage);
            return;
          }

          // Transform database format to Message type
          // Handle both old format (message, sender_id) and new format (body, sender_user_id)
          const newMessage: Message = {
            id: rawMessage.id,
            request_id: rawMessage.request_id || requestId,
            sender_user_id: rawMessage.sender_user_id || rawMessage.sender_id || null,
            sender_type: rawMessage.sender_type === 'client' ? 'user' : (rawMessage.sender_type || 'user'),
            body: rawMessage.body || rawMessage.message || '',
            attachments: rawMessage.attachments || null,
            created_at: rawMessage.created_at || new Date().toISOString(),
            read_at: rawMessage.read_at || null,
          };

          queryClient.setQueryData<Message[]>(['messages', requestId], (old) => {
            if (!old) return [newMessage];
            // Check if message already exists to avoid duplicates
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
