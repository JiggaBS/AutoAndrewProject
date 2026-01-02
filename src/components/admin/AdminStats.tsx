import { Card, CardContent } from "@/components/ui/card";
import { Car, Clock, CheckCircle2, XCircle, TrendingUp, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface ValuationRequest {
  id: string;
  status: string;
  estimated_value: number | null;
  final_offer: number | null;
}

interface AdminStatsProps {
  requests: ValuationRequest[];
  onStatusFilter?: (status: string) => void;
}

export function AdminStats({ requests, onStatusFilter }: AdminStatsProps) {
  const stats = {
    total: requests.length,
    pending: requests.filter(r => r.status === "pending").length,
    contacted: requests.filter(r => r.status === "contacted").length,
    completed: requests.filter(r => r.status === "completed").length,
    rejected: requests.filter(r => r.status === "rejected").length,
  };

  const statCards = [
    {
      label: "Totale Richieste",
      value: stats.total,
      icon: Car,
      trend: "Dal mese scorso",
      highlight: true,
      color: "primary",
      filterStatus: "all",
    },
    {
      label: "In Attesa",
      value: stats.pending,
      icon: Clock,
      trend: "Da gestire",
      highlight: false,
      color: "text-yellow-500",
      bgColor: "bg-yellow-500/10",
      filterStatus: "pending",
    },
    {
      label: "Completate",
      value: stats.completed,
      icon: CheckCircle2,
      trend: "Questo mese",
      highlight: false,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
      filterStatus: "completed",
    },
    {
      label: "In Lavorazione",
      value: stats.contacted,
      icon: TrendingUp,
      trend: "In corso",
      highlight: false,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
      filterStatus: "contacted",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 lg:gap-4">
      {statCards.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card
            key={stat.label}
            className={cn(
              "relative overflow-hidden transition-all duration-300 hover:shadow-lg border-l-4",
              stat.highlight 
                ? "bg-primary text-primary-foreground border-l-primary border-t-0 border-r-0 border-b-0" 
                : cn("border-t-0 border-r-0 border-b-0", stat.color?.replace("text-", "border-"))
            )}
          >
            <CardContent className="p-3 lg:p-6">
              <div className="flex items-start justify-between mb-2 lg:mb-4">
                <div>
                  <p className={cn(
                    "text-xs lg:text-sm font-medium mb-0.5 lg:mb-1",
                    stat.highlight ? "text-primary-foreground/80" : "text-muted-foreground"
                  )}>
                    {stat.label}
                  </p>
                  <p className="text-2xl lg:text-4xl font-display font-bold">{stat.value}</p>
                </div>
                <button 
                  onClick={() => onStatusFilter?.(stat.filterStatus)}
                  className={cn(
                    "p-1.5 lg:p-2 rounded-lg transition-colors hidden sm:flex",
                    stat.highlight 
                      ? "bg-primary-foreground/20 hover:bg-primary-foreground/30" 
                      : cn("bg-secondary hover:bg-secondary/80", stat.color)
                  )}
                >
                  <ArrowUpRight className="w-3 h-3 lg:w-4 lg:h-4" />
                </button>
              </div>
              <div className={cn(
                "flex items-center gap-1 lg:gap-2 text-xs lg:text-sm",
                stat.highlight ? "text-primary-foreground/80" : "text-muted-foreground"
              )}>
                <Icon className={cn("w-3 h-3 lg:w-4 lg:h-4", !stat.highlight && stat.color)} />
                <span className="truncate">{stat.trend}</span>
              </div>
              {stat.highlight && (
                <div className="absolute -bottom-6 -right-6 w-16 lg:w-24 h-16 lg:h-24 rounded-full bg-primary-foreground/10" />
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
