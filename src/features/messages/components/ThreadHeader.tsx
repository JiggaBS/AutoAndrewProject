import { Badge } from '@/components/ui/badge';
import { Lock, MessageSquare, Car } from 'lucide-react';
import { canUserSendMessage, getStatusLabel } from '../types';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

interface ThreadHeaderProps {
  title: string;
  status: string;
  isAdmin?: boolean;
  unreadCount?: number;
}

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20',
  contacted: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
  completed: 'bg-green-500/10 text-green-600 border-green-500/20',
  rejected: 'bg-red-500/10 text-red-600 border-red-500/20',
};

export function ThreadHeader({ title, status, isAdmin, unreadCount }: ThreadHeaderProps) {
  const { language } = useLanguage();
  const isLocked = !isAdmin && !canUserSendMessage(status);

  return (
    <div className="flex items-center justify-between p-4 border-b border-border bg-card/50 backdrop-blur-sm">
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
          <Car className="w-5 h-5 text-primary" />
        </div>
        <div className="min-w-0">
          <h3 className="font-semibold text-foreground truncate">{title}</h3>
          <div className="flex items-center gap-2 mt-0.5">
            <Badge variant="outline" className={cn('text-xs', statusColors[status])}>
              {getStatusLabel(status, language)}
            </Badge>
            {isLocked && (
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <Lock className="w-3 h-3" />
                {language === 'it' ? 'Messaggi bloccati' : 'Messages locked'}
              </span>
            )}
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        {unreadCount && unreadCount > 0 && (
          <Badge className="bg-primary text-primary-foreground">
            {unreadCount} {language === 'it' ? 'nuovi' : 'new'}
          </Badge>
        )}
        <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
          <MessageSquare className="w-4 h-4 text-muted-foreground" />
        </div>
      </div>
    </div>
  );
}
