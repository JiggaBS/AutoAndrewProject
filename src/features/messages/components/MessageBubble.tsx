import { cn } from '@/lib/utils';
import { Message } from '../types';
import { User, Shield, Bot, Copy, Check } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

interface MessageBubbleProps {
  message: Message;
  isOwnMessage: boolean;
  showSender?: boolean;
  senderName?: string;
}

// Linkify URLs in text
function linkifyText(text: string): React.ReactNode[] {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const parts = text.split(urlRegex);
  
  return parts.map((part, index) => {
    if (urlRegex.test(part)) {
      return (
        <a
          key={index}
          href={part}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary underline hover:opacity-80"
        >
          {part}
        </a>
      );
    }
    return part;
  });
}

function formatMessageTime(dateString: string, language: string): string {
  const date = new Date(dateString);
  return date.toLocaleTimeString(language === 'it' ? 'it-IT' : 'en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function MessageBubble({ message, isOwnMessage, showSender = true, senderName }: MessageBubbleProps) {
  const { language } = useLanguage();
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(message.body);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // System message - centered, muted
  if (message.sender_type === 'system') {
    return (
      <div className="flex justify-center my-4">
        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-muted/50 border border-border/50">
          <Bot className="w-3.5 h-3.5 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">{message.body}</span>
        </div>
      </div>
    );
  }

  const senderIcon = message.sender_type === 'admin' ? Shield : User;
  const SenderIcon = senderIcon;

  return (
    <div
      className={cn(
        'group flex flex-col max-w-[85%] lg:max-w-[70%] gap-1',
        isOwnMessage ? 'ml-auto items-end' : 'mr-auto items-start'
      )}
    >
      {/* Sender info */}
      {showSender && (
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground px-1">
          <SenderIcon className="w-3 h-3" />
          <span className="font-medium">
            {message.sender_type === 'admin'
              ? 'Admin'
              : senderName || (language === 'it' ? 'Tu' : 'You')}
          </span>
          <span className="opacity-60">•</span>
          <span className="opacity-60">{formatMessageTime(message.created_at, language)}</span>
        </div>
      )}

      {/* Message bubble */}
      <div className="relative">
        <div
          className={cn(
            'px-4 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap break-words',
            isOwnMessage
              ? 'bg-primary text-primary-foreground rounded-br-md'
              : 'bg-muted rounded-bl-md'
          )}
        >
          {linkifyText(message.body)}
        </div>

        {/* Copy button - appears on hover */}
        <Button
          variant="ghost"
          size="icon"
          onClick={handleCopy}
          className={cn(
            'absolute -right-10 top-1/2 -translate-y-1/2 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity',
            isOwnMessage && '-left-10 -right-auto'
          )}
        >
          {copied ? (
            <Check className="w-3.5 h-3.5 text-green-500" />
          ) : (
            <Copy className="w-3.5 h-3.5 text-muted-foreground" />
          )}
        </Button>
      </div>

      {/* Read status for own messages */}
      {isOwnMessage && message.read_at && (
        <span className="text-[10px] text-muted-foreground/70 px-1">
          {language === 'it' ? 'Letto' : 'Read'}
        </span>
      )}
    </div>
  );
}
