import { motion, AnimatePresence } from 'framer-motion';
import {
  House, FolderOpen, Flask, BookOpen, Certificate, Graph,
  Calendar, Books, Bell, Gear, MagnifyingGlass,
  CaretUpDown, Plus, Atom, ChartLineUp
} from '@phosphor-icons/react';
import { useAppStore } from '../../store/appStore';
import { cn } from '../../lib/utils';
import { Avatar } from '../ui/Avatar';
import { CURRENT_USER, NOTIFICATIONS } from '../../data/mockData';
import type { ViewType } from '../../types';

interface NavItem {
  id: ViewType;
  label: string;
  icon: React.ElementType;
}

const MAIN_NAV: NavItem[] = [
  { id: 'dashboard',      label: 'Dashboard',       icon: House },
  { id: 'projects',       label: 'Projects',         icon: FolderOpen },
  { id: 'experiments',    label: 'Experiments',      icon: Flask },
];

const RESEARCH_NAV: NavItem[] = [
  { id: 'publications',   label: 'Publications',     icon: BookOpen },
  { id: 'patents',        label: 'Patents',           icon: Certificate },
  { id: 'knowledge_graph',label: 'Knowledge Graph',  icon: Graph },
  { id: 'timeline',       label: 'Timeline',          icon: Calendar },
  { id: 'libraries',      label: 'Molecule Library',  icon: Atom },
];

export function Sidebar() {
  const { view, setView, sidebarCollapsed, toggleSidebar, setSearchOpen, setNotificationsOpen } = useAppStore();
  const unread = NOTIFICATIONS.filter((n) => !n.read).length;

  return (
    <motion.aside
      animate={{ width: sidebarCollapsed ? 52 : 232 }}
      transition={{ duration: 0.18, ease: [0.4, 0, 0.2, 1] }}
      className="h-full flex flex-col shrink-0 overflow-hidden relative select-none"
      style={{ background: '#0f0f11', borderRight: '1px solid rgba(255,255,255,0.06)' }}
    >
      {/* Workspace header */}
      <div className={cn('flex items-center gap-2.5 px-3 py-3.5 border-b', sidebarCollapsed ? 'justify-center' : '')} style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
        <div className="w-7 h-7 rounded-lg bg-blue-500 flex items-center justify-center shrink-0">
          <Flask size={14} color="white" weight="fill" />
        </div>
        <AnimatePresence>
          {!sidebarCollapsed && (
            <motion.div
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="flex-1 min-w-0 flex items-center justify-between"
            >
              <div className="min-w-0">
                <div className="text-sm font-semibold text-white tracking-tight leading-none">ChemStudio</div>
                <div className="text-xs text-white/30 mt-0.5 leading-none">Novartis Pharma AG</div>
              </div>
              <CaretUpDown size={13} className="text-white/20 shrink-0" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Search */}
      <div className="px-2 pt-2">
        <button
          onClick={() => setSearchOpen(true)}
          className={cn(
            'w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md transition-colors',
            'text-white/40 hover:text-white/70 hover:bg-white/5',
            sidebarCollapsed ? 'justify-center' : ''
          )}
        >
          <MagnifyingGlass size={14} />
          {!sidebarCollapsed && (
            <>
              <span className="text-xs flex-1 text-left">Search...</span>
              <span className="text-xs text-white/20 border border-white/10 rounded px-1 py-0.5">⌘K</span>
            </>
          )}
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 py-2 overflow-y-auto space-y-4">
        <NavSection label="Main" collapsed={sidebarCollapsed}>
          {MAIN_NAV.map((item) => (
            <NavBtn key={item.id} item={item} active={view === item.id || (view === 'project_detail' && item.id === 'projects') || (view === 'experiment_detail' && item.id === 'experiments')} collapsed={sidebarCollapsed} onClick={() => setView(item.id)} />
          ))}
        </NavSection>

        <NavSection label="Research" collapsed={sidebarCollapsed}>
          {RESEARCH_NAV.map((item) => (
            <NavBtn key={item.id} item={item} active={view === item.id} collapsed={sidebarCollapsed} onClick={() => setView(item.id)} />
          ))}
        </NavSection>
      </nav>

      {/* Bottom */}
      <div className="px-2 pb-2 space-y-0.5 border-t" style={{ borderColor: 'rgba(255,255,255,0.06)', paddingTop: 8 }}>
        <button
          onClick={() => setNotificationsOpen(true)}
          className={cn(
            'w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-md transition-colors text-white/40 hover:text-white/70 hover:bg-white/5 relative',
            sidebarCollapsed ? 'justify-center' : ''
          )}
        >
          <Bell size={14} />
          {!sidebarCollapsed && <span className="text-xs flex-1 text-left">Notifications</span>}
          {unread > 0 && (
            <span className={cn('bg-blue-500 text-white text-xs rounded-full flex items-center justify-center font-semibold leading-none', sidebarCollapsed ? 'absolute top-1 right-1 w-3.5 h-3.5 text-[9px]' : 'w-4 h-4 shrink-0')}>
              {unread}
            </span>
          )}
        </button>
        <NavBtn item={{ id: 'templates', label: 'Templates', icon: Books }} active={view === 'templates'} collapsed={sidebarCollapsed} onClick={() => setView('templates')} />
        <NavBtn item={{ id: 'settings', label: 'Settings', icon: Gear }} active={view === 'settings'} collapsed={sidebarCollapsed} onClick={() => setView('settings')} />
      </div>

      {/* User */}
      <div className="px-2 pb-3 pt-2 border-t" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
        <div className={cn('flex items-center gap-2.5 px-2 py-1.5 rounded-md hover:bg-white/5 cursor-pointer transition-colors', sidebarCollapsed && 'justify-center')}>
          <Avatar user={CURRENT_USER} size="sm" showOnline />
          {!sidebarCollapsed && (
            <div className="min-w-0 flex-1">
              <div className="text-xs font-medium text-white/80 truncate">{CURRENT_USER.name}</div>
              <div className="text-xs text-white/30 truncate">{CURRENT_USER.title}</div>
            </div>
          )}
        </div>
      </div>

      {/* Collapse toggle */}
      <button
        onClick={toggleSidebar}
        className="absolute top-[52px] -right-3 w-5 h-5 bg-[#1a1a1f] border border-white/10 rounded-full flex items-center justify-center shadow hover:bg-[#2a2a2f] transition-colors z-20"
      >
        <motion.div animate={{ rotate: sidebarCollapsed ? 0 : 180 }} transition={{ duration: 0.18 }}>
          <CaretUpDown size={8} className="text-white/40 rotate-90" />
        </motion.div>
      </button>
    </motion.aside>
  );
}

function NavSection({ label, collapsed, children }: { label: string; collapsed: boolean; children: React.ReactNode }) {
  return (
    <div className="space-y-0.5">
      {!collapsed && (
        <div className="px-2.5 pb-1">
          <span className="text-[10px] font-semibold uppercase tracking-widest text-white/20">{label}</span>
        </div>
      )}
      {children}
    </div>
  );
}

function NavBtn({ item, active, collapsed, onClick }: { item: NavItem; active: boolean; collapsed: boolean; onClick: () => void }) {
  const Icon = item.icon;
  return (
    <button
      onClick={onClick}
      title={collapsed ? item.label : undefined}
      className={cn(
        'w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-md transition-all text-left',
        active
          ? 'bg-white/10 text-white'
          : 'text-white/40 hover:text-white/70 hover:bg-white/5',
        collapsed ? 'justify-center' : '',
      )}
    >
      <Icon size={14} weight={active ? 'fill' : 'regular'} />
      {!collapsed && <span className="text-xs font-medium flex-1">{item.label}</span>}
    </button>
  );
}
