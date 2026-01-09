import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";
import { Loader2, ShieldCheck, Mail, Lock, User, Phone, ArrowLeft } from "lucide-react";
import { z } from "zod";
import { Header } from "@/components/Header";
import { Footer } from "@/components/home/Footer";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Auth() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [phone, setPhone] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [activeTab, setActiveTab] = useState("login");
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [sendingReset, setSendingReset] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [resettingPassword, setResettingPassword] = useState(false);

  const loginSchema = z.object({
    email: z.string().email(t("auth.error.invalidEmail")),
    password: z.string().min(6, t("auth.error.passwordMin")),
  });

  const signupSchema = z.object({
    name: z.string().min(2, t("auth.error.nameMin")),
    surname: z.string().min(2, t("auth.error.surnameMin")),
    email: z.string().email(t("auth.error.invalidEmail")),
    phone: z.string().min(10, t("auth.error.phoneMin")),
    password: z.string().min(6, t("auth.error.passwordMin")),
  });

  useEffect(() => {
    // Check if this is a password reset callback from URL hash
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const accessToken = hashParams.get('access_token');
    const type = hashParams.get('type');
    
    if (accessToken && type === 'recovery') {
      // This is a password reset callback
      setShowForgotPassword(false);
      setActiveTab("reset");
      setCheckingAuth(false);
      // Clear the hash from URL
      window.history.replaceState(null, '', window.location.pathname + window.location.search);
      return;
    }

    // Check URL search params for mode (only if not in password recovery)
    const mode = searchParams.get('mode');
    if (mode === 'signup') {
      setActiveTab("signup");
      setIsSignUp(true);
    } else {
      setActiveTab("login");
      setIsSignUp(false);
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      // Handle password recovery flow via URL hash
      const isPasswordRecovery = accessToken && type === 'recovery';
      
      if (isPasswordRecovery) {
        setShowForgotPassword(false);
        setActiveTab("reset");
        setCheckingAuth(false);
        return;
      }

      if (session?.user && event === 'SIGNED_IN') {
        // Check if user is admin
        const { data: isAdmin } = await supabase.rpc("has_role", {
          _user_id: session.user.id,
          _role: "admin"
        });
        
        if (isAdmin) {
          navigate("/admin");
        } else {
          navigate("/dashboard");
        }
      }
      setCheckingAuth(false);
    });

    // Only check session if not in password reset flow
    if (!(accessToken && type === 'recovery')) {
      supabase.auth.getSession().then(async ({ data: { session } }) => {
        if (session?.user) {
          // Check if user is admin
          const { data: isAdmin } = await supabase.rpc("has_role", {
            _user_id: session.user.id,
            _role: "admin"
          });
          
          if (isAdmin) {
            navigate("/admin");
          } else {
            navigate("/dashboard");
          }
        }
        setCheckingAuth(false);
      });
    }

    return () => subscription.unsubscribe();
  }, [navigate, searchParams]);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSignUp) {
      const validation = signupSchema.safeParse({ name, surname, email, phone, password });
      if (!validation.success) {
        toast({
          title: t("auth.error"),
          description: validation.error.errors[0].message,
          variant: "destructive",
        });
        return;
      }
    } else {
      const validation = loginSchema.safeParse({ email, password });
      if (!validation.success) {
        toast({
          title: t("auth.error"),
          description: validation.error.errors[0].message,
          variant: "destructive",
        });
        return;
      }
    }

    setLoading(true);
    try {
      if (isSignUp) {
        const { data: signUpData, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/dashboard`,
            data: {
              name,
              surname,
              phone,
              full_name: `${name} ${surname}`,
            },
          },
        });

        if (error) {
          if (error.message.includes("already registered")) {
            throw new Error(t("auth.error.alreadyRegistered"));
          }
          throw error;
        }

        // Create or update user profile in the database
        // Use upsert to handle case where trigger already created profile
        if (signUpData.user) {
          const result = await supabase
            .from("user_profiles")
            .upsert({
              user_id: signUpData.user.id,
              name,
              surname,
              phone,
              email: email,
              updated_at: new Date().toISOString(),
            }, {
              onConflict: 'user_id'
            });

          const { error: profileError } = result;

          if (profileError) {
            console.error("Error creating/updating user profile:", profileError);
            // Don't throw - profile can be created later, metadata is already saved
          }
        }

        toast({
          title: t("auth.success.registered"),
          description: t("auth.success.registeredDesc"),
        });
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          if (error.message.includes("Invalid login")) {
            throw new Error(t("auth.error.invalidLogin"));
          }
          throw error;
        }
      }
    } catch (error) {
      toast({
        title: t("auth.error"),
        description: error instanceof Error ? error.message : t("auth.error.auth"),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
          queryParams: {
            prompt: "select_account", // Force Google to show account selection screen
          },
        },
      });

      if (error) throw error;
    } catch (error) {
      toast({
        title: t("auth.error"),
        description: error instanceof Error ? error.message : t("auth.error.google"),
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!resetEmail) {
      toast({
        title: t("auth.error"),
        description: t("auth.error.enterEmail"),
        variant: "destructive",
      });
      return;
    }

    const emailValidation = z.string().email(t("auth.error.invalidEmail")).safeParse(resetEmail);
    if (!emailValidation.success) {
      toast({
        title: t("auth.error"),
        description: emailValidation.error.errors[0].message,
        variant: "destructive",
      });
      return;
    }

    setSendingReset(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
        redirectTo: `${window.location.origin}/auth`,
      });

      if (error) throw error;

      toast({
        title: t("auth.success.emailSent"),
        description: t("auth.success.emailSentDesc"),
      });
      setResetEmail("");
    } catch (error) {
      toast({
        title: t("auth.error"),
        description: error instanceof Error ? error.message : t("auth.error.sendReset"),
        variant: "destructive",
      });
    } finally {
      setSendingReset(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword.length < 6) {
      toast({
        title: t("auth.error"),
        description: t("auth.error.passwordMin"),
        variant: "destructive",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      toast({
        title: t("auth.error"),
        description: t("auth.error.passwordMismatch"),
        variant: "destructive",
      });
      return;
    }

    setResettingPassword(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) throw error;

      toast({
        title: t("auth.success"),
        description: t("auth.success.passwordUpdated"),
      });

      // Clear form and go back to login
      setNewPassword("");
      setConfirmPassword("");
      setActiveTab("login");
      setShowForgotPassword(false);
    } catch (error) {
      toast({
        title: t("auth.error"),
        description: error instanceof Error ? error.message : t("auth.error.updatePassword"),
        variant: "destructive",
      });
    } finally {
      setResettingPassword(false);
    }
  };

  if (checkingAuth) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 flex items-center justify-center p-4 py-12">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <ShieldCheck className="w-6 h-6 text-primary" />
            </div>
            <CardTitle className="text-2xl">{t("auth.title")}</CardTitle>
            <CardDescription>
              {t("auth.subtitle")}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Email/Password Form */}
            <Tabs value={activeTab} onValueChange={(v) => { 
              setActiveTab(v); 
              setIsSignUp(v === "signup");
              setShowForgotPassword(v === "forgot");
            }}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">{t("auth.login.tab")}</TabsTrigger>
                <TabsTrigger value="signup">{t("auth.signup.tab")}</TabsTrigger>
              </TabsList>
              
              <TabsContent value="login" className="space-y-4 mt-4">
                <form onSubmit={handleEmailLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">{t("auth.email")}</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder={t("auth.email.placeholder")}
                        className="pl-10"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={loading}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">{t("auth.password")}</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="password"
                        type="password"
                        placeholder="••••••••"
                        className="pl-10"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={loading}
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-end">
                    <Button
                      type="button"
                      variant="link"
                      className="px-0 text-sm"
                      onClick={() => {
                        setShowForgotPassword(true);
                        setActiveTab("forgot");
                      }}
                    >
                      {t("auth.forgot")}
                    </Button>
                  </div>
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : t("auth.login.button")}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="forgot" className="space-y-4 mt-4">
                <div className="space-y-4">
                  <div className="text-center space-y-2">
                    <h3 className="text-lg font-semibold">{t("auth.forgot.title")}</h3>
                    <p className="text-sm text-muted-foreground">
                      {t("auth.forgot.subtitle")}
                    </p>
                  </div>
                  <form onSubmit={handleForgotPassword} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="reset-email">{t("auth.email")}</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="reset-email"
                          type="email"
                          placeholder={t("auth.email.placeholder")}
                          className="pl-10"
                          value={resetEmail}
                          onChange={(e) => setResetEmail(e.target.value)}
                          disabled={sendingReset}
                        />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        className="flex-1"
                        onClick={() => {
                          setShowForgotPassword(false);
                          setActiveTab("login");
                          setResetEmail("");
                        }}
                      >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        {t("auth.forgot.back")}
                      </Button>
                      <Button type="submit" className="flex-1" disabled={sendingReset}>
                        {sendingReset ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <>
                            <Mail className="w-4 h-4 mr-2" />
                            {t("auth.forgot.send")}
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                </div>
              </TabsContent>

              <TabsContent value="reset" className="space-y-4 mt-4">
                <div className="space-y-4">
                  <div className="text-center space-y-2">
                    <h3 className="text-lg font-semibold">{t("auth.reset.title")}</h3>
                    <p className="text-sm text-muted-foreground">
                      {t("auth.reset.subtitle")}
                    </p>
                  </div>
                  <form onSubmit={handleResetPassword} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="new-password">{t("auth.reset.newPassword")}</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="new-password"
                          type="password"
                          placeholder={t("auth.password.placeholder")}
                          className="pl-10"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          disabled={resettingPassword}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">{t("auth.reset.confirmPassword")}</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="confirm-password"
                          type="password"
                          placeholder={t("auth.reset.confirm.placeholder")}
                          className="pl-10"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          disabled={resettingPassword}
                        />
                      </div>
                    </div>
                    <Button type="submit" className="w-full" disabled={resettingPassword}>
                      {resettingPassword ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          {t("auth.reset.updating")}
                        </>
                      ) : (
                        <>
                          <Lock className="w-4 h-4 mr-2" />
                          {t("auth.reset.button")}
                        </>
                      )}
                    </Button>
                  </form>
                </div>
              </TabsContent>
              
              <TabsContent value="signup" className="space-y-4 mt-4">
                <form onSubmit={handleEmailLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-name">{t("auth.name")}</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="signup-name"
                        type="text"
                        placeholder={t("auth.name.placeholder")}
                        className="pl-10"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        disabled={loading}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-surname">{t("auth.surname")}</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="signup-surname"
                        type="text"
                        placeholder={t("auth.surname.placeholder")}
                        className="pl-10"
                        value={surname}
                        onChange={(e) => setSurname(e.target.value)}
                        disabled={loading}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">{t("auth.email")}</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="signup-email"
                        type="email"
                        placeholder={t("auth.email.placeholder")}
                        className="pl-10"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={loading}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-phone">{t("auth.phone")}</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="signup-phone"
                        type="tel"
                        placeholder={t("auth.phone.placeholder")}
                        className="pl-10"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        disabled={loading}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">{t("auth.password")}</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="signup-password"
                        type="password"
                        placeholder={t("auth.password.placeholder")}
                        className="pl-10"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={loading}
                        required
                      />
                    </div>
                  </div>
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : t("auth.signup.button")}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">{t("auth.or")}</span>
              </div>
            </div>

            {/* Google Login */}
            <Button
              variant="outline"
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
              )}
              {t("auth.google")}
            </Button>
            
            <p className="text-xs text-muted-foreground text-center">
              {t("auth.footer")}
            </p>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
