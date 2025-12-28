import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";

interface NotificationOptions {
  isAdmin: boolean;
  userId?: string;
  userEmail?: string;
  onNewMessage?: (message: Record<string, unknown>) => void;
  onRequestUpdate?: (request: Record<string, unknown>) => void;
}

export function useRealtimeNotifications({
  isAdmin,
  userId,
  userEmail,
  onNewMessage,
  onRequestUpdate,
}: NotificationOptions) {
  const { language } = useLanguage();
  const [unreadCount, setUnreadCount] = useState(0);

  const showNotification = useCallback((title: string, description: string) => {
    toast({
      title,
      description,
    });

    // Play notification sound
    const audio = new Audio("data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1pbWRzfIF9eoF4bnFweXZ1d3Z4fYKGiYyOjY2Ni4qKiYiFgn57d3RxbmpnZGFfXV1dXl9hY2ZpbG9ydXh7foCChIaHiImKioqKioqJiYiHhoSDgYB+fXt5eHZ1dHNycnFxcXFycnN0dXZ3eHp7fH1+f4CBgoOEhYaGh4iIiImJiYmJiYmIiIeHhoWEg4KBgH9+fXx7enl4d3Z2dXV0dHR0dHR1dXZ2d3h5ent8fX5/gIGCg4SFhoeIiImJiYqKioqKiomJiIiHhoWEg4KBgH9+fXx7enl4d3Z2dXV0dHR0dHR1dXZ2d3h5enp7fH1+f4CBgoOEhYaHiIiJiYqKioqKiomJiIiHhoaFhIOCgYB/fn18e3p5eHd2dnV1dHR0dHR0dXV2dnd4eXp7fH1+f4CBgoOEhYaHiIiJiYqKioqKiomJiIiHhoaFhIOCgYB/fn18e3p5");
    audio.volume = 0.3;
    audio.play().catch(() => {}); // Ignore errors if audio can't play
  }, []);

  useEffect(() => {
    if (!userId && !userEmail) return;

    // Subscribe to new messages
    const messagesChannel = supabase
      .channel('messages-notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'valuation_messages',
        },
        async (payload) => {
          // Validate payload
          if (!payload.new) {
            console.error('Received null payload.new in notification subscription');
            return;
          }

          const newMessage = payload.new as Record<string, unknown>;
          
          // Validate required fields
          if (!newMessage.id || !newMessage.request_id) {
            console.error('Received message with missing required fields:', newMessage);
            return;
          }

          // Normalize sender_type (handle both 'client' and 'user')
          const senderType = newMessage.sender_type === 'client' ? 'user' : (newMessage.sender_type || 'user');
          
          // For admin: notify on user messages
          if (isAdmin && senderType === 'user') {
            showNotification(
              language === "it" ? "Nuovo messaggio" : "New message",
              language === "it" ? "Hai ricevuto un nuovo messaggio da un cliente" : "You received a new message from a client"
            );
            setUnreadCount(prev => prev + 1);
            onNewMessage?.(newMessage);
          }
          
          // For client: notify on admin messages
          if (!isAdmin && senderType === 'admin') {
            // Check if this message is for the current user's request
            const { data: request, error } = await supabase
              .from('valuation_requests')
              .select('email, user_id')
              .eq('id', newMessage.request_id)
              .single();
            
            if (error) {
              console.error('Error fetching request for notification:', error);
              return;
            }
            
            if (request && (request.email === userEmail || request.user_id === userId)) {
              showNotification(
                language === "it" ? "Nuovo messaggio" : "New message",
                language === "it" ? "Hai ricevuto una risposta alla tua richiesta" : "You received a reply to your request"
              );
              setUnreadCount(prev => prev + 1);
              onNewMessage?.(newMessage);
            }
          }
        }
      )
      .subscribe();

    // Subscribe to request updates (status changes, offers)
    const requestsChannel = supabase
      .channel('requests-notifications')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'valuation_requests',
        },
        async (payload) => {
          const updatedRequest = payload.new as Record<string, unknown>;
          const oldRequest = payload.old as Record<string, unknown>;
          
          // For admin: notify on new requests or status changes
          if (isAdmin) {
            if (oldRequest.status !== updatedRequest.status) {
              onRequestUpdate?.(updatedRequest);
            }
          }
          
          // For client: notify on their request updates
          if (!isAdmin && (updatedRequest.email === userEmail || updatedRequest.user_id === userId)) {
            // Notify on status change
            if (oldRequest.status !== updatedRequest.status) {
              const statusLabels: Record<string, string> = {
                pending: language === "it" ? "In attesa" : "Pending",
                contacted: language === "it" ? "In revisione" : "Under Review",
                completed: language === "it" ? "Completato" : "Completed",
                rejected: language === "it" ? "Rifiutato" : "Rejected",
              };
              
              showNotification(
                language === "it" ? "Aggiornamento richiesta" : "Request update",
                language === "it" 
                  ? `La tua richiesta è ora: ${statusLabels[updatedRequest.status]}`
                  : `Your request is now: ${statusLabels[updatedRequest.status]}`
              );
              onRequestUpdate?.(updatedRequest);
            }
            
            // Notify on new offer
            if (!oldRequest.final_offer && updatedRequest.final_offer) {
              showNotification(
                language === "it" ? "Nuova offerta!" : "New offer!",
                language === "it" 
                  ? `Hai ricevuto un'offerta di €${updatedRequest.final_offer.toLocaleString()}`
                  : `You received an offer of €${updatedRequest.final_offer.toLocaleString()}`
              );
              setUnreadCount(prev => prev + 1);
              onRequestUpdate?.(updatedRequest);
            }
          }
        }
      )
      .subscribe();

    // Subscribe to new requests (admin only)
    let newRequestsChannel: ReturnType<typeof supabase.channel> | null = null;
    if (isAdmin) {
      newRequestsChannel = supabase
        .channel('new-requests-notifications')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'valuation_requests',
          },
          (payload) => {
            const newRequest = payload.new as Record<string, unknown>;
            showNotification(
              language === "it" ? "Nuova richiesta" : "New request",
              `${newRequest.make} ${newRequest.model} (${newRequest.year})`
            );
            setUnreadCount(prev => prev + 1);
            onRequestUpdate?.(newRequest);
          }
        )
        .subscribe();
    }

    return () => {
      supabase.removeChannel(messagesChannel);
      supabase.removeChannel(requestsChannel);
      if (newRequestsChannel) {
        supabase.removeChannel(newRequestsChannel);
      }
    };
  }, [isAdmin, userId, userEmail, language, showNotification, onNewMessage, onRequestUpdate]);

  const clearUnread = useCallback(() => {
    setUnreadCount(0);
  }, []);

  return { unreadCount, clearUnread };
}
