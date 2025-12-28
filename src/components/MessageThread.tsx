// Legacy MessageThread component - now wraps the new ChatThread
// This maintains backward compatibility with existing code

import { ChatThread } from '@/features/messages';

interface MessageThreadProps {
  requestId: string;
  requestStatus: string;
  isAdmin?: boolean;
  clientName?: string;
}

export function MessageThread({ 
  requestId, 
  requestStatus, 
  isAdmin = false,
  clientName = "Cliente"
}: MessageThreadProps) {
  return (
    <ChatThread
      requestId={requestId}
      requestTitle={clientName}
      requestStatus={requestStatus}
      isAdmin={isAdmin}
      clientName={clientName}
      showHeader={false}
      className="border-0 rounded-none"
    />
  );
}
