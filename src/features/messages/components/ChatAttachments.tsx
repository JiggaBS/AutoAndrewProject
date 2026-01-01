import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Paperclip, X, FileIcon, ImageIcon, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { cn } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';
import { ImageLightbox } from './ImageLightbox';

export interface Attachment {
  name: string;
  url: string;
  type: string;
  size: number;
}

interface AttachmentPickerProps {
  onAttachmentsChange: (attachments: Attachment[]) => void;
  attachments: Attachment[];
  requestId: string;
  disabled?: boolean;
  maxFiles?: number;
  maxSizeMB?: number;
}

const ALLOWED_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

export function AttachmentPicker({
  onAttachmentsChange,
  attachments,
  requestId,
  disabled = false,
  maxFiles = 5,
  maxSizeMB = 10,
}: AttachmentPickerProps) {
  const [isUploading, setIsUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const remainingSlots = maxFiles - attachments.length;
    if (remainingSlots <= 0) {
      toast({
        title: 'Limite file raggiunto',
        description: `Puoi allegare al massimo ${maxFiles} file.`,
        variant: 'destructive',
      });
      return;
    }

    const filesToUpload = Array.from(files).slice(0, remainingSlots);
    setIsUploading(true);

    try {
      const uploadPromises = filesToUpload.map(async (file) => {
        // Validate type
        if (!ALLOWED_TYPES.includes(file.type)) {
          throw new Error(`Tipo file non supportato: ${file.name}`);
        }

        // Validate size
        if (file.size > maxSizeMB * 1024 * 1024) {
          throw new Error(`File troppo grande: ${file.name} (max ${maxSizeMB}MB)`);
        }

        // Generate unique path: request/{request_id}/{timestamp}-{filename}
        // This format matches the storage policies
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Devi essere autenticato per caricare file');

        const timestamp = Date.now();
        const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
        const filePath = `request/${requestId}/${timestamp}-${safeName}`;

        // Upload to storage
        const { error: uploadError } = await supabase.storage
          .from('chat-attachments')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('chat-attachments')
          .getPublicUrl(filePath);

        return {
          name: file.name,
          url: publicUrl,
          type: file.type,
          size: file.size,
        } as Attachment;
      });

      const newAttachments = await Promise.all(uploadPromises);
      onAttachmentsChange([...attachments, ...newAttachments]);
    } catch (error: unknown) {
      toast({
        title: 'Errore caricamento',
        description: error instanceof Error ? error.message : 'Impossibile caricare il file.',
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
      if (inputRef.current) {
        inputRef.current.value = '';
      }
    }
  };

  const removeAttachment = (index: number) => {
    const updated = attachments.filter((_, i) => i !== index);
    onAttachmentsChange(updated);
  };

  return (
    <div className="flex items-center gap-2">
      <input
        ref={inputRef}
        type="file"
        multiple
        accept={ALLOWED_TYPES.join(',')}
        onChange={handleFileSelect}
        className="hidden"
        disabled={disabled || isUploading}
      />
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={() => inputRef.current?.click()}
        disabled={disabled || isUploading || attachments.length >= maxFiles}
        className="h-9 w-9 rounded-lg shrink-0"
      >
        {isUploading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Paperclip className="w-4 h-4" />
        )}
      </Button>
    </div>
  );
}

interface AttachmentPreviewProps {
  attachments: Attachment[];
  onRemove: (index: number) => void;
}

export function AttachmentPreview({ attachments, onRemove }: AttachmentPreviewProps) {
  if (attachments.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 p-2 bg-muted/30 rounded-lg">
      {attachments.map((att, index) => (
        <div
          key={index}
          className="flex items-center gap-2 px-2 py-1.5 bg-background rounded-md border border-border text-xs max-w-[180px]"
        >
          {att.type.startsWith('image/') ? (
            <ImageIcon className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
          ) : (
            <FileIcon className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
          )}
          <span className="truncate flex-1">{att.name}</span>
          <button
            type="button"
            onClick={() => onRemove(index)}
            className="p-0.5 hover:bg-muted rounded shrink-0"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      ))}
    </div>
  );
}

interface MessageAttachmentsProps {
  attachments: Attachment[];
}

export function MessageAttachments({ attachments }: MessageAttachmentsProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  if (!attachments || attachments.length === 0) return null;

  const imageAttachments = attachments
    .map((att, index) => ({ ...att, originalIndex: index }))
    .filter((att) => att.type.startsWith('image/'));

  const openLightbox = (attachmentIndex: number) => {
    const imageIndex = imageAttachments.findIndex(
      (img) => img.originalIndex === attachmentIndex
    );
    if (imageIndex !== -1) {
      setLightboxIndex(imageIndex);
    }
  };

  return (
    <>
      <div className="flex flex-wrap gap-2 mt-2">
        {attachments.map((att, index) => {
          const isImage = att.type.startsWith('image/');

          if (isImage) {
            return (
              <button
                key={index}
                onClick={() => openLightbox(index)}
                className="block cursor-zoom-in focus:outline-none focus:ring-2 focus:ring-primary/50 rounded-lg"
              >
                <img
                  src={att.url}
                  alt={att.name}
                  className="max-w-[200px] max-h-[150px] rounded-lg object-cover border border-border/50 bg-muted hover:opacity-90 transition-opacity"
                />
              </button>
            );
          }

          return (
            <a
              key={index}
              href={att.url}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "flex items-center gap-2 px-3 py-2 rounded-lg text-xs",
                "bg-background/50 border border-border/50 hover:bg-background transition-colors"
              )}
            >
              <FileIcon className="w-4 h-4 text-muted-foreground" />
              <span className="truncate max-w-[120px]">{att.name}</span>
            </a>
          );
        })}
      </div>

      {lightboxIndex !== null && (
        <ImageLightbox
          images={imageAttachments.map((img) => ({ url: img.url, name: img.name }))}
          initialIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      )}
    </>
  );
}
