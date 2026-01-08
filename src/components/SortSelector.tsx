import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLanguage } from "@/contexts/LanguageContext";

export type SortOption = {
  value: string;
  labelKey: string;
  field: "price" | "mileage" | "ad_number" | "first_registration_date";
  direction: "asc" | "desc";
};

export const sortOptions: SortOption[] = [
  { value: "newest", labelKey: "listings.sort.newest", field: "ad_number", direction: "desc" },
  { value: "price_asc", labelKey: "listings.sort.price_asc", field: "price", direction: "asc" },
  { value: "price_desc", labelKey: "listings.sort.price_desc", field: "price", direction: "desc" },
  { value: "mileage_asc", labelKey: "listings.sort.mileage_asc", field: "mileage", direction: "asc" },
  { value: "mileage_desc", labelKey: "listings.sort.mileage_desc", field: "mileage", direction: "desc" },
  { value: "year_desc", labelKey: "listings.sort.year_desc", field: "first_registration_date", direction: "desc" },
  { value: "year_asc", labelKey: "listings.sort.year_asc", field: "first_registration_date", direction: "asc" },
];

interface SortSelectorProps {
  currentSort: string;
  onSortChange: (sort: SortOption) => void;
  resultCount: number;
  onToggleDirection?: () => void;
  showDirectionToggle?: boolean;
}

export function SortSelector({ 
  currentSort, 
  onSortChange, 
  resultCount,
  onToggleDirection,
  showDirectionToggle = false 
}: SortSelectorProps) {
  const { t } = useLanguage();
  const current = sortOptions.find(s => s.value === currentSort) || sortOptions[0];
  const canToggleDirection = current.field !== "ad_number"; // Don't toggle for "newest"

  return (
    <div className="flex items-center gap-3 md:gap-4 w-full md:w-auto">
      <span className="text-sm text-gray-500 dark:text-[#888] whitespace-nowrap">
        {t("listings.sort.label")}
      </span>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="outline" 
            className="bg-white dark:bg-card border-gray-200 dark:border-[#2a2a2a] text-black dark:text-white hover:bg-gray-50 dark:hover:bg-[#2a2a2a] justify-between gap-2 min-w-[140px] md:min-w-[160px] flex-1 md:flex-initial text-sm min-h-[44px]"
          >
            <span className="flex-1 text-left truncate">{t(current.labelKey)}</span>
            <ArrowUpDown className="w-4 h-4 opacity-50 flex-shrink-0" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56 bg-white dark:bg-card border-gray-200 dark:border-[#2a2a2a]">
          {sortOptions.map((option) => (
            <DropdownMenuItem
              key={option.value}
              onClick={() => onSortChange(option)}
              className={currentSort === option.value ? "bg-[#ff6b35]/10 text-[#ff6b35] dark:bg-[#ff6b35]/20 dark:text-[#ff6b35]" : "text-black dark:text-white"}
            >
              <span className="flex-1">{t(option.labelKey)}</span>
              {option.direction === "asc" ? (
                <ArrowUp className="w-3 h-3 text-gray-500 dark:text-[#888]" />
              ) : (
                <ArrowDown className="w-3 h-3 text-gray-500 dark:text-[#888]" />
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      {showDirectionToggle && canToggleDirection && onToggleDirection && (
        <Button
          variant="outline"
          size="icon"
          onClick={onToggleDirection}
          className="bg-white dark:bg-card border-gray-200 dark:border-[#2a2a2a] text-black dark:text-white hover:bg-gray-50 dark:hover:bg-[#2a2a2a] min-h-[44px] min-w-[44px] flex-shrink-0"
          aria-label={current.direction === "asc" 
            ? t("listings.sort.descending")
            : t("listings.sort.ascending")
          }
        >
          {current.direction === "asc" ? (
            <ArrowDown className="w-4 h-4" />
          ) : (
            <ArrowUp className="w-4 h-4" />
          )}
        </Button>
      )}
    </div>
  );
}
