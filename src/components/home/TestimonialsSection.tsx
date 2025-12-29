import { forwardRef, useRef } from "react";
import { Star, Quote, ChevronLeft, ChevronRight, BadgeCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";

interface Testimonial {
  id: number;
  name: string;
  location: string;
  rating: number;
  text: string;
  vehicle: string;
  date: string;
  avatar: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Marco Rossi",
    location: "Milano",
    rating: 5,
    text: "Esperienza eccellente! Ho trovato la mia BMW Serie 3 in condizioni perfette. Personale professionale e disponibile, consegna rapida. Consiglio vivamente a tutti coloro che cercano un'auto usata di qualità.",
    vehicle: "BMW Serie 3",
    date: "Novembre 2024",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop",
  },
  {
    id: 2,
    name: "Giulia Bianchi",
    location: "Roma",
    rating: 5,
    text: "Servizio impeccabile dall'inizio alla fine. Il team mi ha guidata nella scelta e ho ottenuto un finanziamento vantaggioso.",
    vehicle: "Volkswagen Golf",
    date: "Ottobre 2024",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop",
  },
  {
    id: 3,
    name: "Alessandro Verdi",
    location: "Torino",
    rating: 5,
    text: "Auto perfetta, prezzo onesto e garanzia inclusa. Ho confrontato diversi concessionari e questo è stato il migliore.",
    vehicle: "Mercedes GLA",
    date: "Dicembre 2024",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop",
  },
  {
    id: 4,
    name: "Francesca Martini",
    location: "Bologna",
    rating: 5,
    text: "Ottima selezione di auto ibride. Ho trovato esattamente quello che cercavo. Processo di acquisto semplice e veloce.",
    vehicle: "Volvo XC40",
    date: "Settembre 2024",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop",
  },
];

const StarRating = forwardRef<HTMLDivElement, { rating: number; size?: "sm" | "md" }>(
  ({ rating, size = "sm" }, ref) => {
    const starSize = size === "md" ? "w-5 h-5" : "w-4 h-4";
    return (
      <div ref={ref} className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={cn(
              starSize,
              star <= rating
                ? "fill-warning text-warning"
                : "fill-muted text-muted"
            )}
          />
        ))}
      </div>
    );
  }
);

StarRating.displayName = "StarRating";

export const TestimonialsSection = forwardRef<HTMLElement>((props, ref) => {
  const { t } = useLanguage();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  const averageRating = (
    testimonials.reduce((acc, t) => acc + t.rating, 0) / testimonials.length
  ).toFixed(1);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -320, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 320, behavior: 'smooth' });
    }
  };

  // Featured testimonial (first one)
  const featured = testimonials[0];
  const others = testimonials.slice(1);

  return (
    <section ref={ref} className="py-20 md:py-28 bg-secondary/40 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
      
      <div className="container relative">
        {/* Header */}
        <div className="text-center mb-14">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-5">
            <Star className="w-4 h-4 fill-primary" />
            {t("testimonials.badge")}
          </span>
          
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-foreground mb-5 tracking-tight">
            {t("testimonials.mainTitle")}
          </h2>
          
          <div className="flex items-center justify-center gap-4 text-muted-foreground">
            <div className="flex items-center gap-2 bg-card/80 px-4 py-2 rounded-full border border-border">
              <Star className="w-5 h-5 fill-warning text-warning" />
              <span className="text-xl font-bold text-foreground">{averageRating}</span>
              <span className="text-sm text-muted-foreground">/5</span>
            </div>
            <span className="text-sm font-medium">{t("testimonials.basedOn")} {testimonials.length}+ {t("testimonials.reviews")}</span>
          </div>
        </div>

        {/* Desktop Layout: Featured + Grid */}
        <div className="hidden lg:grid lg:grid-cols-12 gap-6">
          {/* Featured Testimonial - Larger */}
          <article className="lg:col-span-5 bg-card rounded-2xl p-8 border border-border shadow-lg relative overflow-hidden group hover:border-primary/30 transition-colors">
            <Quote className="absolute top-6 right-6 w-12 h-12 text-primary/10 group-hover:text-primary/20 transition-colors" />
            
            {/* Verified Badge */}
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-success/10 text-success text-xs font-medium mb-6">
              <BadgeCheck className="w-3.5 h-3.5" />
              Recensione verificata
            </div>

            <StarRating rating={featured.rating} size="md" />
            
            <p className="mt-6 text-foreground text-lg leading-relaxed">
              "{featured.text}"
            </p>

            <p className="mt-5 text-sm text-primary font-medium">
              {t("testimonials.purchase")} {featured.vehicle}
            </p>

            <div className="mt-6 pt-6 border-t border-border flex items-center gap-4">
              <img
                src={featured.avatar}
                alt={featured.name}
                className="w-14 h-14 rounded-full object-cover ring-2 ring-primary/20"
                loading="lazy"
              />
              <div>
                <p className="font-semibold text-foreground text-base">{featured.name}</p>
                <p className="text-sm text-muted-foreground">
                  {featured.location} • {featured.date}
                </p>
              </div>
            </div>
          </article>

          {/* Other Testimonials Grid */}
          <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {others.map((testimonial, index) => (
              <article
                key={testimonial.id}
                className={cn(
                  "group relative bg-card/80 backdrop-blur-sm rounded-xl p-5 border border-border",
                  "hover:border-primary/30 hover:bg-card hover:shadow-lg",
                  "transition-all duration-300",
                  "opacity-0 animate-fade-in"
                )}
                style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'forwards' }}
              >
                <Quote className="absolute top-3 right-3 w-6 h-6 text-primary/10 group-hover:text-primary/20 transition-colors" />

                <StarRating rating={testimonial.rating} />

                <p className="mt-3 text-muted-foreground text-sm leading-relaxed line-clamp-3">
                  "{testimonial.text}"
                </p>

                <p className="mt-3 text-xs text-primary font-medium">
                  {t("testimonials.purchase")} {testimonial.vehicle}
                </p>

                <div className="mt-4 pt-4 border-t border-border flex items-center gap-3">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-9 h-9 rounded-full object-cover ring-2 ring-border"
                    loading="lazy"
                  />
                  <div>
                    <p className="font-medium text-foreground text-sm">{testimonial.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {testimonial.location}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* Mobile/Tablet: Horizontal Scroll */}
        <div className="lg:hidden relative">
          {/* Scroll Buttons */}
          <div className="absolute -left-2 top-1/2 -translate-y-1/2 z-10 hidden sm:block">
            <Button
              variant="secondary"
              size="icon"
              className="w-10 h-10 rounded-full shadow-lg bg-card border border-border hover:bg-primary hover:text-primary-foreground"
              onClick={scrollLeft}
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
          </div>
          <div className="absolute -right-2 top-1/2 -translate-y-1/2 z-10 hidden sm:block">
            <Button
              variant="secondary"
              size="icon"
              className="w-10 h-10 rounded-full shadow-lg bg-card border border-border hover:bg-primary hover:text-primary-foreground"
              onClick={scrollRight}
              aria-label="Scroll right"
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>

          {/* Scrollable Container */}
          <div 
            ref={scrollContainerRef}
            className="flex gap-5 overflow-x-auto pb-4 -mx-4 px-4 snap-x snap-mandatory scrollbar-hide"
          >
            {testimonials.map((testimonial, index) => (
              <article
                key={testimonial.id}
                className={cn(
                  "group relative bg-card rounded-xl p-5 border border-border flex-shrink-0 w-[300px] snap-start",
                  "hover:border-primary/30 hover:shadow-lg",
                  "transition-all duration-300"
                )}
              >
                <Quote className="absolute top-3 right-3 w-6 h-6 text-primary/10" />

                <StarRating rating={testimonial.rating} />

                <p className="mt-3 text-muted-foreground text-sm leading-relaxed line-clamp-4">
                  "{testimonial.text}"
                </p>

                <p className="mt-3 text-xs text-primary font-medium">
                  {t("testimonials.purchase")} {testimonial.vehicle}
                </p>

                <div className="mt-4 pt-4 border-t border-border flex items-center gap-3">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-9 h-9 rounded-full object-cover ring-2 ring-border"
                    loading="lazy"
                  />
                  <div>
                    <p className="font-medium text-foreground text-sm">{testimonial.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {testimonial.location} • {testimonial.date}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
          
          {/* Scroll indicator dots for mobile */}
          <div className="flex justify-center gap-2 mt-4 sm:hidden">
            {testimonials.map((_, index) => (
              <div key={index} className="w-2 h-2 rounded-full bg-border" />
            ))}
          </div>
        </div>

        {/* Trust Badges - Enhanced */}
        <div className="hidden md:block mt-14 pt-10 border-t border-border/50">
          <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10">
            <div className="flex items-center gap-3 px-4 py-2 rounded-lg bg-card/50 border border-border/50">
              <div className="w-10 h-10 rounded-full bg-success/15 flex items-center justify-center">
                <svg className="w-5 h-5 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-sm font-medium text-foreground">{t("testimonials.verified")}</span>
            </div>
            <div className="flex items-center gap-3 px-4 py-2 rounded-lg bg-card/50 border border-border/50">
              <div className="w-10 h-10 rounded-full bg-primary/15 flex items-center justify-center">
                <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <span className="text-sm font-medium text-foreground">{t("testimonials.guarantee")}</span>
            </div>
            <div className="flex items-center gap-3 px-4 py-2 rounded-lg bg-card/50 border border-border/50">
              <div className="w-10 h-10 rounded-full bg-warning/15 flex items-center justify-center">
                <Star className="w-5 h-5 text-warning fill-warning" />
              </div>
              <span className="text-sm font-medium text-foreground">{t("testimonials.satisfiedClients")}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});

TestimonialsSection.displayName = "TestimonialsSection";
