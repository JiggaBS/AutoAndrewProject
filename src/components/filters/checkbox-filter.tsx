import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

interface Option {
  value: string;
  label: string;
  count: number;
}

interface CheckboxFilterProps {
  options: Option[];
  selected: string[];
  onToggle: (value: string) => void;
}

export function CheckboxFilter({
  options,
  selected,
  onToggle,
}: CheckboxFilterProps) {
  return (
    <div className="space-y-2">
      {options.map((option) => {
        const isSelected = selected.includes(option.value);
        const isDisabled = option.count === 0 && !isSelected;

        return (
          <label
            key={option.value}
            className={cn(
              "flex items-center gap-2 cursor-pointer group",
              isDisabled && "opacity-50 cursor-not-allowed"
            )}
          >
            <Checkbox
              checked={isSelected}
              onCheckedChange={() => !isDisabled && onToggle(option.value)}
              disabled={isDisabled}
              className="data-[state=checked]:bg-[#ff6b35] data-[state=checked]:border-[#ff6b35] border-gray-300 dark:border-[#3a3a3a]"
            />
            <span
              className={cn(
                "text-sm flex-1",
                isSelected ? "text-black dark:text-white font-medium" : "text-gray-700 dark:text-[#888]",
                !isDisabled && "group-hover:text-black dark:group-hover:text-white"
              )}
            >
              {option.label}
            </span>
            <span className="text-xs text-gray-500 dark:text-[#888]">({option.count})</span>
          </label>
        );
      })}
    </div>
  );
}
