import { MagnifyingGlass, Bell, Plus, Command, CaretRight } from '@phosphor-icons/react';
import { useAppStore } from '../../store/appStore';
import { Avatar } from '../ui/Avatar';
import { CURRENT_USER, NOTIFICATIONS } from '../../data/mockData';
import { cn } from '../../lib/utils';

const VIEW_LABELS: Record<string, string> = {
  dashboard: 'Dashboard',
  projects: 'Projects',
  project_detail: 'Project',
  experiments: 'Experiments',
  experiment_detail: 'Experiment',
  publications: 'Publications',
  patents: 'Patents',
  knowledge_graph: 'Knowledge Graph',
  timeline: 'Research Timeline',
  libraries: 'Molecule Library',
  templates: 'Templates',
  settings: 'Settings',
  search: 'Search',
};

export function TopBar() {
  const { view, setSearchOpen, setNotificationsOpen } = useAppStore();
  const unread = NOTIFICATIONS.filter((n) => !n.read).length;
  const label = VIEW_LABELS[view] ?? view;

  return (
    <div className="h-11 flex items-center px-4 gap-3 bg-white shrink-0" style={{ borderBottom: '1px solid #f0f0f3' }}>
      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 flex-1 min-w-0">
        <span className="text-xs text-gray-400">Novartis</span>
        <CaretRight size={11} className="text-gray-300" />
        <span className="text-xs font-semibold text-gray-800">{label}</span>
      </div>

      {/* Search */}
      <button
        onClick={() => setSearchOpen(true)}
        className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-50 border border-gray-200 text-gray-400 hover:border-gray-300 hover:bg-gray-100 transition-all"
        style={{ minWidth: 220 }}
      >
        <MagnifyingGlass size={13} />
        <span className="text-xs flex-1 text-left text-gray-400">Search anything...</span>
        <kbd className="text-[10px] text-gray-300 flex items-center gap-0.5 font-sans">
          <Command size={10} />K
        </kbd>
      </button>

      {/* Actions */}
      <div className="flex items-center gap-1.5">
        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-colors shadow-sm shadow-blue-200">
          <Plus size={13} weight="bold" />
          New
        </button>

        <button
          onClick={() => setNotificationsOpen(true)}
          className="relative w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
        >
          <Bell size={15} />
          {unread > 0 && (
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-blue-500 rounded-full ring-2 ring-white" />
          )}
        </button>

        <div className="w-px h-5 bg-gray-100 mx-0.5" />

        <Avatar user={CURRENT_USER} size="sm" showOnline className="cursor-pointer hover:opacity-80 transition-opacity" />
      </div>
    </div>
  );
}
