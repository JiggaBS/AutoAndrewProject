import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Settings, Bell, Moon, Sun, Mail, Save, Eye, EyeOff } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export function AdminSettings() {
  const [isDarkMode, setIsDarkMode] = useState(!document.documentElement.classList.contains("light"));
  const [notifyEmail, setNotifyEmail] = useState("");
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [logoTextVisible, setLogoTextVisible] = useState(true);
  const [publishButtonVisible, setPublishButtonVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      // Fetch logo text visibility
      const logoResult = await supabase
        .from("app_settings")
        .select("key, value")
        .eq("key", "logo_text_visible")
        .maybeSingle();

      const { data: logoData, error: logoError } = logoResult;

      if (!logoError && logoData) {
        setLogoTextVisible(logoData.value === "true");
      }

      // Fetch publish button visibility
      const publishResult = await supabase
        .from("app_settings")
        .select("key, value")
        .eq("key", "publish_button_visible")
        .maybeSingle();

      const { data: publishData, error: publishError } = publishResult;

      if (!publishError && publishData) {
        setPublishButtonVisible(publishData.value === "true");
      }
    } catch (error) {
      console.error("Error fetching settings:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSettings = async () => {
    setSaving(true);
    try {
      const result = await supabase
        .from("app_settings")
        .upsert(
          {
            key: "logo_text_visible",
            value: String(logoTextVisible),
          },
          { onConflict: "key" }
        );

      const { error: logoError } = result;

      if (logoError) {
        throw logoError;
      }

      toast({
        title: "Impostazioni salvate",
        description: "Le impostazioni del sito sono state aggiornate",
      });
    } catch (error) {
      console.error("Error saving settings:", error);
      toast({
        title: "Errore",
        description: "Impossibile salvare le impostazioni",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleLogoTextToggle = async (checked: boolean) => {
    setLogoTextVisible(checked);
    try {
      const result = await supabase
        .from("app_settings")
        .upsert(
          {
            key: "logo_text_visible",
            value: String(checked),
          },
          { onConflict: "key" }
        );

      const { error } = result;

      if (error) throw error;

      toast({
        title: "Impostazione aggiornata",
        description: checked ? "Testo logo ora visibile" : "Testo logo ora nascosto",
      });
    } catch (error) {
      console.error("Error updating logo text setting:", error);
      toast({
        title: "Errore",
        description: "Impossibile aggiornare l'impostazione",
        variant: "destructive",
      });
      setLogoTextVisible(!checked);
    }
  };

  const handlePublishButtonToggle = async (checked: boolean) => {
    setPublishButtonVisible(checked);
    try {
      const result = await supabase
        .from("app_settings")
        .upsert(
          {
            key: "publish_button_visible",
            value: String(checked),
          },
          { onConflict: "key" }
        );

      const { error } = result;

      if (error) throw error;

      toast({
        title: "Impostazione aggiornata",
        description: checked ? "Pulsante 'Pubblica annuncio' ora visibile" : "Pulsante 'Pubblica annuncio' ora nascosto",
      });
    } catch (error) {
      console.error("Error updating publish button setting:", error);
      toast({
        title: "Errore",
        description: "Impossibile aggiornare l'impostazione",
        variant: "destructive",
      });
      setPublishButtonVisible(!checked);
    }
  };

  const toggleTheme = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    if (newDarkMode) {
      document.documentElement.classList.remove("light");
    } else {
      document.documentElement.classList.add("light");
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-primary" />
            Impostazioni Generali
          </CardTitle>
          <CardDescription>
            Configura le preferenze del pannello admin
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Theme Toggle */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {isDarkMode ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
              <div>
                <Label htmlFor="darkMode">Tema Scuro</Label>
                <p className="text-sm text-muted-foreground">
                  Passa tra tema chiaro e scuro
                </p>
              </div>
            </div>
            <Switch
              id="darkMode"
              checked={isDarkMode}
              onCheckedChange={toggleTheme}
            />
          </div>

          <Separator />

          {/* Logo Text Visibility */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {logoTextVisible ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
              <div>
                <Label htmlFor="logoText">Visibilità Testo Logo</Label>
                <p className="text-sm text-muted-foreground">
                  Mostra o nascondi il testo "AutoAndrew" nell'header (tutti i dispositivi)
                </p>
              </div>
            </div>
            <Switch
              id="logoText"
              checked={logoTextVisible}
              onCheckedChange={handleLogoTextToggle}
              disabled={loading}
            />
          </div>

          <Separator />

          {/* Publish Button Visibility */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {publishButtonVisible ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
              <div>
                <Label htmlFor="publishButton">Visibilità Pulsante "Pubblica annuncio"</Label>
                <p className="text-sm text-muted-foreground">
                  Mostra o nascondi il pulsante "Pubblica annuncio" nell'header
                </p>
              </div>
            </div>
            <Switch
              id="publishButton"
              checked={publishButtonVisible}
              onCheckedChange={handlePublishButtonToggle}
              disabled={loading}
            />
          </div>

          <Separator />

          {/* Email Notifications */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bell className="w-5 h-5" />
                <div>
                  <Label htmlFor="emailNotif">Notifiche Email</Label>
                  <p className="text-sm text-muted-foreground">
                    Ricevi email per nuove richieste
                  </p>
                </div>
              </div>
              <Switch
                id="emailNotif"
                checked={emailNotifications}
                onCheckedChange={setEmailNotifications}
              />
            </div>

            {emailNotifications && (
              <div className="ml-8 space-y-2">
                <Label htmlFor="notifyEmail" className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email di notifica
                </Label>
                <Input
                  id="notifyEmail"
                  type="email"
                  placeholder="admin@tuodominio.it"
                  value={notifyEmail}
                  onChange={(e) => setNotifyEmail(e.target.value)}
                />
              </div>
            )}
          </div>

          <Separator />

          <Button onClick={handleSaveSettings} disabled={saving || loading}>
            <Save className="w-4 h-4 mr-2" />
            {saving ? "Salvataggio..." : "Salva Impostazioni"}
          </Button>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle>Informazioni Sistema</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <span className="text-muted-foreground">Versione:</span>
            <span>1.0.0</span>
            <span className="text-muted-foreground">Ultimo aggiornamento:</span>
            <span>{new Date().toLocaleDateString("it-IT")}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
