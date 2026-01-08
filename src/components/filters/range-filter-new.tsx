import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Option {
  value: number;
  label: string;
}

interface RangeFilterNewProps {
  minPlaceholder: string;
  maxPlaceholder: string;
  minValue: number | null;
  maxValue: number | null;
  onChange: (min: number | null, max: number | null) => void;
  options: Option[];
}

export function RangeFilterNew({
  minPlaceholder,
  maxPlaceholder,
  minValue,
  maxValue,
  onChange,
  options,
}: RangeFilterNewProps) {
  const CLEAR_VALUE = "__any__";
  
  return (
    <div className="flex gap-2">
      <Select
        value={minValue?.toString() || CLEAR_VALUE}
        onValueChange={(v) => onChange(v === CLEAR_VALUE ? null : parseInt(v, 10), maxValue)}
      >
        <SelectTrigger className="flex-1 bg-white dark:bg-card !border !border-gray-200 dark:!border-[#2a2a2a] text-black dark:text-white hover:!border-[#ff6b35] focus:!border-[#ff6b35] focus:ring-0 focus:ring-offset-0">
          <SelectValue placeholder={minPlaceholder} className="text-black dark:text-white placeholder:text-gray-500 dark:placeholder:text-[#888]" />
        </SelectTrigger>
        <SelectContent className="bg-white dark:bg-[#1a1a1a] border-gray-200 dark:border-[#2a2a2a]">
          <SelectItem value={CLEAR_VALUE} className="text-black dark:text-white focus:bg-black focus:text-white dark:focus:bg-[#ff6b35]">
            Qualsiasi
          </SelectItem>
          {options
            .filter((opt) => !maxValue || opt.value <= maxValue)
            .map((option) => (
              <SelectItem 
                key={option.value} 
                value={option.value.toString()}
                className="text-black dark:text-white focus:bg-black focus:text-white dark:focus:bg-[#ff6b35]"
              >
                {option.label}
              </SelectItem>
            ))}
        </SelectContent>
      </Select>

      <Select
        value={maxValue?.toString() || CLEAR_VALUE}
        onValueChange={(v) => onChange(minValue, v === CLEAR_VALUE ? null : parseInt(v, 10))}
      >
        <SelectTrigger className="flex-1 bg-white dark:bg-card !border !border-gray-200 dark:!border-[#2a2a2a] text-black dark:text-white hover:!border-[#ff6b35] focus:!border-[#ff6b35] focus:ring-0 focus:ring-offset-0">
          <SelectValue placeholder={maxPlaceholder} className="text-black dark:text-white placeholder:text-gray-500 dark:placeholder:text-[#888]" />
        </SelectTrigger>
        <SelectContent className="bg-white dark:bg-[#1a1a1a] border-gray-200 dark:border-[#2a2a2a]">
          <SelectItem value={CLEAR_VALUE} className="text-black dark:text-white focus:bg-black focus:text-white dark:focus:bg-[#ff6b35]">
            Qualsiasi
          </SelectItem>
          {options
            .filter((opt) => !minValue || opt.value >= minValue)
            .map((option) => (
              <SelectItem 
                key={option.value} 
                value={option.value.toString()}
                className="text-black dark:text-white focus:bg-black focus:text-white dark:focus:bg-[#ff6b35]"
              >
                {option.label}
              </SelectItem>
            ))}
        </SelectContent>
      </Select>
    </div>
  );
}
