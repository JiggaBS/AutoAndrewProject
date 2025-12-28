import { forwardRef } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Phone } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export const CTASection = forwardRef<HTMLElement>((props, ref) => {
  const { t } = useLanguage();
  
  return (
    <section ref={ref} className="py-16 md:py-20">
      <div className="container">
        <div className="relative bg-gradient-to-br from-primary/20 via-primary/10 to-secondary rounded-2xl p-8 md:p-12 overflow-hidden">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          
          <div className="relative z-10 max-w-xl">
            <h2 className="font-display text-2xl md:text-4xl font-bold text-foreground mb-4">
              {t("cta.title")}
            </h2>
            <p className="text-muted-foreground text-base md:text-lg mb-8">
              {t("cta.subtitle")}
            </p>
            <Button asChild size="lg" className="font-semibold">
              <Link to="/contatti">
                <Phone className="mr-2 h-5 w-5" />
                {t("cta.button")}
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
});

CTASection.displayName = "CTASection";
