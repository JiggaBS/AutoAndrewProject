// Message types for the messaging system

export interface MessageAttachment {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number;
  uploaded_at: string;
}

export interface Message {
  id: string;
  request_id: string;
  sender_user_id: string | null;
  sender_type: 'admin' | 'user' | 'system';
  body: string;
  attachments: MessageAttachment[] | null;
  created_at: string;
  read_at: string | null;
}

export interface ValuationRequestWithMessages {
  id: string;
  make: string;
  model: string;
  year: number;
  status: string;
  name: string;
  email: string;
  phone: string;
  last_message_at: string | null;
  last_message_preview: string | null;
  unread_count_user: number;
  unread_count_admin: number;
}

export type MessageSenderRole = 'admin' | 'user' | 'system';

// Status that allows client messages
export const STATUS_ALLOWS_MESSAGES = ['pending'] as const;

// Status labels for UI
export const STATUS_LABELS: Record<string, { it: string; en: string }> = {
  pending: { it: 'In attesa', en: 'Pending' },
  contacted: { it: 'In revisione', en: 'Under Review' },
  completed: { it: 'Completato', en: 'Completed' },
  rejected: { it: 'Rifiutato', en: 'Refused' },
};

export const getStatusLabel = (status: string, language: string): string => {
  const labels = STATUS_LABELS[status];
  return labels ? (language === 'it' ? labels.it : labels.en) : status;
};

export const canUserSendMessage = (status: string): boolean => {
  return STATUS_ALLOWS_MESSAGES.includes(status as typeof STATUS_ALLOWS_MESSAGES[number]);
};
