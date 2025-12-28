import { useEffect, useRef, useState } from 'react';
import { Message } from '../types';
import { MessageBubble } from './MessageBubble';
import { Skeleton } from '@/components/ui/skeleton';
import { MessageSquare } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

interface MessageListProps {
  messages: Message[];
  isLoading: boolean;
  isAdmin?: boolean;
  clientName?: string;
}

// Group messages by date
function groupMessagesByDate(messages: Message[]): Map<string, Message[]> {
  const groups = new Map<string, Message[]>();
  
  messages.forEach((message) => {
    const date = new Date(message.created_at).toLocaleDateString();
    const existing = groups.get(date) || [];
    groups.set(date, [...existing, message]);
  });
  
  return groups;
}

function formatDateSeparator(dateStr: string, language: string): string {
  const date = new Date(dateStr);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (date.toDateString() === today.toDateString()) {
    return language === 'it' ? 'Oggi' : 'Today';
  }
  if (date.toDateString() === yesterday.toDateString()) {
    return language === 'it' ? 'Ieri' : 'Yesterday';
  }
  
  return date.toLocaleDateString(language === 'it' ? 'it-IT' : 'en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });
}

export function MessageList({ messages, isLoading, isAdmin, clientName }: MessageListProps) {
  const { language } = useLanguage();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true);
  const previousMessagesLength = useRef(messages.length);

  // Check if user is near bottom of scroll
  const handleScroll = () => {
    if (!containerRef.current) return;
    
    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
    const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
    setShouldAutoScroll(isNearBottom);
  };

  // Auto-scroll to bottom when new messages arrive (if near bottom)
  useEffect(() => {
    if (messages.length > previousMessagesLength.current && shouldAutoScroll) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
    previousMessagesLength.current = messages.length;
  }, [messages.length, shouldAutoScroll]);

  // Initial scroll to bottom
  useEffect(() => {
    if (!isLoading && messages.length > 0) {
      messagesEndRef.current?.scrollIntoView();
    }
  }, [isLoading]);

  if (isLoading) {
    return (
      <div className="flex-1 p-4 space-y-4">
        <div className="flex items-start gap-3">
          <Skeleton className="w-10 h-10 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-16 w-64 rounded-2xl" />
          </div>
        </div>
        <div className="flex items-start gap-3 justify-end">
          <div className="space-y-2 items-end flex flex-col">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-12 w-48 rounded-2xl" />
          </div>
        </div>
        <div className="flex items-start gap-3">
          <Skeleton className="w-10 h-10 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-20 w-72 rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
        <div className="w-16 h-16 rounded-2xl bg-muted/50 flex items-center justify-center mb-4">
          <MessageSquare className="w-8 h-8 text-muted-foreground/50" />
        </div>
        <h4 className="font-medium text-foreground mb-1">
          {language === 'it' ? 'Nessun messaggio' : 'No messages yet'}
        </h4>
        <p className="text-sm text-muted-foreground max-w-xs">
          {isAdmin
            ? language === 'it'
              ? 'Invia un messaggio per iniziare la conversazione con il cliente.'
              : 'Send a message to start the conversation with the client.'
            : language === 'it'
            ? 'Invia un messaggio per iniziare la conversazione.'
            : 'Send a message to start the conversation.'}
        </p>
      </div>
    );
  }

  const groupedMessages = groupMessagesByDate(messages);

  return (
    <div
      ref={containerRef}
      onScroll={handleScroll}
      className="flex-1 overflow-y-auto p-4 space-y-6"
    >
      {Array.from(groupedMessages.entries()).map(([date, dayMessages]) => (
        <div key={date} className="space-y-3">
          {/* Date separator */}
          <div className="flex items-center gap-3 my-4">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs font-medium text-muted-foreground px-2">
              {formatDateSeparator(date, language)}
            </span>
            <div className="flex-1 h-px bg-border" />
          </div>

          {/* Messages for this date */}
          {dayMessages.map((message, index) => {
            const isOwnMessage = isAdmin
              ? message.sender_type === 'admin'
              : message.sender_type === 'user';

            // Show sender only for first message in a sequence from same sender
            const prevMessage = dayMessages[index - 1];
            const showSender = !prevMessage || prevMessage.sender_type !== message.sender_type;

            return (
              <MessageBubble
                key={message.id}
                message={message}
                isOwnMessage={isOwnMessage}
                showSender={showSender}
                senderName={isAdmin && message.sender_type === 'user' ? clientName : undefined}
              />
            );
          })}
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
}
