import { useEffect, useRef, useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useMessages } from '@/features/messages/hooks/useMessages';
import { Message, canUserSendMessage, getStatusLabel } from '@/features/messages/types';
import { Send, Loader2, MessageSquare, User, Shield, Lock, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';
import { 
  AttachmentPicker, 
  AttachmentPreview, 
  MessageAttachments,
  Attachment 
} from '@/features/messages/components/ChatAttachments';

interface ClientChatPanelProps {
  requestId: string;
  requestStatus: string;
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

function formatTime(dateStr: string): string {
  return new Date(dateStr).toLocaleTimeString('it-IT', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function ClientChatPanel({ requestId, requestStatus }: ClientChatPanelProps) {
  const { language } = useLanguage();
  const { messages, isLoading, sendMessage, isSending } = useMessages(requestId);
  const [message, setMessage] = useState('');
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true);
  const previousMessagesLength = useRef(messages.length);
  
  const maxLength = 2000;
  const charCount = message.length;
  const isOverLimit = charCount > maxLength;
  const isLocked = !canUserSendMessage(requestStatus);
  const hasContent = message.trim().length > 0 || attachments.length > 0;
  const canSend = hasContent && !isSending && !isOverLimit && !isLocked;

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [message]);

  // Check if user is near bottom
  const handleScroll = () => {
    if (!containerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
    const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
    setShouldAutoScroll(isNearBottom);
  };

  // Auto-scroll when new messages arrive
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

  const handleSend = () => {
    if (!canSend) return;
    sendMessage({ 
      body: message.trim() || (attachments.length > 0 ? '📎 Allegato' : ''),
      attachments: attachments.length > 0 
        ? attachments.map(a => ({ name: a.name, url: a.url, type: a.type, size: a.size }))
        : undefined 
    });
    setMessage('');
    setAttachments([]);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const getLockedMessage = () => {
    switch (requestStatus) {
      case 'contacted':
        return language === 'it'
          ? 'La tua richiesta è in revisione. I messaggi sono temporaneamente disabilitati.'
          : 'Your request is under review. Messaging is temporarily disabled.';
      case 'completed':
        return language === 'it'
          ? 'Questa richiesta è stata completata. La conversazione è chiusa.'
          : 'This request has been completed. The conversation is closed.';
      case 'rejected':
        return language === 'it'
          ? 'Questa richiesta è stata rifiutata. La conversazione è chiusa.'
          : 'This request has been refused. The conversation is closed.';
      default:
        return language === 'it'
          ? 'I messaggi sono attualmente disabilitati.'
          : 'Messaging is currently disabled.';
    }
  };

  const groupedMessages = groupMessagesByDate(messages);

  return (
    <div className="flex flex-col h-full min-h-0 bg-background">
      {/* Messages Area */}
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="flex-1 min-h-0 overflow-y-auto overscroll-contain"
      >
        {isLoading ? (
          <div className="p-4 space-y-4">
            <div className="flex items-start gap-3">
              <Skeleton className="w-8 h-8 rounded-full shrink-0" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-14 w-52 rounded-2xl" />
              </div>
            </div>
            <div className="flex items-start gap-3 justify-end">
              <div className="space-y-2 flex flex-col items-end">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-10 w-40 rounded-2xl" />
              </div>
            </div>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full p-8 text-center min-h-[200px]">
            <div className="w-14 h-14 rounded-2xl bg-muted/50 flex items-center justify-center mb-4">
              <MessageSquare className="w-7 h-7 text-muted-foreground/50" />
            </div>
            <h4 className="font-medium text-foreground mb-1">
              {language === 'it' ? 'Nessun messaggio' : 'No messages yet'}
            </h4>
            <p className="text-sm text-muted-foreground max-w-xs">
              {language === 'it'
                ? 'Invia un messaggio per iniziare la conversazione.'
                : 'Send a message to start the conversation.'}
            </p>
          </div>
        ) : (
          <div className="p-4 space-y-4">
            {Array.from(groupedMessages.entries()).map(([date, dayMessages]) => (
              <div key={date} className="space-y-3">
                {/* Date separator */}
                <div className="flex items-center gap-3 my-4">
                  <div className="flex-1 h-px bg-border" />
                  <span className="text-xs font-medium text-muted-foreground px-2 capitalize">
                    {formatDateSeparator(date, language)}
                  </span>
                  <div className="flex-1 h-px bg-border" />
                </div>

                {/* Messages */}
                {dayMessages.map((msg, index) => {
                  const isOwnMessage = msg.sender_type === 'user';
                  const isSystem = msg.sender_type === 'system';
                  const prevMessage = dayMessages[index - 1];
                  const showSender = !prevMessage || prevMessage.sender_type !== msg.sender_type;

                  const attachmentsArr = Array.isArray(msg.attachments)
                    ? (msg.attachments as unknown as Attachment[])
                    : [];
                  const hasAttachments = attachmentsArr.length > 0;
                  const isAttachmentOnly = hasAttachments && msg.body.trim() === '📎 Allegato';

                  if (isSystem) {
                    return (
                      <div key={msg.id} className="flex justify-center my-3">
                        <div className="px-3 py-1.5 rounded-full bg-muted/50 text-xs text-muted-foreground">
                          {msg.body}
                        </div>
                      </div>
                    );
                  }

                  return (
                    <div
                      key={msg.id}
                      className={cn(
                        "flex items-end gap-2",
                        isOwnMessage ? "justify-end" : "justify-start"
                      )}
                    >
                      {/* Avatar for admin messages */}
                      {!isOwnMessage && showSender && (
                        <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mb-5">
                          <Shield className="w-3.5 h-3.5 text-primary" />
                        </div>
                      )}
                      {!isOwnMessage && !showSender && <div className="w-7 shrink-0" />}

                      <div className={cn("max-w-[75%] sm:max-w-[70%]", isOwnMessage && "order-first")}>
                        {showSender && (
                          <p className={cn(
                            "text-xs text-muted-foreground mb-1 flex items-center gap-1",
                            isOwnMessage ? "justify-end" : "justify-start"
                          )}>
                            {isOwnMessage ? (
                              language === 'it' ? 'Tu' : 'You'
                            ) : (
                              'Admin'
                            )}
                            <span className="mx-1">•</span>
                            {formatTime(msg.created_at)}
                          </p>
                        )}
                        <div
                          className={cn(
                            "px-4 py-2.5 rounded-2xl text-sm break-words",
                            isAttachmentOnly
                              ? "bg-muted text-foreground border border-border/50"
                              : isOwnMessage
                              ? "bg-primary text-primary-foreground rounded-br-md"
                              : "bg-muted text-foreground rounded-bl-md"
                          )}
                        >
                          {!isAttachmentOnly && msg.body}
                          {hasAttachments && (
                            <MessageAttachments attachments={attachmentsArr} />
                          )}
                        </div>
                      </div>

                      {/* Avatar for user messages */}
                      {isOwnMessage && showSender && (
                        <div className="w-7 h-7 rounded-full bg-secondary flex items-center justify-center shrink-0 mb-5">
                          <User className="w-3.5 h-3.5 text-muted-foreground" />
                        </div>
                      )}
                      {isOwnMessage && !showSender && <div className="w-7 shrink-0" />}
                    </div>
                  );
                })}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Composer - Fixed at bottom */}
      {isLocked ? (
        <div className="shrink-0 p-3 sm:p-4 border-t border-border bg-muted/30 safe-area-bottom">
          <div className="flex items-start gap-3 p-3 sm:p-4 rounded-xl bg-background border border-border">
            <div className="w-9 h-9 rounded-full bg-muted flex items-center justify-center shrink-0">
              <Lock className="w-4 h-4 text-muted-foreground" />
            </div>
            <div className="min-w-0">
              <h4 className="font-medium text-foreground text-sm">
                {language === 'it' ? 'Messaggi disabilitati' : 'Messaging disabled'}
              </h4>
              <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 break-words">
                {getLockedMessage()}
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                {language === 'it' ? 'Stato attuale:' : 'Current status:'}{' '}
                <span className="font-medium">{getStatusLabel(requestStatus, language)}</span>
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="shrink-0 p-3 sm:p-4 border-t border-border bg-card/80 backdrop-blur-sm safe-area-bottom">
          {attachments.length > 0 && (
            <div className="mb-2">
              <AttachmentPreview
                attachments={attachments}
                onRemove={(index) => setAttachments(attachments.filter((_, i) => i !== index))}
              />
            </div>
          )}
          <div className="flex gap-2 sm:gap-3 items-end">
            <AttachmentPicker
              attachments={attachments}
              onAttachmentsChange={setAttachments}
              disabled={isSending}
            />
            <div className="flex-1 relative">
              <Textarea
                ref={textareaRef}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={language === 'it' ? 'Scrivi un messaggio...' : 'Write a message...'}
                className={cn(
                  "min-h-[44px] max-h-[120px] resize-none pr-14 py-2.5 sm:py-3 rounded-xl bg-background text-sm",
                  isOverLimit && "border-destructive focus-visible:ring-destructive"
                )}
                disabled={isSending}
              />
              <div
                className={cn(
                  "absolute right-3 bottom-2 text-[10px] sm:text-xs",
                  isOverLimit ? "text-destructive" : "text-muted-foreground"
                )}
              >
                {charCount}/{maxLength}
              </div>
            </div>
            <Button
              onClick={handleSend}
              disabled={!canSend}
              size="icon"
              className="h-11 w-11 rounded-xl shrink-0"
            >
              {isSending ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1.5">
            <AlertCircle className="w-3 h-3" />
            {language === 'it'
              ? 'Puoi inviare messaggi finché la richiesta è "In attesa". Premi Invio per inviare.'
              : 'You can send messages while the request is "Pending". Press Enter to send.'}
          </p>
        </div>
      )}
    </div>
  );
}
