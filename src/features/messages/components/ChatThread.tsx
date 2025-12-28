import { useEffect } from 'react';
import { ThreadHeader } from './ThreadHeader';
import { MessageList } from './MessageList';
import { Composer } from './Composer';
import { useMessages } from '../hooks/useMessages';
import { cn } from '@/lib/utils';

interface ChatThreadProps {
  requestId: string;
  requestTitle: string;
  requestStatus: string;
  isAdmin?: boolean;
  clientName?: string;
  unreadCount?: number;
  className?: string;
  showHeader?: boolean;
}

export function ChatThread({
  requestId,
  requestTitle,
  requestStatus,
  isAdmin = false,
  clientName,
  unreadCount,
  className,
  showHeader = true,
}: ChatThreadProps) {
  const {
    messages,
    isLoading,
    sendMessage,
    isSending,
    markAsRead,
  } = useMessages(requestId);

  // Mark as read when opening thread
  useEffect(() => {
    if (requestId && unreadCount && unreadCount > 0) {
      markAsRead();
    }
  }, [requestId, unreadCount, markAsRead]);

  const handleSendMessage = (body: string) => {
    sendMessage({ body });
  };

  return (
    <div className={cn('flex flex-col h-full bg-background rounded-xl border border-border overflow-hidden', className)}>
      {showHeader && (
        <ThreadHeader
          title={requestTitle}
          status={requestStatus}
          isAdmin={isAdmin}
          unreadCount={unreadCount}
        />
      )}
      
      <MessageList
        messages={messages}
        isLoading={isLoading}
        isAdmin={isAdmin}
        clientName={clientName}
      />
      
      <Composer
        onSend={handleSendMessage}
        isSending={isSending}
        status={requestStatus}
        isAdmin={isAdmin}
      />
    </div>
  );
}
