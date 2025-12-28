import { forwardRef } from "react";
import { Star, Quote } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";

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
    text: "Esperienza eccellente! Ho trovato la mia BMW Serie 3 in condizioni perfette. Personale professionale e disponibile, consegna rapida.",
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
    rating: 4,
    text: "Ottima selezione di auto ibride. Ho trovato esattamente quello che cercavo. Unica nota: tempi di consegna un po' lunghi.",
    vehicle: "Volvo XC40",
    date: "Settembre 2024",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop",
  },
];

const StarRating = forwardRef<HTMLDivElement, { rating: number }>(({ rating }, ref) => {
  return (
    <div ref={ref} className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={cn(
            "w-4 h-4",
            star <= rating
              ? "fill-warning text-warning"
              : "fill-muted text-muted"
          )}
        />
      ))}
    </div>
  );
});

StarRating.displayName = "StarRating";

export const TestimonialsSection = forwardRef<HTMLElement>((props, ref) => {
  const { t } = useLanguage();
  
  const averageRating = (
    testimonials.reduce((acc, t) => acc + t.rating, 0) / testimonials.length
  ).toFixed(1);

  return (
    <section ref={ref} className="py-16 md:py-24 bg-secondary/30">
      <div className="container">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            {t("testimonials.badge")}
          </span>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
            {t("testimonials.mainTitle")}
          </h2>
          <div className="flex items-center justify-center gap-3 text-muted-foreground">
            <div className="flex items-center gap-1">
              <Star className="w-5 h-5 fill-warning text-warning" />
              <span className="text-xl font-bold text-foreground">{averageRating}</span>
            </div>
            <span className="text-sm">{t("testimonials.basedOn")} {testimonials.length}+ {t("testimonials.reviews")}</span>
          </div>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((testimonial, index) => (
            <article
              key={testimonial.id}
              className={cn(
                "group relative bg-card rounded-xl p-6 border border-border",
                "hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5",
                "transition-all duration-300 hover:-translate-y-1",
                "opacity-0 animate-fade-in"
              )}
              style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'forwards' }}
            >
              {/* Quote Icon */}
              <Quote className="absolute top-4 right-4 w-8 h-8 text-primary/20 group-hover:text-primary/40 transition-colors" />

              {/* Rating */}
              <StarRating rating={testimonial.rating} />

              {/* Text */}
              <p className="mt-4 text-muted-foreground text-sm leading-relaxed line-clamp-4">
                "{testimonial.text}"
              </p>

              {/* Vehicle */}
              <p className="mt-3 text-xs text-primary font-medium">
                {t("testimonials.purchase")} {testimonial.vehicle}
              </p>

              {/* Author */}
              <div className="mt-4 pt-4 border-t border-border flex items-center gap-3">
                <img
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-border"
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

        {/* Trust Badges */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-8 text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-success/20 flex items-center justify-center">
              <svg className="w-5 h-5 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <span className="text-sm font-medium">{t("testimonials.verified")}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
              <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <span className="text-sm font-medium">{t("testimonials.guarantee")}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-warning/20 flex items-center justify-center">
              <Star className="w-5 h-5 text-warning" />
            </div>
            <span className="text-sm font-medium">{t("testimonials.satisfiedClients")}</span>
          </div>
        </div>
      </div>
    </section>
  );
});

TestimonialsSection.displayName = "TestimonialsSection";
