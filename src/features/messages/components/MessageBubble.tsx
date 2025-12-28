import { cn } from '@/lib/utils';
import { Message, MessageAttachment } from '../types';
import { User, Shield, Bot, Copy, Check, Download, File, Image as ImageIcon, ExternalLink, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';

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

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

function getFileTypeIcon(type: string) {
  if (type.startsWith('image/')) {
    return ImageIcon;
  }
  if (type === 'application/pdf') {
    return File;
  }
  return File;
}

function AttachmentPreview({ attachment }: { attachment: MessageAttachment }) {
  const { language } = useLanguage();
  const [isLoading, setIsLoading] = useState(false);
  const Icon = getFileTypeIcon(attachment.type);
  const isImage = attachment.type.startsWith('image/');

  const handleOpenFile = async () => {
    setIsLoading(true);
    try {
      // Extract file path from attachment.id (format: "request/{request_id}/{timestamp}-{filename}")
      // or from the URL if id is not available
      let filePath = attachment.id;
      
      // If id doesn't look like a path, try to extract from URL
      if (!filePath || !filePath.includes('/')) {
        // Try to extract path from URL
        // URL format: https://...supabase.co/storage/v1/object/sign/message-attachments/request/...
        const urlMatch = attachment.url.match(/message-attachments\/(.+)$/);
        if (urlMatch) {
          filePath = urlMatch[1];
        } else {
          // Last resort: use the stored URL directly
          window.open(attachment.url, '_blank');
          setIsLoading(false);
          return;
        }
      }
      
      // Generate a fresh signed URL
      const { data: signedUrlData, error: urlError } = await supabase.storage
        .from('message-attachments')
        .createSignedUrl(filePath, 3600); // 1 hour expiry

      if (urlError) {
        console.error('Error generating signed URL:', urlError);
        // Fallback to stored URL if signed URL generation fails
        window.open(attachment.url, '_blank');
        setIsLoading(false);
        return;
      }

      if (signedUrlData?.signedUrl) {
        // For images, open in new tab for preview
        // For other files, trigger download
        if (isImage) {
          window.open(signedUrlData.signedUrl, '_blank');
        } else {
          // Trigger download
          const link = document.createElement('a');
          link.href = signedUrlData.signedUrl;
          link.download = attachment.name;
          link.target = '_blank';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
      } else {
        // Fallback to stored URL
        window.open(attachment.url, '_blank');
      }
    } catch (error) {
      console.error('Error opening file:', error);
      // Fallback to stored URL
      window.open(attachment.url, '_blank');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-2 p-3 rounded-lg bg-background/50 border border-border/50 flex items-center gap-3 group">
      <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center shrink-0">
        <Icon className="w-5 h-5 text-muted-foreground" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{attachment.name}</p>
        <p className="text-xs text-muted-foreground">{formatFileSize(attachment.size)}</p>
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 shrink-0"
        onClick={handleOpenFile}
        disabled={isLoading}
        title={language === 'it' ? (isImage ? 'Apri immagine' : 'Scarica documento') : (isImage ? 'Open image' : 'Download document')}
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : isImage ? (
          <ExternalLink className="w-4 h-4" />
        ) : (
          <Download className="w-4 h-4" />
        )}
      </Button>
    </div>
  );
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
          {message.body && linkifyText(message.body)}
          
          {/* Attachments */}
          {message.attachments && message.attachments.length > 0 && (
            <div className={cn('mt-2 space-y-2', message.body && 'pt-2 border-t border-current/20')}>
              {message.attachments.map((attachment, idx) => (
                <AttachmentPreview key={attachment.id || idx} attachment={attachment} />
              ))}
            </div>
          )}
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
