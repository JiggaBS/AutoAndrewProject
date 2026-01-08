import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useLanguage } from "@/contexts/LanguageContext";

interface Option {
  value: string;
  label: string;
  count?: number;
}

interface SelectFilterProps {
  placeholder: string;
  value: string | null;
  onChange: (value: string | null) => void;
  options: Option[];
}

export function SelectFilter({
  placeholder,
  value,
  onChange,
  options,
}: SelectFilterProps) {
  const { t } = useLanguage();
  const CLEAR_VALUE = "__any__";
  
  return (
    <Select
      value={value || CLEAR_VALUE}
      onValueChange={(v) => onChange(v === CLEAR_VALUE ? null : v)}
    >
      <SelectTrigger className="w-full bg-white dark:bg-card !border !border-gray-200 dark:!border-[#2a2a2a] text-black dark:text-white hover:!border-[#ff6b35] focus:!border-[#ff6b35] focus:ring-0 focus:ring-offset-0">
        <SelectValue placeholder={placeholder} className="text-black dark:text-white placeholder:text-gray-500 dark:placeholder:text-[#888]" />
      </SelectTrigger>
      <SelectContent className="bg-white dark:bg-[#1a1a1a] border-gray-200 dark:border-[#2a2a2a]">
        <SelectItem value={CLEAR_VALUE} className="text-black dark:text-white focus:bg-black focus:text-white dark:focus:bg-[#ff6b35]">
          {t("filters.any")}
        </SelectItem>
        {options
          .filter((opt) => opt.count === undefined || opt.count > 0)
          .map((option) => (
            <SelectItem 
              key={option.value} 
              value={option.value}
              className="text-black dark:text-white focus:bg-black focus:text-white dark:focus:bg-[#ff6b35]"
            >
              {option.label}
            </SelectItem>
          ))}
      </SelectContent>
    </Select>
  );
}
