import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { ClientChatPanel } from "@/components/ClientChatPanel";
import { 
  Car, 
  Gauge, 
  Fuel, 
  Calendar,
  ChevronRight,
  MessageSquare,
  ImageIcon,
  FileText,
  X,
  Euro,
  Info
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface ValuationRequest {
  id: string;
  created_at: string;
  make: string;
  model: string;
  year: number;
  fuel_type: string;
  mileage: number;
  condition: string;
  name: string;
  email: string;
  phone: string;
  notes: string | null;
  price: number | null;
  estimated_value: number | null;
  final_offer: number | null;
  admin_notes: string | null;
  appointment_date: string | null;
  status: string;
  images: string[];
}

interface ClientRequestCardProps {
  request: ValuationRequest;
  autoOpen?: boolean;
}

const statusColors: Record<string, string> = {
  pending: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
  contacted: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  completed: "bg-green-500/10 text-green-600 border-green-500/20",
  rejected: "bg-red-500/10 text-red-600 border-red-500/20",
};

type DialogTab = "details" | "messages";

export function ClientRequestCard({ request, autoOpen }: ClientRequestCardProps) {
  const { language } = useLanguage();
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [autoOpened, setAutoOpened] = useState(false);
  const [activeTab, setActiveTab] = useState<DialogTab>("details");

  useEffect(() => {
    if (autoOpen && !autoOpened) {
      setDetailOpen(true);
      setAutoOpened(true);
    }
  }, [autoOpen, autoOpened]);

  useEffect(() => {
    if (!detailOpen) {
      setActiveTab("details");
    }
  }, [detailOpen]);

  const statusLabels: Record<string, string> = {
    pending: language === "it" ? "In attesa" : "Pending",
    contacted: language === "it" ? "In revisione" : "Under Review",
    completed: language === "it" ? "Completato" : "Completed",
    rejected: language === "it" ? "Rifiutato" : "Refused",
  };

  const conditionLabels: Record<string, string> = {
    excellent: language === "it" ? "Eccellente" : "Excellent",
    good: language === "it" ? "Buone" : "Good",
    fair: language === "it" ? "Discrete" : "Fair",
    poor: language === "it" ? "Da Rivedere" : "Poor",
  };

  const tabs = [
    { id: "details" as const, label: language === "it" ? "Dettagli" : "Details", icon: Info },
    { id: "messages" as const, label: language === "it" ? "Messaggi" : "Messages", icon: MessageSquare },
  ];

  return (
    <>
      {/* Compact Preview Card */}
      <Card 
        className="overflow-hidden border-border/50 transition-all hover:border-primary/30 cursor-pointer group"
        onClick={() => setDetailOpen(true)}
      >
        <CardContent className="p-4 md:p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                <Car className="w-4 h-4 text-primary" />
              </div>
              <div>
                <h3 className="font-bold">{request.make} {request.model}</h3>
                <p className="text-xs text-muted-foreground">
                  {language === "it" ? "Anno" : "Year"} {request.year} • ID: {request.id.slice(0, 8).toUpperCase()}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge className={`${statusColors[request.status]} px-2 py-0.5 text-xs font-medium`}>
                {statusLabels[request.status]}
              </Badge>
              <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
          </div>

          <div className="grid grid-cols-4 gap-2">
            <div className="p-2 rounded-lg bg-muted/50 text-center">
              <div className="flex items-center justify-center gap-1 mb-0.5">
                <Gauge className="w-3 h-3 text-muted-foreground" />
                <span className="text-[10px] text-muted-foreground">Km</span>
              </div>
              <p className="font-semibold text-xs">{request.mileage.toLocaleString()}</p>
            </div>
            <div className="p-2 rounded-lg bg-muted/50 text-center">
              <div className="flex items-center justify-center gap-1 mb-0.5">
                <Fuel className="w-3 h-3 text-muted-foreground" />
                <span className="text-[10px] text-muted-foreground">{language === "it" ? "Carb." : "Fuel"}</span>
              </div>
              <p className="font-semibold text-xs">{request.fuel_type}</p>
            </div>
            <div className="p-2 rounded-lg bg-muted/50 text-center">
              <div className="flex items-center justify-center gap-1 mb-0.5">
                <Car className="w-3 h-3 text-muted-foreground" />
                <span className="text-[10px] text-muted-foreground">{language === "it" ? "Cond." : "Cond."}</span>
              </div>
              <p className="font-semibold text-xs">{conditionLabels[request.condition]}</p>
            </div>
            <div className="p-2 rounded-lg bg-muted/50 text-center">
              <div className="flex items-center justify-center gap-1 mb-0.5">
                <Calendar className="w-3 h-3 text-muted-foreground" />
                <span className="text-[10px] text-muted-foreground">{language === "it" ? "Data" : "Date"}</span>
              </div>
              <p className="font-semibold text-xs">{new Date(request.created_at).toLocaleDateString(language === "it" ? "it-IT" : "en-US")}</p>
            </div>
          </div>

          {request.final_offer && (
            <div className="mt-3 p-2 rounded-lg bg-green-500/10 border border-green-500/20 flex items-center justify-between">
              <span className="text-xs text-green-600 font-medium">{language === "it" ? "Offerta finale" : "Final offer"}</span>
              <span className="font-bold text-green-600">€{request.final_offer.toLocaleString()}</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Detail Dialog */}
      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="left-0 top-0 translate-x-0 translate-y-0 w-screen max-w-none h-[100dvh] rounded-none sm:left-[50%] sm:top-[50%] sm:translate-x-[-50%] sm:translate-y-[-50%] sm:max-w-3xl sm:h-[85vh] sm:rounded-lg overflow-hidden p-0 gap-0 bg-card border-border [&>button]:hidden !flex !flex-col">
          <DialogTitle className="sr-only">
            {language === "it" ? "Dettagli richiesta" : "Request details"}: {request.make} {request.model}
          </DialogTitle>
          <DialogDescription className="sr-only">
            {language === "it"
              ? "Visualizza i dettagli e i messaggi della richiesta di valutazione."
              : "View request details and messages."}
          </DialogDescription>

          {/* Header with Tabs */}
          <div className="shrink-0 border-b border-border bg-card">
            {/* Title Row */}
            <div className="p-4 sm:p-6 pb-3 sm:pb-4 pt-[calc(1rem+env(safe-area-inset-top))] sm:pt-6">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-primary/10">
                    <Car className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-lg sm:text-xl font-bold">{request.make} {request.model}</h2>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      {language === "it" ? "Anno" : "Year"} {request.year} • ID: {request.id.slice(0, 8).toUpperCase()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={`${statusColors[request.status]} px-3 py-1 hidden sm:flex`}>
                    {statusLabels[request.status]}
                  </Badge>
                  <button
                    onClick={() => setDetailOpen(false)}
                    className="p-2 rounded-lg hover:bg-secondary transition-colors"
                  >
                    <X className="w-5 h-5 text-muted-foreground" />
                  </button>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex px-4 sm:px-6 gap-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-t-lg transition-colors relative",
                    activeTab === tab.id
                      ? "text-primary bg-background"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  )}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                  {activeTab === tab.id && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="flex-1 min-h-0 overflow-hidden">
            {/* Details Tab */}
            {activeTab === "details" && (
              <div className="h-full overflow-y-auto p-4 sm:p-6 space-y-4 sm:space-y-6 pb-[calc(1rem+env(safe-area-inset-bottom))] sm:pb-6">
                {/* Mobile Status Badge */}
                <div className="sm:hidden">
                  <Badge className={`${statusColors[request.status]} px-3 py-1`}>
                    {statusLabels[request.status]}
                  </Badge>
                </div>

                {/* Vehicle Details */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="p-3 rounded-xl bg-muted/50">
                    <div className="flex items-center gap-2 mb-1">
                      <Gauge className="w-4 h-4 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">{language === "it" ? "Chilometraggio" : "Mileage"}</span>
                    </div>
                    <p className="font-bold">{request.mileage.toLocaleString()} km</p>
                  </div>
                  <div className="p-3 rounded-xl bg-muted/50">
                    <div className="flex items-center gap-2 mb-1">
                      <Fuel className="w-4 h-4 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">{language === "it" ? "Carburante" : "Fuel"}</span>
                    </div>
                    <p className="font-bold">{request.fuel_type}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-muted/50">
                    <div className="flex items-center gap-2 mb-1">
                      <Car className="w-4 h-4 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">{language === "it" ? "Condizioni" : "Condition"}</span>
                    </div>
                    <p className="font-bold">{conditionLabels[request.condition]}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-muted/50">
                    <div className="flex items-center gap-2 mb-1">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">{language === "it" ? "Data richiesta" : "Request date"}</span>
                    </div>
                    <p className="font-bold">{new Date(request.created_at).toLocaleDateString(language === "it" ? "it-IT" : "en-US")}</p>
                  </div>
                </div>

                {/* Price/Offer Section */}
                {(request.price || request.final_offer) && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {request.price && (
                      <div className="p-4 rounded-xl bg-muted/30 border">
                        <div className="flex items-center gap-2 mb-1">
                          <Euro className="w-4 h-4 text-muted-foreground" />
                          <p className="text-xs text-muted-foreground">{language === "it" ? "Prezzo richiesto" : "Requested price"}</p>
                        </div>
                        <p className="text-xl font-bold">€{request.price.toLocaleString()}</p>
                      </div>
                    )}
                    {request.final_offer && (
                      <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20">
                        <div className="flex items-center gap-2 mb-1">
                          <Euro className="w-4 h-4 text-green-600" />
                          <p className="text-xs text-green-600">{language === "it" ? "Offerta finale" : "Final offer"}</p>
                        </div>
                        <p className="text-xl font-bold text-green-600">€{request.final_offer.toLocaleString()}</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Notes */}
                {request.notes && (
                  <div className="p-4 rounded-xl bg-muted/30 border">
                    <div className="flex items-center gap-2 mb-2">
                      <FileText className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm font-medium">{language === "it" ? "Note" : "Notes"}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{request.notes}</p>
                  </div>
                )}

                {/* Photos */}
                {request.images && request.images.length > 0 && (
                  <div className="p-4 rounded-xl bg-muted/30 border">
                    <div className="flex items-center gap-2 mb-3">
                      <ImageIcon className="w-4 h-4 text-primary" />
                      <h4 className="font-semibold text-sm">{language === "it" ? "Foto" : "Photos"} ({request.images.length})</h4>
                    </div>
                    <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
                      {request.images.map((image, index) => (
                        <button
                          key={index}
                          onClick={() => setSelectedImage(image)}
                          className="aspect-square rounded-lg overflow-hidden border border-border/50 hover:border-primary/50 transition-colors"
                        >
                          <img 
                            src={image} 
                            alt={`${request.make} ${request.model} - ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Appointment */}
                {request.appointment_date && (
                  <div className="p-4 rounded-xl bg-primary/10 border border-primary/20">
                    <div className="flex items-center gap-3">
                      <Calendar className="w-5 h-5 text-primary" />
                      <div>
                        <p className="text-xs text-muted-foreground">{language === "it" ? "Appuntamento fissato" : "Appointment scheduled"}</p>
                        <p className="font-bold text-primary">
                          {new Date(request.appointment_date).toLocaleDateString(language === "it" ? "it-IT" : "en-US", {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Messages Tab */}
            {activeTab === "messages" && (
              <div className="h-full min-h-0">
                <ClientChatPanel
                  requestId={request.id}
                  requestStatus={request.status}
                />
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Image Lightbox */}
      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-4xl p-0 bg-black/90 border-none">
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors z-10"
          >
            <X className="w-5 h-5 text-white" />
          </button>
          {selectedImage && (
            <img 
              src={selectedImage} 
              alt="Full size"
              className="w-full h-auto max-h-[90vh] object-contain"
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
