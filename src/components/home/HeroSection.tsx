import { forwardRef } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, ChevronDown } from "lucide-react";
import heroBgDark from "@/assets/hero-bg.webp";
import heroBgLight from "@/assets/hero-bg-light.jpg";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "next-themes";

export const HeroSection = forwardRef<HTMLElement>((props, ref) => {
  const { t, language } = useLanguage();
  const { resolvedTheme } = useTheme();
  
  const heroBg = resolvedTheme === "light" ? heroBgLight : heroBgDark;
  
  const scrollToContent = () => {
    window.scrollTo({ top: window.innerHeight - 100, behavior: "smooth" });
  };

  return (
    <section ref={ref} className="relative min-h-[70vh] md:min-h-[85vh] flex items-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-no-repeat scale-105 animate-[pulse_20s_ease-in-out_infinite] bg-[position:70%_center] md:bg-center"
        style={{
          backgroundImage: `url(${heroBg})`,
          animationName: "subtle-zoom",
        }}
      />
      {/* Dark mode overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-background/20 dark:block hidden" />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/30 dark:block hidden" />
      {/* Light mode overlay - subtle to preserve the clean BMW aesthetic */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent dark:hidden" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent dark:hidden" />

      {/* Animated Accent Lines */}
      <div className="absolute top-1/4 left-0 w-1 h-32 bg-gradient-to-b from-transparent via-primary to-transparent opacity-60" />
      <div className="absolute top-1/3 left-4 w-0.5 h-20 bg-gradient-to-b from-transparent via-primary/50 to-transparent opacity-40" />

      {/* Content */}
      <div className="container relative z-10 py-6 md:py-20">
        <div className="max-w-2xl space-y-6">
          <span
            className="inline-block text-primary font-semibold text-sm uppercase tracking-widest opacity-0 animate-fade-in"
            style={{ animationDelay: "100ms", animationFillMode: "forwards" }}
          >
            AutoAndrew
          </span>

          <h1
            className="font-display text-4xl md:text-6xl lg:text-7xl font-bold text-foreground dark:text-foreground text-white leading-tight opacity-0 animate-fade-in"
            style={{ animationDelay: "200ms", animationFillMode: "forwards" }}
          >
            {language === "it" ? (
              <>
                Trova la tua
                <br />
                <span className="text-primary relative">
                  Auto Perfetta
                  <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 8" fill="none">
                    <path
                      d="M0 4C50 0 150 8 200 4"
                      stroke="hsl(var(--primary))"
                      strokeWidth="3"
                      strokeLinecap="round"
                      className="opacity-60"
                    />
                  </svg>
                </span>
              </>
            ) : (
              <>
                Find Your
                <br />
                <span className="text-primary relative">
                  Perfect Car
                  <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 8" fill="none">
                    <path
                      d="M0 4C50 0 150 8 200 4"
                      stroke="hsl(var(--primary))"
                      strokeWidth="3"
                      strokeLinecap="round"
                      className="opacity-60"
                    />
                  </svg>
                </span>
              </>
            )}
          </h1>

          <p
            className="text-muted-foreground dark:text-muted-foreground text-slate-300 text-lg md:text-xl max-w-lg opacity-0 animate-fade-in"
            style={{ animationDelay: "300ms", animationFillMode: "forwards" }}
          >
            {t("hero.subtitle")}
          </p>

          <div
            className="flex flex-col sm:flex-row gap-4 pt-4 opacity-0 animate-fade-in"
            style={{ animationDelay: "400ms", animationFillMode: "forwards" }}
          >
            <Button asChild size="lg" className="text-base font-semibold group">
              <Link to="/listings">
                {t("hero.cta.browse")}
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="text-base font-semibold bg-transparent border-white/40 text-white hover:bg-white/10 hover:border-white/60 dark:border-foreground/20 dark:text-foreground dark:hover:bg-foreground/10 dark:hover:border-foreground/40"
            >
              <Link to="/valutiamo">{t("hero.cta.valuation")}</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-0 right-0 flex justify-center z-10">
        <button
          onClick={scrollToContent}
          className="flex flex-col items-center gap-2 text-slate-400 hover:text-white dark:text-muted-foreground dark:hover:text-foreground transition-colors cursor-pointer opacity-0 animate-fade-in"
          style={{ animationDelay: "600ms", animationFillMode: "forwards" }}
        >
          <span className="text-xs uppercase tracking-wider">
            {language === "it" ? "Scopri" : "Discover"}
          </span>
          <ChevronDown className="w-5 h-5 animate-bounce" />
        </button>
      </div>

      {/* Decorative gradient at bottom - smooth multi-stop transition */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-[linear-gradient(to_top,hsl(var(--background))_0%,hsl(var(--background)/0.8)_30%,hsl(var(--background)/0.4)_60%,transparent_100%)]" />
    </section>
  );
});

HeroSection.displayName = "HeroSection";
