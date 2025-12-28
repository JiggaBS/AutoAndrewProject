import { useCallback, useEffect, useMemo, useState } from "react";
import { Bell } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";

interface BellItem {
  requestId: string;
  title: string;
  description: string;
  at: string | null;
  unread: number;
  link: string;
}

interface NotificationBellProps {
  isAdmin: boolean;
  userId?: string;
  userEmail?: string;
}

export function NotificationBell({ isAdmin, userId, userEmail }: NotificationBellProps) {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [items, setItems] = useState<BellItem[]>([]);
  const [open, setOpen] = useState(false);

  const totalUnread = useMemo(
    () => items.reduce((sum, i) => sum + (i.unread || 0), 0),
    [items]
  );

  const formatTime = useCallback(
    (iso: string | null) => {
      if (!iso) return "";
      return new Date(iso).toLocaleString(language === "it" ? "it-IT" : "en-US", {
        day: "2-digit",
        month: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      });
    },
    [language]
  );

  const refreshFromDb = useCallback(async () => {
    if (!userId && !userEmail) return;

    // Admin: show any threads with admin-unread or recent activity
    if (isAdmin) {
      const { data } = await supabase
        .from("valuation_requests")
        .select(
          "id, make, model, year, last_message_at, last_message_preview, unread_count_admin, status, final_offer, created_at"
        )
        .order("last_message_at", { ascending: false, nullsFirst: false })
        .limit(10);

      const mapped: BellItem[] = (data || []).map((r) => ({
        requestId: r.id,
        title: language === "it" ? "Aggiornamento richiesta" : "Request update",
        description:
          r.last_message_preview ||
          `${r.make} ${r.model} (${r.year})${r.final_offer ? ` • €${Number(r.final_offer).toLocaleString()}` : ""}`,
        at: r.last_message_at || r.created_at,
        unread: Number(r.unread_count_admin || 0),
        link: "/admin",
      }));

      setItems(mapped);
      return;
    }

    // Client: only own requests
    // Fetch by user_id OR email (for backward compatibility)
    const base = supabase
      .from("valuation_requests")
      .select(
        "id, make, model, year, last_message_at, last_message_preview, unread_count_user, status, final_offer, created_at, email, user_id"
      )
      .order("last_message_at", { ascending: false, nullsFirst: false })
      .limit(10);

    // Use OR to match either user_id or email
    const query = userId && userEmail 
      ? base.or(`user_id.eq.${userId},email.eq.${userEmail}`)
      : userId 
        ? base.eq("user_id", userId)
        : base.eq("email", userEmail!);

    const { data } = await query;

    const mapped: BellItem[] = (data || []).map((r) => ({
      requestId: r.id,
      title: language === "it" ? "Aggiornamento richiesta" : "Request update",
      description:
        r.last_message_preview ||
        `${r.make} ${r.model} (${r.year})${r.final_offer ? ` • €${Number(r.final_offer).toLocaleString()}` : ""}`,
      at: r.last_message_at || r.created_at,
      unread: Number(r.unread_count_user || 0),
      link: "/dashboard",
    }));

    setItems(mapped);
  }, [isAdmin, userId, userEmail, language]);

  useEffect(() => {
    refreshFromDb();
    const t = window.setInterval(refreshFromDb, 15000); // reliable fallback if realtime is blocked
    return () => window.clearInterval(t);
  }, [refreshFromDb]);

  useEffect(() => {
    if (!userId && !userEmail) return;

    // Try realtime (best-effort). If it doesn't connect, polling above still works.
    const channel = supabase
      .channel("bell-refresh")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "valuation_messages" },
        () => refreshFromDb()
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "valuation_requests" },
        () => refreshFromDb()
      )
      .subscribe((status) => {
        // Only log errors in development mode to reduce console noise in production
        // Polling fallback ensures reliability even if realtime fails
        if (import.meta.env.DEV && (status === "CHANNEL_ERROR" || status === "TIMED_OUT" || status === "CLOSED")) {
          console.debug("[NotificationBell] realtime status:", status, "- falling back to polling");
        }
        // Successful subscription is silent - polling fallback ensures reliability
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [refreshFromDb, userId, userEmail]);

  const markThreadRead = useCallback(
    async (requestId: string) => {
      try {
        const { error } = await supabase.rpc("mark_thread_read", { p_request_id: requestId });
        if (error) throw error;
      } catch (e) {
        console.warn("[NotificationBell] mark_thread_read failed", e);
      }
    },
    []
  );

  const onItemClick = async (it: BellItem) => {
    if (it.unread > 0) {
      await markThreadRead(it.requestId);
      await refreshFromDb();
    }
    navigate(`${it.link}?request=${encodeURIComponent(it.requestId)}`);
    setOpen(false);
  };

  const markAllAsRead = async () => {
    const unreadThreads = items.filter((i) => i.unread > 0);
    for (const it of unreadThreads) {
      // sequential is fine here; at most 10 items and keeps it simple
      // (tool parallelization rule doesn't apply inside runtime)
      await markThreadRead(it.requestId);
    }
    await refreshFromDb();
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative text-muted-foreground hover:text-foreground"
          aria-label={language === "it" ? "Notifiche" : "Notifications"}
        >
          <Bell className="h-5 w-5" />
          {totalUnread > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-destructive text-destructive-foreground animate-pulse shadow-lg">
              {totalUnread > 9 ? "9+" : totalUnread}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-80 bg-popover z-50">
        <div className="flex items-center justify-between px-3 py-2 border-b border-border">
          <span className="font-semibold text-foreground">
            {language === "it" ? "Notifiche" : "Notifications"}
          </span>
          {totalUnread > 0 && (
            <button
              onClick={markAllAsRead}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              {language === "it" ? "Segna tutte come lette" : "Mark all read"}
            </button>
          )}
        </div>

        {items.length === 0 ? (
          <div className="px-3 py-8 text-center text-muted-foreground text-sm">
            {language === "it" ? "Nessuna notifica" : "No notifications"}
          </div>
        ) : (
          <div className="max-h-80 overflow-y-auto">
            {items.map((it) => (
              <DropdownMenuItem
                key={it.requestId}
                onClick={() => onItemClick(it)}
                className={cn(
                  "relative flex flex-col items-start px-3 py-3 cursor-pointer",
                  it.unread > 0 && "bg-primary/5"
                )}
              >
                <div className="flex items-center justify-between w-full">
                  <span
                    className={cn(
                      "font-medium text-sm",
                      it.unread > 0 ? "text-foreground" : "text-muted-foreground"
                    )}
                  >
                    {it.title}
                  </span>
                  <span className="text-xs text-muted-foreground">{formatTime(it.at)}</span>
                </div>
                <span className="text-xs text-muted-foreground mt-1 line-clamp-2">
                  {it.description}
                </span>
                {it.unread > 0 && (
                  <div className="mt-2 flex items-center gap-2">
                    <Badge className="bg-primary text-primary-foreground">
                      {it.unread} {language === "it" ? "non lette" : "unread"}
                    </Badge>
                  </div>
                )}
              </DropdownMenuItem>
            ))}
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
