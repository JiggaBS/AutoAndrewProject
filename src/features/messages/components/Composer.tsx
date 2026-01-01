import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send, Loader2, Lock, AlertCircle } from 'lucide-react';
import { canUserSendMessage, getStatusLabel } from '../types';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

interface ComposerProps {
  onSend: (body: string) => void;
  isSending: boolean;
  status: string;
  isAdmin?: boolean;
  maxLength?: number;
}

export function Composer({
  onSend,
  isSending,
  status,
  isAdmin = false,
  maxLength = 2000,
}: ComposerProps) {
  const { language } = useLanguage();
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  const isLocked = !isAdmin && !canUserSendMessage(status);
  const charCount = message.length;
  const isOverLimit = charCount > maxLength;
  const canSend = message.trim().length > 0 && !isSending && !isOverLimit;

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 150)}px`;
    }
  }, [message]);

  const handleSend = () => {
    if (!canSend) return;
    onSend(message.trim());
    setMessage('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const getLockedMessage = () => {
    switch (status) {
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

  if (isLocked) {
    return (
      <div className="p-4 border-t border-border bg-muted/30">
        <div className="flex items-start gap-3 p-4 rounded-xl bg-background border border-border">
          <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center shrink-0">
            <Lock className="w-5 h-5 text-muted-foreground" />
          </div>
          <div>
            <h4 className="font-medium text-foreground text-sm">
              {language === 'it' ? 'Messaggi disabilitati' : 'Messaging disabled'}
            </h4>
            <p className="text-sm text-muted-foreground mt-0.5">
              {getLockedMessage()}
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              {language === 'it' ? 'Stato attuale:' : 'Current status:'}{' '}
              <span className="font-medium">{getStatusLabel(status, language)}</span>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 border-t border-border bg-card/50 backdrop-blur-sm">
      <div className="flex gap-3 items-end">
        <div className="flex-1 relative">
          <Textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={
              isAdmin
                ? language === 'it'
                  ? 'Scrivi un messaggio al cliente...'
                  : 'Write a message to the client...'
                : language === 'it'
                ? 'Scrivi un messaggio...'
                : 'Write a message...'
            }
            className={cn(
              'min-h-[48px] max-h-[150px] resize-none pr-16 py-3 rounded-xl bg-background',
              isOverLimit && 'border-destructive focus-visible:ring-destructive'
            )}
            disabled={isSending}
          />
          
          {/* Character count */}
          <div
            className={cn(
              'absolute right-3 bottom-2 text-xs',
              isOverLimit ? 'text-destructive' : 'text-muted-foreground'
            )}
          >
            {charCount}/{maxLength}
          </div>
        </div>

        <Button
          onClick={handleSend}
          disabled={!canSend}
          size="icon"
          className="h-12 w-12 rounded-xl shrink-0"
        >
          {isSending ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Send className="w-5 h-5" />
          )}
        </Button>
      </div>

      {/* Helper text */}
      {!isAdmin && (
        <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1.5">
          <AlertCircle className="w-3 h-3" />
          {language === 'it'
            ? 'Puoi inviare messaggi finché la richiesta è "In attesa". Premi Invio per inviare.'
            : 'You can send messages while the request is "Pending". Press Enter to send.'}
        </p>
      )}
    </div>
  );
}
