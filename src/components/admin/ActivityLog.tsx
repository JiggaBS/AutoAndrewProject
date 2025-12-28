import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { Activity, RefreshCw, User, Car, Settings } from "lucide-react";

interface ActivityLogEntry {
  id: string;
  user_id: string;
  action: string;
  entity_type: string;
  entity_id: string;
  details: Record<string, unknown> | null;
  created_at: string;
  read_at: string | null;
}

interface ValuationRequest {
  id: string;
  make: string;
  model: string;
  name: string;
}

const actionLabels: Record<string, { label: string; color: string }> = {
  status_updated: { label: "Stato aggiornato", color: "bg-blue-500/10 text-blue-600" },
  notes_updated: { label: "Note aggiornate", color: "bg-purple-500/10 text-purple-600" },
  offer_updated: { label: "Offerta aggiornata", color: "bg-green-500/10 text-green-600" },
  appointment_set: { label: "Appuntamento fissato", color: "bg-yellow-500/10 text-yellow-600" },
  viewed: { label: "Visualizzato", color: "bg-gray-500/10 text-gray-600" },
};

const statusLabels: Record<string, string> = {
  pending: "In attesa",
  contacted: "Contattato",
  completed: "Completato",
  rejected: "Rifiutato",
};

const entityIcons: Record<string, React.ReactNode> = {
  valuation_request: <Car className="w-4 h-4" />,
  user_role: <User className="w-4 h-4" />,
  settings: <Settings className="w-4 h-4" />,
};

export function ActivityLog() {
  const [logs, setLogs] = useState<ActivityLogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [requestsMap, setRequestsMap] = useState<Record<string, ValuationRequest>>({});

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("activity_log")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(50);

      if (error) throw error;
      const logsData = (data as ActivityLogEntry[]) || [];
      setLogs(logsData);

      // Fetch related valuation requests
      const entityIds = logsData
        .filter(log => log.entity_type === "valuation_request")
        .map(log => log.entity_id);

      if (entityIds.length > 0) {
        const { data: requests } = await supabase
          .from("valuation_requests")
          .select("id, make, model, name")
          .in("id", entityIds);

        if (requests) {
          const map: Record<string, ValuationRequest> = {};
          requests.forEach(req => {
            map[req.id] = req;
          });
          setRequestsMap(map);
        }
      }
    } catch (error) {
      console.error("Error fetching activity logs:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return "Ora";
    if (minutes < 60) return `${minutes} min fa`;
    if (hours < 24) return `${hours} ore fa`;
    if (days < 7) return `${days} giorni fa`;
    
    return date.toLocaleDateString("it-IT", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const getStatusLabel = (status: string) => {
    return statusLabels[status] || status;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-primary" />
              Registro Attività
            </CardTitle>
            <CardDescription>
              Cronologia delle azioni degli admin
            </CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={fetchLogs}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Aggiorna
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="flex gap-3 p-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-3 w-40" />
                </div>
              </div>
            ))}
          </div>
        ) : logs.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <Activity className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Nessuna attività registrata</p>
          </div>
        ) : (
          <div className="space-y-3">
            {logs.map((log) => {
              const actionInfo = actionLabels[log.action] || { label: log.action, color: "bg-muted" };
              const request = requestsMap[log.entity_id];
              
              return (
                <div key={log.id} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                  <div className="p-2 rounded-full bg-background">
                    {entityIcons[log.entity_type] || <Activity className="w-4 h-4" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge className={actionInfo.color}>{actionInfo.label}</Badge>
                      {log.details?.status && (
                        <span className="text-sm font-medium text-foreground">
                          → {getStatusLabel(log.details.status)}
                        </span>
                      )}
                    </div>
                    {request ? (
                      <p className="text-sm text-muted-foreground mt-1">
                        {request.make} {request.model} • {request.name}
                      </p>
                    ) : (
                      <p className="text-xs text-muted-foreground mt-1">
                        ID: {log.entity_id.slice(0, 8)}...
                      </p>
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    {formatDate(log.created_at)}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
