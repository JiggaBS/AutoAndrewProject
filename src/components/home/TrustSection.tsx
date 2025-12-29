import { forwardRef } from "react";
import { Shield, Award, Clock, ThumbsUp, Car, Users, Headphones, TrendingUp } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";

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
    { value: "500+", label: t("trust.stat.vehicles"), icon: Car },
    { value: "15", label: t("trust.stat.experience"), icon: TrendingUp },
    { value: "98%", label: t("trust.stat.satisfaction"), icon: Users },
    { value: "24h", label: t("trust.stat.support"), icon: Headphones },
  ];

  return (
    <section ref={ref} className="py-20 md:py-28 bg-card/50 relative overflow-hidden">
      {/* Subtle decorative gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.03] via-transparent to-primary/[0.02] pointer-events-none" />
      
      <div className="container relative">
        {/* Section Title */}
        <div className="text-center mb-14">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-5">
            <Award className="w-4 h-4" />
            {t("trust.badge") || "Perché Sceglierci"}
          </span>
          
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-foreground tracking-tight">
            {t("trust.mainTitle")}
          </h2>
        </div>

        {/* Trust Items - Cards with icons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {trustItems.map((item, index) => (
            <div
              key={item.title}
              className={cn(
                "group relative bg-card rounded-xl p-6 border border-border",
                "hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5",
                "transition-all duration-300",
                "opacity-0 animate-fade-in"
              )}
              style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'forwards' }}
            >
              {/* Icon */}
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-5 group-hover:bg-primary/15 transition-colors">
                <item.icon className="w-7 h-7 text-primary" />
              </div>
              
              {/* Title */}
              <h3 className="font-display font-semibold text-foreground text-lg mb-2">
                {item.title}
              </h3>
              
              {/* Description */}
              <p className="text-sm text-muted-foreground leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>

        {/* Stats - Prominent Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className={cn(
                "relative bg-gradient-to-br from-card to-card/80 rounded-xl p-6 md:p-8 border border-border",
                "text-center group hover:border-primary/50 hover:shadow-xl hover:shadow-primary/10",
                "transition-all duration-300",
                "opacity-0 animate-fade-in"
              )}
              style={{ animationDelay: `${(index + 4) * 100}ms`, animationFillMode: 'forwards' }}
            >
              {/* Background Icon */}
              <stat.icon className="absolute top-4 right-4 w-8 h-8 text-primary/10 group-hover:text-primary/20 transition-colors" />
              
              {/* Value */}
              <div className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-primary mb-2 tracking-tight">
                {stat.value}
              </div>
              
              {/* Label */}
              <div className="text-sm md:text-base text-muted-foreground font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
});

TrustSection.displayName = "TrustSection";
