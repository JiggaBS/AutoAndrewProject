import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send, Loader2, Lock, AlertCircle, Paperclip, X, File } from 'lucide-react';
import { canUserSendMessage, getStatusLabel } from '../types';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';

interface ComposerProps {
  onSend: (body: string, attachments?: File[]) => void;
  isSending: boolean;
  status: string;
  isAdmin?: boolean;
  maxLength?: number;
  requestId?: string;
}

export function Composer({
  onSend,
  isSending,
  status,
  isAdmin = false,
  maxLength = 2000,
  requestId,
}: ComposerProps) {
  const { language } = useLanguage();
  const [message, setMessage] = useState('');
  const [attachments, setAttachments] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const isLocked = !isAdmin && !canUserSendMessage(status);
  const charCount = message.length;
  const isOverLimit = charCount > maxLength;
  const canSend = (message.trim().length > 0 || attachments.length > 0) && !isSending && !isOverLimit && !isUploading;
  
  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
  const MAX_FILES = 5;

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 150)}px`;
    }
  }, [message]);

  const handleSend = () => {
    if (!canSend) return;
    onSend(message.trim(), attachments.length > 0 ? attachments : undefined);
    setMessage('');
    setAttachments([]);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    if (attachments.length + files.length > MAX_FILES) {
      toast({
        title: language === 'it' ? 'Troppi file' : 'Too many files',
        description: language === 'it' 
          ? `Puoi allegare massimo ${MAX_FILES} file alla volta.`
          : `You can attach up to ${MAX_FILES} files at once.`,
        variant: 'destructive',
      });
      return;
    }

    const validFiles: File[] = [];
    const invalidFiles: string[] = [];
    
    for (const file of files) {
      if (file.size > MAX_FILE_SIZE) {
        invalidFiles.push(file.name);
        continue;
      }
      validFiles.push(file);
    }

    if (invalidFiles.length > 0) {
      toast({
        title: language === 'it' ? 'File troppo grande' : 'File too large',
        description: language === 'it'
          ? `${invalidFiles.join(', ')} supera il limite di ${formatFileSize(MAX_FILE_SIZE)}.`
          : `${invalidFiles.join(', ')} exceeds the ${formatFileSize(MAX_FILE_SIZE)} limit.`,
        variant: 'destructive',
      });
    }

    if (validFiles.length > 0) {
      setAttachments(prev => [...prev, ...validFiles]);
    }
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) {
      return '🖼️';
    }
    if (file.type === 'application/pdf') {
      return '📄';
    }
    if (file.type.includes('word') || file.type.includes('document')) {
      return '📝';
    }
    if (file.type.includes('excel') || file.type.includes('spreadsheet')) {
      return '📊';
    }
    return '📎';
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
      {/* Attachments preview */}
      {attachments.length > 0 && (
        <div className="mb-3 flex flex-wrap gap-2">
          {attachments.map((file, index) => (
            <div
              key={index}
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-secondary/50 border border-border text-sm"
            >
              <span className="text-base">{getFileIcon(file)}</span>
              <div className="flex-1 min-w-0">
                <p className="truncate font-medium text-xs">{file.name}</p>
                <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-6 w-6 shrink-0"
                onClick={() => removeAttachment(index)}
                disabled={isSending}
              >
                <X className="w-3.5 h-3.5" />
              </Button>
            </div>
          ))}
        </div>
      )}

      <div className="flex gap-3 items-end">
        {/* File input (hidden) */}
        <input
          ref={fileInputRef}
          type="file"
          multiple
          className="hidden"
          onChange={handleFileSelect}
          accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.jpg,.jpeg,.png,.gif,.webp,.txt,.csv"
          disabled={isSending || isLocked || attachments.length >= MAX_FILES}
        />

        {/* Attach button */}
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="h-12 w-12 rounded-xl shrink-0"
          onClick={() => fileInputRef.current?.click()}
          disabled={isSending || isLocked || attachments.length >= MAX_FILES}
          title={language === 'it' ? 'Allega documento' : 'Attach document'}
        >
          <Paperclip className="w-5 h-5" />
        </Button>

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
