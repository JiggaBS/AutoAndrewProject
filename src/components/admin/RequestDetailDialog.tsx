import { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase";
import { AdminChatPanel } from "./AdminChatPanel";
import { 
  Eye, 
  Car, 
  Phone, 
  Mail, 
  Image as ImageIcon, 
  Euro, 
  Calendar,
  MessageSquare,
  Save,
  Hash,
  Gauge,
  Fuel,
  Star,
  X,
  ChevronLeft,
  ChevronRight,
  Copy,
  Check,
  FileText
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface ValuationRequest {
  id: string;
  created_at: string;
  make: string;
  model: string;
  year: number;
  fuel_type: string;
  mileage: number;
  condition: string;
  price: number | null;
  name: string;
  email: string;
  phone: string;
  notes: string | null;
  estimated_value: number | null;
  final_offer: number | null;
  admin_notes: string | null;
  appointment_date: string | null;
  status: string;
  images: string[];
}

interface RequestDetailDialogProps {
  request: ValuationRequest;
  onUpdateStatus: (id: string, status: string) => void;
  onUpdateRequest: (id: string, updates: Partial<ValuationRequest>) => void;
  autoOpen?: boolean;
}

const conditionLabels: Record<string, string> = {
  excellent: "Ottime",
  good: "Buone",
  fair: "Discrete",
  poor: "Da revisionare",
};

const statusColors: Record<string, string> = {
  pending: "bg-yellow-500/20 text-yellow-500 border-yellow-500/30",
  contacted: "bg-blue-500/20 text-blue-500 border-blue-500/30",
  completed: "bg-green-500/20 text-green-500 border-green-500/30",
  rejected: "bg-red-500/20 text-red-500 border-red-500/30",
};

export function RequestDetailDialog({ request, onUpdateStatus, onUpdateRequest, autoOpen }: RequestDetailDialogProps) {
  const [finalOffer, setFinalOffer] = useState<string>(request.final_offer?.toString() || "");
  const [appointmentDate, setAppointmentDate] = useState<string>(
    request.appointment_date ? new Date(request.appointment_date).toISOString().slice(0, 16) : ""
  );
  const [isSaving, setIsSaving] = useState(false);
  const [copied, setCopied] = useState(false);
  const [expandedImageIndex, setExpandedImageIndex] = useState<number | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState("details");

  const minSwipeDistance = 50;

  useEffect(() => {
    if (autoOpen) setDialogOpen(true);
  }, [autoOpen]);

  useEffect(() => {
    if (!dialogOpen) {
      setExpandedImageIndex(null);
      setActiveTab("details");
    }
  }, [dialogOpen]);

  const goToPreviousImage = useCallback(() => {
    if (expandedImageIndex === null || !request.images) return;
    setExpandedImageIndex(expandedImageIndex === 0 ? request.images.length - 1 : expandedImageIndex - 1);
  }, [expandedImageIndex, request.images]);

  const goToNextImage = useCallback(() => {
    if (expandedImageIndex === null || !request.images) return;
    setExpandedImageIndex(expandedImageIndex === request.images.length - 1 ? 0 : expandedImageIndex + 1);
  }, [expandedImageIndex, request.images]);

  useEffect(() => {
    if (expandedImageIndex === null) return;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setExpandedImageIndex(null);
      } else if (e.key === 'ArrowLeft') {
        goToPreviousImage();
      } else if (e.key === 'ArrowRight') {
        goToNextImage();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [expandedImageIndex, goToPreviousImage, goToNextImage]);

  const closeLightbox = () => {
    setExpandedImageIndex(null);
  };

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    
    if (isLeftSwipe) {
      goToNextImage();
    } else if (isRightSwipe) {
      goToPreviousImage();
    }
    
    setTouchStart(null);
    setTouchEnd(null);
  };

  const trackingCode = request.id.slice(0, 8).toUpperCase();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("it-IT", {
      day: "2-digit",
      month: "2-digit",
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

  const handleSave = async () => {
    setIsSaving(true);
    const updates: Partial<ValuationRequest> = {
      final_offer: finalOffer ? parseInt(finalOffer) : null,
      appointment_date: appointmentDate ? new Date(appointmentDate).toISOString() : null,
    };
    await onUpdateRequest(request.id, updates);

    const hasUpdates = finalOffer || appointmentDate;
    if (hasUpdates) {
      // Build the in-app message text
      const messageParts: string[] = [];
      
      if (finalOffer) {
        const offerFormatted = new Intl.NumberFormat("it-IT", {
          style: "currency",
          currency: "EUR",
          maximumFractionDigits: 0,
        }).format(parseInt(finalOffer));
        messageParts.push(`💰 La nostra offerta: ${offerFormatted}`);
      }
      
      if (appointmentDate) {
        const dateFormatted = new Date(appointmentDate).toLocaleString("it-IT", {
          weekday: "long",
          day: "2-digit",
          month: "long",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        });
        messageParts.push(`📅 Appuntamento fissato: ${dateFormatted}`);
      }

      // Send in-app system message
      try {
        const systemMessage = messageParts.join("\n\n");
        await supabase.rpc("insert_system_message", {
          p_request_id: request.id,
          p_body: systemMessage,
        });
      } catch (msgError) {
        console.error("Failed to send in-app message:", msgError);
      }

      // Send email notification
      try {
        const { error } = await supabase.functions.invoke("notify-client", {
          body: {
            request_id: request.id,
            client_email: request.email,
            client_name: request.name,
            vehicle: `${request.make} ${request.model} ${request.year}`,
            tracking_code: trackingCode,
            final_offer: finalOffer ? parseInt(finalOffer) : null,
            appointment_date: appointmentDate ? new Date(appointmentDate).toISOString() : null,
            message: null,
            site_url: window.location.origin,
          },
        });

        if (error) {
          console.error("Failed to send notification email:", error);
          toast({
            title: "Salvato e Notificato",
            description: "Messaggio inviato al cliente, ma l'email non è stata inviata.",
            variant: "default",
          });
        } else {
          toast({
            title: "Salvato e Notificato",
            description: `Messaggio inviato al cliente ed email inviata a ${request.email}`,
          });
        }
      } catch (emailError) {
        console.error("Email notification error:", emailError);
        toast({
          title: "Salvato e Notificato",
          description: "Messaggio inviato al cliente",
        });
      }
    } else {
      toast({
        title: "Salvato",
        description: "Modifiche salvate con successo",
      });
    }

    setIsSaving(false);
  };

  const openWhatsApp = () => {
    const phone = request.phone.replace(/\D/g, "");
    const message = encodeURIComponent(
      `Buongiorno ${request.name}, la contattiamo riguardo alla valutazione della sua ${request.make} ${request.model} (Pratica #${trackingCode}). Quando possiamo sentirci?`
    );
    window.open(`https://wa.me/39${phone}?text=${message}`, "_blank");
  };

  const copyTrackingCode = () => {
    navigator.clipboard.writeText(trackingCode);
    setCopied(true);
    toast({ title: "Codice copiato!", description: `#${trackingCode}` });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" className="gap-2">
          <Eye className="w-4 h-4" />
          Dettagli
        </Button>
      </DialogTrigger>
      <DialogContent className="left-0 top-0 translate-x-0 translate-y-0 w-screen max-w-none h-[100dvh] rounded-none sm:left-[50%] sm:top-[50%] sm:translate-x-[-50%] sm:translate-y-[-50%] sm:max-w-2xl sm:h-[85vh] sm:rounded-lg overflow-hidden sm:overflow-y-auto sm:overflow-x-hidden p-0 gap-0 bg-card border-0 sm:border sm:border-border ring-0 outline-none focus:ring-0 focus:outline-none focus-visible:ring-0 focus-visible:outline-none [&>button]:hidden !flex !flex-col">
        {/* Mobile: Show chat fullscreen when messages tab is active */}
        {activeTab === "messages" && (
          <div className="flex flex-col h-full sm:hidden">
            {/* Mobile Chat Header */}
            <div className="flex items-center gap-3 p-4 border-b border-border bg-card shrink-0 safe-area-top">
              <button
                onClick={() => setActiveTab("details")}
                className="p-2 -ml-2 rounded-lg hover:bg-secondary transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <div className="flex-1 min-w-0">
                <h2 className="font-semibold truncate">{request.make} {request.model}</h2>
                <p className="text-xs text-muted-foreground">Chat con {request.name}</p>
              </div>
              <button
                onClick={() => setDialogOpen(false)}
                className="p-2 rounded-lg hover:bg-secondary transition-colors"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>
            
            {/* Mobile Chat Content - Full height */}
            <div className="flex-1 min-h-0">
              <AdminChatPanel
                requestId={request.id}
                requestStatus={request.status}
                clientName={request.name}
              />
            </div>
          </div>
        )}

        {/* Desktop layout and mobile non-messages tabs */}
        <div className={cn(
          "flex flex-col h-full min-h-0 overflow-hidden sm:h-auto sm:overflow-visible",
          activeTab === "messages" && "hidden sm:flex"
        )}>
          {/* Header */}
          <div className="p-4 sm:p-6 pb-3 sm:pb-4 pt-[calc(1rem+env(safe-area-inset-top))] sm:pt-6 shrink-0">
            <div className="flex items-start gap-3 sm:gap-4">
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-secondary flex items-center justify-center shrink-0">
                <Car className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
              </div>
              <div className="min-w-0 flex-1 pr-10">
                <h2 className="text-lg sm:text-xl font-display font-bold truncate">
                  {request.make} {request.model}
                </h2>
                <p className="text-xs sm:text-sm text-muted-foreground truncate">
                  Anno {request.year} • Richiesta del {formatDate(request.created_at)}
                </p>
              </div>
              <button
                onClick={() => setDialogOpen(false)}
                className="absolute right-3 top-[calc(0.75rem+env(safe-area-inset-top))] sm:right-4 sm:top-4 p-2 rounded-lg hover:bg-secondary transition-colors"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>

            {/* Tracking Code + Status */}
            <div className="mt-3 sm:mt-4 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
              <button
                onClick={copyTrackingCode}
                className="w-full sm:w-auto inline-flex items-center gap-2 px-3 py-2 bg-secondary/80 rounded-lg text-sm hover:bg-secondary transition-colors justify-between sm:justify-start"
              >
                <span className="inline-flex items-center gap-2 min-w-0">
                  <Hash className="w-4 h-4 text-muted-foreground shrink-0" />
                  <span className="font-mono font-bold tracking-wider">{trackingCode}</span>
                </span>
                {copied ? (
                  <Check className="w-4 h-4 text-green-500 shrink-0" />
                ) : (
                  <Copy className="w-4 h-4 text-muted-foreground shrink-0" />
                )}
              </button>
              <Select 
                value={request.status} 
                onValueChange={(value) => onUpdateStatus(request.id, value)}
              >
                <SelectTrigger className={cn(
                  "w-full sm:w-[180px] h-9 border rounded-lg font-medium",
                  statusColors[request.status]
                )}>
                  <SelectValue placeholder="Stato" />
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
                  <SelectItem value="pending" className="cursor-pointer">
                    <span className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-yellow-500" />
                      In attesa
                    </span>
                  </SelectItem>
                  <SelectItem value="contacted" className="cursor-pointer">
                    <span className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-blue-500" />
                      Contattato
                    </span>
                  </SelectItem>
                  <SelectItem value="completed" className="cursor-pointer">
                    <span className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-green-500" />
                      Completato
                    </span>
                  </SelectItem>
                  <SelectItem value="rejected" className="cursor-pointer">
                    <span className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-red-500" />
                      Rifiutato
                    </span>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Main Content - Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col min-h-0 px-4 sm:px-6 sm:flex-none">
            <TabsList className="grid w-full grid-cols-2 shrink-0">
              <TabsTrigger value="details" className="gap-2">
                <FileText className="w-4 h-4" />
                Gestione
              </TabsTrigger>
              <TabsTrigger value="messages" className="gap-2">
                <MessageSquare className="w-4 h-4" />
                Messaggi
              </TabsTrigger>
            </TabsList>

            {/* Details Tab - Scrollable */}
            <TabsContent value="details" className="mt-4 pb-[calc(1rem+env(safe-area-inset-bottom))] sm:pb-6 space-y-4 flex-1 min-h-0 overflow-y-auto overscroll-contain touch-pan-y [-webkit-overflow-scrolling:touch] sm:flex-none sm:overflow-visible">
              {/* Vehicle Stats Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 sm:p-4 rounded-xl bg-secondary/50 border border-border">
                  <div className="flex items-center gap-1.5 text-muted-foreground mb-2">
                    <Gauge className="w-3.5 h-3.5" />
                    <span className="text-xs">Chilometri</span>
                  </div>
                  <p className="text-base sm:text-lg font-bold">{request.mileage.toLocaleString("it-IT")} km</p>
                </div>
                <div className="p-3 sm:p-4 rounded-xl bg-secondary/50 border border-border">
                  <div className="flex items-center gap-1.5 text-muted-foreground mb-2">
                    <Fuel className="w-3.5 h-3.5" />
                    <span className="text-xs">Carburante</span>
                  </div>
                  <p className="text-base sm:text-lg font-bold truncate">{request.fuel_type}</p>
                </div>
                <div className="p-3 sm:p-4 rounded-xl bg-secondary/50 border border-border">
                  <div className="flex items-center gap-1.5 text-muted-foreground mb-2">
                    <Star className="w-3.5 h-3.5" />
                    <span className="text-xs">Condizioni</span>
                  </div>
                  <p className="text-base sm:text-lg font-bold truncate">{conditionLabels[request.condition] || request.condition}</p>
                </div>
                <div className="p-3 sm:p-4 rounded-xl bg-secondary/50 border border-border">
                  <div className="flex items-center gap-1.5 text-muted-foreground mb-2">
                    <Calendar className="w-3.5 h-3.5" />
                    <span className="text-xs">Anno</span>
                  </div>
                  <p className="text-base sm:text-lg font-bold">{request.year}</p>
                </div>
              </div>

              {/* Pricing Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-4 sm:p-5 rounded-xl bg-secondary/30 border border-border">
                  <div className="flex items-center gap-2 text-muted-foreground mb-2">
                    <Euro className="w-4 h-4" />
                    <span className="text-sm">Prezzo Richiesto</span>
                  </div>
                  <p className="text-xl sm:text-2xl font-display font-bold">
                    {request.price ? formatCurrency(request.price) : "—"}
                  </p>
                </div>
                <div className="p-4 sm:p-5 rounded-xl bg-primary/5 border border-primary/20">
                  <div className="flex items-center gap-2 text-primary mb-2">
                    <Euro className="w-4 h-4" />
                    <span className="text-sm">Offerta Finale</span>
                  </div>
                  {request.final_offer ? (
                    <p className="text-xl sm:text-2xl font-display font-bold text-primary">
                      {formatCurrency(request.final_offer)}
                    </p>
                  ) : (
                    <div className="h-1 w-8 bg-primary/40 rounded-full mt-3" />
                  )}
                </div>
              </div>

              {/* Contact Info */}
              <div className="p-4 sm:p-5 rounded-xl bg-secondary/30 border border-border">
                <div className="flex items-center gap-2 text-muted-foreground mb-4">
                  <Mail className="w-4 h-4" />
                  <span className="text-sm font-medium">Informazioni Contatto</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                  <div className="min-w-0">
                    <p className="text-lg sm:text-xl font-bold mb-2 truncate">{request.name}</p>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-muted-foreground">
                      <a href={`tel:${request.phone}`} className="flex items-center gap-1.5 hover:text-foreground transition-colors">
                        <Phone className="w-4 h-4 shrink-0" />
                        <span className="break-all">{request.phone}</span>
                      </a>
                      <a href={`mailto:${request.email}`} className="flex items-center gap-1.5 hover:text-foreground transition-colors min-w-0">
                        <Mail className="w-4 h-4 shrink-0" />
                        <span className="break-all">{request.email}</span>
                      </a>
                    </div>
                  </div>
                  <Button
                    className="bg-green-600 hover:bg-green-700 text-white rounded-lg gap-2 w-full sm:w-auto shrink-0"
                    onClick={openWhatsApp}
                  >
                    <MessageSquare className="w-4 h-4" />
                    WhatsApp
                  </Button>
                </div>
                {request.notes && (
                  <div className="mt-4 p-4 rounded-lg bg-background/50 border border-border">
                    <p className="text-xs text-muted-foreground mb-1">Note del cliente</p>
                    <p className="text-sm break-words">{request.notes}</p>
                  </div>
                )}
              </div>

              {/* Photos */}
              {request.images && request.images.length > 0 && (
                <div className="p-4 rounded-xl bg-secondary/30 border border-border">
                  <div className="flex items-center gap-2 text-muted-foreground mb-3">
                    <ImageIcon className="w-4 h-4" />
                    <span className="text-sm font-medium">Foto ({request.images.length})</span>
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    {request.images.slice(0, 4).map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setExpandedImageIndex(idx)}
                        className="relative aspect-square overflow-hidden rounded-lg border-2 border-border hover:border-primary/50 transition-all group"
                      >
                        <img src={img} alt={`Foto ${idx + 1}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                          <Eye className="w-4 h-4 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        {idx === 3 && request.images.length > 4 && (
                          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                            <span className="text-white font-bold text-lg">+{request.images.length - 4}</span>
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Admin Fields */}
              <div className="p-4 rounded-xl bg-secondary/30 border border-border space-y-4">
                <h4 className="font-medium text-sm flex items-center gap-2">
                  <FileText className="w-4 h-4 text-primary" />
                  Gestione Pratica
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="finalOffer" className="text-xs text-muted-foreground flex items-center gap-1.5">
                      <Euro className="w-3.5 h-3.5 text-primary" />
                      La Mia Offerta (€)
                    </Label>
                    <Input
                      id="finalOffer"
                      type="number"
                      placeholder="Es. 15000"
                      value={finalOffer}
                      onChange={(e) => setFinalOffer(e.target.value)}
                      className="h-11 bg-secondary/50 border-border"
                    />
                    <p className="text-xs text-muted-foreground">L'offerta che proponi al cliente.</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="appointmentDate" className="text-xs text-muted-foreground flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-primary" />
                      Data Appuntamento
                    </Label>
                    <Input
                      id="appointmentDate"
                      type="datetime-local"
                      value={appointmentDate}
                      onChange={(e) => setAppointmentDate(e.target.value)}
                      className="h-11 bg-secondary/50 border-border"
                    />
                    <p className="text-xs text-muted-foreground">Quando vuoi incontrare il cliente.</p>
                  </div>
                </div>
                <div className="flex justify-end pt-2">
                  <Button variant="outline" onClick={handleSave} disabled={isSaving} className="gap-2">
                    <Save className="w-4 h-4" />
                    {isSaving ? "Salvataggio..." : "Salva Modifiche"}
                  </Button>
                </div>
              </div>
            </TabsContent>

            {/* Messages Tab - Desktop Only (mobile uses fullscreen) */}
            <TabsContent value="messages" className="hidden sm:flex flex-col mt-4 pb-6 h-[60vh] min-h-[420px]">
              <div className="flex-1 min-h-0 rounded-xl border border-border overflow-hidden">
                <AdminChatPanel
                  requestId={request.id}
                  requestStatus={request.status}
                  clientName={request.name}
                />
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Lightbox */}
        {expandedImageIndex !== null && request.images && createPortal(
          <div className="fixed inset-0 z-[99999] bg-black" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}>
            <div className="absolute inset-0" onClick={closeLightbox} />
            <div className="relative w-full h-full flex flex-col pointer-events-none">
              <div className="absolute top-0 left-0 right-0 flex items-center justify-between p-6 bg-gradient-to-b from-black/80 to-transparent z-20 pointer-events-auto">
                <div className="text-white">
                  <p className="text-xl font-semibold">{request.make} {request.model}</p>
                  <p className="text-sm text-white/70">Foto {expandedImageIndex + 1} di {request.images.length}</p>
                </div>
                <button
                  type="button"
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); closeLightbox(); }}
                  className="p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
                >
                  <X className="w-8 h-8 text-white" />
                </button>
              </div>
              <div 
                className="flex-1 flex items-center justify-center p-4 pt-24 pb-36 pointer-events-auto"
                onTouchStart={onTouchStart}
                onTouchMove={onTouchMove}
                onTouchEnd={onTouchEnd}
              >
                <img
                  src={request.images[expandedImageIndex]}
                  alt={`Foto ${expandedImageIndex + 1}`}
                  className="max-w-[95vw] max-h-[calc(100vh-200px)] w-auto h-auto object-contain pointer-events-none select-none"
                  draggable={false}
                />
              </div>
              {request.images.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); goToPreviousImage(); }}
                    className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 p-2 sm:p-3 bg-white/10 hover:bg-white/30 rounded-full transition-colors z-30 pointer-events-auto"
                  >
                    <ChevronLeft className="w-5 h-5 sm:w-8 sm:h-8 text-white" />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); goToNextImage(); }}
                    className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 p-2 sm:p-3 bg-white/10 hover:bg-white/30 rounded-full transition-colors z-30 pointer-events-auto"
                  >
                    <ChevronRight className="w-5 h-5 sm:w-8 sm:h-8 text-white" />
                  </button>
                </>
              )}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-6 z-20 pointer-events-auto">
                <div className="flex justify-center gap-3 overflow-x-auto py-2">
                  {request.images.map((img, idx) => (
                    <button
                      type="button"
                      key={idx}
                      onClick={(e) => { e.preventDefault(); e.stopPropagation(); setExpandedImageIndex(idx); }}
                      className={cn(
                        "shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all",
                        expandedImageIndex === idx
                          ? "border-white ring-2 ring-white/50 scale-110"
                          : "border-white/30 opacity-50 hover:opacity-100 hover:border-white/60"
                      )}
                    >
                      <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>,
          document.body
        )}
      </DialogContent>
    </Dialog>
  );
}