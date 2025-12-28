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
}

export function SortSelector({ currentSort, onSortChange, resultCount }: SortSelectorProps) {
  const { t } = useLanguage();
  const current = sortOptions.find(s => s.value === currentSort) || sortOptions[0];

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
      <p className="text-muted-foreground text-sm">
        <span className="text-foreground font-semibold">{resultCount}</span> {t("listings.results")}
      </p>
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="w-full sm:w-auto justify-between gap-2">
            <ArrowUpDown className="w-4 h-4" />
            <span className="flex-1 text-left">{t(current.labelKey)}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56 bg-card border-border">
          {sortOptions.map((option) => (
            <DropdownMenuItem
              key={option.value}
              onClick={() => onSortChange(option)}
              className={currentSort === option.value ? "bg-primary/10 text-primary" : ""}
            >
              <span className="flex-1">{t(option.labelKey)}</span>
              {option.direction === "asc" ? (
                <ArrowUp className="w-3 h-3 text-muted-foreground" />
              ) : (
                <ArrowDown className="w-3 h-3 text-muted-foreground" />
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
