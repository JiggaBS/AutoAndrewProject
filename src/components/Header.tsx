import { Link, useLocation, useNavigate } from "react-router-dom";
import { Car, Menu, X, Home, User, LogOut, Shield, Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { useState, useEffect, forwardRef } from "react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { User as SupabaseUser } from "@supabase/supabase-js";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { NotificationBell } from "@/components/NotificationBell";

export const Header = forwardRef<HTMLElement>((props, ref) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLogoTextVisible, setIsLogoTextVisible] = useState(true);
  const [isPublishButtonVisible, setIsPublishButtonVisible] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, setTheme, resolvedTheme } = useTheme();
  const { t } = useLanguage();

  const navLinks = [
    { to: "/", label: t("nav.home"), icon: Home },
    { to: "/listings", label: t("nav.listings") },
    { to: "/valutiamo", label: t("nav.valutiamo") },
    { to: "/contatti", label: t("nav.contact") },
  ];

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        checkAdminRole(session.user.id);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        setTimeout(() => {
          checkAdminRole(session.user.id);
        }, 0);
      } else {
        setIsAdmin(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkAdminRole = async (userId: string) => {
    try {
      const { data, error } = await supabase.rpc('has_role', {
        _user_id: userId,
        _role: 'admin'
      });
      if (!error) {
        setIsAdmin(data === true);
      }
    } catch (error) {
      console.error("Error checking admin role:", error);
    }
  };

  useEffect(() => {
    // Fetch logo text visibility setting from backend
    const fetchLogoTextSetting = async () => {
      try {
        const result = await supabase
          .from("app_settings")
          .select("value")
          .eq("key", "logo_text_visible")
          .maybeSingle();

        const { data, error } = result;

        if (error) {
          console.error("Error fetching logo text setting:", error);
        } else if (data) {
          setIsLogoTextVisible(data.value === "true");
        }
      } catch (error) {
        console.error("Error fetching logo text setting:", error);
      }
    };

    // Fetch publish button visibility setting from backend
    const fetchPublishButtonSetting = async () => {
      try {
        const result = await supabase
          .from("app_settings")
          .select("value")
          .eq("key", "publish_button_visible")
          .maybeSingle();

        const { data, error } = result;

        if (error) {
          console.error("Error fetching publish button setting:", error);
        } else if (data) {
          setIsPublishButtonVisible(data.value === "true");
        }
      } catch (error) {
        console.error("Error fetching publish button setting:", error);
      }
    };

    fetchLogoTextSetting();
    fetchPublishButtonSetting();

    // Subscribe to real-time changes
    const channel = supabase
      .channel("app_settings_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "app_settings",
          filter: "key=eq.logo_text_visible",
        },
        (payload) => {
          if (payload.new && typeof payload.new === 'object' && 'value' in payload.new) {
            setIsLogoTextVisible(payload.new.value === "true");
          }
        }
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "app_settings",
          filter: "key=eq.publish_button_visible",
        },
        (payload) => {
          if (payload.new && typeof payload.new === 'object' && 'value' in payload.new) {
            setIsPublishButtonVisible(payload.new.value === "true");
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      navigate("/");
      toast({
        title: t("nav.logout"),
        description: t("nav.logout"),
      });
    } catch (error) {
      console.error("Error logging out:", error);
      toast({
        title: t("common.error"),
        description: t("common.error"),
        variant: "destructive",
      });
    }
  };

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  return (
    <header 
      ref={ref}
      className="sticky top-0 z-50 bg-card/95 backdrop-blur-md border-b border-border/80 shadow-sm dark:shadow-none"
    >
      <div className="container">
        <div className="flex items-center justify-between h-[72px]">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center gap-2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-card rounded-md px-1"
          >
            <Car className="w-9 h-9 text-primary" />
            {isLogoTextVisible && (
              <span className="text-xl font-bold text-foreground tracking-tight">AutoAndrew</span>
            )}
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.to}
                className={cn(
                  "relative px-4 py-2.5 text-[15px] font-medium transition-all duration-200 rounded-lg",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-card",
                  isActive(link.to)
                    ? "text-primary bg-primary/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/60",
                )}
              >
                {link.label}
                {isActive(link.to) && (
                  <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-primary rounded-full" />
                )}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2.5">
            {/* Language Switcher */}
            <LanguageSwitcher />
            
            {/* Theme Toggle */}
            <button
              onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
              className="p-2.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-card"
              aria-label="Toggle theme"
            >
              {resolvedTheme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* Notification Bell */}
            {user && (
              <NotificationBell 
                isAdmin={isAdmin} 
                userId={user.id} 
                userEmail={user.email} 
              />
            )}
            
            {isPublishButtonVisible && (
              <Button variant="outline" size="sm" className="hidden sm:flex h-10">
                Pubblica annuncio
              </Button>
            )}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="hidden sm:flex h-10 focus-visible:ring-2 focus-visible:ring-primary"
                  >
                    <User className="w-4 h-4 mr-2" />
                    {t("nav.dashboard")}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  {isAdmin && (
                    <>
                      <DropdownMenuItem asChild>
                        <Link to="/admin" className="cursor-pointer text-primary font-medium">
                          <Shield className="w-4 h-4 mr-2" />
                          {t("nav.admin")}
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                    </>
                  )}
                  <DropdownMenuItem asChild>
                    <Link to="/dashboard" className="cursor-pointer">
                      <User className="w-4 h-4 mr-2" />
                      {t("nav.dashboard")}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                    <LogOut className="w-4 h-4 mr-2" />
                    {t("nav.logout")}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button 
                variant="outline" 
                size="sm" 
                className="hidden sm:flex h-10" 
                asChild
              >
                <Link to="/auth">{t("nav.login")}</Link>
              </Button>
            )}

            {/* Mobile Menu Toggle */}
            <button 
              className="md:hidden p-2.5 rounded-lg hover:bg-secondary/60 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary" 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMenuOpen ? <X className="w-6 h-6 text-foreground" /> : <Menu className="w-6 h-6 text-foreground" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <nav className="md:hidden py-4 border-t border-border/60 animate-fade-in">
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  to={link.to}
                  className={cn(
                    "text-[15px] font-medium px-4 py-3 rounded-lg transition-colors",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-inset",
                    isActive(link.to) 
                      ? "text-primary bg-primary/10" 
                      : "text-foreground hover:bg-secondary/60",
                  )}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <div className="flex flex-col gap-2 mt-4 pt-4 border-t border-border/60">
                {user ? (
                  <>
                    {isAdmin && (
                      <Button size="sm" className="w-full h-11" asChild>
                        <Link to="/admin" onClick={() => setIsMenuOpen(false)}>
                          <Shield className="w-4 h-4 mr-2" />
                          {t("nav.admin")}
                        </Link>
                      </Button>
                    )}
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1 h-11" asChild>
                        <Link to="/dashboard" onClick={() => setIsMenuOpen(false)}>
                          <User className="w-4 h-4 mr-2" />
                          {t("nav.dashboard")}
                        </Link>
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1 h-11" onClick={handleLogout}>
                        <LogOut className="w-4 h-4 mr-2" />
                        {t("nav.logout")}
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      className={cn(
                        "flex-1 font-semibold transition-all h-11 text-[15px] rounded-lg border border-border/50",
                        "focus-visible:ring-2 focus-visible:ring-primary",
                        location.pathname === "/auth" && !location.search.includes("mode=signup")
                          ? "bg-card text-foreground shadow-sm"
                          : "bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/80"
                      )}
                      asChild
                    >
                      <Link to="/auth" onClick={() => setIsMenuOpen(false)}>
                        {t("auth.login.button")}
                      </Link>
                    </Button>
                    <Button
                      variant="ghost"
                      className={cn(
                        "flex-1 font-semibold transition-all h-11 text-[15px] rounded-lg border border-border/50",
                        "focus-visible:ring-2 focus-visible:ring-primary",
                        location.pathname === "/auth" && location.search.includes("mode=signup")
                          ? "bg-card text-foreground shadow-sm"
                          : "bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/80"
                      )}
                      asChild
                    >
                      <Link to="/auth?mode=signup" onClick={() => setIsMenuOpen(false)}>
                        {t("auth.signup.button")}
                      </Link>
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
});

Header.displayName = "Header";
