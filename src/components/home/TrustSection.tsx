import { forwardRef } from "react";
import { Shield, Award, Clock, ThumbsUp } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export const TrustSection = forwardRef<HTMLElement>((props, ref) => {
  const { t } = useLanguage();

  const trustItems = [
    {
      icon: Shield,
      title: t("trust.warranty.title"),
      description: t("trust.warranty.desc"),
    },
    {
      icon: Award,
      title: t("trust.certified.title"),
      description: t("trust.certified.desc"),
    },
    {
      icon: Clock,
      title: t("trust.delivery.title"),
      description: t("trust.delivery.desc"),
    },
    {
      icon: ThumbsUp,
      title: t("trust.satisfaction.title"),
      description: t("trust.satisfaction.desc"),
    },
  ];

  const stats = [
    { value: "500+", label: t("trust.stat.vehicles") },
    { value: "15", label: t("trust.stat.experience") },
    { value: "98%", label: t("trust.stat.satisfaction") },
    { value: "24h", label: t("trust.stat.support") },
  ];

  return (
    <section ref={ref} className="py-12 bg-secondary/50 border-y border-border">
      <div className="container mx-auto px-4">
        {/* Section Title */}
        <h2 className="text-3xl md:text-4xl font-display font-bold text-center text-foreground mb-10">
          {t("trust.mainTitle")}
        </h2>
        {/* Trust Items */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
          {trustItems.map((item, index) => (
            <div
              key={item.title}
              className="flex flex-col items-center text-center p-4 opacity-0 animate-fade-in"
              style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'forwards' }}
            >
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                <item.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-display font-semibold text-foreground mb-1">
                {item.title}
              </h3>
              <p className="text-sm text-muted-foreground">
                {item.description}
              </p>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className="text-center p-4 bg-card rounded-lg border border-border opacity-0 animate-fade-in"
              style={{ animationDelay: `${(index + 4) * 100}ms`, animationFillMode: 'forwards' }}
            >
              <div className="font-display text-3xl md:text-4xl font-bold text-primary mb-1">
                {stat.value}
              </div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
});

TrustSection.displayName = "TrustSection";
