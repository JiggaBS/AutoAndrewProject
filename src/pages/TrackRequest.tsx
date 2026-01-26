import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/home/Footer";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import {
  Search,
  Car,
  Euro,
  Calendar,
  MessageSquare,
  Clock,
  CheckCircle2,
  XCircle,
  Loader2,
  Hash,
} from "lucide-react";

interface ValuationRequest {
  id: string;
  created_at: string;
  make: string;
  model: string;
  year: number;
  fuel_type: string;
  mileage: number;
  condition: string;
  status: string;
  final_offer: number | null;
  appointment_date: string | null;
  admin_notes: string | null;
  name: string;
}

const statusConfig: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  pending: {
    label: "In Valutazione",
    color: "bg-yellow-500/20 text-yellow-500 border-yellow-500/30",
    icon: <Clock className="w-4 h-4" />,
  },
  contacted: {
    label: "Ti Abbiamo Contattato",
    color: "bg-blue-500/20 text-blue-500 border-blue-500/30",
    icon: <MessageSquare className="w-4 h-4" />,
  },
  completed: {
    label: "Completato",
    color: "bg-green-500/20 text-green-500 border-green-500/30",
    icon: <CheckCircle2 className="w-4 h-4" />,
  },
  rejected: {
    label: "Non Disponibile",
    color: "bg-red-500/20 text-red-500 border-red-500/30",
    icon: <XCircle className="w-4 h-4" />,
  },
};

const conditionLabels: Record<string, string> = {
  excellent: "Ottime condizioni",
  good: "Buone condizioni",
  fair: "Condizioni discrete",
  poor: "Da revisionare",
};

export default function TrackRequest() {
  const [trackingCode, setTrackingCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [request, setRequest] = useState<ValuationRequest | null>(null);
  const [notFound, setNotFound] = useState(false);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("it-IT", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("it-IT", {
      style: "currency",
      currency: "EUR",
      maximumFractionDigits: 0,
    }).format(value);
  };

  const handleSearch = async () => {
    if (!trackingCode.trim()) {
      toast({ title: "Inserisci il codice pratica", variant: "destructive" });
      return;
    }

    setIsLoading(true);
    setNotFound(false);
    setRequest(null);

    try {
      // Search by the first 8 characters of the UUID (tracking code)
      const searchPattern = trackingCode.trim().toLowerCase();
      
      // Fetch all and filter client-side since UUID column doesn't support ILIKE
      const { data: allData, error } = await supabase
        .from("valuation_requests")
        .select("id, created_at, make, model, year, fuel_type, mileage, condition, status, final_offer, appointment_date, admin_notes, name");
      
      if (error) throw error;
      
      // Find the request that starts with the tracking code
      const data = allData?.find(r => r.id.toLowerCase().startsWith(searchPattern)) || null;

      if (!data) {
        setNotFound(true);
      } else {
        setRequest(data);
      }
    } catch (error) {
      console.error("Error fetching request:", error);
      toast({
        title: "Errore",
        description: "Si è verificato un errore durante la ricerca. Riprova.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SEO
        title="Traccia la Tua Richiesta"
        description="Controlla lo stato della tua richiesta di valutazione auto inserendo il codice pratica."
        url="/traccia-richiesta"
      />
      <Header />

      <main className="flex-1 container max-w-2xl mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-display font-bold mb-3">
            Traccia la Tua Richiesta
          </h1>
          <p className="text-muted-foreground">
            Inserisci il codice pratica che hai ricevuto per controllare lo stato della tua valutazione.
          </p>
        </div>

        {/* Search Box */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  placeholder="Es. D82D25AA"
                  value={trackingCode}
                  onChange={(e) => setTrackingCode(e.target.value.toUpperCase())}
                  onKeyPress={handleKeyPress}
                  className="pl-10 h-12 text-lg font-mono tracking-wider uppercase"
                  maxLength={8}
                />
              </div>
              <Button
                onClick={handleSearch}
                disabled={isLoading}
                className="h-12 px-8 gap-2"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Search className="w-5 h-5" />
                )}
                Cerca
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Not Found */}
        {notFound && (
          <Card className="border-destructive/50 bg-destructive/5">
            <CardContent className="pt-6 text-center">
              <XCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Pratica Non Trovata</h3>
              <p className="text-muted-foreground">
                Verifica di aver inserito correttamente il codice pratica.
                Il codice è composto da 8 caratteri alfanumerici.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Request Details */}
        {request && (
          <Card>
            <CardHeader className="pb-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center">
                    <Car className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">
                      {request.make} {request.model}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Anno {request.year} • {request.mileage.toLocaleString("it-IT")} km
                    </p>
                  </div>
                </div>
                <Badge
                  className={`${statusConfig[request.status]?.color || ""} border px-3 py-1.5 gap-2 w-fit`}
                >
                  {statusConfig[request.status]?.icon}
                  {statusConfig[request.status]?.label || request.status}
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Request Info */}
              <div className="p-4 rounded-xl bg-secondary/30 border border-border">
                <p className="text-sm text-muted-foreground mb-1">Richiesta inviata il</p>
                <p className="font-medium">{formatDate(request.created_at)}</p>
                <p className="text-sm text-muted-foreground mt-3 mb-1">Condizioni dichiarate</p>
                <p className="font-medium">{conditionLabels[request.condition] || request.condition}</p>
              </div>

              {/* Admin Offer */}
              {request.final_offer && (
                <>
                  <Separator />
                  <div className="p-5 rounded-xl bg-primary/5 border border-primary/20">
                    <div className="flex items-center gap-2 text-primary mb-3">
                      <Euro className="w-5 h-5" />
                      <span className="font-medium">La Nostra Offerta</span>
                    </div>
                    <p className="text-3xl font-display font-bold text-primary">
                      {formatCurrency(request.final_offer)}
                    </p>
                  </div>
                </>
              )}

              {/* Appointment */}
              {request.appointment_date && (
                <div className="p-5 rounded-xl bg-secondary/50 border border-border">
                  <div className="flex items-center gap-2 text-muted-foreground mb-3">
                    <Calendar className="w-5 h-5" />
                    <span className="font-medium">Appuntamento Fissato</span>
                  </div>
                  <p className="text-xl font-semibold">
                    {formatDate(request.appointment_date)}
                  </p>
                </div>
              )}

              {/* Message from Admin */}
              {request.admin_notes && (
                <div className="p-5 rounded-xl bg-secondary/50 border border-border">
                  <div className="flex items-center gap-2 text-muted-foreground mb-3">
                    <MessageSquare className="w-5 h-5" />
                    <span className="font-medium">Messaggio dal Concessionario</span>
                  </div>
                  <p className="text-foreground whitespace-pre-wrap">{request.admin_notes}</p>
                </div>
              )}

              {/* Status-specific messages */}
              {request.status === "pending" && !request.final_offer && (
                <div className="p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/20 text-center">
                  <Clock className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">
                    La tua richiesta è in fase di valutazione.
                    Ti contatteremo presto con la nostra offerta.
                  </p>
                </div>
              )}

              {request.status === "completed" && (
                <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-center">
                  <CheckCircle2 className="w-8 h-8 text-green-500 mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">
                    Grazie per aver scelto AutoAndrew!
                    La pratica è stata completata con successo.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </main>

      <Footer />
    </div>
  );
}
