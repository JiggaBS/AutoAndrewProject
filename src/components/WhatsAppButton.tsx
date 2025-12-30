import { forwardRef } from "react";
import { useLocation } from "react-router-dom";
import { MessageCircle } from "lucide-react";
import { trackWhatsAppClick } from "@/lib/analytics";

interface WhatsAppButtonProps {
  phoneNumber?: string;
  message?: string;
}

export const WhatsAppButton = forwardRef<HTMLAnchorElement, WhatsAppButtonProps>(({
  phoneNumber = "+393333889908",
  message = "Ciao! Vorrei informazioni sui veicoli disponibili.",
}, ref) => {
  const location = useLocation();

  // Don't show in admin screens (avoids overlapping mobile admin UI)
  if (location.pathname.startsWith("/admin")) return null;

  const encodedMessage = encodeURIComponent(message);
  const url = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

  const handleClick = () => {
    trackWhatsAppClick(window.location.pathname);
  };

  return (
    <a
      ref={ref}
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center bg-[#25D366] hover:bg-[#20BA5C] text-white w-14 h-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group hover:w-auto hover:h-auto hover:px-4 hover:py-3"
      aria-label="Contattaci su WhatsApp"
    >
      <MessageCircle className="w-6 h-6 flex-shrink-0" />
      <span className="hidden group-hover:inline-block max-w-xs overflow-hidden transition-all duration-300 whitespace-nowrap ml-2">
        Chatta con noi
      </span>
    </a>
  );
});

WhatsAppButton.displayName = "WhatsAppButton";
