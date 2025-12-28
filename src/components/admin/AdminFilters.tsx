import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search, X, Download, SlidersHorizontal } from "lucide-react";
import { useState } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface AdminFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  statusFilter: string;
  setStatusFilter: (status: string) => void;
  dateFilter: string;
  setDateFilter: (date: string) => void;
  onExportCSV: () => void;
  onClearFilters: () => void;
}

export function AdminFilters({
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  dateFilter,
  setDateFilter,
  onExportCSV,
  onClearFilters,
}: AdminFiltersProps) {
  const [filtersOpen, setFiltersOpen] = useState(false);
  const hasFilters = searchTerm || statusFilter !== "all" || dateFilter !== "all";
  const activeFilterCount = [
    searchTerm ? 1 : 0,
    statusFilter !== "all" ? 1 : 0,
    dateFilter !== "all" ? 1 : 0,
  ].reduce((a, b) => a + b, 0);

  return (
    <div className="space-y-3">
      {/* Mobile View */}
      <div className="lg:hidden space-y-3">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Cerca nome, email, veicolo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 w-full"
          />
        </div>

        {/* Collapsible Filters */}
        <Collapsible open={filtersOpen} onOpenChange={setFiltersOpen}>
          <div className="flex items-center gap-2">
            <CollapsibleTrigger asChild>
              <Button variant="outline" size="sm" className="flex-1">
                <SlidersHorizontal className="w-4 h-4 mr-2" />
                Filtri
                {activeFilterCount > 0 && (
                  <span className="ml-2 bg-primary text-primary-foreground rounded-full px-2 py-0.5 text-xs">
                    {activeFilterCount}
                  </span>
                )}
              </Button>
            </CollapsibleTrigger>
            <Button variant="outline" size="sm" onClick={onExportCSV}>
              <Download className="w-4 h-4" />
            </Button>
          </div>

          <CollapsibleContent className="mt-3 space-y-3">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Stato" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tutti gli stati</SelectItem>
                <SelectItem value="pending">In attesa</SelectItem>
                <SelectItem value="contacted">Contattato</SelectItem>
                <SelectItem value="completed">Completato</SelectItem>
                <SelectItem value="rejected">Rifiutato</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={dateFilter} onValueChange={setDateFilter}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Periodo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tutto il periodo</SelectItem>
                <SelectItem value="today">Oggi</SelectItem>
                <SelectItem value="week">Ultima settimana</SelectItem>
                <SelectItem value="month">Ultimo mese</SelectItem>
                <SelectItem value="quarter">Ultimo trimestre</SelectItem>
              </SelectContent>
            </Select>

            {hasFilters && (
              <Button variant="ghost" size="sm" onClick={onClearFilters} className="w-full">
                <X className="w-4 h-4 mr-1" />
                Pulisci filtri
              </Button>
            )}
          </CollapsibleContent>
        </Collapsible>
      </div>

      {/* Desktop View */}
      <div className="hidden lg:flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-wrap gap-3 items-center">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Cerca nome, email, veicolo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 w-64"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Stato" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tutti gli stati</SelectItem>
              <SelectItem value="pending">In attesa</SelectItem>
              <SelectItem value="contacted">Contattato</SelectItem>
              <SelectItem value="completed">Completato</SelectItem>
              <SelectItem value="rejected">Rifiutato</SelectItem>
            </SelectContent>
          </Select>
          <Select value={dateFilter} onValueChange={setDateFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Periodo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tutto il periodo</SelectItem>
              <SelectItem value="today">Oggi</SelectItem>
              <SelectItem value="week">Ultima settimana</SelectItem>
              <SelectItem value="month">Ultimo mese</SelectItem>
              <SelectItem value="quarter">Ultimo trimestre</SelectItem>
            </SelectContent>
          </Select>
          {hasFilters && (
            <Button variant="ghost" size="sm" onClick={onClearFilters}>
              <X className="w-4 h-4 mr-1" />
              Pulisci
            </Button>
          )}
        </div>
        <Button variant="outline" onClick={onExportCSV}>
          <Download className="w-4 h-4 mr-2" />
          Esporta CSV
        </Button>
      </div>
    </div>
  );
}
