import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { MessageThread } from "@/components/MessageThread";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { 
  Car, 
  Gauge, 
  Fuel, 
  Calendar,
  Euro,
  ChevronRight,
  MessageSquare,
  ImageIcon,
  Phone,
  Mail,
  User,
  FileText,
  X
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

export function ClientRequestCard({ request, autoOpen }: ClientRequestCardProps) {
  const { language, translateFuelType } = useLanguage();
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [autoOpened, setAutoOpened] = useState(false);

  useEffect(() => {
    if (autoOpen && !autoOpened) {
      setDetailOpen(true);
      setAutoOpened(true);
    }
  }, [autoOpen, autoOpened]);

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
              <p className="font-semibold text-xs">{translateFuelType(request.fuel_type)}</p>
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
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto p-0 [&>button]:hidden">
          <DialogHeader className="p-6 pb-0 relative">
            <button
              onClick={() => setDetailOpen(false)}
              className="absolute right-4 top-4 z-50 p-2 rounded-full bg-muted/80 hover:bg-muted opacity-80 ring-offset-background transition-all hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none"
            >
              <X className="h-5 w-5" />
              <span className="sr-only">Close</span>
            </button>
            <div className="flex items-start gap-3 pr-12">
              <div className="p-3 rounded-xl bg-primary/10">
                <Car className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 flex-wrap">
                  <DialogTitle className="text-xl font-bold">{request.make} {request.model}</DialogTitle>
                  <Badge className={`${statusColors[request.status]} px-3 py-1 shrink-0`}>
                    {statusLabels[request.status]}
                  </Badge>
                </div>
                <DialogDescription className="text-sm text-muted-foreground">
                  {language === "it" ? "Anno" : "Year"} {request.year} • ID: {request.id.slice(0, 8).toUpperCase()}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="p-6 space-y-6">
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
                <p className="font-bold">{translateFuelType(request.fuel_type)}</p>
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
                    <p className="text-xs text-muted-foreground mb-1">{language === "it" ? "Prezzo richiesto" : "Requested price"}</p>
                    <p className="text-xl font-bold">€{request.price.toLocaleString()}</p>
                  </div>
                )}
                {request.final_offer && (
                  <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20">
                    <p className="text-xs text-green-600 mb-1">{language === "it" ? "Offerta finale" : "Final offer"}</p>
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
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <ImageIcon className="w-4 h-4 text-primary" />
                  <h4 className="font-semibold">{language === "it" ? "Foto" : "Photos"} ({request.images.length})</h4>
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

            <Separator />

            {/* Messages Section */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <MessageSquare className="w-4 h-4 text-primary" />
                <h4 className="font-semibold">{language === "it" ? "Messaggi" : "Messages"}</h4>
              </div>
              <MessageThread 
                requestId={request.id}
                requestStatus={request.status}
                isAdmin={false}
              />
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Image Lightbox */}
      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-4xl p-0 bg-black/90 border-none">
          <DialogTitle className="sr-only">
            {language === "it" ? "Visualizzazione immagine a schermo intero" : "Full screen image view"}
          </DialogTitle>
          <DialogDescription className="sr-only">
            {selectedImage ? `${request.make} ${request.model} - ${language === "it" ? "Immagine" : "Image"}` : ""}
          </DialogDescription>
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