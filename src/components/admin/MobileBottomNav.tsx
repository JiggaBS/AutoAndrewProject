import { useState, useEffect } from "react";
import { LayoutDashboard, BarChart3, Users, Activity, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

interface MobileBottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const navItems = [
  { id: "requests", label: "Dashboard", icon: LayoutDashboard },
  { id: "analytics", label: "Analytics", icon: BarChart3 },
  { id: "users", label: "Utenti", icon: Users },
  { id: "activity", label: "Attività", icon: Activity },
  { id: "settings", label: "Impost.", icon: Settings },
];

// Hook to detect if virtual keyboard is open
function useKeyboardVisible() {
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

  useEffect(() => {
    // Use Visual Viewport API to detect keyboard
    const viewport = window.visualViewport;
    
    if (!viewport) {
      // Fallback: detect focus on input elements
      const handleFocusIn = (e: FocusEvent) => {
        const target = e.target as HTMLElement;
        if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
          setIsKeyboardVisible(true);
        }
      };
      
      const handleFocusOut = () => {
        setIsKeyboardVisible(false);
      };
      
      document.addEventListener('focusin', handleFocusIn);
      document.addEventListener('focusout', handleFocusOut);
      
      return () => {
        document.removeEventListener('focusin', handleFocusIn);
        document.removeEventListener('focusout', handleFocusOut);
      };
    }

    const initialHeight = viewport.height;
    
    const handleResize = () => {
      // If viewport height shrinks significantly (more than 150px), keyboard is likely open
      const heightDiff = initialHeight - viewport.height;
      setIsKeyboardVisible(heightDiff > 150);
    };

    viewport.addEventListener('resize', handleResize);
    
    return () => {
      viewport.removeEventListener('resize', handleResize);
    };
  }, []);

  return isKeyboardVisible;
}

export function MobileBottomNav({ activeTab, onTabChange }: MobileBottomNavProps) {
  const isKeyboardVisible = useKeyboardVisible();

  // Hide bottom nav when keyboard is visible
  if (isKeyboardVisible) {
    return null;
  }

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border z-40 safe-area-bottom">
      <div className="flex items-center justify-around h-16">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={cn(
                "flex flex-col items-center justify-center gap-0.5 flex-1 h-full px-1 transition-colors",
                isActive 
                  ? "text-primary" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className={cn(
                "w-5 h-5 transition-transform",
                isActive && "scale-110"
              )} />
              <span className={cn(
                "text-[10px] font-medium truncate",
                isActive && "font-semibold"
              )}>
                {item.label}
              </span>
              {isActive && (
                <div className="absolute bottom-1 w-1 h-1 rounded-full bg-primary" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
