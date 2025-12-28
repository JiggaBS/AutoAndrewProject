import { useState, useMemo } from "react";
import { Calculator, Euro, Calendar, Percent } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useLanguage } from "@/contexts/LanguageContext";

interface FinancingCalculatorProps {
  vehiclePrice?: number;
}

export function FinancingCalculator({ vehiclePrice = 20000 }: FinancingCalculatorProps) {
  const { t } = useLanguage();
  const [price, setPrice] = useState(vehiclePrice);
  const [downPayment, setDownPayment] = useState(Math.round(vehiclePrice * 0.2));
  const [months, setMonths] = useState(48);
  const [interestRate, setInterestRate] = useState(5.9);

  const calculation = useMemo(() => {
    const principal = price - downPayment;
    const monthlyRate = interestRate / 100 / 12;
    
    if (monthlyRate === 0) {
      return {
        monthlyPayment: principal / months,
        totalPayment: principal,
        totalInterest: 0,
      };
    }
    
    const monthlyPayment = 
      (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) /
      (Math.pow(1 + monthlyRate, months) - 1);
    
    const totalPayment = monthlyPayment * months;
    const totalInterest = totalPayment - principal;
    
    return {
      monthlyPayment,
      totalPayment,
      totalInterest,
    };
  }, [price, downPayment, months, interestRate]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("it-IT", {
      style: "currency",
      currency: "EUR",
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Calculator className="w-4 h-4" />
          {t("financing.calculate")}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md bg-card border-border">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-foreground">
            <Calculator className="w-5 h-5 text-primary" />
            {t("financing.title")}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* Price */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-sm">
              <Euro className="w-4 h-4" />
              {t("financing.vehiclePrice")}
            </Label>
            <Input
              type="number"
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              className="bg-secondary border-border"
            />
          </div>

          {/* Down Payment */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <Label className="text-sm">{t("financing.downPayment")}</Label>
              <span className="text-sm font-semibold text-primary">{formatCurrency(downPayment)}</span>
            </div>
            <Slider
              value={[downPayment]}
              onValueChange={([value]) => setDownPayment(value)}
              max={price * 0.5}
              min={0}
              step={500}
              className="py-2"
            />
          </div>

          {/* Duration */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <Label className="flex items-center gap-2 text-sm">
                <Calendar className="w-4 h-4" />
                {t("financing.duration")}
              </Label>
              <span className="text-sm font-semibold text-primary">{months} {t("financing.months")}</span>
            </div>
            <Slider
              value={[months]}
              onValueChange={([value]) => setMonths(value)}
              max={84}
              min={12}
              step={12}
              className="py-2"
            />
          </div>

          {/* Interest Rate */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <Label className="flex items-center gap-2 text-sm">
                <Percent className="w-4 h-4" />
                {t("financing.rate")}
              </Label>
              <span className="text-sm font-semibold text-primary">{interestRate}%</span>
            </div>
            <Slider
              value={[interestRate]}
              onValueChange={([value]) => setInterestRate(value)}
              max={12}
              min={0}
              step={0.1}
              className="py-2"
            />
          </div>

          {/* Results */}
          <div className="bg-primary/10 rounded-lg p-4 space-y-3">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-1">{t("financing.monthlyPayment")}</p>
              <p className="text-3xl font-bold text-primary">
                {formatCurrency(calculation.monthlyPayment)}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4 pt-2 border-t border-border/50">
              <div className="text-center">
                <p className="text-xs text-muted-foreground">{t("financing.totalFinanced")}</p>
                <p className="text-sm font-semibold">{formatCurrency(price - downPayment)}</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-muted-foreground">{t("financing.totalInterest")}</p>
                <p className="text-sm font-semibold">{formatCurrency(calculation.totalInterest)}</p>
              </div>
            </div>
          </div>

          <p className="text-xs text-muted-foreground text-center">
            {t("financing.disclaimer")}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}