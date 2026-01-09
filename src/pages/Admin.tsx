import { useEffect, useState, useMemo, useCallback } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { useRealtimeNotifications } from "@/hooks/useRealtimeNotifications";
import { NotificationBell } from "@/components/NotificationBell";
import { 
  Car, 
  Calendar, 
  Gauge, 
  Phone, 
  Mail, 
  Euro,
  Loader2,
  RefreshCw,
  Users,
  Shield,
  ShieldAlert,
  Trash2,
  MessageSquare,
  Download,
  Plus,
  Eye
} from "lucide-react";
import { User, Session } from "@supabase/supabase-js";

// Components
import { AdminStats } from "@/components/admin/AdminStats";
import { AdminFilters } from "@/components/admin/AdminFilters";
import { AnalyticsDashboard } from "@/components/admin/AnalyticsDashboard";
import { AdminSettings } from "@/components/admin/AdminSettings";
import { ActivityLog } from "@/components/admin/ActivityLog";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { MobileRequestCard } from "@/components/admin/MobileRequestCard";
import { MobileBottomNav } from "@/components/admin/MobileBottomNav";
import { VehicleBadgeManager } from "@/components/admin/VehicleBadgeManager";

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

interface UserRole {
  id: string;
  user_id: string;
  role: "admin" | "user";
  created_at: string;
  profile?: {
    name: string;
    surname: string;
    phone: string;
  };
  email?: string;
}

const conditionLabels: Record<string, string> = {
  excellent: "Ottime",
  good: "Buone",
  fair: "Discrete",
  poor: "Da revisionare",
};

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

export default function Admin() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [checkingRole, setCheckingRole] = useState(true);
  const [requests, setRequests] = useState<ValuationRequest[]>([]);
  const [loadingRequests, setLoadingRequests] = useState(true);
  const [users, setUsers] = useState<UserRole[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [activeTab, setActiveTab] = useState("requests");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [unreadActivityCount, setUnreadActivityCount] = useState(0);

  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);

      if (!session?.user) {
        navigate("/auth");
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);

      if (!session?.user) {
        navigate("/auth");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const checkAdminRole = useCallback(async () => {
    setCheckingRole(true);
    try {
      const { data, error } = await supabase.rpc("has_role", {
        _user_id: user!.id,
        _role: "admin"
      });

      if (error) throw error;
      setIsAdmin(data === true);
      
      if (!data) {
        toast({
          title: "Accesso negato",
          description: "Non hai i permessi di amministratore",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Role check error:", error);
      setIsAdmin(false);
    } finally {
      setCheckingRole(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      checkAdminRole();
    }
  }, [user, checkAdminRole]);

  const fetchUnreadActivityCount = useCallback(async () => {
    try {
      const { count, error } = await supabase
        .from("activity_log")
        .select("*", { count: "exact", head: true })
        .is("read_at", null);

      if (error) throw error;
      setUnreadActivityCount(count || 0);
    } catch (error) {
      console.error("Error fetching unread count:", error);
    }
  }, []);

  const markActivityAsRead = async () => {
    try {
      const { error } = await supabase
        .from("activity_log")
        .update({ read_at: new Date().toISOString() })
        .is("read_at", null);

      if (error) throw error;
      setUnreadActivityCount(0);
    } catch (error) {
      console.error("Error marking activity as read:", error);
    }
  };

  const fetchRequests = useCallback(async () => {
    setLoadingRequests(true);
    try {
      // First verify admin role
      const { data: isAdminCheck, error: roleError } = await supabase.rpc("has_role", {
        _user_id: user!.id,
        _role: "admin"
      });

      if (roleError) {
        console.error("Role check error in fetchRequests:", roleError);
        toast({
          title: "Errore",
          description: "Errore verifica permessi: " + roleError.message,
          variant: "destructive",
        });
        return;
      }

      if (!isAdminCheck) {
        console.error("User is not admin, cannot fetch requests");
        toast({
          title: "Errore",
          description: "Non hai i permessi per visualizzare le richieste",
          variant: "destructive",
        });
        return;
      }

      // Fetch requests
      const { data, error, count } = await supabase
        .from("valuation_requests")
        .select("*", { count: "exact" })
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Fetch error details:", error);
        throw error;
      }

      if (import.meta.env.DEV) {
        console.log(`Fetched ${data?.length || 0} requests (total in DB: ${count || 0})`);
      }
      setRequests((data as ValuationRequest[]) || []);
      
      if (data && data.length === 0 && count === 0) {
        if (import.meta.env.DEV) {
          console.log("No requests found in database");
        }
      }
    } catch (error) {
      console.error("Fetch error:", error);
      toast({
        title: "Errore",
        description: error instanceof Error ? error.message : "Impossibile caricare le richieste",
        variant: "destructive",
      });
    } finally {
      setLoadingRequests(false);
    }
  }, [user]);

  const fetchUsers = useCallback(async () => {
    setLoadingUsers(true);
    try {
      interface ProfileData {
        user_id: string;
        name: string | null;
        surname: string | null;
        phone: string | null;
        email: string | null;
        created_at: string;
      }

      const profilesResult = await supabase
        .from("user_profiles")
        .select("user_id, name, surname, phone, email, created_at")
        .order("created_at", { ascending: false });

      const { data: profiles, error: profilesError } = profilesResult;

      if (profilesError) throw profilesError;

      const { data: userRoles, error: rolesError } = await supabase
        .from("user_roles")
        .select("user_id, role, created_at");

      if (rolesError) throw rolesError;

      const rolesMap: Record<string, { role: "admin" | "user"; created_at: string }> = {};
      if (userRoles) {
        userRoles.forEach(ur => {
          rolesMap[ur.user_id] = {
            role: ur.role,
            created_at: ur.created_at,
          };
        });
      }

      const usersWithProfiles: UserRole[] = (profiles || []).map((profile) => {
        const roleData = rolesMap[profile.user_id];
        return {
          id: roleData ? `${profile.user_id}-${roleData.role}` : profile.user_id,
          user_id: profile.user_id,
          role: roleData?.role || "user",
          created_at: profile.created_at,
          profile: {
            name: profile.name || "",
            surname: profile.surname || "",
            phone: profile.phone || "",
          },
          email: profile.email || undefined,
        };
      });

      setUsers(usersWithProfiles);
    } catch (error) {
      console.error("Fetch users error:", error);
      toast({
        title: "Errore",
        description: "Impossibile caricare gli utenti",
        variant: "destructive",
      });
    } finally {
      setLoadingUsers(false);
    }
  }, []);

  // Now define the callbacks that use fetchRequests
  const handleNewMessage = useCallback(() => {
    fetchRequests(); // Refresh to get updated unread counts
  }, [fetchRequests]);

  const handleRequestUpdate = useCallback(() => {
    fetchRequests(); // Refresh the requests list
  }, [fetchRequests]);

  useRealtimeNotifications({
    isAdmin: true,
    userId: user?.id,
    onNewMessage: handleNewMessage,
    onRequestUpdate: handleRequestUpdate,
  });

  useEffect(() => {
    if (isAdmin) {
      fetchRequests();
      fetchUsers();
      fetchUnreadActivityCount();
    }
  }, [isAdmin, fetchRequests, fetchUsers, fetchUnreadActivityCount]);

  useEffect(() => {
    const requestId = new URLSearchParams(location.search).get("request");
    if (requestId) {
      // Navigate directly to the request detail page
      navigate(`/admin/requests/${requestId}`, { replace: true });
    }
  }, [location.search, navigate]);

  const filteredRequests = useMemo(() => {
    return requests.filter(req => {
      if (searchTerm) {
        const search = searchTerm.toLowerCase();
        const matchesSearch = 
          req.name.toLowerCase().includes(search) ||
          req.email.toLowerCase().includes(search) ||
          req.make.toLowerCase().includes(search) ||
          req.model.toLowerCase().includes(search) ||
          req.phone.includes(search);
        if (!matchesSearch) return false;
      }

      if (statusFilter !== "all" && req.status !== statusFilter) {
        return false;
      }

      if (dateFilter !== "all") {
        const reqDate = new Date(req.created_at);
        const now = new Date();
        
        switch (dateFilter) {
          case "today":
            if (reqDate.toDateString() !== now.toDateString()) return false;
            break;
          case "week": {
            const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            if (reqDate < weekAgo) return false;
            break;
          }
          case "month": {
            const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
            if (reqDate < monthAgo) return false;
            break;
          }
          case "quarter": {
            const quarterAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
            if (reqDate < quarterAgo) return false;
            break;
          }
        }
      }

      return true;
    });
  }, [requests, searchTerm, statusFilter, dateFilter]);

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from("valuation_requests")
        .update({ status: newStatus })
        .eq("id", id);

      if (error) throw error;

      await supabase.from("activity_log").insert({
        user_id: user!.id,
        action: "status_updated",
        entity_type: "valuation_request",
        entity_id: id,
        details: { status: newStatus },
      });

      setRequests(prev => 
        prev.map(r => r.id === id ? { ...r, status: newStatus } : r)
      );

      toast({
        title: "Stato aggiornato",
        description: `Richiesta segnata come "${statusLabels[newStatus]}"`,
      });
    } catch (error) {
      toast({
        title: "Errore",
        description: "Impossibile aggiornare lo stato",
        variant: "destructive",
      });
    }
  };

  const updateRequest = async (id: string, updates: Partial<ValuationRequest>) => {
    try {
      const { error } = await supabase
        .from("valuation_requests")
        .update(updates)
        .eq("id", id);

      if (error) throw error;

      const actions = [];
      if (updates.admin_notes !== undefined) actions.push("notes_updated");
      if (updates.final_offer !== undefined) actions.push("offer_updated");
      if (updates.appointment_date !== undefined) actions.push("appointment_set");

      for (const action of actions) {
        await supabase.from("activity_log").insert({
          user_id: user!.id,
          action,
          entity_type: "valuation_request",
          entity_id: id,
          details: updates,
        });
      }

      setRequests(prev => 
        prev.map(r => r.id === id ? { ...r, ...updates } : r)
      );

      toast({
        title: "Modifiche salvate",
        description: "I dati sono stati aggiornati",
      });
    } catch (error) {
      toast({
        title: "Errore",
        description: "Impossibile salvare le modifiche",
        variant: "destructive",
      });
    }
  };

  const exportToCSV = () => {
    const headers = ["Data", "Nome", "Email", "Telefono", "Marca", "Modello", "Anno", "Km", "Carburante", "Condizioni", "Stima", "Offerta", "Stato", "Note Cliente", "Note Admin"];
    
    const rows = filteredRequests.map(r => [
      new Date(r.created_at).toLocaleDateString("it-IT"),
      r.name,
      r.email,
      r.phone,
      r.make,
      r.model,
      r.year,
      r.mileage,
      r.fuel_type,
      conditionLabels[r.condition] || r.condition,
      r.estimated_value || "",
      r.final_offer || "",
      statusLabels[r.status] || r.status,
      r.notes || "",
      r.admin_notes || "",
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `valutazioni_${new Date().toISOString().split("T")[0]}.csv`;
    link.click();

    toast({
      title: "Export completato",
      description: `${filteredRequests.length} richieste esportate`,
    });
  };

  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setDateFilter("all");
  };

  const updateUserRole = async (userId: string, newRole: "admin" | "user") => {
    try {
      const { data: existingRole } = await supabase
        .from("user_roles")
        .select("id")
        .eq("user_id", userId)
        .single();

      if (existingRole) {
        const { error } = await supabase
          .from("user_roles")
          .update({ role: newRole })
          .eq("user_id", userId);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("user_roles")
          .insert({ user_id: userId, role: newRole });

        if (error) throw error;
      }

      await fetchUsers();

      toast({
        title: "Ruolo aggiornato",
        description: `Utente ora è ${newRole === "admin" ? "Admin" : "Utente"}`,
      });
    } catch (error) {
      console.error("Update role error:", error);
      toast({
        title: "Errore",
        description: "Impossibile aggiornare il ruolo",
        variant: "destructive",
      });
    }
  };

  const removeUserRole = async (userId: string) => {
    if (userId === user?.id) {
      toast({
        title: "Errore",
        description: "Non puoi rimuovere te stesso",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from("user_roles")
        .delete()
        .eq("user_id", userId);

      if (error) throw error;

      await fetchUsers();

      toast({
        title: "Ruolo rimosso",
        description: "Il ruolo dell'utente è stato rimosso",
      });
    } catch (error) {
      console.error("Remove role error:", error);
      toast({
        title: "Errore",
        description: "Impossibile rimuovere il ruolo",
        variant: "destructive",
      });
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
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

  const getTabTitle = () => {
    switch (activeTab) {
      case "requests": return "Dashboard";
      case "analytics": return "Analytics";
      case "users": return "Gestione Utenti";
      case "activity": return "Log Attività";
      case "vehicles": return "Gestione Veicoli";
      case "settings": return "Impostazioni";
      case "help": return "Aiuto";
      default: return "Dashboard";
    }
  };

  const getTabSubtitle = () => {
    switch (activeTab) {
      case "requests": return "Gestisci le richieste di valutazione";
      case "analytics": return "Visualizza statistiche e report";
      case "users": return "Gestisci utenti e ruoli";
      case "activity": return "Cronologia delle attività";
      case "vehicles": return "Gestisci badge e caratteristiche veicoli";
      case "settings": return "Configura le impostazioni";
      case "help": return "Centro assistenza";
      default: return "";
    }
  };

  if (loading || checkingRole) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-destructive/10 rounded-full flex items-center justify-center mb-4">
              <ShieldAlert className="w-6 h-6 text-destructive" />
            </div>
            <CardTitle>Accesso Negato</CardTitle>
            <CardDescription>
              Non hai i permessi per accedere a questa pagina.
              Contatta un amministratore per ottenere l'accesso.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" onClick={handleLogout}>
              Torna al login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary/30 flex pb-16 lg:pb-0">
      {/* Sidebar - hidden on mobile */}
      <div className="hidden lg:block">
        <AdminSidebar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onLogout={handleLogout}
          userEmail={user?.email}
        />
      </div>

      {/* Mobile sidebar overlay */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div 
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="absolute left-0 top-0 h-full">
            <AdminSidebar
              activeTab={activeTab}
              onTabChange={(tab) => {
                setActiveTab(tab);
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
        <AdminHeader
          title={getTabTitle()}
          subtitle={getTabSubtitle()}
          onMenuClick={() => setMobileMenuOpen(true)}
          notificationBell={
            user ? (
              <NotificationBell isAdmin userId={user.id} userEmail={user.email} />
            ) : null
          }
          actions={
            activeTab === "requests" ? (
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={exportToCSV} className="hidden sm:flex">
                  <Download className="w-4 h-4 mr-2" />
                  Esporta
                </Button>
                <Button size="sm" className="hidden sm:flex">
                  <Plus className="w-4 h-4 mr-2" />
                  Nuova
                </Button>
              </div>
            ) : undefined
          }
        />

        <main className="flex-1 overflow-y-auto p-3 lg:p-6">
          {/* Requests/Dashboard Tab */}
          {activeTab === "requests" && (
            <div className="space-y-6">
              <AdminStats requests={requests} onStatusFilter={setStatusFilter} />
              
              <Card className="border-0 shadow-sm">
                <CardHeader className="pb-3 lg:pb-4 px-3 lg:px-6 pt-3 lg:pt-6">
                  <div className="flex items-center justify-between gap-2 lg:gap-4">
                    <div className="min-w-0">
                      <CardTitle className="text-base lg:text-lg">Richieste di Valutazione</CardTitle>
                      <CardDescription className="text-xs lg:text-sm">
                        {filteredRequests.length} di {requests.length} richieste
                      </CardDescription>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <Button variant="outline" size="sm" onClick={fetchRequests} className="shrink-0">
                        <RefreshCw className="w-4 h-4 lg:mr-2" />
                        <span className="hidden lg:inline">Aggiorna</span>
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3 lg:space-y-4 px-3 lg:px-6 pb-3 lg:pb-6">
                  <AdminFilters
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    statusFilter={statusFilter}
                    setStatusFilter={setStatusFilter}
                    dateFilter={dateFilter}
                    setDateFilter={setDateFilter}
                    onExportCSV={exportToCSV}
                    onClearFilters={clearFilters}
                  />

                  {loadingRequests ? (
                    <div className="space-y-4">
                      {[1, 2, 3].map(i => (
                        <Skeleton key={i} className="h-16 w-full" />
                      ))}
                    </div>
                  ) : filteredRequests.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                      <Car className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>Nessuna richiesta trovata</p>
                      {(searchTerm || statusFilter !== "all" || dateFilter !== "all") && (
                        <Button variant="link" onClick={clearFilters}>
                          Pulisci filtri
                        </Button>
                      )}
                    </div>
                  ) : (
                    <>
                      {/* Mobile Cards View */}
                      <div className="lg:hidden space-y-3">
                        {filteredRequests.map((request) => (
                          <MobileRequestCard
                            key={request.id}
                            request={request}
                            onUpdateStatus={updateStatus}
                          />
                        ))}
                      </div>

                      {/* Desktop Table View */}
                      <div className="hidden lg:block overflow-x-auto rounded-lg border border-border">
                        <Table>
                          <TableHeader>
                            <TableRow className="bg-secondary/50">
                              <TableHead className="w-[140px]">Data</TableHead>
                              <TableHead>Veicolo</TableHead>
                              <TableHead>Contatto</TableHead>
                              <TableHead className="text-right">Richiesta</TableHead>
                              <TableHead className="text-right">Offerta</TableHead>
                              <TableHead className="w-[150px]">Stato</TableHead>
                              <TableHead className="w-[100px]"></TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {filteredRequests.map((request) => (
                              <TableRow key={request.id} className="hover:bg-secondary/30">
                                <TableCell className="py-3">
                                  <div className="flex flex-col gap-0.5">
                                    <span className="text-sm font-medium">
                                      {new Date(request.created_at).toLocaleDateString("it-IT", { day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                    {request.appointment_date && (
                                      <div className="flex items-center gap-1 text-xs text-orange-500 font-medium">
                                        <Calendar className="w-3 h-3" />
                                        {new Date(request.appointment_date).toLocaleDateString("it-IT", { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}
                                      </div>
                                    )}
                                  </div>
                                </TableCell>
                                <TableCell className="py-3">
                                  <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center shrink-0">
                                      <Car className="w-5 h-5 text-muted-foreground" />
                                    </div>
                                    <div>
                                      <p className="font-medium text-sm">
                                        {request.make} {request.model}
                                      </p>
                                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                        <span>{request.year}</span>
                                        <span>•</span>
                                        <span>{request.fuel_type}</span>
                                        <span>•</span>
                                        <span>{request.mileage.toLocaleString("it-IT")} km</span>
                                      </div>
                                      {request.admin_notes && (
                                        <div className="flex items-center gap-1 text-xs text-blue-500 mt-0.5">
                                          <MessageSquare className="w-3 h-3" />
                                          <span className="truncate max-w-[150px]">{request.admin_notes}</span>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </TableCell>
                                <TableCell className="py-3">
                                  <div>
                                    <p className="text-sm font-medium">{request.name}</p>
                                    <div className="flex flex-col text-xs text-muted-foreground">
                                      <a href={`tel:${request.phone}`} className="hover:text-primary transition-colors">
                                        {request.phone}
                                      </a>
                                      <a href={`mailto:${request.email}`} className="hover:text-primary transition-colors truncate max-w-[180px]">
                                        {request.email}
                                      </a>
                                    </div>
                                  </div>
                                </TableCell>
                                <TableCell className="py-3 text-right">
                                  {request.price ? (
                                    <span className="text-sm font-medium">
                                      {formatCurrency(request.price)}
                                    </span>
                                  ) : (
                                    <span className="text-muted-foreground text-sm">-</span>
                                  )}
                                </TableCell>
                                <TableCell className="py-3 text-right">
                                  {request.final_offer ? (
                                    <span className="text-sm font-bold text-primary">
                                      {formatCurrency(request.final_offer)}
                                    </span>
                                  ) : request.estimated_value ? (
                                    <div className="flex flex-col items-end">
                                      <span className="text-xs text-muted-foreground">Stima</span>
                                      <span className="text-sm text-muted-foreground">{formatCurrency(request.estimated_value)}</span>
                                    </div>
                                  ) : (
                                    <span className="text-muted-foreground text-sm">-</span>
                                  )}
                                </TableCell>
                                <TableCell className="py-3">
                                  <Select
                                    value={request.status}
                                    onValueChange={(value) => updateStatus(request.id, value)}
                                  >
                                    <SelectTrigger className={`w-full h-8 text-xs ${statusColors[request.status]}`}>
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="pending">In attesa</SelectItem>
                                      <SelectItem value="contacted">Contattato</SelectItem>
                                      <SelectItem value="completed">Completato</SelectItem>
                                      <SelectItem value="rejected">Rifiutato</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </TableCell>
                                <TableCell className="py-3 text-right">
                                  <Button size="icon" variant="ghost" asChild className="h-8 w-8">
                                    <Link to={`/admin/requests/${request.id}`}>
                                      <Eye className="w-4 h-4 text-muted-foreground hover:text-foreground" />
                                    </Link>
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {/* Analytics Tab */}
          {activeTab === "analytics" && (
            <div className="space-y-6">
              <AdminStats requests={requests} onStatusFilter={setStatusFilter} />
              <AnalyticsDashboard requests={requests} />
            </div>
          )}

          {/* Users Tab */}
          {activeTab === "users" && (
            <div className="space-y-6">
              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Gestione Utenti</CardTitle>
                      <CardDescription>
                        Visualizza e gestisci tutti gli utenti registrati e i loro ruoli
                      </CardDescription>
                    </div>
                    <Button variant="outline" size="sm" onClick={fetchUsers}>
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Aggiorna
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {loadingUsers ? (
                    <div className="space-y-4">
                      {[1, 2].map(i => (
                        <Skeleton key={i} className="h-12 w-full" />
                      ))}
                    </div>
                  ) : users.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                      <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>Nessun utente registrato</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto rounded-lg border border-border">
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-secondary/50">
                            <TableHead>Nome</TableHead>
                            <TableHead>Cognome</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Telefono</TableHead>
                            <TableHead>Ruolo</TableHead>
                            <TableHead>Data Registrazione</TableHead>
                            <TableHead>Azioni</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {users.map((userRole) => (
                            <TableRow key={userRole.id} className="hover:bg-secondary/30">
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <span className="font-medium">
                                    {userRole.profile?.name || "-"}
                                  </span>
                                  {userRole.user_id === user?.id && (
                                    <Badge variant="outline" className="text-xs">Tu</Badge>
                                  )}
                                </div>
                              </TableCell>
                              <TableCell>
                                {userRole.profile?.surname || "-"}
                              </TableCell>
                              <TableCell>
                                {userRole.email ? (
                                  <a 
                                    href={`mailto:${userRole.email}`} 
                                    className="text-primary hover:underline flex items-center gap-1"
                                  >
                                    <Mail className="w-3 h-3" />
                                    {userRole.email}
                                  </a>
                                ) : (
                                  <span className="text-muted-foreground text-sm">-</span>
                                )}
                              </TableCell>
                              <TableCell>
                                {userRole.profile?.phone ? (
                                  <a 
                                    href={`tel:${userRole.profile.phone}`} 
                                    className="text-primary hover:underline flex items-center gap-1"
                                  >
                                    <Phone className="w-3 h-3" />
                                    {userRole.profile.phone}
                                  </a>
                                ) : (
                                  <span className="text-muted-foreground text-sm">-</span>
                                )}
                              </TableCell>
                              <TableCell>
                                <Badge className={userRole.role === "admin" ? "bg-primary" : "bg-muted"}>
                                  {userRole.role === "admin" ? (
                                    <><Shield className="w-3 h-3 mr-1" /> Admin</>
                                  ) : (
                                    "Utente"
                                  )}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-sm text-muted-foreground">
                                {formatDate(userRole.created_at)}
                              </TableCell>
                              <TableCell>
                                <div className="flex gap-2">
                                  <Select
                                    value={userRole.role}
                                    onValueChange={(value: "admin" | "user") => updateUserRole(userRole.user_id, value)}
                                    disabled={userRole.user_id === user?.id}
                                  >
                                    <SelectTrigger className="w-24">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="user">Utente</SelectItem>
                                      <SelectItem value="admin">Admin</SelectItem>
                                    </SelectContent>
                                  </Select>
                                  <Button 
                                    variant="ghost" 
                                    size="icon"
                                    onClick={() => removeUserRole(userRole.user_id)}
                                    disabled={userRole.user_id === user?.id}
                                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {/* Activity Tab */}
          {activeTab === "activity" && (
            <div className="space-y-6">
              <ActivityLog />
            </div>
          )}

          {/* Vehicles Tab */}
          {activeTab === "vehicles" && (
            <div className="space-y-6">
              <VehicleBadgeManager userId={user!.id} />
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === "settings" && (
            <div className="space-y-6">
              <AdminSettings />
            </div>
          )}

          {/* Help Tab */}
          {activeTab === "help" && (
            <div className="space-y-6">
              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle>Centro Assistenza</CardTitle>
                  <CardDescription>
                    Hai bisogno di aiuto? Contattaci o consulta la documentazione.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <Card className="bg-secondary/50">
                      <CardContent className="p-6">
                        <Mail className="w-8 h-8 text-primary mb-4" />
                        <h3 className="font-semibold mb-2">Email Supporto</h3>
                        <p className="text-sm text-muted-foreground">
                          Per assistenza tecnica o domande generali
                        </p>
                        <a href="mailto:support@autovaluta.it" className="text-primary hover:underline text-sm mt-2 block">
                          support@autovaluta.it
                        </a>
                      </CardContent>
                    </Card>
                    <Card className="bg-secondary/50">
                      <CardContent className="p-6">
                        <Phone className="w-8 h-8 text-primary mb-4" />
                        <h3 className="font-semibold mb-2">Telefono</h3>
                        <p className="text-sm text-muted-foreground">
                          Lun-Ven, 9:00-18:00
                        </p>
                        <a href="tel:+390123456789" className="text-primary hover:underline text-sm mt-2 block">
                          +39 012 345 6789
                        </a>
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}
