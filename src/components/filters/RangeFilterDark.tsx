import React, { useState, useEffect, useCallback } from "react";
import { SliderDark } from "./SliderDark";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface RangeFilterDarkProps {
  label: string;
  icon?: React.ReactNode;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  minValue?: string;
  maxValue?: string;
  onChange: (min: string, max: string) => void;
  className?: string;
}

export function RangeFilterDark({
  label,
  icon,
  min,
  max,
  step = 1,
  unit = "",
  minValue,
  maxValue,
  onChange,
  className,
}: RangeFilterDarkProps) {
  const getSliderValues = useCallback(() => {
    const vMin = minValue && minValue !== "" ? parseFloat(minValue) : min;
    const vMax = maxValue && maxValue !== "" ? parseFloat(maxValue) : max;
    return [Math.max(min, vMin), Math.min(max, vMax)];
  }, [minValue, maxValue, min, max]);

  const [localValues, setLocalValues] = useState<number[]>(getSliderValues());

  useEffect(() => {
    const [currentMin, currentMax] = getSliderValues();
    if (currentMin !== localValues[0] || currentMax !== localValues[1]) {
      setLocalValues([currentMin, currentMax]);
    }
  }, [minValue, maxValue, min, max, getSliderValues, localValues]);

  const handleSliderChange = (values: number[]) => {
    setLocalValues(values);
  };

  const handleSliderCommit = (values: number[]) => {
    const [newMin, newMax] = values;
    onChange(newMin.toString(), newMax.toString());
  };

  const formatValue = (val: number) => {
    // Years should not have commas (typically 4-digit numbers between 1900-2100)
    const isYear = unit === "" && val >= 1900 && val <= 2100;
    
    if (isYear) {
      return Math.round(val).toString();
    }
    
    if (val >= 1000 && (unit === "€" || unit === "km")) {
      return (val / 1000).toLocaleString(undefined, { maximumFractionDigits: 1 }) + "k";
    }
    return val.toLocaleString();
  };

  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-medium text-[#888]">
          {icon && <span className="text-[#ff6b35]">{icon}</span>}
          {label}
        </div>
        <Badge 
          variant="outline" 
          className="h-7 px-3 text-xs font-mono font-normal bg-[#2a2a2a] border-[#3a3a3a] text-white"
        >
          {formatValue(localValues[0])} – {formatValue(localValues[1])} {unit}
        </Badge>
      </div>

      <div className="px-1">
        <SliderDark
          value={localValues}
          min={min}
          max={max}
          step={step}
          onValueChange={handleSliderChange}
          onValueCommit={handleSliderCommit}
          className="cursor-pointer touch-none"
        />
      </div>
    </div>
  );
}
