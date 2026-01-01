import { forwardRef } from "react";
import { ShieldCheck, CreditCard, RefreshCw, ArrowRight, Wrench } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";

export const ServicesSection = forwardRef<HTMLElement>((props, ref) => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();

  const handleContactScroll = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Check if we're already on the contacts page
    if (window.location.pathname === "/contatti") {
      // Already on the page, just scroll
      const element = document.getElementById("contatti");
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    } else {
      // Navigate first, then scroll after navigation
      navigate("/contatti");
      // Use a longer delay to ensure React Router navigation completes
      setTimeout(() => {
        const element = document.getElementById("contatti");
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        } else {
          // Retry if element not found (page might still be loading)
          setTimeout(() => {
            const retryElement = document.getElementById("contatti");
            if (retryElement) {
              retryElement.scrollIntoView({ behavior: "smooth", block: "start" });
            }
          }, 200);
        }
      }, 300);
    }
  };

  const services = [
    {
      id: "selection",
      icon: ShieldCheck,
      title: language === "it" ? "Selezione Garantita" : "Guaranteed Selection",
      description: language === "it"
        ? "Ogni veicolo è accuratamente ispezionato e certificato per garantirti qualità e sicurezza."
        : "Every vehicle is carefully inspected and certified to guarantee you quality and safety.",
      features: language === "it"
        ? ["Veicoli certificati", "Controlli accurati", "Garanzia inclusa"]
        : ["Certified vehicles", "Thorough inspections", "Warranty included"],
      ctaText: language === "it" ? "Scopri le auto" : "Discover cars",
      href: "/listings",
      onClick: undefined,
    },
    {
      id: "financing",
      icon: CreditCard,
      title: language === "it" ? "Finanziamenti su Misura" : "Custom Financing",
      description: language === "it"
        ? "Soluzioni di pagamento personalizzate con le migliori condizioni del mercato per ogni esigenza."
        : "Personalized payment solutions with the best market conditions for every need.",
      features: language === "it"
        ? ["Tassi competitivi", "Rate flessibili", "Approvazione rapida"]
        : ["Competitive rates", "Flexible payments", "Quick approval"],
      ctaText: language === "it" ? "Richiedi preventivo" : "Request quote",
      href: "#",
      onClick: handleContactScroll,
    },
    {
      id: "tradein",
      icon: RefreshCw,
      title: language === "it" ? "Ritiro Usato" : "Trade-in Service",
      description: language === "it"
        ? "Valutiamo e ritiriamo il tuo veicolo attuale al miglior prezzo con valutazione gratuita."
        : "We evaluate and collect your current vehicle at the best price with free evaluation.",
      features: language === "it"
        ? ["Valutazione gratuita", "Ritiro immediato", "Miglior prezzo garantito"]
        : ["Free evaluation", "Immediate pickup", "Best price guaranteed"],
      ctaText: language === "it" ? "Valuta subito" : "Get valuation",
      href: "/valutiamo",
      onClick: undefined,
    },
  ];

  return (
    <section ref={ref} className="py-20 md:py-28 relative overflow-hidden">
      {/* Background gradient accent */}
      <div className="absolute inset-0 bg-gradient-to-t from-card/50 via-transparent to-transparent pointer-events-none" />
      
      <div className="container relative">
        {/* Section Header */}
        <div className="text-center mb-14">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-5">
            <Wrench className="w-4 h-4" />
            {language === "it" ? "Cosa Offriamo" : "What We Offer"}
          </span>
          
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground tracking-tight">
            {t("services.title")}
          </h2>
          
          <p className="text-muted-foreground mt-4 max-w-2xl mx-auto text-base md:text-lg">
            {language === "it" 
              ? "Un'esperienza d'acquisto completa con servizi pensati per te"
              : "A complete purchase experience with services designed for you"
            }
          </p>
        </div>

        {/* Services Grid - 3 Cards Only */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto">
          {services.map((service, index) => {
            const handleCardClick = (e: React.MouseEvent) => {
              // Only handle card click if button wasn't clicked
              if ((e.target as HTMLElement).closest('button, a')) {
                return;
              }
              if (service.onClick) {
                service.onClick(e);
              } else if (service.href !== "#") {
                navigate(service.href);
              }
            };

            const handleCardKeyDown = (e: React.KeyboardEvent) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                if (service.onClick) {
                  service.onClick(e as unknown as React.MouseEvent);
                } else if (service.href !== "#") {
                  navigate(service.href);
                }
              }
            };

            return (
              <div 
                key={service.id}
                className={cn(
                  "group relative bg-card border border-border rounded-xl p-8 md:p-10",
                  "hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/10",
                  "hover:-translate-y-1",
                  "transition-all duration-300 cursor-pointer",
                  "opacity-0 animate-fade-in",
                  "focus-within:ring-2 focus-within:ring-primary/50 focus-within:ring-offset-2 focus-within:ring-offset-background",
                  "flex flex-col"
                )}
                style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'forwards' }}
                onClick={handleCardClick}
                onKeyDown={handleCardKeyDown}
                tabIndex={0}
                role="button"
                aria-label={`${service.title} - ${service.description}`}
              >
                {/* Icon */}
                <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                  <service.icon className="w-8 h-8 text-primary" />
                </div>
                
                {/* Title */}
                <h3 className="font-display text-2xl font-bold text-foreground mb-3">
                  {service.title}
                </h3>
                
                {/* Description */}
                <p className="text-muted-foreground text-sm leading-relaxed mb-5">
                  {service.description}
                </p>
                
                {/* Key Features - flex-grow to push button down */}
                <div className="flex-grow mb-6">
                  <ul className="space-y-2.5">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-2.5 text-sm">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                        <span className="text-foreground font-medium">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                {/* CTA Button - aligned at bottom */}
                {service.onClick ? (
                  <Button
                    variant="outline"
                    size="sm"
                    className={cn(
                      "h-11 px-5 border-primary/30 text-primary bg-transparent",
                      "hover:bg-primary/10 hover:border-primary/50",
                      "font-semibold transition-all duration-300",
                      "group/btn focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
                      "mt-auto"
                    )}
                    onClick={(e) => {
                      e.stopPropagation();
                      service.onClick?.(e);
                    }}
                  >
                    {service.ctaText}
                    <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                    className={cn(
                      "h-11 px-5 border-primary/30 text-primary bg-transparent",
                      "hover:bg-primary/10 hover:border-primary/50",
                      "font-semibold transition-all duration-300",
                      "group/btn focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
                      "mt-auto"
                    )}
                  >
                    <Link 
                      to={service.href}
                      onClick={(e) => e.stopPropagation()}
                    >
                      {service.ctaText}
                      <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                    </Link>
                  </Button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
});

ServicesSection.displayName = "ServicesSection";
