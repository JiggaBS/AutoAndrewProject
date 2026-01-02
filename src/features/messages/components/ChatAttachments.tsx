import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Paperclip, X, FileIcon, ImageIcon, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { cn } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';
import { ImageLightbox } from './ImageLightbox';

// Helper function to generate signed URL for a file path
async function getSignedUrl(filePath: string): Promise<string | null> {
  try {
    // Extract path from URL if it's a full URL
    let path = filePath;
    if (filePath.includes('/storage/v1/object/')) {
      // Extract path from Supabase storage URL
      const urlParts = filePath.split('/storage/v1/object/');
      if (urlParts.length > 1) {
        path = urlParts[1].split('?')[0];
      }
    } else if (filePath.startsWith('request/')) {
      // Already a path
      path = filePath;
    }

    const { data, error } = await supabase.storage
      .from('chat-attachments')
      .createSignedUrl(path, 60 * 60 * 24); // 24 hours

    if (error) {
      if (import.meta.env.DEV) {
        console.error('Error generating signed URL:', error);
      }
      return null;
    }

    return data?.signedUrl || null;
  } catch (error) {
    if (import.meta.env.DEV) {
      console.error('Error generating signed URL:', error);
    }
    return null;
  }
}

export interface Attachment {
  id?: string; // Storage path (e.g., "request/{request_id}/{timestamp}-{filename}")
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
      // Validate requestId before attempting upload
      if (!requestId) {
        throw new Error('ID richiesta non valido. Ricarica la pagina e riprova.');
      }

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

        // Generate signed URL for private bucket (24 hours expiry)
        const { data: signedUrlData, error: signedUrlError } = await supabase.storage
          .from('chat-attachments')
          .createSignedUrl(filePath, 60 * 60 * 24); // 24 hours

        if (signedUrlError) throw signedUrlError;

        return {
          id: filePath, // Store the path for later signed URL regeneration
          name: file.name,
          url: signedUrlData?.signedUrl || '',
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
      {attachments.map((att, index) => {
        const isImage = att.type.startsWith('image/');
        
        return (
          <div
            key={index}
            className={cn(
              "relative bg-background rounded-md border border-border overflow-hidden",
              isImage ? "w-20 h-20" : "flex items-center gap-2 px-2 py-1.5 text-xs max-w-[180px]"
            )}
          >
            {isImage ? (
              <>
                <img
                  src={att.url}
                  alt={att.name}
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => onRemove(index)}
                  className="absolute top-1 right-1 p-0.5 bg-black/50 hover:bg-black/70 rounded-full transition-colors"
                >
                  <X className="w-3 h-3 text-white" />
                </button>
              </>
            ) : (
              <>
                <FileIcon className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                <span className="truncate flex-1">{att.name}</span>
                <button
                  type="button"
                  onClick={() => onRemove(index)}
                  className="p-0.5 hover:bg-muted rounded shrink-0"
                >
                  <X className="w-3 h-3" />
                </button>
              </>
            )}
          </div>
        );
      })}
    </div>
  );
}

interface MessageAttachmentsProps {
  attachments: Attachment[];
}

export function MessageAttachments({ attachments }: MessageAttachmentsProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [processedAttachments, setProcessedAttachments] = useState<Attachment[]>([]);

  useEffect(() => {
    // Process attachments to generate signed URLs for images
    const processAttachments = async () => {
      const processed = await Promise.all(
        attachments.map(async (att) => {
          // If it's an image, generate a fresh signed URL
          if (att.type.startsWith('image/')) {
            // Use id (storage path) if available, otherwise try to extract from URL
            const filePath = att.id || att.url;
            const signedUrl = await getSignedUrl(filePath);
            if (signedUrl) {
              return { ...att, url: signedUrl };
            }
          }
          // For non-images, also try to regenerate signed URL if needed
          else if (!att.url.startsWith('http') || att.url.includes('/storage/v1/object/')) {
            const filePath = att.id || att.url;
            const signedUrl = await getSignedUrl(filePath);
            if (signedUrl) {
              return { ...att, url: signedUrl };
            }
          }
          return att;
        })
      );
      setProcessedAttachments(processed);
    };

    if (attachments && attachments.length > 0) {
      processAttachments();
    } else {
      setProcessedAttachments([]);
    }
  }, [attachments]);

  if (!attachments || attachments.length === 0) return null;

  const imageAttachments = processedAttachments
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
        {processedAttachments.map((att, index) => {
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
