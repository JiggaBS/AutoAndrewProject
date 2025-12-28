import { useState, useMemo, useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Header } from "@/components/Header";
import { Footer } from "@/components/home/Footer";
import { SEO } from "@/components/SEO";
import { trackContactForm } from "@/lib/analytics";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "@/hooks/use-toast";
import { 
  Car, 
  Calculator, 
  Upload, 
  Send, 
  Fuel, 
  Calendar, 
  Gauge,
  CheckCircle2,
  Camera,
  X,
  TrendingUp,
  Euro,
  Phone,
  Mail,
  User,
  Info
} from "lucide-react";
import { makes, bodyTypes, fuels, years } from "@/data/sampleVehicles";
import { useLanguage } from "@/contexts/LanguageContext";

// Form validation schema
const valuationSchema = z.object({
  // Vehicle info
  make: z.string().min(1, "Seleziona la marca"),
  model: z.string().min(1, "Inserisci il modello").max(50, "Modello troppo lungo"),
  year: z.string().min(1, "Seleziona l'anno"),
  fuel: z.string().min(1, "Seleziona il carburante"),
  mileage: z.string().min(1, "Inserisci il chilometraggio").regex(/^\d+$/, "Solo numeri"),
  bodyType: z.string().optional(),
  condition: z.string().min(1, "Seleziona le condizioni"),
  price: z.string().min(1, "Inserisci il prezzo desiderato").regex(/^\d+$/, "Solo numeri"),
  // Contact info
  name: z.string().min(2, "Nome troppo corto").max(50, "Nome troppo lungo"),
  email: z.string().email("Email non valida"),
  phone: z.string().min(9, "Numero non valido").max(15, "Numero troppo lungo"),
  notes: z.string().max(500, "Note troppo lunghe").optional(),
});

type ValuationFormData = z.infer<typeof valuationSchema>;

// Estimate calculation data
const baseValues: Record<string, number> = {
  "Alfa Romeo": 18000,
  "Audi": 28000,
  "BMW": 32000,
  "Chevrolet": 16000,
  "Citroën": 14000,
  "Cupra": 26000,
  "Dacia": 10000,
  "DS": 22000,
  "Ferrari": 180000,
  "Fiat": 12000,
  "Ford": 15000,
  "Honda": 18000,
  "Hyundai": 17000,
  "Jaguar": 40000,
  "Jeep": 28000,
  "Kia": 18000,
  "Lamborghini": 200000,
  "Lancia": 14000,
  "Land Rover": 45000,
  "Lexus": 38000,
  "Maserati": 65000,
  "Mazda": 20000,
  "Mercedes-Benz": 35000,
  "MG": 18000,
  "Mini": 20000,
  "Mitsubishi": 16000,
  "Nissan": 17000,
  "Opel": 14000,
  "Peugeot": 15000,
  "Porsche": 85000,
  "Renault": 14000,
  "Seat": 16000,
  "Skoda": 18000,
  "Smart": 12000,
  "Subaru": 22000,
  "Suzuki": 14000,
  "Tesla": 45000,
  "Toyota": 22000,
  "Volkswagen": 22000,
  "Volvo": 30000,
};

const fuelMultipliers: Record<string, number> = {
  "Benzina": 1.0,
  "Diesel": 1.05,
  "GPL": 0.9,
  "Metano": 0.85,
  "Elettrica": 1.15,
  "Ibrida": 1.1,
};

const conditionMultipliers: Record<string, number> = {
  "excellent": 1.1,
  "good": 1.0,
  "fair": 0.85,
  "poor": 0.65,
};

const conditions = [
  { key: "excellent", value: "Ottime condizioni" },
  { key: "good", value: "Buone condizioni" },
  { key: "fair", value: "Condizioni discrete" },
  { key: "poor", value: "Da revisionare" },
];

export default function Valutiamo() {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showEstimate, setShowEstimate] = useState(false);
  const [submittedTrackingCode, setSubmittedTrackingCode] = useState<string | null>(null);
  const [userProfile, setUserProfile] = useState<{ name: string; surname: string; phone: string; email: string } | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const form = useForm<ValuationFormData>({
    resolver: zodResolver(valuationSchema),
    defaultValues: {
      make: "",
      model: "",
      year: "",
      fuel: "",
      mileage: "",
      bodyType: "",
      condition: "",
      price: "",
      name: "",
      email: "",
      phone: "",
      notes: "",
    },
  });

  // Fetch user profile data when component mounts
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          setIsLoggedIn(false);
          return;
        }
        
        setIsLoggedIn(true);

        // Try to get profile from user_profiles table first
        const { data: profile, error: profileError } = await supabase
          .from("user_profiles")
          .select("name, surname, phone")
          .eq("user_id", user.id)
          .single();

        if (profile && !profileError) {
          // Profile found in database
          // Fix: Handle null surname properly - filter out null/undefined values
          const fullName = [profile.name, profile.surname].filter(Boolean).join(" ") || profile.name || "";
          setUserProfile({
            name: fullName,
            surname: profile.surname || "",
            phone: profile.phone,
            email: user.email || "",
          });
          
          // Pre-fill form with profile data
          form.setValue("name", fullName);
          form.setValue("phone", profile.phone);
          form.setValue("email", user.email || "");
        } else {
          // Fallback to user metadata
          const metadata = user.user_metadata || {};
          if (metadata.name || metadata.surname || metadata.phone) {
            const fullName = metadata.full_name || `${metadata.name || ""} ${metadata.surname || ""}`.trim();
            setUserProfile({
              name: fullName,
              surname: metadata.surname || "",
              phone: metadata.phone || "",
              email: user.email || "",
            });
            
            // Pre-fill form with metadata
            if (fullName) form.setValue("name", fullName);
            if (metadata.phone) form.setValue("phone", metadata.phone);
            if (user.email) form.setValue("email", user.email);
          } else if (user.email) {
            // At least set email if available
            setUserProfile({
              name: "",
              surname: "",
              phone: "",
              email: user.email || "",
            });
            form.setValue("email", user.email);
          }
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    fetchUserProfile();
  }, [form]);

  const watchedValues = form.watch(["make", "year", "mileage", "fuel", "condition"]);

  // Calculate estimated value
  const estimatedValue = useMemo(() => {
    const [make, year, mileage, fuel, condition] = watchedValues;
    
    if (!make || !year || !mileage || !fuel || !condition) {
      return null;
    }

    const makeLabel = makes.find(m => m.key.toString() === make)?.value || "";
    const fuelLabel = fuels.find(f => f.key.toString() === fuel)?.value || "";
    
    const baseValue = baseValues[makeLabel] || 15000;
    const currentYear = new Date().getFullYear();
    const vehicleAge = currentYear - parseInt(year);
    const km = parseInt(mileage);

    // Age depreciation (7% per year)
    const ageDepreciation = Math.pow(0.93, vehicleAge);
    
    // Mileage depreciation (1% per 10,000 km after 50,000)
    const kmOver50k = Math.max(0, km - 50000);
    const kmDepreciation = 1 - (kmOver50k / 10000) * 0.01;
    
    // Fuel and condition multipliers
    const fuelMult = fuelMultipliers[fuelLabel] || 1;
    const condMult = conditionMultipliers[condition] || 1;

    const value = baseValue * ageDepreciation * Math.max(0.5, kmDepreciation) * fuelMult * condMult;
    
    return Math.round(value / 100) * 100;
  }, [watchedValues]);

  // Handle image upload
  const handleImageUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    if (uploadedImages.length + files.length > 10) {
      toast({
        title: "Limite foto raggiunto",
        description: "Puoi caricare massimo 10 foto",
        variant: "destructive",
      });
      return;
    }

    Array.from(files).forEach(file => {
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File troppo grande",
          description: "Ogni foto deve essere massimo 5MB",
          variant: "destructive",
        });
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setUploadedImages(prev => [...prev, event.target!.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });

    e.target.value = "";
  }, [uploadedImages.length]);

  const removeImage = useCallback((index: number) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index));
  }, []);

  const onSubmit = async (data: ValuationFormData) => {
    setIsSubmitting(true);

    try {
      // REQUIRE authentication - block submit if not logged in
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: language === "it" ? "Accesso richiesto" : "Login required",
          description: language === "it" 
            ? "Devi effettuare l'accesso per inviare una richiesta di valutazione"
            : "You must log in to submit a valuation request",
          variant: "destructive",
        });
        // Redirect to auth page with return URL
        navigate("/auth", { state: { returnTo: "/valutiamo" } });
        setIsSubmitting(false);
        return;
      }

      // Get labels for API
      const makeLabel = makes.find(m => m.key.toString() === data.make)?.value || data.make;
      const fuelLabel = fuels.find(f => f.key.toString() === data.fuel)?.value || data.fuel;

      const { data: result, error } = await supabase.functions.invoke("submit-valuation", {
        body: {
          make: makeLabel,
          model: data.model,
          year: parseInt(data.year),
          fuel_type: fuelLabel,
          mileage: parseInt(data.mileage),
          condition: data.condition,
          price: data.price ? parseInt(data.price) : null,
          name: data.name,
          email: data.email,
          phone: data.phone,
          notes: data.notes || null,
          estimated_value: estimatedValue,
          images: uploadedImages.length > 0 ? uploadedImages : [],
          user_id: user?.id || null, // Include user_id if logged in
        },
      });

      if (error) throw error;

      // Validate result structure
      if (!result) {
        throw new Error(language === "it" 
          ? "Risposta del server non valida. Riprova." 
          : "Invalid server response. Please try again.");
      }

      // Check if the response indicates an error
      if (result && typeof result === 'object' && 'error' in result) {
        throw new Error(String(result.error));
      }

      // Get the tracking code from the result
      const resultId = result && typeof result === 'object' && 'id' in result ? result.id : null;
      const trackingCode = resultId ? String(resultId).substring(0, 8).toUpperCase() : null;
      
      if (!trackingCode) {
        console.warn("No tracking code received from server:", result);
        // Still show success but without tracking code
      }
      
      setSubmittedTrackingCode(trackingCode);

      toast({
        title: "Richiesta inviata!",
        description: "Ti contatteremo entro 24 ore con la valutazione definitiva.",
      });

      // Track form submission
      trackContactForm("valuation");
      
      form.reset();
      setUploadedImages([]);
      setShowEstimate(false);
    } catch (error) {
      console.error("Submit error:", error);
      toast({
        title: "Errore",
        description: error.message || "Si è verificato un errore. Riprova.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("it-IT", {
      style: "currency",
      currency: "EUR",
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title={language === "it" ? "Valutazione Auto Gratuita - Valutiamo la Tua Auto" : "Free Car Valuation - We Value Your Car"}
        description={language === "it" 
          ? "Richiedi una valutazione gratuita e senza impegno della tua auto. Ottieni una stima istantanea e ricevi una risposta entro 24 ore. Valutazione professionale per vendere o permutare il tuo veicolo."
          : "Request a free, no-obligation valuation of your car. Get an instant estimate and receive a response within 24 hours. Professional valuation to sell or trade-in your vehicle."}
        keywords={language === "it" 
          ? "valutazione auto gratuita, stima auto usata, permuta auto, vendere auto, valutazione veicolo online"
          : "free car valuation, car appraisal, trade-in car, sell car, online vehicle valuation"}
        url="/valutiamo"
      />
      <Header />
      
      <main className="container py-8 md:py-12">
        {/* Success State */}
        {submittedTrackingCode ? (
          <div className="max-w-2xl mx-auto text-center space-y-6 animate-fade-in">
            <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10 text-green-600 dark:text-green-400" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">
              {language === "it" ? "Richiesta Inviata con Successo!" : "Request Submitted Successfully!"}
            </h1>
            <p className="text-muted-foreground text-lg">
              {language === "it" 
                ? "Ti contatteremo entro 24 ore con la valutazione definitiva."
                : "We will contact you within 24 hours with the final valuation."}
            </p>
            
            <Card className="border-border bg-card">
              <CardContent className="pt-6 space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-2">
                    {language === "it" ? "Il tuo codice di tracciamento:" : "Your tracking code:"}
                  </p>
                  <p className="text-3xl font-mono font-bold text-primary tracking-wider">
                    {submittedTrackingCode}
                  </p>
                </div>
                <Separator />
                <p className="text-sm text-muted-foreground">
                  {language === "it" 
                    ? "Usa questo codice per seguire lo stato della tua richiesta in qualsiasi momento."
                    : "Use this code to track your request status at any time."}
                </p>
                <Button asChild className="w-full">
                  <a href="/traccia-richiesta">
                    {language === "it" ? "Traccia la tua richiesta" : "Track your request"}
                  </a>
                </Button>
              </CardContent>
            </Card>
            
            <Button 
              variant="outline" 
              onClick={() => setSubmittedTrackingCode(null)}
            >
              {language === "it" ? "Invia un'altra richiesta" : "Submit another request"}
            </Button>
          </div>
        ) : (
          <>
        {/* Hero Section */}
        <div className="text-center mb-10 md:mb-14 animate-fade-in">
          <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
            <TrendingUp className="w-3 h-3 mr-1" />
            {language === "it" ? "Valutazione Gratuita" : "Free Valuation"}
          </Badge>
          <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-4 font-[Montserrat]">
            {t("valuation.title")}
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto text-base md:text-lg">
            {t("valuation.subtitle")}
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Auth Banner for non-logged-in users */}
            {!isLoggedIn && (
              <Alert className="border-primary/20 bg-primary/5">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 w-full">
                  <div className="flex items-center gap-2 text-center sm:text-left">
                    <Info className="h-4 w-4 text-primary shrink-0" />
                    <span className="text-foreground text-sm">
                      {language === "it" 
                        ? "Per salvare e seguire la valutazione serve un account" 
                        : "An account is required to save and track your valuation"}
                    </span>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <Button asChild variant="outline" size="sm">
                      <Link to="/auth" state={{ returnTo: "/valutiamo" }}>
                        {language === "it" ? "Accedi" : "Login"}
                      </Link>
                    </Button>
                    <Button asChild size="sm">
                      <Link to="/auth?mode=signup" state={{ returnTo: "/valutiamo" }}>
                        {language === "it" ? "Registrati" : "Sign Up"}
                      </Link>
                    </Button>
                  </div>
                </div>
              </Alert>
            )}
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Vehicle Information Card */}
                <Card className="border-border bg-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-foreground">
                      <Car className="w-5 h-5 text-primary" />
                      {t("valuation.vehicleInfo")}
                    </CardTitle>
                    <CardDescription>
                      {t("valuation.vehicleInfo.desc")}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="make"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t("valuation.brand")} *</FormLabel>
                            <Select onValueChange={(value) => { field.onChange(value); setShowEstimate(true); }} value={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder={t("valuation.selectBrand")} />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {makes.map(make => (
                                  <SelectItem key={make.key} value={make.key.toString()}>
                                    {make.value}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="model"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t("valuation.modelLabel")} *</FormLabel>
                            <FormControl>
                              <Input placeholder={t("valuation.modelPlaceholder")} {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="year"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t("valuation.registrationYear")} *</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder={t("valuation.selectYear")} />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {years.map(year => (
                                  <SelectItem key={year.key} value={year.key.toString()}>
                                    {year.value}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="fuel"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t("valuation.fuelType")} *</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder={t("valuation.selectFuel")} />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {fuels.map(fuel => (
                                  <SelectItem key={fuel.key} value={fuel.key.toString()}>
                                    {fuel.value}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="mileage"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t("valuation.mileage")} *</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Gauge className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <Input placeholder={t("valuation.mileagePlaceholder")} className="pl-10" {...field} />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="condition"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t("valuation.conditionLabel")} *</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder={t("valuation.selectCondition")} />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="excellent">{t("valuation.condition.excellent")}</SelectItem>
                                <SelectItem value="good">{t("valuation.condition.good")}</SelectItem>
                                <SelectItem value="fair">{t("valuation.condition.fair")}</SelectItem>
                                <SelectItem value="poor">{t("valuation.condition.poor")}</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="bodyType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t("valuation.bodyType")}</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder={t("valuation.selectBodyType")} />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {bodyTypes.map(bt => (
                                  <SelectItem key={bt.key} value={bt.key}>
                                    {bt.value}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="price"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t("valuation.desiredPrice")}</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Euro className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <Input 
                                  placeholder={t("valuation.pricePlaceholder")} 
                                  className="pl-10" 
                                  {...field} 
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-border bg-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-foreground">
                      <Camera className="w-5 h-5 text-primary" />
                      {t("valuation.photos")}
                    </CardTitle>
                    <CardDescription>
                      {t("valuation.photos.desc")}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleImageUpload}
                        className="hidden"
                        id="image-upload"
                      />
                      <label htmlFor="image-upload" className="cursor-pointer">
                        <Upload className="w-10 h-10 mx-auto mb-3 text-muted-foreground" />
                        <p className="text-foreground font-medium mb-1">
                          {t("valuation.photos.dragDrop")}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {t("valuation.photos.format")}
                        </p>
                      </label>
                    </div>

                    {uploadedImages.length > 0 && (
                      <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 mt-4">
                        {uploadedImages.map((img, index) => (
                          <div key={index} className="relative group aspect-square">
                            <img
                              src={img}
                              alt={`Foto ${index + 1}`}
                              className="w-full h-full object-cover rounded-lg"
                            />
                            <button
                              type="button"
                              onClick={() => removeImage(index)}
                              className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card className="border-border bg-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-foreground">
                      <User className="w-5 h-5 text-primary" />
                      {t("valuation.yourData")}
                    </CardTitle>
                    <CardDescription>
                      {t("valuation.yourData.desc")}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t("valuation.fullName")} *</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <Input placeholder={t("valuation.fullName")} className="pl-10" {...field} />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t("valuation.phone")} *</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <Input placeholder={t("valuation.phonePlaceholder")} className="pl-10" {...field} />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem className="sm:col-span-2">
                            <FormLabel>{t("valuation.emailLabel")} *</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <Input placeholder={t("valuation.emailPlaceholder")} className="pl-10" {...field} />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="notes"
                        render={({ field }) => (
                          <FormItem className="sm:col-span-2">
                            <FormLabel>{t("valuation.notesLabel")}</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder={t("valuation.notesPlaceholder")}
                                className="min-h-[100px]"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <Button 
                      type="submit" 
                      size="lg" 
                      className="w-full"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>{t("valuation.submitting")}</>
                      ) : (
                        <>
                          <Send className="w-4 h-4 mr-2" />
                          {t("valuation.submitButton")}
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              </form>
            </Form>
          </div>

          {/* Sidebar - Instant Estimate */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              <Card className="border-primary/30 bg-gradient-to-br from-card to-primary/5">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-foreground">
                    <Calculator className="w-5 h-5 text-primary" />
                    {t("valuation.instantEstimate")}
                  </CardTitle>
                  <CardDescription>
                    {t("valuation.instantEstimate.desc")}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {estimatedValue ? (
                    <div className="text-center py-4">
                      <p className="text-sm text-muted-foreground mb-2">{t("valuation.estimatedValue")}</p>
                      <div className="text-4xl font-bold text-primary mb-2">
                        {formatCurrency(estimatedValue)}
                      </div>
                      <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                        <span className="text-success">
                          {formatCurrency(estimatedValue * 0.95)}
                        </span>
                        <span>–</span>
                        <span className="text-success">
                          {formatCurrency(estimatedValue * 1.05)}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-4">
                        {t("valuation.estimateDisclaimer")}
                      </p>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Euro className="w-12 h-12 mx-auto text-muted-foreground/50 mb-3" />
                      <p className="text-muted-foreground text-sm">
                        {t("valuation.fillData")}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Why Choose Us */}
              <Card className="border-border bg-card">
                <CardHeader>
                  <CardTitle className="text-foreground text-lg">
                    {t("valuation.whyChooseUs")}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    t("valuation.benefit1"),
                    t("valuation.benefit2"),
                    t("valuation.benefit3"),
                    t("valuation.benefit4"),
                    t("valuation.benefit5"),
                  ].map((item, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                      <span className="text-sm text-foreground">{item}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}
