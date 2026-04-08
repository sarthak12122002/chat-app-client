import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MessageSquare, History, Bookmark, BarChart3, Database, ChevronLeft, ChevronRight, Dna } from 'lucide-react';
import { cn } from '@/lib/utils';
import ThemeToggle from './ThemeToggle';

const NAV_ITEMS = [
  { path: '/', icon: MessageSquare, label: 'Chat' },
  { path: '/history', icon: History, label: 'History' },
  { path: '/saved', icon: Bookmark, label: 'Saved' },
  { path: '/analytics', icon: BarChart3, label: 'Analytics' },
];

export default function AppSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  return (
    <aside
      className={cn(
        "h-screen flex flex-col bg-sidebar border-r border-sidebar-border transition-all duration-300 ease-in-out relative z-20",
        collapsed ? "w-[68px]" : "w-[240px]"
      )}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 h-16 border-b border-sidebar-border shrink-0">
        <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shrink-0">
          <Dna className="h-5 w-5 text-white" />
        </div>
        {!collapsed && (
          <div className="animate-fade-in">
            <h1 className="text-sm font-bold text-sidebar-foreground tracking-tight">Bio-Tech Query AI</h1>
            <p className="text-[10px] text-sidebar-foreground/50 font-medium uppercase tracking-wider">Biotech Analytics</p>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map(({ path, icon: Icon, label }) => {
          const active = location.pathname === path;
          return (
            <Link
              key={path}
              to={path}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                active
                  ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-md"
                  : "text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent"
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {!collapsed && <span className="animate-fade-in">{label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-sidebar-border p-3 space-y-2">
        <div className="flex items-center justify-between">
          <ThemeToggle />
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="h-8 w-8 rounded-lg flex items-center justify-center text-sidebar-foreground/50 hover:text-sidebar-foreground hover:bg-sidebar-accent transition-colors"
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>
        </div>
        {!collapsed && (
          <div className="flex items-center gap-2 px-2 py-1.5 animate-fade-in">
            <Database className="h-3.5 w-3.5 text-accent" />
            <span className="text-[11px] text-sidebar-foreground/50 font-medium">Connected to Biotech DB</span>
          </div>
        )}
      </div>
    </aside>
  );
}