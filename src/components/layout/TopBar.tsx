import { MagnifyingGlass, Bell, Plus, Command } from '@phosphor-icons/react';
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

  return (
    <div className="h-12 flex items-center px-4 gap-3 bg-white border-b border-gray-100 shrink-0" style={{ boxShadow: '0 1px 0 0 #e4e8ef' }}>
      <div className="flex-1 min-w-0">
        <h1 className="text-sm font-semibold text-gray-800">{VIEW_LABELS[view] ?? view}</h1>
      </div>

      {/* Search trigger */}
      <button
        onClick={() => setSearchOpen(true)}
        className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-200 text-gray-400 text-sm hover:border-gray-300 hover:text-gray-500 transition-colors bg-gray-50"
        style={{ minWidth: 200 }}
      >
        <MagnifyingGlass size={13} />
        <span className="flex-1 text-left">Search projects, experiments...</span>
        <span className="text-xs flex items-center gap-0.5 text-gray-300">
          <Command size={10} />K
        </span>
      </button>

      {/* Actions */}
      <div className="flex items-center gap-1">
        <button
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm"
        >
          <Plus size={13} weight="bold" />
          New
        </button>

        <button
          onClick={() => setNotificationsOpen(true)}
          className="relative w-8 h-8 flex items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors"
        >
          <Bell size={16} />
          {unread > 0 && (
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-blue-600 rounded-full" />
          )}
        </button>

        <Avatar user={CURRENT_USER} size="sm" showOnline className="ml-1 cursor-pointer" />
      </div>
    </div>
  );
}
