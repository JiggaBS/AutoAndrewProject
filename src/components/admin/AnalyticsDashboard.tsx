import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area, CartesianGrid } from "recharts";
import { TrendingUp, PieChart as PieChartIcon, Car, Activity } from "lucide-react";

interface ValuationRequest {
  id: string;
  created_at: string;
  status: string;
  make: string;
  estimated_value: number | null;
  final_offer: number | null;
}

interface AnalyticsDashboardProps {
  requests: ValuationRequest[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card border border-border rounded-lg p-3 shadow-xl">
        <p className="text-sm font-medium text-foreground mb-1">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-xs" style={{ color: entry.color }}>
            {entry.name}: {entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export function AnalyticsDashboard({ requests }: AnalyticsDashboardProps) {
  const monthlyData = useMemo(() => {
    const months: Record<string, { name: string; richieste: number; completate: number; valore: number }> = {};
    
    requests.forEach(req => {
      const date = new Date(req.created_at);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
      const monthName = date.toLocaleDateString("it-IT", { month: "short", year: "2-digit" });
      
      if (!months[monthKey]) {
        months[monthKey] = { name: monthName, richieste: 0, completate: 0, valore: 0 };
      }
      months[monthKey].richieste++;
      if (req.status === "completed") {
        months[monthKey].completate++;
        months[monthKey].valore += req.final_offer || req.estimated_value || 0;
      }
    });
    
    return Object.entries(months)
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-6)
      .map(([_, data]) => data);
  }, [requests]);

  const statusData = useMemo(() => {
    const statusCounts: Record<string, number> = {
      pending: 0,
      contacted: 0,
      completed: 0,
      rejected: 0,
    };
    
    requests.forEach(req => {
      if (statusCounts[req.status] !== undefined) {
        statusCounts[req.status]++;
      }
    });

    const total = Object.values(statusCounts).reduce((a, b) => a + b, 0);
    
    return [
      { name: "In attesa", value: statusCounts.pending, color: "#f59e0b", percent: total > 0 ? Math.round((statusCounts.pending / total) * 100) : 0 },
      { name: "Contattati", value: statusCounts.contacted, color: "#3b82f6", percent: total > 0 ? Math.round((statusCounts.contacted / total) * 100) : 0 },
      { name: "Completate", value: statusCounts.completed, color: "#22c55e", percent: total > 0 ? Math.round((statusCounts.completed / total) * 100) : 0 },
      { name: "Rifiutate", value: statusCounts.rejected, color: "#ef4444", percent: total > 0 ? Math.round((statusCounts.rejected / total) * 100) : 0 },
    ].filter(s => s.value > 0);
  }, [requests]);

  const topBrands = useMemo(() => {
    const brands: Record<string, number> = {};
    requests.forEach(req => {
      brands[req.make] = (brands[req.make] || 0) + 1;
    });
    
    return Object.entries(brands)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([name, count]) => ({ name, count }));
  }, [requests]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("it-IT", {
      style: "currency",
      currency: "EUR",
      maximumFractionDigits: 0,
    }).format(value);
  };

  if (requests.length === 0) {
    return (
      <Card className="border-0 shadow-sm">
        <CardContent className="pt-6 text-center text-muted-foreground">
          Nessun dato disponibile per le statistiche
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid lg:grid-cols-2 gap-4">
      {/* Monthly Trend - Modern Bar Chart */}
      <Card className="border-0 shadow-sm bg-card overflow-hidden">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <TrendingUp className="w-4 h-4" />
            Andamento Mensile
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={monthlyData} barGap={8}>
              <defs>
                <linearGradient id="barGradientPrimary" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={1} />
                  <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0.6} />
                </linearGradient>
                <linearGradient id="barGradientSuccess" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#22c55e" stopOpacity={1} />
                  <stop offset="100%" stopColor="#22c55e" stopOpacity={0.6} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis 
                dataKey="name" 
                tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} 
                axisLine={false}
                tickLine={false}
              />
              <YAxis 
                tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} 
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'hsl(var(--muted))', opacity: 0.3 }} />
              <Bar 
                dataKey="richieste" 
                fill="url(#barGradientPrimary)" 
                name="Richieste" 
                radius={[6, 6, 0, 0]} 
                maxBarSize={40}
              />
              <Bar 
                dataKey="completate" 
                fill="url(#barGradientSuccess)" 
                name="Completate" 
                radius={[6, 6, 0, 0]} 
                maxBarSize={40}
              />
            </BarChart>
          </ResponsiveContainer>
          <div className="flex items-center justify-center gap-6 mt-2">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-sm bg-primary" />
              <span className="text-xs text-muted-foreground">Richieste</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-sm bg-green-500" />
              <span className="text-xs text-muted-foreground">Completate</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Status Distribution - Modern Donut */}
      <Card className="border-0 shadow-sm bg-card overflow-hidden">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <PieChartIcon className="w-4 h-4" />
            Distribuzione Stati
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex items-center">
            <div className="w-1/2">
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <defs>
                    {statusData.map((entry, index) => (
                      <linearGradient key={`gradient-${index}`} id={`pieGradient-${index}`} x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor={entry.color} stopOpacity={1} />
                        <stop offset="100%" stopColor={entry.color} stopOpacity={0.7} />
                      </linearGradient>
                    ))}
                  </defs>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={3}
                    dataKey="value"
                    stroke="none"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={`url(#pieGradient-${index})`} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="w-1/2 space-y-3 pl-4">
              {statusData.map((item) => (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-2.5 h-2.5 rounded-full" 
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-sm text-muted-foreground">{item.name}</span>
                  </div>
                  <span className="text-sm font-semibold">{item.percent}%</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Top Brands - Modern List */}
      <Card className="border-0 shadow-sm bg-card overflow-hidden">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <Car className="w-4 h-4" />
            Top Marche Richieste
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-3">
            {topBrands.map((brand, idx) => (
              <div key={brand.name} className="group">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-lg bg-secondary flex items-center justify-center text-xs font-bold text-muted-foreground">
                      {idx + 1}
                    </span>
                    <span className="font-medium text-sm">{brand.name}</span>
                  </div>
                  <span className="text-sm font-semibold text-primary">{brand.count}</span>
                </div>
                <div className="h-1.5 bg-secondary rounded-full overflow-hidden ml-9">
                  <div 
                    className="h-full bg-gradient-to-r from-primary to-primary/60 rounded-full transition-all duration-500"
                    style={{ width: `${(brand.count / topBrands[0].count) * 100}%` }}
                  />
                </div>
              </div>
            ))}
            {topBrands.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">Nessun dato</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Value Trend - Modern Area Chart */}
      <Card className="border-0 shadow-sm bg-card overflow-hidden">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <Activity className="w-4 h-4" />
            Valore Completato
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={monthlyData}>
              <defs>
                <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#22c55e" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#22c55e" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis 
                dataKey="name" 
                tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} 
                axisLine={false}
                tickLine={false}
              />
              <YAxis 
                tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} 
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => v > 0 ? `€${(v/1000).toFixed(0)}k` : '0'}
              />
              <Tooltip 
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-card border border-border rounded-lg p-3 shadow-xl">
                        <p className="text-sm font-medium text-foreground mb-1">{label}</p>
                        <p className="text-xs text-green-500">
                          Valore: {formatCurrency(payload[0].value as number)}
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Area 
                type="monotone" 
                dataKey="valore" 
                stroke="#22c55e" 
                strokeWidth={2.5}
                fill="url(#areaGradient)"
                dot={{ fill: "#22c55e", strokeWidth: 0, r: 4 }}
                activeDot={{ fill: "#22c55e", strokeWidth: 2, stroke: "#fff", r: 6 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
