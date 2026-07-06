import { motion, AnimatePresence } from 'framer-motion';
import { X, Bell, Checks, ChatCircle, CheckCircle, BookOpen, Star, Clock } from '@phosphor-icons/react';
import { useAppStore } from '../../store/appStore';
import { NOTIFICATIONS } from '../../data/mockData';
import { Avatar } from '../ui/Avatar';
import { formatRelative } from '../../lib/utils';

const TYPE_ICONS: Record<string, React.ElementType> = {
  mention: ChatCircle,
  review_request: Clock,
  approval: CheckCircle,
  comment: ChatCircle,
  publication: BookOpen,
  milestone: Star,
};

const TYPE_COLORS: Record<string, string> = {
  mention: '#2563eb',
  review_request: '#d97706',
  approval: '#059669',
  comment: '#7c3aed',
  publication: '#0891b2',
  milestone: '#d97706',
};

export function NotificationsPanel() {
  const { notificationsOpen, setNotificationsOpen } = useAppStore();

  return (
    <AnimatePresence>
      {notificationsOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.3 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black z-40"
            onClick={() => setNotificationsOpen(false)}
          />
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.2 }}
            className="fixed right-4 top-14 w-[360px] bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden"
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <Bell size={15} className="text-gray-700" />
                <span className="text-[13px] font-semibold text-gray-800">Notifications</span>
                <span className="text-[10px] bg-blue-600 text-white px-1.5 py-0.5 rounded-full">
                  {NOTIFICATIONS.filter((n) => !n.read).length}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <button className="text-[11px] text-blue-600 hover:text-blue-700 flex items-center gap-1">
                  <Checks size={12} />
                  Mark all read
                </button>
                <button onClick={() => setNotificationsOpen(false)} className="w-6 h-6 flex items-center justify-center rounded-md hover:bg-gray-100 ml-1">
                  <X size={13} className="text-gray-400" />
                </button>
              </div>
            </div>

            <div className="max-h-[480px] overflow-y-auto divide-y divide-gray-50">
              {NOTIFICATIONS.map((n) => {
                const Icon = TYPE_ICONS[n.type] ?? Bell;
                const color = TYPE_COLORS[n.type] ?? '#9ca3af';
                return (
                  <div
                    key={n.id}
                    className={`flex gap-3 px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors ${!n.read ? 'bg-blue-50/30' : ''}`}
                  >
                    <div className="relative shrink-0">
                      <Avatar user={n.from} size="sm" />
                      <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full flex items-center justify-center" style={{ background: color }}>
                        <Icon size={9} color="white" weight="fill" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[12px] text-gray-800 leading-snug">
                        <span className="font-medium">{n.title}</span>
                      </p>
                      <p className="text-[11px] text-gray-500 mt-0.5 line-clamp-2">{n.body}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] text-gray-400">{formatRelative(n.timestamp)}</span>
                        {!n.read && <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
