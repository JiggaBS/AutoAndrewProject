import { useLanguage } from "@/contexts/LanguageContext";

export function ListingsHero() {
  const { t } = useLanguage();
  
  return (
    <div className="text-center mb-10 md:mb-14 animate-fade-in">
      <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-4 font-[Montserrat]">
        {t("listings.title")}
      </h1>
      <p className="text-muted-foreground max-w-2xl mx-auto text-base md:text-lg">
        {t("listings.subtitle")}
      </p>
    </div>
  );
}
