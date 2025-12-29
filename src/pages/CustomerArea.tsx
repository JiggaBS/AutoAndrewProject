import { useEffect, useState, useCallback } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useRealtimeNotifications } from "@/hooks/useRealtimeNotifications";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/hooks/use-toast";
import { 
  LogOut, 
  Car, 
  Heart,
  FileText,
  Calendar,
  Euro,
  Gauge,
  Fuel,
  Trash2,
  Loader2,
  User,
  Mail,
  Phone,
  Save,
  CheckCircle2,
  XCircle,
  Send,
  Settings,
  Home,
  Bell,
  ChevronRight,
  Shield,
  Clock,
  TrendingUp,
  AlertTriangle,
  Lock
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { User as SupabaseUser, Session } from "@supabase/supabase-js";
import { Vehicle } from "@/data/sampleVehicles";
import { Header } from "@/components/Header";
import { Footer } from "@/components/home/Footer";
import { VehicleCard } from "@/components/VehicleCard";
import { ClientRequestCard } from "@/components/ClientRequestCard";
import { useLanguage } from "@/contexts/LanguageContext";
import { z } from "zod";
import { cn } from "@/lib/utils";

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

interface SavedVehicle {
  id: string;
  user_id: string;
  vehicle_data: Vehicle;
  created_at: string;
}

interface UserProfile {
  id: string;
  user_id: string;
  name: string | null;
  surname: string | null;
  phone: string | null;
  email: string | null;
  created_at: string;
  updated_at: string;
}

const profileSchema = z.object({
  name: z.string().min(2, "Il nome deve contenere almeno 2 caratteri"),
  surname: z.string().min(2, "Il cognome deve contenere almeno 2 caratteri"),
  phone: z.string().min(10, "Il numero di telefono deve contenere almeno 10 caratteri"),
  email: z.string().email("Email non valida"),
});

const statusColors: Record<string, string> = {
  pending: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
  contacted: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  completed: "bg-green-500/10 text-green-600 border-green-500/20",
  rejected: "bg-red-500/10 text-red-600 border-red-500/20",
};

type ActiveSection = "overview" | "favorites" | "requests" | "profile" | "settings";

export default function CustomerArea() {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState<ValuationRequest[]>([]);
  const [loadingRequests, setLoadingRequests] = useState(true);
  const [savedVehicles, setSavedVehicles] = useState<SavedVehicle[]>([]);
  const [loadingSaved, setLoadingSaved] = useState(true);
  const [activeSection, setActiveSection] = useState<ActiveSection>("overview");
  const [autoOpenRequestId, setAutoOpenRequestId] = useState<string | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [saving, setSaving] = useState(false);
  const [sendingVerification, setSendingVerification] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [changingPassword, setChangingPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    phone: "",
    email: "",
  });

  const statusLabels: Record<string, string> = {
    pending: language === "it" ? "In attesa" : "Pending",
    contacted: language === "it" ? "Contattato" : "Contacted",
    completed: language === "it" ? "Completato" : "Completed",
    rejected: language === "it" ? "Rifiutato" : "Rejected",
  };

  const conditionLabels: Record<string, string> = {
    excellent: language === "it" ? "Eccellente" : "Excellent",
    good: language === "it" ? "Buone" : "Good",
    fair: language === "it" ? "Discrete" : "Fair",
    poor: language === "it" ? "Da Rivedere" : "Poor",
  };

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

  const fetchRequests = useCallback(async () => {
    if (!user) return;
    
    setLoadingRequests(true);
    try {
      // Fetch requests by user_id OR email (for backward compatibility)
      const { data, error } = await supabase
        .from("valuation_requests")
        .select("*")
        .or(`user_id.eq.${user.id},email.eq.${user.email}`)
        .order("created_at", { ascending: false });

      if (error) throw error;
      const typedData = (data || []).map(item => ({
        ...item,
        images: Array.isArray(item.images) ? item.images : []
      })) as ValuationRequest[];
      setRequests(typedData);
    } catch (error) {
      console.error("Error fetching requests:", error);
    } finally {
      setLoadingRequests(false);
    }
  }, [user]);

  const fetchSavedVehicles = useCallback(async () => {
    if (!user) return;
    
    setLoadingSaved(true);
    try {
      const result = await supabase
        .from("saved_vehicles")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      const { data, error } = result;

      if (error) throw error;
      setSavedVehicles(data || []);
    } catch (error) {
      console.error("Error fetching saved vehicles:", error);
    } finally {
      setLoadingSaved(false);
    }
  }, [user]);

  const fetchProfile = useCallback(async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("user_profiles")
        .select("*")
        .eq("user_id", userId)
        .single();

      if (error && error.code !== 'PGRST116') throw error;

      if (data) {
        // Check if name contains full name (has spaces) but surname is empty - fix Google auth issue
        const nameHasSpaces = data.name && data.name.trim().includes(' ');
        const needsNameSplit = nameHasSpaces && !data.surname;
        
        // Check if profile is missing surname or phone, try to sync from user metadata
        const metadata = user?.user_metadata || {};
        const needsUpdate = needsNameSplit || (!data.surname && metadata.surname) || (!data.phone && metadata.phone);
        
        if (needsUpdate && user) {
          // Update profile with missing data from metadata or split name
          const updateData: Record<string, string> = {};
          
          // If name contains full name but surname is empty, split it
          if (needsNameSplit && data.name) {
            const nameParts = data.name.trim().split(/\s+/);
            if (nameParts.length > 1) {
              updateData.name = nameParts[0];
              updateData.surname = nameParts.slice(1).join(' ');
            }
          }
          
          // Try to get surname from metadata if still missing
          if (!updateData.surname && !data.surname && metadata.surname) {
            updateData.surname = metadata.surname;
          }
          
          // Try to get surname from metadata full_name if still missing
          if (!updateData.surname && !data.surname && metadata.full_name) {
            const fullNameParts = metadata.full_name.trim().split(/\s+/);
            if (fullNameParts.length > 1) {
              updateData.surname = fullNameParts.slice(1).join(' ');
            }
          }
          
          if (!data.phone && metadata.phone) updateData.phone = metadata.phone;
          
          if (Object.keys(updateData).length > 0) {
            updateData.updated_at = new Date().toISOString();
            const { data: updatedData, error: updateError } = await supabase
              .from("user_profiles")
              .update(updateData)
              .eq("user_id", userId)
              .select()
              .single();
            
            if (!updateError && updatedData) {
              setProfile(updatedData);
              setFormData({
                name: updatedData.name || "",
                surname: updatedData.surname || "",
                phone: updatedData.phone || "",
                email: updatedData.email || user?.email || "",
              });
              return;
            }
          }
        }
        
        setProfile(data);
        setFormData({
          name: data.name || "",
          surname: data.surname || "",
          phone: data.phone || "",
          email: data.email || user?.email || "",
        });
      } else {
        // No profile exists, try to create from metadata
        if (user) {
          const metadata = user.user_metadata || {};
          const createData = {
            user_id: userId,
            name: metadata.name || metadata.full_name?.split(' ')[0] || user.email?.split('@')[0] || "",
            surname: metadata.surname || metadata.full_name?.split(' ').slice(1).join(' ') || "",
            phone: metadata.phone || "",
            email: user.email || "",
          };
          
          const { data: newProfile, error: createError } = await supabase
            .from("user_profiles")
            .insert(createData)
            .select()
            .single();
          
          if (!createError && newProfile) {
            setProfile(newProfile);
            setFormData({
              name: newProfile.name || "",
              surname: newProfile.surname || "",
              phone: newProfile.phone || "",
              email: newProfile.email || "",
            });
            return;
          }
        }
        
        setFormData({
          name: "",
          surname: "",
          phone: "",
          email: user?.email || "",
        });
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchRequests();
      fetchSavedVehicles();
      fetchProfile(user.id);
    }
  }, [user, fetchRequests, fetchSavedVehicles, fetchProfile]);

  // Realtime notifications for client
  const handleNewMessage = useCallback(() => {
    fetchRequests(); // Refresh to show new message indicators
  }, [fetchRequests]);

  const handleRequestUpdate = useCallback(() => {
    fetchRequests(); // Refresh the requests list
  }, [fetchRequests]);

  useRealtimeNotifications({
    isAdmin: false,
    userId: user?.id,
    userEmail: user?.email,
    onNewMessage: handleNewMessage,
    onRequestUpdate: handleRequestUpdate,
  });

  // Handle URL query param for auto-opening request
  useEffect(() => {
    const requestId = new URLSearchParams(location.search).get("request");
    if (requestId) {
      setActiveSection("requests");
      setAutoOpenRequestId(requestId);
      navigate("/dashboard", { replace: true });
      // Clear autoOpenRequestId after dialog has time to open
      const timer = setTimeout(() => setAutoOpenRequestId(null), 500);
      return () => clearTimeout(timer);
    }
  }, [location.search, navigate]);

  const handleRemoveSaved = async (savedId: string) => {
    try {
      const result = await supabase
        .from("saved_vehicles")
        .delete()
        .eq("id", savedId);
      const { error } = result;

      if (error) throw error;

      setSavedVehicles(savedVehicles.filter(v => v.id !== savedId));
      toast({
        title: language === "it" ? "Rimosso" : "Removed",
        description: language === "it" ? "Veicolo rimosso dai preferiti" : "Vehicle removed from favorites",
      });
    } catch (error) {
      console.error("Error removing saved vehicle:", error);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;

    const validation = profileSchema.safeParse(formData);
    if (!validation.success) {
      toast({
        title: "Errore",
        description: validation.error.errors[0].message,
        variant: "destructive",
      });
      return;
    }

    setSaving(true);
    try {
      if (profile) {
        const { error } = await supabase
          .from("user_profiles")
          .update({
            name: formData.name,
            surname: formData.surname,
            phone: formData.phone,
            email: formData.email,
            updated_at: new Date().toISOString(),
          })
          .eq("user_id", user.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("user_profiles")
          .insert({
            user_id: user.id,
            name: formData.name,
            surname: formData.surname,
            phone: formData.phone,
            email: formData.email,
          });

        if (error) throw error;
      }

      if (formData.email !== user.email) {
        const { error: updateError } = await supabase.auth.updateUser({
          email: formData.email,
        });

        if (updateError) {
          toast({
            title: "Attenzione",
            description: "Profilo aggiornato, ma l'email richiede verifica.",
            variant: "default",
          });
        }
      }

      toast({
        title: language === "it" ? "Successo" : "Success",
        description: language === "it" ? "Profilo aggiornato" : "Profile updated",
      });

      await fetchProfile(user.id);
    } catch (error) {
      console.error("Error saving profile:", error);
      toast({
        title: "Errore",
        description: error.message || "Impossibile salvare il profilo",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleResendVerification = async () => {
    if (!user) return;

    setSendingVerification(true);
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: user.email!,
        options: {
          emailRedirectTo: `${window.location.origin}/dashboard`,
        },
      });

      if (error) throw error;

      toast({
        title: language === "it" ? "Email inviata" : "Email sent",
        description: language === "it" ? "Controlla la tua casella email" : "Check your inbox",
      });
    } catch (error) {
      console.error("Error resending verification:", error);
    } finally {
      setSendingVerification(false);
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      navigate("/");
      toast({
        title: language === "it" ? "Disconnesso" : "Logged out",
        description: language === "it" ? "Arrivederci!" : "Goodbye!",
      });
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const handleDeleteAccount = async () => {
    if (!user || !deletePassword) return;

    setDeleting(true);
    try {
      // Re-authenticate user with password
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user.email!,
        password: deletePassword,
      });

      if (signInError) {
        toast({
          title: language === "it" ? "Errore" : "Error",
          description: language === "it" ? "Password non corretta" : "Incorrect password",
          variant: "destructive",
        });
        return;
      }

      // Delete user profile data first
      await supabase.from("user_profiles").delete().eq("user_id", user.id);
      await supabase.from("saved_vehicles").delete().eq("user_id", user.id);

      // Sign out and inform user (actual account deletion requires admin API)
      await supabase.auth.signOut();
      
      toast({
        title: language === "it" ? "Account eliminato" : "Account deleted",
        description: language === "it" 
          ? "Il tuo account è stato eliminato con successo" 
          : "Your account has been successfully deleted",
      });
      
      navigate("/");
    } catch (error) {
      console.error("Error deleting account:", error);
      toast({
        title: language === "it" ? "Errore" : "Error",
        description: error instanceof Error ? error.message : (language === "it" ? "Impossibile eliminare l'account" : "Unable to delete account"),
        variant: "destructive",
      });
    } finally {
      setDeleting(false);
      setDeletePassword("");
      setDeleteDialogOpen(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || !currentPassword || !newPassword) return;

    if (newPassword !== confirmPassword) {
      toast({
        title: language === "it" ? "Errore" : "Error",
        description: language === "it" ? "Le password non corrispondono" : "Passwords do not match",
        variant: "destructive",
      });
      return;
    }

    if (newPassword.length < 6) {
      toast({
        title: language === "it" ? "Errore" : "Error",
        description: language === "it" ? "La password deve contenere almeno 6 caratteri" : "Password must be at least 6 characters",
        variant: "destructive",
      });
      return;
    }

    setChangingPassword(true);
    try {
      // Re-authenticate with current password
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user.email!,
        password: currentPassword,
      });

      if (signInError) {
        toast({
          title: language === "it" ? "Errore" : "Error",
          description: language === "it" ? "Password attuale non corretta" : "Current password is incorrect",
          variant: "destructive",
        });
        return;
      }

      // Update password
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (updateError) throw updateError;

      toast({
        title: language === "it" ? "Successo" : "Success",
        description: language === "it" ? "Password aggiornata con successo" : "Password updated successfully",
      });

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      console.error("Error changing password:", error);
      toast({
        title: language === "it" ? "Errore" : "Error",
        description: error instanceof Error ? error.message : (language === "it" ? "Impossibile cambiare la password" : "Unable to change password"),
        variant: "destructive",
      });
    } finally {
      setChangingPassword(false);
    }
  };

  const isEmailVerified = user?.email_confirmed_at !== null && user?.email_confirmed_at !== undefined;

  const menuItems = [
    { id: "overview" as const, label: language === "it" ? "Panoramica" : "Overview", icon: Home },
    { id: "favorites" as const, label: language === "it" ? "Preferiti" : "Favorites", icon: Heart, count: savedVehicles.length },
    { id: "requests" as const, label: language === "it" ? "Richieste" : "Requests", icon: FileText, count: requests.length },
    { id: "profile" as const, label: language === "it" ? "Profilo" : "Profile", icon: User },
    { id: "settings" as const, label: language === "it" ? "Impostazioni" : "Settings", icon: Settings },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container py-8">
          <Skeleton className="h-8 w-64 mb-4" />
          <Skeleton className="h-96 w-full" />
        </div>
        <Footer />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const userName = profile?.name && profile?.surname 
    ? `${profile.name} ${profile.surname}` 
    : profile?.name || user.email?.split('@')[0] || 'Utente';

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container py-6 lg:py-8 max-w-7xl">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* Sidebar */}
          <aside className="lg:w-72 flex-shrink-0">
            <Card className="sticky top-24 border-border/50">
              <CardContent className="p-4 lg:p-6">
                {/* User Info */}
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-primary-foreground text-xl font-bold shadow-lg">
                    {userName.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-foreground truncate">{userName}</h3>
                    <p className="text-sm text-muted-foreground truncate">{user.email}</p>
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
                    <button
                      key={item.id}
                      onClick={() => setActiveSection(item.id)}
                      className={cn(
                        "w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all",
                        activeSection === item.id
                          ? "bg-primary text-primary-foreground shadow-sm"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted"
                      )}
                    >
                      <span className="flex items-center gap-3">
                        <item.icon className="w-4 h-4" />
                        {item.label}
                      </span>
                      {item.count !== undefined && item.count > 0 && (
                        <Badge variant={activeSection === item.id ? "secondary" : "outline"} className="text-xs">
                          {item.count}
                        </Badge>
                      )}
                    </button>
                  ))}
                </nav>

                <Separator className="my-4" />

                <Button 
                  variant="ghost" 
                  className="w-full justify-start text-muted-foreground hover:text-destructive"
                  onClick={handleLogout}
                >
                  <LogOut className="w-4 h-4 mr-3" />
                  {language === "it" ? "Esci" : "Logout"}
                </Button>
              </CardContent>
            </Card>
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            {/* Overview Section */}
            {activeSection === "overview" && (
              <div className="space-y-6">
                {/* Welcome Banner */}
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/15 via-primary/5 to-transparent p-6 lg:p-8 border border-primary/20">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                  <div className="relative z-10">
                    <h1 className="text-2xl lg:text-3xl font-bold text-foreground mb-2">
                      {language === "it" ? "Bentornato" : "Welcome back"}, {profile?.name || userName}!
                    </h1>
                    <p className="text-muted-foreground">
                      {language === "it" 
                        ? "Gestisci i tuoi veicoli preferiti, richieste di valutazione e impostazioni del profilo."
                        : "Manage your favorite vehicles, valuation requests, and profile settings."}
                    </p>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <Card 
                    className="border-border/50 cursor-pointer hover:border-primary/50 transition-all group"
                    onClick={() => setActiveSection("favorites")}
                  >
                    <CardContent className="p-5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="p-3 rounded-xl bg-red-500/10 group-hover:bg-red-500/20 transition-colors">
                            <Heart className="w-5 h-5 text-red-500" />
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">{language === "it" ? "Preferiti" : "Favorites"}</p>
                            <p className="text-2xl font-bold">{savedVehicles.length}</p>
                          </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card 
                    className="border-border/50 cursor-pointer hover:border-primary/50 transition-all group"
                    onClick={() => setActiveSection("requests")}
                  >
                    <CardContent className="p-5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="p-3 rounded-xl bg-blue-500/10 group-hover:bg-blue-500/20 transition-colors">
                            <FileText className="w-5 h-5 text-blue-500" />
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">{language === "it" ? "Richieste" : "Requests"}</p>
                            <p className="text-2xl font-bold">{requests.length}</p>
                          </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card 
                    className="border-border/50 cursor-pointer hover:border-primary/50 transition-all group"
                    onClick={() => setActiveSection("requests")}
                  >
                    <CardContent className="p-5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="p-3 rounded-xl bg-green-500/10 group-hover:bg-green-500/20 transition-colors">
                            <Euro className="w-5 h-5 text-green-500" />
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">{language === "it" ? "Offerte" : "Offers"}</p>
                            <p className="text-2xl font-bold">{requests.filter(r => r.final_offer).length}</p>
                          </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* My Valuation Requests */}
                <Card className="border-border/50">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="w-5 h-5 text-primary" />
                      {language === "it" ? "Le Mie Richieste di Valutazione" : "My Valuation Requests"}
                    </CardTitle>
                    {requests.length > 0 && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => setActiveSection("requests")}
                        className="text-primary hover:text-primary"
                      >
                        {language === "it" ? "Vedi tutte" : "View all"}
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </Button>
                    )}
                  </CardHeader>
                  <CardContent>
                    {loadingRequests ? (
                      <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                          <Skeleton key={i} className="h-20 rounded-xl" />
                        ))}
                      </div>
                    ) : requests.length > 0 ? (
                      <div className="space-y-3">
                        {requests.slice(0, 5).map((request) => (
                          <button
                            key={request.id}
                            onClick={() => setActiveSection("requests")}
                            className="w-full flex items-center justify-between p-4 rounded-xl bg-muted/30 border border-border/50 hover:bg-muted/50 hover:border-primary/30 transition-all cursor-pointer text-left group"
                          >
                            <div className="flex items-center gap-4">
                              <div className="p-2.5 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                                <Car className="w-5 h-5 text-primary" />
                              </div>
                              <div>
                                <p className="font-medium group-hover:text-primary transition-colors">
                                  {request.make} {request.model} ({request.year})
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  {new Date(request.created_at).toLocaleDateString(language === "it" ? "it-IT" : "en-US")}
                                  {request.final_offer && (
                                    <span className="ml-2 text-green-600 font-medium">
                                      • €{request.final_offer.toLocaleString()}
                                    </span>
                                  )}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge className={`${statusColors[request.status]} text-xs`}>
                                {statusLabels[request.status]}
                              </Badge>
                              <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                            </div>
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <div className="p-4 rounded-full bg-muted/50 w-fit mx-auto mb-4">
                          <FileText className="w-8 h-8 text-muted-foreground" />
                        </div>
                        <p className="text-muted-foreground mb-2">
                          {language === "it" ? "Nessuna richiesta di valutazione" : "No valuation requests"}
                        </p>
                        <p className="text-sm text-muted-foreground mb-4">
                          {language === "it" 
                            ? "Vuoi vendere la tua auto? Richiedi una valutazione gratuita!"
                            : "Want to sell your car? Request a free valuation!"}
                        </p>
                        <Button asChild>
                          <Link to="/valutiamo">
                            <TrendingUp className="w-4 h-4 mr-2" />
                            {language === "it" ? "Richiedi Valutazione" : "Request Valuation"}
                          </Link>
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Favorites Section */}
            {activeSection === "favorites" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold">{language === "it" ? "Veicoli Preferiti" : "Favorite Vehicles"}</h2>
                    <p className="text-muted-foreground">{savedVehicles.length} {language === "it" ? "veicoli salvati" : "saved vehicles"}</p>
                  </div>
                  <Button asChild variant="outline">
                    <Link to="/listings">
                      <Car className="w-4 h-4 mr-2" />
                      {language === "it" ? "Sfoglia Veicoli" : "Browse Vehicles"}
                    </Link>
                  </Button>
                </div>

                {loadingSaved ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {[1, 2, 3].map((i) => (
                      <Skeleton key={i} className="h-80 rounded-xl" />
                    ))}
                  </div>
                ) : savedVehicles.length === 0 ? (
                  <Card className="border-dashed border-2">
                    <CardContent className="flex flex-col items-center justify-center py-16">
                      <div className="p-4 rounded-full bg-muted/50 mb-4">
                        <Heart className="w-12 h-12 text-muted-foreground" />
                      </div>
                      <h3 className="text-xl font-semibold mb-2">{language === "it" ? "Nessun preferito" : "No favorites"}</h3>
                      <p className="text-muted-foreground text-center mb-6 max-w-sm">
                        {language === "it" 
                          ? "Non hai ancora salvato nessun veicolo. Inizia a sfogliare i nostri annunci!"
                          : "You haven't saved any vehicles yet. Start browsing our listings!"}
                      </p>
                      <Button asChild size="lg">
                        <Link to="/listings">
                          <Car className="w-4 h-4 mr-2" />
                          {language === "it" ? "Esplora Veicoli" : "Explore Vehicles"}
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {savedVehicles.map((saved) => (
                      <div key={saved.id} className="relative group">
                        <VehicleCard vehicle={saved.vehicle_data} />
                        <Button
                          variant="destructive"
                          size="icon"
                          className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                          onClick={() => handleRemoveSaved(saved.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Requests Section */}
            {activeSection === "requests" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold">{language === "it" ? "Richieste di Valutazione" : "Valuation Requests"}</h2>
                    <p className="text-muted-foreground">{requests.length} {language === "it" ? "richieste inviate" : "requests sent"}</p>
                  </div>
                  <Button asChild>
                    <Link to="/valutiamo">
                      <Euro className="w-4 h-4 mr-2" />
                      {language === "it" ? "Nuova Valutazione" : "New Valuation"}
                    </Link>
                  </Button>
                </div>

                {loadingRequests ? (
                  <div className="space-y-4">
                    {[1, 2].map((i) => (
                      <Skeleton key={i} className="h-48 rounded-xl" />
                    ))}
                  </div>
                ) : requests.length === 0 ? (
                  <Card className="border-dashed border-2">
                    <CardContent className="flex flex-col items-center justify-center py-16">
                      <div className="p-4 rounded-full bg-muted/50 mb-4">
                        <FileText className="w-12 h-12 text-muted-foreground" />
                      </div>
                      <h3 className="text-xl font-semibold mb-2">{language === "it" ? "Nessuna richiesta" : "No requests"}</h3>
                      <p className="text-muted-foreground text-center mb-6 max-w-sm">
                        {language === "it" 
                          ? "Non hai ancora inviato richieste di valutazione. Scopri quanto vale il tuo veicolo!"
                          : "You haven't submitted any valuation requests yet. Find out how much your vehicle is worth!"}
                      </p>
                      <Button asChild size="lg">
                        <Link to="/valutiamo">
                          <Euro className="w-4 h-4 mr-2" />
                          {language === "it" ? "Richiedi Valutazione" : "Request Valuation"}
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-4">
                    {requests.map((request) => (
                      <ClientRequestCard
                        key={request.id}
                        request={request}
                        autoOpen={autoOpenRequestId === request.id}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Profile Section */}
            {activeSection === "profile" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold">{language === "it" ? "Il Mio Profilo" : "My Profile"}</h2>
                  <p className="text-muted-foreground">{language === "it" ? "Le tue informazioni personali" : "Your personal information"}</p>
                </div>

                <Card className="border-border/50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="w-5 h-5 text-primary" />
                      {language === "it" ? "Dati Personali" : "Personal Data"}
                    </CardTitle>
                    <CardDescription>
                      {language === "it" ? "Riepilogo delle tue informazioni" : "Summary of your information"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 rounded-xl border bg-muted/30">
                        <p className="text-sm text-muted-foreground mb-1">{language === "it" ? "Nome" : "First Name"}</p>
                        <p className="font-medium flex items-center gap-2">
                          <User className="w-4 h-4 text-primary" />
                          {profile?.name || "-"}
                        </p>
                      </div>
                      <div className="p-4 rounded-xl border bg-muted/30">
                        <p className="text-sm text-muted-foreground mb-1">{language === "it" ? "Cognome" : "Last Name"}</p>
                        <p className="font-medium flex items-center gap-2">
                          <User className="w-4 h-4 text-primary" />
                          {profile?.surname || "-"}
                        </p>
                      </div>
                    </div>

                    <div className="p-4 rounded-xl border bg-muted/30">
                      <p className="text-sm text-muted-foreground mb-1">Email</p>
                      <p className="font-medium flex items-center gap-2">
                        <Mail className="w-4 h-4 text-primary" />
                        {user?.email || "-"}
                      </p>
                    </div>

                    <div className="p-4 rounded-xl border bg-muted/30">
                      <p className="text-sm text-muted-foreground mb-1">{language === "it" ? "Telefono" : "Phone"}</p>
                      <p className="font-medium flex items-center gap-2">
                        <Phone className="w-4 h-4 text-primary" />
                        {profile?.phone || "-"}
                      </p>
                    </div>

                    <div className="p-4 rounded-xl border bg-muted/30">
                      <p className="text-sm text-muted-foreground mb-1">{language === "it" ? "Account creato" : "Account created"}</p>
                      <p className="font-medium flex items-center gap-2">
                        <Clock className="w-4 h-4 text-primary" />
                        {user?.created_at ? new Date(user.created_at).toLocaleDateString(language === "it" ? "it-IT" : "en-US", {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        }) : '-'}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Settings Section */}
            {activeSection === "settings" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold">{language === "it" ? "Impostazioni" : "Settings"}</h2>
                  <p className="text-muted-foreground">{language === "it" ? "Gestisci le preferenze del tuo account" : "Manage your account preferences"}</p>
                </div>


                {/* Change Password */}
                <Card className="border-border/50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Lock className="w-5 h-5 text-primary" />
                      {language === "it" ? "Cambia Password" : "Change Password"}
                    </CardTitle>
                    <CardDescription>
                      {language === "it" ? "Aggiorna la password del tuo account" : "Update your account password"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleChangePassword} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="current-password">{language === "it" ? "Password attuale" : "Current password"}</Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input
                            id="current-password"
                            type="password"
                            placeholder={language === "it" ? "La tua password attuale" : "Your current password"}
                            className="pl-10"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            disabled={changingPassword}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="new-password">{language === "it" ? "Nuova password" : "New password"}</Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input
                            id="new-password"
                            type="password"
                            placeholder={language === "it" ? "La tua nuova password" : "Your new password"}
                            className="pl-10"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            disabled={changingPassword}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="confirm-password">{language === "it" ? "Conferma password" : "Confirm password"}</Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input
                            id="confirm-password"
                            type="password"
                            placeholder={language === "it" ? "Conferma la nuova password" : "Confirm your new password"}
                            className="pl-10"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            disabled={changingPassword}
                          />
                        </div>
                      </div>

                      <Button 
                        type="submit" 
                        disabled={changingPassword || !currentPassword || !newPassword || !confirmPassword}
                      >
                        {changingPassword ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            {language === "it" ? "Aggiornamento..." : "Updating..."}
                          </>
                        ) : (
                          <>
                            <Save className="w-4 h-4 mr-2" />
                            {language === "it" ? "Aggiorna password" : "Update password"}
                          </>
                        )}
                      </Button>
                    </form>
                  </CardContent>
                </Card>

                {/* Delete Account */}
                <Card className="border-destructive/50">
                  <CardContent className="pt-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border border-destructive/20 bg-destructive/5">
                      <div>
                        <p className="font-medium text-destructive">
                          {language === "it" ? "Elimina Account" : "Delete Account"}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {language === "it" 
                            ? "Elimina permanentemente il tuo account e tutti i dati associati" 
                            : "Permanently delete your account and all associated data"}
                        </p>
                      </div>
                      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                        <AlertDialogTrigger asChild>
                          <Button variant="destructive" className="shrink-0">
                            <Trash2 className="w-4 h-4 mr-2" />
                            {language === "it" ? "Elimina Account" : "Delete Account"}
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle className="flex items-center gap-2">
                              <AlertTriangle className="w-5 h-5 text-destructive" />
                              {language === "it" ? "Conferma Eliminazione Account" : "Confirm Account Deletion"}
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              {language === "it" 
                                ? "Questa azione è irreversibile. Tutti i tuoi dati, preferiti e richieste verranno eliminati permanentemente." 
                                : "This action is irreversible. All your data, favorites, and requests will be permanently deleted."}
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <div className="space-y-4 py-4">
                            <div className="space-y-2">
                              <Label htmlFor="delete-password" className="text-sm font-medium">
                                {language === "it" ? "Inserisci la tua password per confermare" : "Enter your password to confirm"}
                              </Label>
                              <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <Input
                                  id="delete-password"
                                  type="password"
                                  placeholder={language === "it" ? "La tua password" : "Your password"}
                                  className="pl-10"
                                  value={deletePassword}
                                  onChange={(e) => setDeletePassword(e.target.value)}
                                  disabled={deleting}
                                />
                              </div>
                            </div>
                          </div>
                          <AlertDialogFooter>
                            <AlertDialogCancel disabled={deleting}>
                              {language === "it" ? "Annulla" : "Cancel"}
                            </AlertDialogCancel>
                            <Button
                              variant="destructive"
                              onClick={handleDeleteAccount}
                              disabled={!deletePassword || deleting}
                            >
                              {deleting ? (
                                <>
                                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                  {language === "it" ? "Eliminazione..." : "Deleting..."}
                                </>
                              ) : (
                                <>
                                  <Trash2 className="w-4 h-4 mr-2" />
                                  {language === "it" ? "Elimina definitivamente" : "Delete permanently"}
                                </>
                              )}
                            </Button>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </CardContent>
                </Card>

              </div>
            )}
          </main>
        </div>
      </div>
      <Footer />
    </div>
  );
}
