import { motion, AnimatePresence } from 'framer-motion';
import {
  House, FolderOpen, Flask, BookOpen, Certificate, Graph,
  Calendar, Books, Robot, Bell, Gear, MagnifyingGlass,
  ChartBar, Users, CaretRight, Atom
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
  badge?: number;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: House },
  { id: 'projects', label: 'Projects', icon: FolderOpen },
  { id: 'experiments', label: 'Experiments', icon: Flask },
  { id: 'publications', label: 'Publications', icon: BookOpen },
  { id: 'patents', label: 'Patents', icon: Certificate },
  { id: 'knowledge_graph', label: 'Knowledge Graph', icon: Graph },
  { id: 'timeline', label: 'Timeline', icon: Calendar },
  { id: 'libraries', label: 'Molecule Library', icon: Atom },
];

const BOTTOM_ITEMS: NavItem[] = [
  { id: 'templates', label: 'Templates', icon: Books },
  { id: 'settings', label: 'Settings', icon: Gear },
];

export function Sidebar() {
  const { view, setView, sidebarCollapsed, toggleSidebar, setSearchOpen, setNotificationsOpen } = useAppStore();
  const unread = NOTIFICATIONS.filter((n) => !n.read).length;

  return (
    <motion.aside
      animate={{ width: sidebarCollapsed ? 56 : 220 }}
      transition={{ duration: 0.2, ease: 'easeInOut' }}
      className="h-full flex flex-col bg-white border-r border-gray-100 shrink-0 overflow-hidden"
      style={{ boxShadow: '1px 0 0 0 #e4e8ef' }}
    >
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-4 py-4 border-b border-gray-100">
        <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center shrink-0">
          <Flask size={15} color="white" weight="fill" />
        </div>
        <AnimatePresence>
          {!sidebarCollapsed && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <span className="font-semibold text-gray-900 text-sm tracking-tight">ChemStudio</span>
              <span className="text-xs text-blue-500 font-medium ml-1">2.0</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Search */}
      <div className="px-2 py-2">
        <button
          onClick={() => setSearchOpen(true)}
          className={cn(
            'w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-gray-400 hover:bg-gray-50 hover:text-gray-600 transition-colors',
            sidebarCollapsed ? 'justify-center' : ''
          )}
        >
          <MagnifyingGlass size={15} />
          {!sidebarCollapsed && (
            <span className="text-sm flex-1 text-left">Search...</span>
          )}
          {!sidebarCollapsed && (
            <span className="text-xs text-gray-300 border border-gray-200 rounded px-1">⌘K</span>
          )}
        </button>
      </div>

      {/* Main Nav */}
      <nav className="flex-1 px-2 py-1 overflow-y-auto space-y-0.5">
        {NAV_ITEMS.map((item) => (
          <NavBtn key={item.id} item={item} active={view === item.id} collapsed={sidebarCollapsed} onClick={() => setView(item.id)} />
        ))}
      </nav>

      {/* Bottom */}
      <div className="px-2 py-2 space-y-0.5 border-t border-gray-100">
        <button
          onClick={() => setNotificationsOpen(true)}
          className={cn(
            'w-full flex items-center gap-2.5 px-2 py-1.5 rounded-lg text-gray-500 hover:bg-gray-50 hover:text-gray-700 transition-colors relative',
            sidebarCollapsed ? 'justify-center' : ''
          )}
        >
          <Bell size={15} />
          {!sidebarCollapsed && <span className="text-sm flex-1 text-left">Notifications</span>}
          {unread > 0 && (
            <span className="absolute top-1 right-1 w-4 h-4 bg-blue-600 text-white text-xs rounded-full flex items-center justify-center font-semibold">
              {unread}
            </span>
          )}
        </button>
        {BOTTOM_ITEMS.map((item) => (
          <NavBtn key={item.id} item={item} active={view === item.id} collapsed={sidebarCollapsed} onClick={() => setView(item.id)} />
        ))}
      </div>

      {/* User */}
      <div className="px-2 py-3 border-t border-gray-100">
        <div className={cn('flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-gray-50 cursor-pointer', sidebarCollapsed && 'justify-center')}>
          <Avatar user={CURRENT_USER} size="sm" showOnline />
          {!sidebarCollapsed && (
            <div className="min-w-0 flex-1">
              <div className="text-sm font-medium text-gray-800 truncate">{CURRENT_USER.name}</div>
              <div className="text-xs text-gray-400 truncate">{CURRENT_USER.title}</div>
            </div>
          )}
        </div>
      </div>

      {/* Collapse toggle */}
      <button
        onClick={toggleSidebar}
        className="absolute bottom-[72px] -right-3 w-6 h-6 bg-white border border-gray-200 rounded-full flex items-center justify-center shadow-sm hover:bg-gray-50 transition-colors z-10"
        style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.1)' }}
      >
        <CaretRight size={10} className={cn('text-gray-400 transition-transform', sidebarCollapsed ? '' : 'rotate-180')} />
      </button>
    </motion.aside>
  );
}

function NavBtn({ item, active, collapsed, onClick }: { item: NavItem; active: boolean; collapsed: boolean; onClick: () => void }) {
  const Icon = item.icon;
  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full flex items-center gap-2.5 px-2 py-1.5 rounded-lg transition-colors text-left',
        active
          ? 'bg-blue-50 text-blue-700 font-medium'
          : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700',
        collapsed ? 'justify-center' : '',
      )}
    >
      <Icon size={15} weight={active ? 'fill' : 'regular'} />
      {!collapsed && <span className="text-sm flex-1">{item.label}</span>}
      {!collapsed && item.badge !== undefined && (
        <span className="text-xs bg-gray-100 text-gray-500 rounded-full px-1.5 py-0.5">{item.badge}</span>
      )}
    </button>
  );
}
