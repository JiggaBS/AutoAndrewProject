import { useParams, useNavigate, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Header } from "@/components/Header";
import { ClientChatPanel } from "@/components/ClientChatPanel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";
import { useState, useEffect } from "react";
import { User } from "@supabase/supabase-js";
import {
  Car,
  Gauge,
  Fuel,
  Calendar,
  Euro,
  FileText,
  ChevronRight,
  ChevronLeft,
  ImageIcon,
  Info,
  MessageSquare,
  X,
  Home,
  Heart,
  User as UserIcon,
  Settings,
  LogOut,
  CheckCircle2,
  XCircle,
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

const statusColors: Record<string, string> = {
  pending: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
  contacted: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  completed: "bg-green-500/10 text-green-600 border-green-500/20",
  rejected: "bg-red-500/10 text-red-600 border-red-500/20",
};

type ActiveTab = "details" | "messages";

export default function ClientRequestDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState<ActiveTab>("details");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [userLoading, setUserLoading] = useState(true);

  // Auth check
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      setUserLoading(false);
      if (!session?.user) {
        navigate("/auth");
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setUserLoading(false);
      if (!session?.user) {
        navigate("/auth");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  const menuItems = [
    { id: "overview", label: language === "it" ? "Panoramica" : "Overview", icon: Home, href: "/dashboard" },
    { id: "favorites", label: language === "it" ? "Preferiti" : "Favorites", icon: Heart, href: "/dashboard" },
    { id: "requests", label: language === "it" ? "Richieste" : "Requests", icon: FileText, href: "/dashboard" },
    { id: "profile", label: language === "it" ? "Profilo" : "Profile", icon: UserIcon, href: "/dashboard" },
    { id: "settings", label: language === "it" ? "Impostazioni" : "Settings", icon: Settings, href: "/dashboard" },
  ];

  const isEmailVerified = user?.email_confirmed_at !== null && user?.email_confirmed_at !== undefined;
  const userName = user?.email?.split('@')[0] || 'Utente';

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

  const { data: request, isLoading, error } = useQuery({
    queryKey: ["client-request", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("valuation_requests")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      return {
        ...data,
        images: Array.isArray(data.images) ? data.images : [],
      } as ValuationRequest;
    },
    enabled: !!id,
  });

  // Sidebar component for reuse
  const ClientSidebar = () => (
    <Card className="sticky top-24 border-border/50">
      <CardContent className="p-4 lg:p-6">
        {/* User Info */}
        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-primary-foreground text-xl font-bold shadow-lg">
            {userName.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-foreground truncate">{userName}</h3>
            <p className="text-sm text-muted-foreground truncate">{user?.email}</p>
            {isEmailVerified ? (
              <Badge variant="outline" className="mt-1 text-xs bg-green-500/10 text-green-600 border-green-500/20">
                <CheckCircle2 className="w-3 h-3 mr-1" />
                {language === "it" ? "Verificato" : "Verified"}
              </Badge>
            ) : (
              <Badge variant="outline" className="mt-1 text-xs bg-yellow-500/10 text-yellow-600 border-yellow-500/20">
                <XCircle className="w-3 h-3 mr-1" />
                {language === "it" ? "Non verificato" : "Not verified"}
              </Badge>
            )}
          </div>
        </div>

        <Separator className="mb-4" />

        {/* Navigation */}
        <nav className="space-y-1">
          {menuItems.map((item) => (
            <Link
              key={item.id}
              to={item.href}
              className={cn(
                "w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all",
                item.id === "requests"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              <div className="flex items-center gap-3">
                <item.icon className="w-4 h-4" />
                <span>{item.label}</span>
              </div>
            </Link>
          ))}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all"
          >
            <LogOut className="w-4 h-4" />
            <span>{language === "it" ? "Esci" : "Logout"}</span>
          </button>
        </nav>
      </CardContent>
    </Card>
  );

  if (userLoading || isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container py-6 lg:py-8 max-w-7xl">
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
            {/* Sidebar */}
            <aside className="lg:w-72 flex-shrink-0 hidden lg:block">
              <Card className="sticky top-24 border-border/50">
                <CardContent className="p-6">
                  <Skeleton className="h-14 w-14 rounded-full mb-4" />
                  <Skeleton className="h-4 w-32 mb-2" />
                  <Skeleton className="h-3 w-48 mb-6" />
                  <Separator className="mb-4" />
                  <div className="space-y-2">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Skeleton key={i} className="h-10 w-full rounded-lg" />
                    ))}
                  </div>
                </CardContent>
              </Card>
            </aside>
            {/* Main Content */}
            <main className="flex-1 min-w-0">
              <Skeleton className="h-10 w-48 mb-6" />
              <Skeleton className="h-64 w-full" />
            </main>
          </div>
        </div>
      </div>
    );
  }

  if (error || !request) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container py-6 lg:py-8 max-w-7xl">
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
            {/* Sidebar */}
            <aside className="lg:w-72 flex-shrink-0 hidden lg:block">
              <ClientSidebar />
            </aside>
            {/* Main Content */}
            <main className="flex-1 min-w-0 text-center py-12">
              <h1 className="text-2xl font-bold mb-4">
                {language === "it" ? "Richiesta non trovata" : "Request not found"}
              </h1>
              <Button onClick={() => navigate("/dashboard")}>
                {language === "it" ? "Torna alla dashboard" : "Back to dashboard"}
              </Button>
            </main>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container py-6 lg:py-8 max-w-7xl">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* Sidebar */}
          <aside className="lg:w-72 flex-shrink-0 hidden lg:block">
            <ClientSidebar />
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            {/* Back button for mobile */}
            <div className="lg:hidden mb-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/dashboard")}
                className="gap-2"
              >
                <ChevronLeft className="w-4 h-4" />
                {language === "it" ? "Torna alla dashboard" : "Back to dashboard"}
              </Button>
            </div>

            {/* Request Card */}
            <Card className="border-border/50 overflow-hidden">
              {/* Header */}
              <div className="border-b border-border bg-card">
                <div className="p-4 sm:p-6 pb-3 sm:pb-4 space-y-3">
                  {/* Breadcrumbs - Desktop only */}
                  <nav className="hidden lg:flex items-center gap-2 text-sm text-muted-foreground">
                    <Link
                      to="/dashboard"
                      className="hover:text-foreground transition-colors"
                    >
                      Dashboard
                    </Link>
                    <ChevronRight className="w-4 h-4" />
                    <span className="text-muted-foreground">
                      {language === "it" ? "Richieste" : "Requests"}
                    </span>
                    <ChevronRight className="w-4 h-4" />
                    <span className="text-foreground font-medium truncate max-w-[150px] sm:max-w-none">
                      {request.make} {request.model}
                    </span>
                  </nav>

                  {/* Title Row */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-3 rounded-xl bg-primary/10">
                        <Car className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h1 className="text-lg sm:text-xl font-bold">{request.make} {request.model}</h1>
                        <p className="text-xs sm:text-sm text-muted-foreground">
                          {language === "it" ? "Anno" : "Year"} {request.year} • ID: {request.id.slice(0, 8).toUpperCase()}
                        </p>
                      </div>
                    </div>
                    <Badge className={`${statusColors[request.status]} px-3 py-1`}>
                      {statusLabels[request.status]}
                    </Badge>
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
              <div className="min-h-[500px]">
            {/* Details Tab */}
            {activeTab === "details" && (
              <div className="h-full overflow-y-auto p-4 sm:p-6 space-y-6">
                
                {/* Top Section: Two Columns on Desktop */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  
                  {/* Left Column: Vehicle Specs (2/3 width) */}
                  <div className="lg:col-span-2 space-y-6">
                    {/* Specs Grid */}
                    <div className="bg-muted/30 rounded-xl p-5 border border-border/50">
                      <h3 className="font-semibold mb-4 flex items-center gap-2">
                        <Car className="w-4 h-4 text-primary" />
                        {language === "it" ? "Dati Veicolo" : "Vehicle Data"}
                      </h3>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-y-6 gap-x-4">
                        <div>
                          <div className="flex items-center gap-1.5 text-muted-foreground mb-1.5">
                            <Gauge className="w-3.5 h-3.5" />
                            <span className="text-xs">{language === "it" ? "Chilometri" : "Mileage"}</span>
                          </div>
                          <p className="font-semibold text-lg">{request.mileage.toLocaleString()} km</p>
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5 text-muted-foreground mb-1.5">
                            <Fuel className="w-3.5 h-3.5" />
                            <span className="text-xs">{language === "it" ? "Carburante" : "Fuel"}</span>
                          </div>
                          <p className="font-semibold text-lg">{request.fuel_type}</p>
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5 text-muted-foreground mb-1.5">
                            <Info className="w-3.5 h-3.5" />
                            <span className="text-xs">{language === "it" ? "Condizioni" : "Condition"}</span>
                          </div>
                          <p className="font-semibold text-lg">{conditionLabels[request.condition]}</p>
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5 text-muted-foreground mb-1.5">
                            <Calendar className="w-3.5 h-3.5" />
                            <span className="text-xs">{language === "it" ? "Immatricolazione" : "Year"}</span>
                          </div>
                          <p className="font-semibold text-lg">{request.year}</p>
                        </div>
                      </div>
                    </div>

                    {/* Photos Gallery */}
                    {request.images && request.images.length > 0 && (
                      <div className="bg-muted/30 rounded-xl p-5 border border-border/50">
                        <h3 className="font-semibold mb-4 flex items-center gap-2">
                          <ImageIcon className="w-4 h-4 text-primary" />
                          {language === "it" ? "Foto" : "Photos"} <span className="text-muted-foreground font-normal">({request.images.length})</span>
                        </h3>
                        <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
                          {request.images.map((image, index) => (
                            <button
                              key={index}
                              onClick={() => setSelectedImage(image)}
                              className="aspect-square rounded-lg overflow-hidden border border-border/50 hover:border-primary/50 transition-all hover:shadow-md group relative"
                            >
                              <img 
                                src={image} 
                                alt={`${request.make} ${request.model} - ${index + 1}`}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                              />
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                    
                     {/* Notes */}
                     {request.notes && (
                      <div className="bg-muted/30 rounded-xl p-5 border border-border/50">
                        <h3 className="font-semibold mb-2 flex items-center gap-2">
                          <FileText className="w-4 h-4 text-primary" />
                          {language === "it" ? "Note Aggiuntive" : "Additional Notes"}
                        </h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">{request.notes}</p>
                      </div>
                    )}
                  </div>

                  {/* Right Column: Status & Offer (1/3 width) */}
                  <div className="space-y-6">
                     {/* Status Card */}
                     <div className="bg-muted/30 rounded-xl p-5 border border-border/50 space-y-4">
                        <h3 className="font-semibold flex items-center gap-2">
                          <Info className="w-4 h-4 text-primary" />
                          {language === "it" ? "Stato Pratica" : "Request Status"}
                        </h3>
                        
                        <div className="flex items-center justify-between p-3 rounded-lg bg-background border border-border/50">
                          <span className="text-sm text-muted-foreground">{language === "it" ? "Data invio" : "Sent date"}</span>
                          <span className="font-medium">{new Date(request.created_at).toLocaleDateString(language === "it" ? "it-IT" : "en-US")}</span>
                        </div>

                        {request.appointment_date && (
                          <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
                            <div className="flex items-start gap-3">
                              <Calendar className="w-5 h-5 text-primary mt-0.5" />
                              <div>
                                <p className="text-xs font-semibold uppercase tracking-wider text-primary/80 mb-1">
                                  {language === "it" ? "Appuntamento" : "Appointment"}
                                </p>
                                <p className="font-bold text-primary text-lg">
                                  {new Date(request.appointment_date).toLocaleDateString(language === "it" ? "it-IT" : "en-US", {
                                    weekday: 'short', day: 'numeric', month: 'long'
                                  })}
                                </p>
                                <p className="text-primary/80">
                                   {new Date(request.appointment_date).toLocaleTimeString(language === "it" ? "it-IT" : "en-US", {
                                    hour: '2-digit', minute: '2-digit'
                                  })}
                                </p>
                              </div>
                            </div>
                          </div>
                        )}
                     </div>

                     {/* Valuation Card */}
                     <div className="bg-muted/30 rounded-xl p-5 border border-border/50 space-y-4">
                        <h3 className="font-semibold flex items-center gap-2">
                          <Euro className="w-4 h-4 text-primary" />
                          {language === "it" ? "Valutazione" : "Valuation"}
                        </h3>

                        <div className="space-y-3">
                          <div className="flex justify-between items-end pb-3 border-b border-border/50">
                            <span className="text-sm text-muted-foreground">{language === "it" ? "Tua richiesta" : "Your request"}</span>
                            <span className="font-semibold text-lg">
                              {request.price ? `€${request.price.toLocaleString()}` : "—"}
                            </span>
                          </div>
                          
                          <div className="pt-1">
                             <span className="text-sm text-muted-foreground block mb-1">{language === "it" ? "Nostra offerta" : "Our offer"}</span>
                             {request.final_offer ? (
                               <div className="text-3xl font-bold text-green-600">
                                 €{request.final_offer.toLocaleString()}
                               </div>
                             ) : (
                               <div className="text-sm italic text-muted-foreground">
                                 {language === "it" ? "In elaborazione..." : "Processing..."}
                               </div>
                             )}
                          </div>
                        </div>
                     </div>
                  </div>

                </div>
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
            </Card>
          </main>
        </div>
      </div>

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
    </div>
  );
}