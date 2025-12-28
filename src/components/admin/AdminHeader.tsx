import { Search, Menu, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface AdminHeaderProps {
  title: string;
  subtitle?: string;
  searchTerm?: string;
  onSearchChange?: (value: string) => void;
  onMenuClick?: () => void;
  showSearch?: boolean;
  actions?: React.ReactNode;

  /** Custom notification bell */
  notificationBell?: React.ReactNode;
}

export function AdminHeader({
  title,
  subtitle,
  searchTerm = "",
  onSearchChange,
  onMenuClick,
  showSearch = true,
  actions,
  notificationBell,
}: AdminHeaderProps) {
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  return (
    <header className="bg-card border-b border-border px-4 py-3 lg:px-6 lg:py-4">
      <div className="flex items-center justify-between gap-2 lg:gap-4">
        {/* Left: Mobile menu + Title */}
        <div className="flex items-center gap-2 lg:gap-4 min-w-0 flex-1">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden shrink-0"
            onClick={onMenuClick}
          >
            <Menu className="w-5 h-5" />
          </Button>
          <div className="min-w-0">
            <h1 className="text-lg lg:text-2xl font-display font-bold truncate">{title}</h1>
            {subtitle && (
              <p className="text-xs lg:text-sm text-muted-foreground truncate hidden sm:block">{subtitle}</p>
            )}
          </div>
        </div>

        {/* Center: Search (Desktop) */}
        {showSearch && onSearchChange && (
          <div className="hidden lg:flex flex-1 max-w-md mx-4">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Cerca richieste..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-10 bg-secondary border-0"
              />
            </div>
          </div>
        )}

        {/* Right: Actions + Notifications */}
        <div className="flex items-center gap-1 lg:gap-2 shrink-0">
          {/* Mobile Search Toggle */}
          {showSearch && onSearchChange && (
            <Button 
              variant="ghost" 
              size="icon" 
              className="lg:hidden"
              onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
            >
              {mobileSearchOpen ? <X className="w-5 h-5" /> : <Search className="w-5 h-5" />}
            </Button>
          )}
          
          {/* Desktop actions */}
          <div className="hidden sm:flex items-center gap-2">
            {actions}
          </div>
          
          {/* Notifications bell */}
          {notificationBell}
        </div>
      </div>

      {/* Mobile Search Bar (Expandable) */}
      {showSearch && onSearchChange && mobileSearchOpen && (
        <div className="lg:hidden mt-3 pb-1">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Cerca nome, email, veicolo..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 bg-secondary border-0 w-full"
              autoFocus
            />
          </div>
        </div>
      )}
    </header>
  );
}
