import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Check, ChevronDown, ChevronUp } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface Option {
  label: string;
  value: string;
}

interface ChipFilterProps {
  label: string;
  icon?: React.ReactNode;
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
  maxRows?: number;
}

export function ChipFilter({
  label,
  icon,
  options,
  value,
  onChange,
  className,
  maxRows,
}: ChipFilterProps) {
  const { t } = useLanguage();
  const [expanded, setExpanded] = useState(false);
  
  // Logic to limit items? 
  // Visual limit is hard to calculate without ref. 
  // Let's just limit by count for now as a proxy, e.g. 8 items.
  const limit = maxRows ?? 8;
  const showExpand = options.length > limit;
  const visibleOptions = expanded ? options : options.slice(0, limit);

  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
        {icon && <span className="text-primary">{icon}</span>}
        {label}
      </div>
      <div className="flex flex-wrap gap-2">
        {visibleOptions.map((opt) => {
          const isSelected = value === opt.value;
          return (
            <Badge
              key={opt.value}
              variant={isSelected ? "secondary" : "outline"}
              className={cn(
                "cursor-pointer px-3 py-1 h-7 text-xs font-normal transition-all select-none",
                isSelected 
                  ? "bg-primary/10 border-primary text-primary hover:bg-primary/20" 
                  : "bg-background text-muted-foreground hover:bg-accent hover:text-foreground"
              )}
              onClick={() => onChange(isSelected ? "" : opt.value)}
            >
              {isSelected && <Check className="w-3 h-3 mr-1.5" />}
              {opt.label}
            </Badge>
          );
        })}
        {showExpand && (
          <Button
            variant="ghost"
            size="sm"
            className="h-7 text-[10px] px-2 text-muted-foreground hover:text-foreground"
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? (
              <><ChevronUp className="h-3 w-3 mr-1" /> {t("filters.less")}</>
            ) : (
              <><ChevronDown className="h-3 w-3 mr-1" /> {t("filters.more")}</>
            )}
          </Button>
        )}
      </div>
    </div>
  );
}
