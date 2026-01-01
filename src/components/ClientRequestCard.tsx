import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Car, 
  Gauge, 
  Fuel, 
  Calendar,
  ChevronRight
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
}

const statusColors: Record<string, string> = {
  pending: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
  contacted: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  completed: "bg-green-500/10 text-green-600 border-green-500/20",
  rejected: "bg-red-500/10 text-red-600 border-red-500/20",
};

export function ClientRequestCard({ request }: ClientRequestCardProps) {
  const { language } = useLanguage();

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
    <Link to={`/dashboard/requests/${request.id}`}>
      <Card className="overflow-hidden border-border/50 transition-all hover:border-primary/30 cursor-pointer group">
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
    </Link>
  );
}
