import { MapPin, Phone, Star, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Vehicle } from "@/data/sampleVehicles";
import { useLanguage } from "@/contexts/LanguageContext";
import { trackWhatsAppClick } from "@/lib/analytics";

interface DealerCardProps {
  vehicle: Vehicle;
}

export function DealerCard({ vehicle }: DealerCardProps) {
  const { t, language } = useLanguage();
  const phoneNumber = "+393333889908";
  const formattedPhoneNumber = "+39 333 388 9908";

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("it-IT", {
      style: "currency",
      currency: "EUR",
      maximumFractionDigits: 0
    }).format(price);
  };

  const handleWhatsAppClick = () => {
    // Get vehicle year from registration date
    const yearMatch = vehicle.first_registration_date?.match(/(\d{4})/);
    const year = yearMatch ? yearMatch[1] : '';
    
    // Build vehicle link
    const vehicleUrl = `${window.location.origin}/vehicle/${vehicle.ad_number}`;
    
    // Build WhatsApp message with vehicle information
    const message = language === "it"
      ? `Ciao! Sono interessato a questo veicolo:\n\n` +
        `🚗 ${vehicle.make} ${vehicle.model}${vehicle.version ? ` ${vehicle.version}` : ''}${year ? ` (${year})` : ''}\n` +
        `💰 Prezzo: ${formatPrice(vehicle.price)}\n` +
        `${vehicle.mileage ? `📏 Chilometraggio: ${vehicle.mileage}\n` : ''}` +
        `${vehicle.fuel_type ? `⛽ Carburante: ${vehicle.fuel_type}\n` : ''}` +
        `${vehicle.gearbox ? `⚙️ Cambio: ${vehicle.gearbox}\n` : ''}\n` +
        `🔗 Link: ${vehicleUrl}`
      : `Hello! I'm interested in this vehicle:\n\n` +
        `🚗 ${vehicle.make} ${vehicle.model}${vehicle.version ? ` ${vehicle.version}` : ''}${year ? ` (${year})` : ''}\n` +
        `💰 Price: ${formatPrice(vehicle.price)}\n` +
        `${vehicle.mileage ? `📏 Mileage: ${vehicle.mileage}\n` : ''}` +
        `${vehicle.fuel_type ? `⛽ Fuel: ${vehicle.fuel_type}\n` : ''}` +
        `${vehicle.gearbox ? `⚙️ Transmission: ${vehicle.gearbox}\n` : ''}\n` +
        `🔗 Link: ${vehicleUrl}`;
    
    // Encode message for URL
    const encodedMessage = encodeURIComponent(message);
    const whatsAppUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    
    // Track the click
    trackWhatsAppClick(`vehicle-${vehicle.ad_number}`);
    
    // Open WhatsApp
    window.open(whatsAppUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="dealer-card">
      {/* Google Maps */}
      <div className="aspect-[16/9] bg-muted rounded-lg mb-4 overflow-hidden">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2871.5!2d12.1282!3d44.1882!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x132ca5f0c8a5a5a5%3A0x1234567890abcdef!2sVia%20Emilia%20per%20Cesena%2C%201800%2C%2047034%20Forlimpopoli%20FC!5e0!3m2!1sit!2sit!4v1700000000000!5m2!1sit!2sit"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Posizione Divisione Usato"
          className="w-full h-full"
        />
      </div>

      {/* Dealer Name */}
      <h3 className="font-semibold text-foreground mb-2 line-clamp-2">
        {vehicle.dealer_name}
      </h3>

      {/* Rating */}
      <div className="flex items-center gap-2 mb-3">
        <div className="flex items-center gap-1">
          <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
          <span className="text-sm font-semibold">4.7</span>
        </div>
        <a 
          href="https://www.google.com/maps/place/Divisione+Usato/@44.1882,12.1282,17z/data=!4m8!3m7!1s0x132ca1f4c4c4c4c5:0x1234567890abcdef!8m2!3d44.1882!4d12.1282!9m1!1b1!16s%2Fg%2F11c1k_x_1k"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-primary hover:underline"
        >
          203 {t("dealer.googleReviews")}
        </a>
      </div>

      {/* Location */}
      <div className="flex items-start gap-2 text-sm text-muted-foreground mb-4">
        <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
        <a 
          href="https://www.google.com/maps/place/Via+Emilia+per+Cesena,+1800,+47034+Forlimpopoli+FC"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-primary transition-colors"
        >
          Via Emilia per Cesena, 1800<br />
          47034 Forlimpopoli FC, Italia
        </a>
      </div>

      {/* Action Buttons */}
      <div className="space-y-2">
        <Button 
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
          onClick={handleWhatsAppClick}
        >
          <MessageCircle className="w-4 h-4 mr-2" />
          {t("dealer.contactSeller")}
        </Button>
        <a
          href={`tel:${phoneNumber}`}
          className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border bg-transparent hover:border-primary/50 active:scale-[0.98] h-10 px-4 py-2 w-full border-primary text-primary hover:bg-primary hover:text-primary-foreground"
        >
          <Phone className="w-4 h-4 mr-2" />
          {formattedPhoneNumber}
        </a>
      </div>
    </div>
  );
}