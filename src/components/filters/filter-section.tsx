import { useState } from "react";
import { ChevronDown, X, LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface FilterSectionProps {
  title: string;
  count?: number;
  onClear?: () => void;
  children: React.ReactNode;
  defaultOpen?: boolean;
  icon?: LucideIcon;
}

export function FilterSection({
  title,
  count = 0,
  onClear,
  children,
  defaultOpen = true,
  icon: Icon,
}: FilterSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-gray-200 dark:border-[#2a2a2a] last:border-b-0">
      {/* Header */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between py-3 text-sm font-medium text-black dark:text-white hover:text-[#ff6b35] dark:hover:text-[#ff6b35] transition-colors"
      >
        <span className="flex items-center gap-2">
          {Icon && <Icon className="h-4 w-4 text-gray-500 dark:text-[#888]" />}
          {title}
          {count > 0 && (
            <span className="bg-[#ff6b35] text-white text-xs rounded-full px-2 py-0.5">
              {count}
            </span>
          )}
        </span>
        <ChevronDown
          className={cn(
            "h-4 w-4 text-gray-500 dark:text-[#888] transition-transform duration-200",
            isOpen && "rotate-180"
          )}
        />
      </button>

      {/* Content */}
      {isOpen && (
        <div className="pb-4 filter-section-content">
          {count > 0 && onClear && (
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onClear();
              }}
              className="mb-2 h-auto py-1 px-2 text-xs text-gray-600 dark:text-[#888] hover:text-[#ff6b35] hover:bg-gray-100 dark:hover:bg-[#2a2a2a]"
            >
              <X className="h-3 w-3 mr-1" />
              Cancella
            </Button>
          )}
          {children}
        </div>
      )}
    </div>
  );
}
