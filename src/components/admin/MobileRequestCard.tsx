import { Calendar, Gauge, Phone, Mail, Euro, MessageSquare, Eye } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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

interface MobileRequestCardProps {
  request: ValuationRequest;
  onUpdateStatus: (id: string, status: string) => void;
}

const statusColors: Record<string, string> = {
  pending: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
  contacted: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  completed: "bg-green-500/10 text-green-600 border-green-500/20",
  rejected: "bg-red-500/10 text-red-600 border-red-500/20",
};

const statusLabels: Record<string, string> = {
  pending: "In attesa",
  contacted: "Contattato",
  completed: "Completato",
  rejected: "Rifiutato",
};

export function MobileRequestCard({ request, onUpdateStatus }: MobileRequestCardProps) {
  const { translateFuelType } = useLanguage();
  
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

  return (
    <Card className="border shadow-sm">
      <CardContent className="p-4 space-y-3">
        {/* Header: Vehicle + Status */}
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <h3 className="font-semibold text-base truncate">
              {request.make} {request.model}
            </h3>
            <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
              <span>{request.year}</span>
              <span>•</span>
              <span>{translateFuelType(request.fuel_type)}</span>
              <span>•</span>
              <span className="flex items-center gap-0.5">
                <Gauge className="w-3 h-3" />
                {request.mileage.toLocaleString("it-IT")} km
              </span>
            </div>
          </div>
          <Badge variant="outline" className={`${statusColors[request.status]} shrink-0 text-xs`}>
            {statusLabels[request.status]}
          </Badge>
        </div>

        {/* Contact Info */}
        <div className="bg-secondary/50 rounded-lg p-3 space-y-2">
          <p className="font-medium text-sm">{request.name}</p>
          <div className="flex flex-col gap-1.5">
            <a 
              href={`tel:${request.phone}`} 
              className="flex items-center gap-2 text-xs text-muted-foreground hover:text-primary transition-colors"
            >
              <Phone className="w-3.5 h-3.5" />
              {request.phone}
            </a>
            <a 
              href={`mailto:${request.email}`} 
              className="flex items-center gap-2 text-xs text-muted-foreground hover:text-primary transition-colors truncate"
            >
              <Mail className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">{request.email}</span>
            </a>
          </div>
        </div>

        {/* Prices Row */}
        <div className="flex items-center justify-between text-sm">
          <div>
            <span className="text-muted-foreground text-xs">Richiesta:</span>
            <p className="font-medium">
              {request.price ? formatCurrency(request.price) : "-"}
            </p>
          </div>
          {request.final_offer && (
            <div className="text-right">
              <span className="text-muted-foreground text-xs">Offerta:</span>
              <p className="font-medium text-primary flex items-center gap-1 justify-end">
                <Euro className="w-3.5 h-3.5" />
                {formatCurrency(request.final_offer)}
              </p>
            </div>
          )}
        </div>

        {/* Date + Notes indicator */}
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" />
            {formatDate(request.created_at)}
          </div>
          {request.admin_notes && (
            <span className="flex items-center gap-1 text-primary">
              <MessageSquare className="w-3.5 h-3.5" />
              Nota
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 pt-2 border-t border-border">
          <Select
            value={request.status}
            onValueChange={(value) => onUpdateStatus(request.id, value)}
          >
            <SelectTrigger className={`flex-1 h-9 text-xs ${statusColors[request.status]}`}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pending">In attesa</SelectItem>
              <SelectItem value="contacted">Contattato</SelectItem>
              <SelectItem value="completed">Completato</SelectItem>
              <SelectItem value="rejected">Rifiutato</SelectItem>
            </SelectContent>
          </Select>
          <Button size="sm" variant="outline" className="gap-2" asChild>
            <Link to={`/admin/requests/${request.id}`}>
              <Eye className="w-4 h-4" />
              Dettagli
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
