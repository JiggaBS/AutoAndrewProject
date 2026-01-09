import { Car, BarChart3, Users, Activity, Settings, LogOut, LayoutDashboard, HelpCircle, Home, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
interface AdminSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onLogout: () => void;
  userEmail?: string;
}
const menuItems = [{
  id: "requests",
  label: "Dashboard",
  icon: LayoutDashboard
}, {
  id: "analytics",
  label: "Analytics",
  icon: BarChart3
}, {
  id: "users",
  label: "Utenti",
  icon: Users
}, {
  id: "activity",
  label: "Attività",
  icon: Activity
}, {
  id: "vehicles",
  label: "Veicoli",
  icon: Sparkles
}];
const generalItems = [{
  id: "settings",
  label: "Impostazioni",
  icon: Settings
}, {
  id: "help",
  label: "Aiuto",
  icon: HelpCircle
}];
export function AdminSidebar({
  activeTab,
  onTabChange,
  onLogout,
  userEmail
}: AdminSidebarProps) {
  return <aside className="w-64 bg-card border-r border-border flex flex-col h-screen sticky top-0">
      {/* Logo */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
            <Car className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-display font-bold text-lg">AutoAndrew</h1>
            <p className="text-xs text-muted-foreground">Admin Panel</p>
          </div>
        </div>
        <Link 
          to="/" 
          className="mt-3 flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          <Home className="w-3.5 h-3.5" />
          <span>Home</span>
        </Link>
      </div>

      {/* Menu Section */}
      <div className="flex-1 overflow-y-auto py-6">
        <div className="px-4 mb-2">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Menu</span>
        </div>
        <nav className="space-y-1 px-3">
          {menuItems.map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return <button key={item.id} onClick={() => onTabChange(item.id)} className={cn("w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200", isActive ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25" : "text-muted-foreground hover:bg-secondary hover:text-foreground")}>
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
                {item.id === "requests" && <span className={cn("ml-auto text-xs px-2 py-0.5 rounded-full", isActive ? "bg-primary-foreground/20 text-primary-foreground" : "bg-primary/10 text-primary")}>
                    Nuovo
                  </span>}
              </button>;
        })}
        </nav>

        {/* General Section */}
        <div className="px-4 mt-8 mb-2">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Generale</span>
        </div>
        <nav className="space-y-1 px-3">
          {generalItems.map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return <button key={item.id} onClick={() => onTabChange(item.id)} className={cn("w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200", isActive ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25" : "text-muted-foreground hover:bg-secondary hover:text-foreground")}>
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </button>;
        })}
          <button onClick={onLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all duration-200">
            <LogOut className="w-5 h-5" />
            <span>Esci</span>
          </button>
        </nav>
      </div>

      {/* User Info Footer */}
      <div className="p-4 border-t border-border">
        <div className="bg-secondary rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
              <span className="text-sm font-semibold text-primary">
                {userEmail?.charAt(0).toUpperCase() || "A"}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">Admin</p>
              <p className="text-xs text-muted-foreground truncate">{userEmail}</p>
            </div>
          </div>
        </div>
      </div>
    </aside>;
}