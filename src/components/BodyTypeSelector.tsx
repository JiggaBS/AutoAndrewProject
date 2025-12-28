import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";

interface BodyTypeSelectorProps {
  selected?: string;
  onSelect: (type: string) => void;
}

export function BodyTypeSelector({ selected, onSelect }: BodyTypeSelectorProps) {
  const { t } = useLanguage();

  const bodyTypes = [
    {
      id: "city_car",
      label: t("body.cityCar"),
      svg: (
        <svg viewBox="0 0 80 40" className="w-16 h-8">
          <path
            d="M12 28 L16 28 L18 22 L24 18 L32 16 L48 16 L56 18 L62 22 L64 28 L68 28"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M26 16 L28 22 M40 16 L40 22 M54 16 L52 22"
            stroke="currentColor"
            strokeWidth="1"
            opacity="0.5"
          />
          <circle cx="24" cy="28" r="5" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="24" cy="28" r="2" fill="currentColor" />
          <circle cx="56" cy="28" r="5" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="56" cy="28" r="2" fill="currentColor" />
        </svg>
      ),
    },
    {
      id: "suv",
      label: t("body.suv"),
      svg: (
        <svg viewBox="0 0 80 40" className="w-16 h-8">
          <path
            d="M10 30 L14 30 L16 20 L24 14 L34 12 L54 12 L62 14 L66 20 L68 30 L70 30"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M28 12 L30 20 M42 12 L42 20 M56 12 L54 20"
            stroke="currentColor"
            strokeWidth="1"
            opacity="0.5"
          />
          <path d="M16 20 L66 20" stroke="currentColor" strokeWidth="1" opacity="0.3" />
          <circle cx="22" cy="30" r="6" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="22" cy="30" r="2.5" fill="currentColor" />
          <circle cx="58" cy="30" r="6" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="58" cy="30" r="2.5" fill="currentColor" />
        </svg>
      ),
    },
    {
      id: "van",
      label: t("body.van"),
      svg: (
        <svg viewBox="0 0 80 40" className="w-16 h-8">
          <path
            d="M10 30 L14 30 L14 12 L52 12 L58 16 L64 24 L66 30 L70 30"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M52 12 L52 24 L64 24 M14 24 L52 24"
            stroke="currentColor"
            strokeWidth="1"
            opacity="0.5"
          />
          <path d="M26 12 L26 24 M38 12 L38 24" stroke="currentColor" strokeWidth="1" opacity="0.3" />
          <circle cx="22" cy="30" r="5" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="22" cy="30" r="2" fill="currentColor" />
          <circle cx="58" cy="30" r="5" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="58" cy="30" r="2" fill="currentColor" />
        </svg>
      ),
    },
    {
      id: "cabrio",
      label: t("body.cabrio"),
      svg: (
        <svg viewBox="0 0 80 40" className="w-16 h-8">
          <path
            d="M10 26 L16 26 L20 22 L28 20 L52 20 L60 22 L64 26 L70 26"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M28 20 L26 16 L30 14 M52 20 L54 16"
            stroke="currentColor"
            strokeWidth="1"
            opacity="0.5"
          />
          <path d="M30 14 C35 12, 45 12, 54 16" stroke="currentColor" strokeWidth="1" strokeDasharray="2 2" opacity="0.4" />
          <circle cx="24" cy="26" r="5" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="24" cy="26" r="2" fill="currentColor" />
          <circle cx="56" cy="26" r="5" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="56" cy="26" r="2" fill="currentColor" />
        </svg>
      ),
    },
    {
      id: "monovolume",
      label: t("body.monovolume"),
      svg: (
        <svg viewBox="0 0 80 40" className="w-16 h-8">
          <path
            d="M10 30 L14 30 L16 16 C18 12, 24 10, 30 10 L58 10 C62 10, 66 14, 66 18 L66 30 L70 30"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M24 10 L26 22 M40 10 L40 22 M54 10 L52 22"
            stroke="currentColor"
            strokeWidth="1"
            opacity="0.5"
          />
          <path d="M16 22 L66 22" stroke="currentColor" strokeWidth="1" opacity="0.3" />
          <circle cx="22" cy="30" r="5" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="22" cy="30" r="2" fill="currentColor" />
          <circle cx="58" cy="30" r="5" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="58" cy="30" r="2" fill="currentColor" />
        </svg>
      ),
    },
    {
      id: "berlina",
      label: t("body.berlina"),
      svg: (
        <svg viewBox="0 0 80 40" className="w-16 h-8">
          <path
            d="M8 28 L14 28 L16 22 L22 16 L32 14 L48 14 L58 16 L64 22 L66 28 L72 28"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M26 14 L28 22 M40 14 L40 22 M54 14 L52 22"
            stroke="currentColor"
            strokeWidth="1"
            opacity="0.5"
          />
          <path d="M16 22 L64 22" stroke="currentColor" strokeWidth="1" opacity="0.3" />
          <circle cx="22" cy="28" r="5" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="22" cy="28" r="2" fill="currentColor" />
          <circle cx="58" cy="28" r="5" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="58" cy="28" r="2" fill="currentColor" />
        </svg>
      ),
    },
    {
      id: "station_wagon",
      label: t("body.stationWagon"),
      svg: (
        <svg viewBox="0 0 80 40" className="w-16 h-8">
          <path
            d="M8 28 L14 28 L16 20 L22 14 L32 12 L60 12 L66 16 L66 28 L72 28"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M28 12 L30 20 M44 12 L44 20 M58 12 L58 20"
            stroke="currentColor"
            strokeWidth="1"
            opacity="0.5"
          />
          <path d="M16 20 L66 20" stroke="currentColor" strokeWidth="1" opacity="0.3" />
          <circle cx="22" cy="28" r="5" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="22" cy="28" r="2" fill="currentColor" />
          <circle cx="58" cy="28" r="5" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="58" cy="28" r="2" fill="currentColor" />
        </svg>
      ),
    },
    {
      id: "coupe",
      label: t("body.coupe"),
      svg: (
        <svg viewBox="0 0 80 40" className="w-16 h-8">
          <path
            d="M10 26 L16 26 L20 20 L30 14 L44 14 L56 18 L62 22 L66 26 L70 26"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M32 14 L34 20 M46 14 L48 20"
            stroke="currentColor"
            strokeWidth="1"
            opacity="0.5"
          />
          <path d="M20 20 L62 20" stroke="currentColor" strokeWidth="1" opacity="0.3" />
          <circle cx="24" cy="26" r="5" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="24" cy="26" r="2" fill="currentColor" />
          <circle cx="56" cy="26" r="5" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="56" cy="26" r="2" fill="currentColor" />
        </svg>
      ),
    },
  ];

  return (
    <div className="mt-8 hidden lg:block">
      <h3 className="text-center text-muted-foreground mb-6 font-medium">
        {t("filters.searchByBody")}
      </h3>
      <div className="grid grid-cols-4 md:grid-cols-8 gap-2 max-w-4xl mx-auto">
        {bodyTypes.map((type) => (
          <button
            key={type.id}
            onClick={() => onSelect(type.id)}
            className={cn(
              "body-type-card",
              selected === type.id && "active"
            )}
          >
            <div className="text-foreground">{type.svg}</div>
            <span className="text-xs text-muted-foreground text-center leading-tight">
              {type.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
