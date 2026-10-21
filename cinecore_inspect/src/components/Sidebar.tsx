import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  LayoutDashboard,
  Film,
  Users,
  Video,
  Building2,
  BarChart3,
  Clock,
  ChevronLeft,
  ChevronRight,
  Clapperboard
} from 'lucide-react';
import { PageId } from '../types';

interface SidebarProps {
  currentPage: PageId;
  onNavigate: (page: PageId) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  movieCount?: number;
}

interface NavItem {
  id: PageId;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string | number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentPage,
  onNavigate,
  isCollapsed,
  onToggleCollapse,
  movieCount = 36
}) => {
  const navItems: NavItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'movies', label: 'Movies', icon: Film, badge: movieCount },
    { id: 'actors', label: 'Actors', icon: Users },
    { id: 'directors', label: 'Directors', icon: Video },
    { id: 'producers', label: 'Producers', icon: Building2 },
    { id: 'insights', label: 'Insights', icon: BarChart3 },
    { id: 'activity', label: 'Activity', icon: Clock },
  ];

  return (
    <motion.aside
      initial={false}
      animate={{ width: isCollapsed ? 76 : 260 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      className="relative z-30 flex flex-col h-screen shrink-0 bg-slate-950/90 backdrop-blur-xl border-r border-slate-800/80 select-none overflow-hidden"
    >
      {/* Brand Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-slate-800/80">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 p-[1px] shrink-0 shadow-lg shadow-cyan-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[7px] flex items-center justify-center">
              <Clapperboard className="w-4 h-4 text-cyan-400" />
            </div>
          </div>
          <AnimatePresence mode="wait">
            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.15 }}
                className="whitespace-nowrap"
              >
                <div className="font-heading font-bold text-base text-white tracking-wider flex items-center gap-1.5">
                  <span>CINECORE</span>
                </div>
                <div className="text-[10px] font-mono text-cyan-400/90 -mt-0.5 tracking-tight">
                  Cinematic Management Suite
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <button
          onClick={onToggleCollapse}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900 border border-transparent hover:border-slate-700/60 transition-colors"
          title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Navigation List */}
      <div className="flex-1 overflow-y-auto py-4 px-2 space-y-1">
        <div className="px-3 pb-2 text-[10px] font-mono font-semibold tracking-wider text-slate-400 uppercase">
          {!isCollapsed ? 'Navigation' : '•••'}
        </div>

        {navItems.map((item) => {
          const isActive = currentPage === item.id;
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`group relative w-full flex items-center gap-3.5 px-3 py-2.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                isActive
                  ? 'text-cyan-300 font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
              }`}
            >
              {/* Active animated pill background */}
              {isActive && (
                <motion.div
                  layoutId="sidebar-active-indicator"
                  className="absolute inset-0 rounded-lg bg-cyan-950/40 border border-cyan-500/40 shadow-[inset_0_0_15px_rgba(6,182,212,0.15)]"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}

              {/* Active left indicator bar */}
              {isActive && (
                <motion.div
                  layoutId="sidebar-active-bar"
                  className="absolute left-0 top-1.5 bottom-1.5 w-1 rounded-r bg-cyan-400 shadow-[0_0_8px_#06b6d4]"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}

              {/* Icon with hover micro-rotation */}
              <div
                className={`relative z-10 shrink-0 transition-transform duration-200 group-hover:scale-110 ${
                  isActive ? 'text-cyan-400' : 'text-slate-400 group-hover:text-slate-200'
                }`}
              >
                <Icon className="w-4 h-4" />
              </div>

              {/* Item Label & optional badge */}
              <AnimatePresence mode="wait">
                {!isCollapsed && (
                  <motion.div
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -6 }}
                    transition={{ duration: 0.15 }}
                    className="relative z-10 flex-1 flex items-center justify-between overflow-hidden whitespace-nowrap"
                  >
                    <span className="truncate">{item.label}</span>
                    {item.badge !== undefined && (
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-cyan-300 border border-slate-700">
                        {item.badge}
                      </span>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          );
        })}
      </div>
    </motion.aside>
  );
};
