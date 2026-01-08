import { useState, useEffect, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Star, Share2, Printer, MapPin, CheckCircle, ChevronDown, Plus, Minus } from "lucide-react";
import { Header } from "@/components/Header";
import { ImageGallery } from "@/components/ImageGallery";
import { VehicleSpecs } from "@/components/VehicleSpecs";
import { DealerCard } from "@/components/DealerCard";
import { FinancingCalculator } from "@/components/FinancingCalculator";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { Footer } from "@/components/home/Footer";
import { SEO } from "@/components/SEO";
import { VehicleProductSchema, BreadcrumbSchema } from "@/components/SchemaOrg";
import { sampleVehicles, Vehicle } from "@/data/sampleVehicles";
import { fetchVehicles } from "@/lib/api/vehicles";
import { saveVehicle, unsaveVehicle, isVehicleSaved } from "@/lib/api/savedVehicles";
import { toast } from "@/hooks/use-toast";
import { trackVehicleView, trackSaveVehicle, trackShare } from "@/lib/analytics";
import { useLanguage } from "@/contexts/LanguageContext";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";

const VehicleDetail = () => {
  const { t, language } = useLanguage();
  const { id } = useParams();
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDescriptionOpen, setIsDescriptionOpen] = useState(false);

  const loadVehicle = useCallback(async () => {
    setIsLoading(true);
    try {
      // First try to get from API
      const response = await fetchVehicles({
        limit: 100
      });
      if (response.success && response.data) {
        const found = response.data.find(v => v.ad_number.toString() === id);
        if (found) {
          setVehicle(found);
          setIsLoading(false);
          return;
        }
      }
      // Fallback to sample data
      const sampleVehicle = sampleVehicles.find(v => v.ad_number.toString() === id);
      setVehicle(sampleVehicle || null);
    } catch (error) {
      console.error('Error loading vehicle:', error);
      const sampleVehicle = sampleVehicles.find(v => v.ad_number.toString() === id);
      setVehicle(sampleVehicle || null);
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  const checkIfSaved = useCallback(async () => {
    if (!vehicle) return;
    const saved = await isVehicleSaved(vehicle);
    setIsSaved(saved);
  }, [vehicle]);

  useEffect(() => {
    loadVehicle();
  }, [loadVehicle]);

  useEffect(() => {
    if (vehicle) {
      checkIfSaved();
      // Track vehicle view
      trackVehicleView(vehicle.ad_number.toString(), `${vehicle.make} ${vehicle.model}`);
    }
  }, [vehicle, checkIfSaved]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("it-IT", {
      style: "currency",
      currency: "EUR",
      maximumFractionDigits: 0
    }).format(price);
  };

  const handleSaveToggle = async () => {
    if (!vehicle || isSaving) return;
    
    setIsSaving(true);
    if (isSaved) {
      const success = await unsaveVehicle(vehicle);
      if (success) {
        setIsSaved(false);
        trackSaveVehicle(vehicle.ad_number.toString(), "unsave");
      }
    } else {
      const success = await saveVehicle(vehicle);
      if (success) {
        setIsSaved(true);
        trackSaveVehicle(vehicle.ad_number.toString(), "save");
      }
    }
    setIsSaving(false);
  };

  const handleShare = async () => {
    const url = window.location.href;
    const shareText = language === "it" 
      ? `Guarda questo veicolo: ${vehicle?.make} ${vehicle?.model} - ${formatPrice(vehicle?.price || 0)}`
      : `Check out this vehicle: ${vehicle?.make} ${vehicle?.model} - ${formatPrice(vehicle?.price || 0)}`;
    
    const shareData = {
      title: `${vehicle?.make} ${vehicle?.model} - ${vehicle?.version}`,
      text: shareText,
      url: url,
    };

    try {
      // Check if Web Share API is available (mobile devices)
      if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
        await navigator.share(shareData);
        trackShare("native_share", "vehicle");
        toast({
          title: t("vehicleDetail.shared"),
          description: t("vehicleDetail.sharedDesc"),
        });
      } else {
        // Fallback: Copy to clipboard
        await navigator.clipboard.writeText(url);
        trackShare("clipboard", "vehicle");
        toast({
          title: t("vehicleDetail.linkCopied"),
          description: t("vehicleDetail.linkCopiedDesc"),
        });
      }
    } catch (error) {
      // User cancelled or error occurred
      if ((error as Error).name !== "AbortError") {
        // Only show error if it's not a user cancellation
        try {
          // Fallback: Copy to clipboard
          await navigator.clipboard.writeText(url);
          toast({
            title: t("vehicleDetail.linkCopied"),
            description: t("vehicleDetail.linkCopiedShort"),
          });
        } catch (clipboardError) {
          toast({
            title: t("valuation.errorTitle"),
            description: t("vehicleDetail.shareError"),
            variant: "destructive",
          });
        }
      }
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container py-12 text-center">
          <div className="animate-pulse">
            <div className="text-lg text-muted-foreground">{t("vehicleDetail.loading")}</div>
          </div>
        </div>
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className="min-h-screen bg-background">
        <SEO
          title={t("vehicleDetail.notFound")}
          description={language === "it" ? "Il veicolo richiesto non è disponibile." : "The requested vehicle is not available."}
          noindex={true}
        />
        <Header />
        <div className="container py-12 text-center">
          <h1 className="text-2xl font-bold">{t("vehicleDetail.notFound")}</h1>
          <Link to="/" className="text-primary hover:underline mt-4 inline-block">
            {t("vehicleDetail.backToSearch")}
          </Link>
        </div>
      </div>
    );
  }

  // Enhanced SEO data
  const yearMatch = vehicle.first_registration_date?.match(/(\d{4})/);
  const year = yearMatch ? yearMatch[1] : '';
  const vehicleTitle = `${vehicle.make} ${vehicle.model} ${vehicle.version || ''} ${year ? `(${year})` : ''} - ${formatPrice(vehicle.price)}`;
  
  // Build comprehensive description
  const descriptionParts: string[] = [];
  descriptionParts.push(`${vehicle.make} ${vehicle.model} ${vehicle.version || ''}`.trim());
  if (year) descriptionParts.push(`Anno ${year}`);
  if (vehicle.mileage) descriptionParts.push(vehicle.mileage);
  if (vehicle.fuel_type) descriptionParts.push(vehicle.fuel_type);
  if (vehicle.gearbox) descriptionParts.push(vehicle.gearbox);
  if (vehicle.vehicle_category) descriptionParts.push(vehicle.vehicle_category);
  descriptionParts.push(`Prezzo: ${formatPrice(vehicle.price)}`);
  
  const baseDescription = descriptionParts.join(' - ');
  const vehicleDescription = vehicle.description 
    ? `${baseDescription}. ${vehicle.description.substring(0, 200)}`
    : `${baseDescription}. ${language === "it" ? 'Scopri tutti i dettagli, foto e specifiche su AutoAndrew. Veicolo garantito e controllato.' : 'Discover all details, photos and specifications on AutoAndrew. Guaranteed and inspected vehicle.'}`;
  
  const vehicleImage = vehicle.images && vehicle.images.length > 0 ? vehicle.images[0] : undefined;
  const vehicleUrl = `/vehicle/${vehicle.ad_number}`;
  
  // Enhanced keywords
  const keywords = [
    vehicle.make,
    vehicle.model,
    vehicle.version,
    year ? `${vehicle.make} ${year}` : '',
    language === "it" ? "auto usata" : "used car",
    vehicle.fuel_type,
    vehicle.vehicle_category,
    vehicle.gearbox?.includes("Automatico") ? (language === "it" ? "cambio automatico" : "automatic transmission") : (language === "it" ? "cambio manuale" : "manual transmission"),
    language === "it" ? "vendita auto" : "car sale",
    language === "it" ? "concessionaria" : "dealership",
  ].filter(Boolean).join(', ');

  const whatsAppMessage = `${t("vehicleDetail.interestedMsg")} ${vehicle.make} ${vehicle.model} (${vehicle.version}) - ${language === "it" ? "Prezzo" : "Price"}: ${formatPrice(vehicle.price)}`;

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title={vehicleTitle}
        description={vehicleDescription}
        image={vehicleImage}
        url={vehicleUrl}
        type="product"
        keywords={keywords}
        canonical={vehicleUrl}
      />
      <VehicleProductSchema vehicle={vehicle} />
      <BreadcrumbSchema
        items={[
          { name: language === "it" ? "Home" : "Home", url: "/" },
          { name: language === "it" ? "Listino" : "Listings", url: "/listings" },
          { name: `${vehicle.make} ${vehicle.model}`, url: vehicleUrl },
        ]}
      />
      <Header />

      {/* Back Link */}
      <div className="container py-4">
        <Link to="/listings" className="inline-flex items-center text-primary hover:underline text-sm">
          <ArrowLeft className="w-4 h-4 mr-1" />
          {t("vehicleDetail.back")}
        </Link>
      </div>

      {/* Main Content */}
      <div className="container pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Gallery & Specs */}
          <div className="lg:col-span-2 space-y-6">
            <ImageGallery images={vehicle.images} title={vehicle.title} />
            
            {/* Mobile/Tablet: Title, Price & Dealer - shows here on small screens */}
            <div className="lg:hidden space-y-4">
              {/* Actions */}
              <div className="flex items-center justify-end gap-4 text-sm text-muted-foreground">
                <button 
                  onClick={handleSaveToggle}
                  disabled={isSaving}
                  className={`flex items-center gap-1 hover:text-foreground ${isSaved ? 'text-primary' : ''}`}
                >
                  <Star className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} /> 
                  {isSaved ? t("vehicleDetail.saved") : t("vehicleDetail.save")}
                </button>
                <button 
                  onClick={handleShare}
                  className="flex items-center gap-1 hover:text-foreground"
                >
                  <Share2 className="w-4 h-4" /> {t("vehicleDetail.share")}
                </button>
                <button 
                  onClick={handlePrint}
                  className="flex items-center gap-1 hover:text-foreground"
                >
                  <Printer className="w-4 h-4" /> {t("vehicleDetail.print")}
                </button>
              </div>

              {/* Title & Price Card */}
              <div className="bg-card rounded-lg border border-border p-4 md:p-6">
                <h1 className="text-xl md:text-2xl font-bold text-foreground mb-1">{vehicle.make} {vehicle.model}</h1>
                <p className="text-muted-foreground mb-3">{vehicle.version}</p>
                
                <p className="text-3xl font-bold text-foreground mb-2">{formatPrice(vehicle.price)}</p>
                <span className="inline-flex items-center text-xs text-success font-medium mb-4">
                  <CheckCircle className="w-3 h-3 mr-1" /> {t("vehicleDetail.greatPrice")}
                </span>
                
                {/* Financing Calculator */}
                <div className="pt-4 border-t border-border">
                  <FinancingCalculator vehiclePrice={vehicle.price} />
                </div>
              </div>

              {/* Vehicle Specs - under price on mobile */}
              <VehicleSpecs vehicle={vehicle} />

              {/* Description - Mobile only, appears after Dettagli aggiuntivi */}
              {vehicle.description && (
                <Collapsible open={isDescriptionOpen} onOpenChange={setIsDescriptionOpen}>
                  <div>
                    <div className="border-t border-border/50"></div>
                    <CollapsibleTrigger className="w-full py-4 flex items-center justify-between hover:opacity-80 transition-opacity">
                      <h3 className="font-bold text-foreground uppercase tracking-wide text-sm">
                        {language === "it" ? "ULTERIORI INFORMAZIONI" : "FURTHER INFORMATION"}
                      </h3>
                      {isDescriptionOpen ? (
                        <Minus className="w-5 h-5 text-foreground" />
                      ) : (
                        <Plus className="w-5 h-5 text-foreground" />
                      )}
                    </CollapsibleTrigger>
                    <div className="border-b border-border/50"></div>
                    <CollapsibleContent className="pt-4 pb-6">
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        {vehicle.description}
                      </p>
                    </CollapsibleContent>
                  </div>
                </Collapsible>
              )}

              {/* Dealer Card */}
              <DealerCard vehicle={vehicle} />
            </div>
            
            {/* Vehicle Specs - Desktop only here */}
            <div className="hidden lg:block">
              <VehicleSpecs vehicle={vehicle} />
            </div>
            
            {/* Description - Desktop only */}
            {vehicle.description && (
              <div className="hidden lg:block">
                <Collapsible open={isDescriptionOpen} onOpenChange={setIsDescriptionOpen}>
                  <div>
                    <div className="border-t border-border/50"></div>
                    <CollapsibleTrigger className="w-full py-4 flex items-center justify-between hover:opacity-80 transition-opacity">
                      <h3 className="font-bold text-foreground uppercase tracking-wide text-sm">
                        {language === "it" ? "ULTERIORI INFORMAZIONI" : "FURTHER INFORMATION"}
                      </h3>
                      {isDescriptionOpen ? (
                        <Minus className="w-5 h-5 text-foreground" />
                      ) : (
                        <Plus className="w-5 h-5 text-foreground" />
                      )}
                    </CollapsibleTrigger>
                    <div className="border-b border-border/50"></div>
                    <CollapsibleContent className="pt-4 pb-6">
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        {vehicle.description}
                      </p>
                    </CollapsibleContent>
                  </div>
                </Collapsible>
              </div>
            )}
          </div>

          {/* Right Column - Info & Dealer (Desktop only) */}
          <div className="hidden lg:block space-y-4">
            {/* Actions */}
            <div className="flex items-center justify-end gap-4 text-sm text-muted-foreground">
              <button 
                onClick={handleSaveToggle}
                disabled={isSaving}
                className={`flex items-center gap-1 hover:text-foreground ${isSaved ? 'text-primary' : ''}`}
              >
                <Star className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} /> 
                {isSaved ? t("vehicleDetail.saved") : t("vehicleDetail.save")}
              </button>
              <button 
                onClick={handleShare}
                className="flex items-center gap-1 hover:text-foreground"
              >
                <Share2 className="w-4 h-4" /> {t("vehicleDetail.share")}
              </button>
              <button 
                onClick={handlePrint}
                className="flex items-center gap-1 hover:text-foreground"
              >
                <Printer className="w-4 h-4" /> {t("vehicleDetail.print")}
              </button>
            </div>

            {/* Title & Price Card */}
            <div className="bg-card rounded-lg border border-border p-4 md:p-6">
              <h1 className="text-xl md:text-2xl font-bold text-foreground mb-1">{vehicle.make} {vehicle.model}</h1>
              <p className="text-muted-foreground mb-3">{vehicle.version}</p>
              
              <p className="text-3xl font-bold text-foreground mb-2">{formatPrice(vehicle.price)}</p>
              <span className="inline-flex items-center text-xs text-success font-medium mb-4">
                <CheckCircle className="w-3 h-3 mr-1" /> {t("vehicleDetail.greatPrice")}
              </span>
              
              {/* Financing Calculator */}
              <div className="pt-4 border-t border-border">
                <FinancingCalculator vehiclePrice={vehicle.price} />
              </div>
            </div>

            {/* Dealer Card */}
            <DealerCard vehicle={vehicle} />
          </div>
        </div>
      </div>

      <Footer />
      <WhatsAppButton message={whatsAppMessage} />
    </div>
  );
};

export default VehicleDetail;