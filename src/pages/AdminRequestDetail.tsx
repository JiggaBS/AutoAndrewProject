import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { AdminChatPanel } from "@/components/admin/AdminChatPanel";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { MobileBottomNav } from "@/components/admin/MobileBottomNav";
import { ImageLightbox } from "@/features/messages/components/ImageLightbox";
import {
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
  ChevronLeft,
  Copy,
  Check,
  FileText,
  Eye,
  Loader2,
  Menu,
  X,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { User, Session } from "@supabase/supabase-js";

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

const statusLabels: Record<string, string> = {
  pending: "In attesa",
  contacted: "Contattato",
  completed: "Completato",
  rejected: "Rifiutato",
};

export default function AdminRequestDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [checkingRole, setCheckingRole] = useState(true);

  const [request, setRequest] = useState<ValuationRequest | null>(null);
  const [loadingRequest, setLoadingRequest] = useState(true);

  const [finalOffer, setFinalOffer] = useState<string>("");
  const [appointmentDate, setAppointmentDate] = useState<string>("");
  const [isSaving, setIsSaving] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState("details");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  const handleSidebarTabChange = (tab: string) => {
    navigate(`/admin?tab=${tab}`);
  };

  // Auth check
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
      if (!session?.user) {
        navigate("/auth");
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
      if (!session?.user) {
        navigate("/auth");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  // Role check
  useEffect(() => {
    if (user) {
      checkAdminRole();
    }
  }, [user]);

  const checkAdminRole = async () => {
    setCheckingRole(true);
    try {
      const { data, error } = await supabase.rpc("has_role", {
        _user_id: user!.id,
        _role: "admin",
      });

      if (error) throw error;
      setIsAdmin(data === true);

      if (!data) {
        toast({
          title: "Accesso negato",
          description: "Non hai i permessi di amministratore",
          variant: "destructive",
        });
        navigate("/admin");
      }
    } catch (error: unknown) {
      console.error("Role check error:", error);
      setIsAdmin(false);
      navigate("/admin");
    } finally {
      setCheckingRole(false);
    }
  };

  // Fetch request
  useEffect(() => {
    if (isAdmin && id) {
      fetchRequest();
    }
  }, [isAdmin, id]);

  const fetchRequest = async () => {
    if (!id) return;
    setLoadingRequest(true);
    try {
      const { data, error } = await supabase
        .from("valuation_requests")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;

      const rawImages = data.images;
      const images: string[] = Array.isArray(rawImages)
        ? rawImages.filter((img): img is string => typeof img === "string")
        : [];

      const typedData: ValuationRequest = {
        ...data,
        images,
      };

      setRequest(typedData);
      setFinalOffer(typedData.final_offer?.toString() || "");
      setAppointmentDate(
        typedData.appointment_date
          ? new Date(typedData.appointment_date).toISOString().slice(0, 16)
          : ""
      );
    } catch (error: unknown) {
      console.error("Fetch request error:", error);
      toast({
        title: "Errore",
        description: "Impossibile caricare la richiesta",
        variant: "destructive",
      });
      navigate("/admin");
    } finally {
      setLoadingRequest(false);
    }
  };

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

  const trackingCode = request?.id.slice(0, 8).toUpperCase() || "";

  const copyTrackingCode = () => {
    navigator.clipboard.writeText(trackingCode);
    setCopied(true);
    toast({ title: "Codice copiato!", description: `#${trackingCode}` });
    setTimeout(() => setCopied(false), 2000);
  };

  const updateStatus = async (newStatus: string) => {
    if (!request || !user) return;
    try {
      const { error } = await supabase
        .from("valuation_requests")
        .update({ status: newStatus })
        .eq("id", request.id);

      if (error) throw error;

      await supabase.from("activity_log").insert({
        user_id: user.id,
        action: "status_updated",
        entity_type: "valuation_request",
        entity_id: request.id,
        details: { status: newStatus },
      });

      setRequest((prev) => (prev ? { ...prev, status: newStatus } : prev));

      toast({
        title: "Stato aggiornato",
        description: `Richiesta segnata come "${statusLabels[newStatus]}"`,
      });
    } catch (error: unknown) {
      console.error("Status update error:", error);
      toast({
        title: "Errore",
        description: "Impossibile aggiornare lo stato",
        variant: "destructive",
      });
    }
  };

  const handleSave = async () => {
    if (!request || !user) return;
    setIsSaving(true);

    const updates: Partial<ValuationRequest> = {
      final_offer: finalOffer ? parseInt(finalOffer) : null,
      appointment_date: appointmentDate
        ? new Date(appointmentDate).toISOString()
        : null,
    };

    try {
      const { error } = await supabase
        .from("valuation_requests")
        .update(updates)
        .eq("id", request.id);

      if (error) throw error;

      const actions = [];
      if (updates.final_offer !== undefined) actions.push("offer_updated");
      if (updates.appointment_date !== undefined) actions.push("appointment_set");

      for (const action of actions) {
        await supabase.from("activity_log").insert({
          user_id: user.id,
          action,
          entity_type: "valuation_request",
          entity_id: request.id,
          details: updates,
        });
      }

      setRequest((prev) => (prev ? { ...prev, ...updates } : prev));

      // Try to notify client
      const hasUpdates = finalOffer || appointmentDate;
      if (hasUpdates) {
        try {
          const { error: notifyError } = await supabase.functions.invoke(
            "notify-client",
            {
              body: {
                request_id: request.id,
                client_email: request.email,
                client_name: request.name,
                vehicle: `${request.make} ${request.model} ${request.year}`,
                tracking_code: trackingCode,
                final_offer: finalOffer ? parseInt(finalOffer) : null,
                appointment_date: appointmentDate
                  ? new Date(appointmentDate).toISOString()
                  : null,
                message: null,
                site_url: window.location.origin,
              },
            }
          );

          if (notifyError) {
            console.error("Failed to send notification email:", notifyError);
            toast({
              title: "Salvato",
              description:
                "Dati salvati, ma l'email al cliente non è stata inviata.",
              variant: "default",
            });
          } else {
            toast({
              title: "Salvato e Notificato",
              description: `Email inviata a ${request.email}`,
            });
          }
        } catch (emailError) {
          console.error("Email notification error:", emailError);
          toast({
            title: "Salvato",
            description: "Modifiche salvate con successo",
          });
        }
      } else {
        toast({
          title: "Salvato",
          description: "Modifiche salvate con successo",
        });
      }
    } catch (error: unknown) {
      console.error("Save error:", error);
      toast({
        title: "Errore",
        description: "Impossibile salvare le modifiche",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const openWhatsApp = () => {
    if (!request) return;
    const phone = request.phone.replace(/\D/g, "");
    const message = encodeURIComponent(
      `Buongiorno ${request.name}, la contattiamo riguardo alla valutazione della sua ${request.make} ${request.model} (Pratica #${trackingCode}). Quando possiamo sentirci?`
    );
    window.open(`https://wa.me/39${phone}?text=${message}`, "_blank");
  };

  // Loading states
  if (loading || checkingRole) {
    return (
      <div className="min-h-screen bg-secondary/30 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  if (loadingRequest || !request) {
    return (
      <div className="min-h-screen bg-secondary/30 flex pb-16 lg:pb-0">
        {/* Sidebar - hidden on mobile */}
        <div className="hidden lg:block">
          <AdminSidebar
            activeTab="requests"
            onTabChange={handleSidebarTabChange}
            onLogout={handleLogout}
            userEmail={user?.email}
          />
        </div>
        {/* Main Content */}
        <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
          <div className="p-6 space-y-6">
            <Skeleton className="h-12 w-64" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
        </div>
        {/* Mobile Bottom Nav */}
        <MobileBottomNav
          activeTab="requests"
          onTabChange={handleSidebarTabChange}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary/30 flex pb-16 lg:pb-0">
      {/* Sidebar - hidden on mobile */}
      <div className="hidden lg:block">
        <AdminSidebar
          activeTab="requests"
          onTabChange={handleSidebarTabChange}
          onLogout={handleLogout}
          userEmail={user?.email}
        />
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div 
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="absolute left-0 top-0 h-full">
            <AdminSidebar
              activeTab="requests"
              onTabChange={(tab) => {
                handleSidebarTabChange(tab);
                setMobileMenuOpen(false);
              }}
              onLogout={handleLogout}
              userEmail={user?.email}
            />
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        {/* Header */}
        <header className="shrink-0 border-b border-border bg-card sticky top-0 z-40">
          <div className="px-4 lg:px-6 py-4 space-y-3">
            {/* Mobile menu button + Breadcrumbs */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="lg:hidden p-2 -ml-2 rounded-lg hover:bg-secondary transition-colors"
              >
                <Menu className="w-5 h-5" />
              </button>
              <nav className="flex items-center gap-2 text-sm text-muted-foreground">
                <Link to="/admin" className="hover:text-foreground transition-colors">
                  Dashboard
                </Link>
                <ChevronLeft className="w-4 h-4 rotate-180" />
                <span className="text-muted-foreground">Richieste</span>
                <ChevronLeft className="w-4 h-4 rotate-180" />
                <span className="text-foreground font-medium truncate max-w-[150px] sm:max-w-none">
                  {request.make} {request.model}
                </span>
              </nav>
            </div>

            {/* Title Row */}
            <div className="flex items-center gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center shrink-0">
                    <Car className="w-5 h-5 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <h1 className="text-lg font-bold truncate">
                      {request.make} {request.model}
                    </h1>
                    <p className="text-xs text-muted-foreground truncate">
                      Anno {request.year} • {formatDate(request.created_at)}
                    </p>
                  </div>
                </div>
              </div>
            <button
              onClick={copyTrackingCode}
              className="hidden sm:inline-flex items-center gap-2 px-3 py-2 bg-secondary/80 rounded-lg text-sm hover:bg-secondary transition-colors"
            >
              <Hash className="w-4 h-4 text-muted-foreground" />
              <span className="font-mono font-bold tracking-wider">
                {trackingCode}
              </span>
              {copied ? (
                <Check className="w-4 h-4 text-green-500" />
              ) : (
                <Copy className="w-4 h-4 text-muted-foreground" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Page Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-5xl mx-auto px-4 lg:px-6 py-6">
          {/* Status Selector */}
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center gap-3">
            <button
              onClick={copyTrackingCode}
              className="sm:hidden inline-flex items-center gap-2 px-3 py-2 bg-secondary/80 rounded-lg text-sm hover:bg-secondary transition-colors justify-between"
            >
              <span className="inline-flex items-center gap-2">
                <Hash className="w-4 h-4 text-muted-foreground" />
                <span className="font-mono font-bold tracking-wider">
                  {trackingCode}
                </span>
              </span>
              {copied ? (
                <Check className="w-4 h-4 text-green-500" />
              ) : (
                <Copy className="w-4 h-4 text-muted-foreground" />
              )}
            </button>
            <Select value={request.status} onValueChange={updateStatus}>
              <SelectTrigger
                className={cn(
                  "w-full sm:w-[200px] h-10 border rounded-lg font-medium",
                  statusColors[request.status]
                )}
              >
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

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 max-w-md">
              <TabsTrigger value="details" className="gap-2">
                <FileText className="w-4 h-4" />
                Gestione
              </TabsTrigger>
              <TabsTrigger value="messages" className="gap-2">
                <MessageSquare className="w-4 h-4" />
                Messaggi
              </TabsTrigger>
            </TabsList>

            {/* Details Tab */}
            <TabsContent value="details" className="space-y-6">
              {/* Vehicle Stats Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                <div className="p-4 rounded-xl bg-secondary/50 border border-border">
                  <div className="flex items-center gap-1.5 text-muted-foreground mb-2">
                    <Gauge className="w-3.5 h-3.5" />
                    <span className="text-xs">Chilometri</span>
                  </div>
                  <p className="text-lg font-bold">
                    {request.mileage.toLocaleString("it-IT")} km
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-secondary/50 border border-border">
                  <div className="flex items-center gap-1.5 text-muted-foreground mb-2">
                    <Fuel className="w-3.5 h-3.5" />
                    <span className="text-xs">Carburante</span>
                  </div>
                  <p className="text-lg font-bold truncate">
                    {request.fuel_type}
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-secondary/50 border border-border">
                  <div className="flex items-center gap-1.5 text-muted-foreground mb-2">
                    <Star className="w-3.5 h-3.5" />
                    <span className="text-xs">Condizioni</span>
                  </div>
                  <p className="text-lg font-bold truncate">
                    {conditionLabels[request.condition] || request.condition}
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-secondary/50 border border-border">
                  <div className="flex items-center gap-1.5 text-muted-foreground mb-2">
                    <Calendar className="w-3.5 h-3.5" />
                    <span className="text-xs">Anno</span>
                  </div>
                  <p className="text-lg font-bold">{request.year}</p>
                </div>
              </div>

              {/* Pricing Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-5 rounded-xl bg-secondary/30 border border-border">
                  <div className="flex items-center gap-2 text-muted-foreground mb-2">
                    <Euro className="w-4 h-4" />
                    <span className="text-sm">Prezzo Richiesto</span>
                  </div>
                  <p className="text-2xl font-bold">
                    {request.price ? formatCurrency(request.price) : "—"}
                  </p>
                </div>
                <div className="p-5 rounded-xl bg-primary/5 border border-primary/20">
                  <div className="flex items-center gap-2 text-primary mb-2">
                    <Euro className="w-4 h-4" />
                    <span className="text-sm">Offerta Finale</span>
                  </div>
                  {request.final_offer ? (
                    <p className="text-2xl font-bold text-primary">
                      {formatCurrency(request.final_offer)}
                    </p>
                  ) : (
                    <div className="h-1 w-8 bg-primary/40 rounded-full mt-3" />
                  )}
                </div>
              </div>

              {/* Contact Info */}
              <div className="p-5 rounded-xl bg-secondary/30 border border-border">
                <div className="flex items-center gap-2 text-muted-foreground mb-4">
                  <Mail className="w-4 h-4" />
                  <span className="text-sm font-medium">
                    Informazioni Contatto
                  </span>
                </div>
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-xl font-bold mb-2 truncate">
                      {request.name}
                    </p>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-muted-foreground">
                      <a
                        href={`tel:${request.phone}`}
                        className="flex items-center gap-1.5 hover:text-foreground transition-colors"
                      >
                        <Phone className="w-4 h-4 shrink-0" />
                        <span className="break-all">{request.phone}</span>
                      </a>
                      <a
                        href={`mailto:${request.email}`}
                        className="flex items-center gap-1.5 hover:text-foreground transition-colors min-w-0"
                      >
                        <Mail className="w-4 h-4 shrink-0" />
                        <span className="break-all">{request.email}</span>
                      </a>
                    </div>
                  </div>
                  <Button
                    className="bg-green-600 hover:bg-green-700 text-white rounded-lg gap-2 w-full lg:w-auto shrink-0"
                    onClick={openWhatsApp}
                  >
                    <MessageSquare className="w-4 h-4" />
                    WhatsApp
                  </Button>
                </div>
                {request.notes && (
                  <div className="mt-4 p-4 rounded-lg bg-background/50 border border-border">
                    <p className="text-xs text-muted-foreground mb-1">
                      Note del cliente
                    </p>
                    <p className="text-sm break-words">{request.notes}</p>
                  </div>
                )}
              </div>

              {/* Photos */}
              {request.images && request.images.length > 0 && (
                <div className="p-5 rounded-xl bg-secondary/30 border border-border">
                  <div className="flex items-center gap-2 text-muted-foreground mb-4">
                    <ImageIcon className="w-4 h-4" />
                    <span className="text-sm font-medium">
                      Foto ({request.images.length})
                    </span>
                  </div>
                  <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                    {request.images.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setLightboxIndex(idx)}
                        className="relative aspect-square overflow-hidden rounded-lg border-2 border-border hover:border-primary/50 transition-all group"
                      >
                        <img
                          src={img}
                          alt={`Foto ${idx + 1}`}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                          <Eye className="w-4 h-4 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Admin Fields */}
              <div className="p-5 rounded-xl bg-secondary/30 border border-border space-y-4">
                <h4 className="font-medium text-sm flex items-center gap-2">
                  <FileText className="w-4 h-4 text-primary" />
                  Gestione Pratica
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="finalOffer"
                      className="text-xs text-muted-foreground flex items-center gap-1.5"
                    >
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
                    <p className="text-xs text-muted-foreground">
                      L'offerta che proponi al cliente.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="appointmentDate"
                      className="text-xs text-muted-foreground flex items-center gap-1.5"
                    >
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
                    <p className="text-xs text-muted-foreground">
                      Quando vuoi incontrare il cliente.
                    </p>
                  </div>
                </div>
                <div className="flex justify-end pt-2">
                  <Button
                    variant="outline"
                    onClick={handleSave}
                    disabled={isSaving}
                    className="gap-2"
                  >
                    <Save className="w-4 h-4" />
                    {isSaving ? "Salvataggio..." : "Salva Modifiche"}
                  </Button>
                </div>
              </div>
            </TabsContent>

            {/* Messages Tab */}
            <TabsContent value="messages" className="h-[calc(100vh-280px)] min-h-[400px]">
              <div className="h-full rounded-xl border border-border overflow-hidden">
                <AdminChatPanel
                  requestId={request.id}
                  requestStatus={request.status}
                  clientName={request.name}
                />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>

        {/* Lightbox */}
        {lightboxIndex !== null && request.images && (
          <ImageLightbox
            images={request.images.map((url, idx) => ({
              url,
              name: `Foto ${idx + 1}`,
            }))}
            initialIndex={lightboxIndex}
            onClose={() => setLightboxIndex(null)}
          />
        )}
      </div>

      {/* Mobile Bottom Nav */}
      <MobileBottomNav
        activeTab="requests"
        onTabChange={handleSidebarTabChange}
      />
    </div>
  );
}
