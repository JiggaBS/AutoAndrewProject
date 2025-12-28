import { forwardRef } from "react";
import { Car, CreditCard, RefreshCw } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export const ServicesSection = forwardRef<HTMLElement>((props, ref) => {
  const { t } = useLanguage();
  
  const services = [
    {
      icon: Car,
      title: t("services.selection.title"),
      description: t("services.selection.desc"),
    },
    {
      icon: CreditCard,
      title: t("services.financing.title"),
      description: t("services.financing.desc"),
    },
    {
      icon: RefreshCw,
      title: t("services.tradein.title"),
      description: t("services.tradein.desc"),
    },
  ];

  return (
    <section ref={ref} className="py-16 md:py-24 bg-card/50">
      <div className="container">
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-16">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground relative inline-block">
            {t("services.title")}
            <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-16 h-1 bg-primary rounded-full" />
          </h2>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div 
              key={index}
              className="bg-card border border-border rounded-xl p-6 md:p-8 transition-all duration-300 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5"
            >
              <div className="w-14 h-14 rounded-lg bg-secondary flex items-center justify-center mb-6">
                <service.icon className="w-7 h-7 text-foreground" />
              </div>
              <h3 className="font-display text-xl font-semibold text-foreground mb-3">
                {service.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
});

ServicesSection.displayName = "ServicesSection";
