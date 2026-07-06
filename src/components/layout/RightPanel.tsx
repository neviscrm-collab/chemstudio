import { motion, AnimatePresence } from 'framer-motion';
import { X, ChatCircle, ClockCounterClockwise, Robot, BookOpen, SlidersHorizontal } from '@phosphor-icons/react';
import { useAppStore } from '../../store/appStore';
import { cn } from '../../lib/utils';
import { Avatar } from '../ui/Avatar';
import { EXPERIMENTS } from '../../data/mockData';
import { formatRelative } from '../../lib/utils';

const TABS = [
  { id: 'properties', label: 'Info', icon: SlidersHorizontal },
  { id: 'comments', label: 'Comments', icon: ChatCircle },
  { id: 'versions', label: 'History', icon: ClockCounterClockwise },
  { id: 'ai', label: 'AI', icon: Robot },
] as const;

export function RightPanel() {
  const { rightPanelOpen, rightPanelTab, setRightPanel, selectedExperimentId } = useAppStore();
  const exp = EXPERIMENTS.find((e) => e.id === selectedExperimentId) ?? EXPERIMENTS[0];

  return (
    <AnimatePresence>
      {rightPanelOpen && (
        <motion.aside
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: 280, opacity: 1 }}
          exit={{ width: 0, opacity: 0 }}
          transition={{ duration: 0.2, ease: 'easeInOut' }}
          className="h-full bg-white border-l border-gray-100 flex flex-col overflow-hidden shrink-0"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-3 py-2.5 border-b border-gray-100">
            <div className="flex gap-1">
              {TABS.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setRightPanel(true, tab.id)}
                    className={cn(
                      'flex items-center gap-1 px-2 py-1 rounded-md text-[11px] transition-colors',
                      rightPanelTab === tab.id
                        ? 'bg-blue-50 text-blue-700 font-medium'
                        : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700',
                    )}
                  >
                    <Icon size={12} />
                    {tab.label}
                  </button>
                );
              })}
            </div>
            <button onClick={() => setRightPanel(false)} className="w-6 h-6 flex items-center justify-center rounded-md hover:bg-gray-100 text-gray-400">
              <X size={13} />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            {rightPanelTab === 'comments' && <CommentsPanel exp={exp} />}
            {rightPanelTab === 'versions' && <VersionsPanel exp={exp} />}
            {rightPanelTab === 'ai' && <AIPanel />}
            {rightPanelTab === 'properties' && <PropertiesPanel exp={exp} />}
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}

function PropertiesPanel({ exp }: { exp: typeof EXPERIMENTS[0] }) {
  return (
    <div className="p-3 space-y-4">
      <div>
        <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-2">Experiment</div>
        <div className="space-y-2">
          {[
            { label: 'Code', value: exp.code },
            { label: 'Version', value: `v${exp.version}` },
            { label: 'Status', value: exp.status.replace(/_/g, ' ') },
            { label: 'Updated', value: formatRelative(exp.updatedAt) },
          ].map(({ label, value }) => (
            <div key={label} className="flex items-start justify-between">
              <span className="text-[11px] text-gray-400">{label}</span>
              <span className="text-[11px] text-gray-700 font-medium capitalize">{value}</span>
            </div>
          ))}
        </div>
      </div>
      <div>
        <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-2">Author</div>
        <div className="flex items-center gap-2">
          <Avatar user={exp.author} size="sm" />
          <div>
            <div className="text-[11px] font-medium text-gray-700">{exp.author.name}</div>
            <div className="text-[10px] text-gray-400">{exp.author.title}</div>
          </div>
        </div>
      </div>
      <div>
        <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-2">Tags</div>
        <div className="flex flex-wrap gap-1">
          {exp.tags.map((t) => (
            <span key={t} className="text-[10px] px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded-md">{t}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

function CommentsPanel({ exp }: { exp: typeof EXPERIMENTS[0] }) {
  return (
    <div className="p-3 space-y-3">
      <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">{exp.comments.length} Comments</div>
      {exp.comments.map((c) => (
        <div key={c.id} className="space-y-1.5">
          <div className="flex items-center gap-2">
            <Avatar user={c.author} size="xs" />
            <span className="text-[11px] font-medium text-gray-700">{c.author.name}</span>
            <span className="text-[10px] text-gray-400 ml-auto">{formatRelative(c.createdAt)}</span>
          </div>
          <p className="text-[11px] text-gray-600 leading-relaxed bg-gray-50 rounded-lg px-2.5 py-2">{c.content}</p>
          {!c.resolved && (
            <button className="text-[10px] text-blue-500 hover:text-blue-600">Resolve</button>
          )}
        </div>
      ))}
      <div className="pt-2 border-t border-gray-100">
        <textarea
          placeholder="Add a comment..."
          className="w-full text-[12px] border border-gray-200 rounded-lg px-2.5 py-2 resize-none focus:outline-none focus:border-blue-400 text-gray-700 placeholder:text-gray-400"
          rows={3}
        />
        <button className="mt-1.5 w-full py-1.5 bg-blue-600 text-white text-[12px] font-medium rounded-lg hover:bg-blue-700 transition-colors">
          Comment
        </button>
      </div>
    </div>
  );
}

function VersionsPanel({ exp }: { exp: typeof EXPERIMENTS[0] }) {
  return (
    <div className="p-3 space-y-2">
      <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">{exp.versions.length} Versions</div>
      {[...exp.versions].reverse().map((v, i) => (
        <div key={v.id} className={cn('flex gap-2.5 group', i === 0 && 'opacity-100')}>
          <div className="flex flex-col items-center">
            <div className={cn('w-2 h-2 rounded-full mt-1 shrink-0', i === 0 ? 'bg-blue-600' : 'bg-gray-200')} />
            {i < exp.versions.length - 1 && <div className="w-px flex-1 bg-gray-100 mt-1" />}
          </div>
          <div className="pb-3 flex-1">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-gray-700">v{v.version}</span>
              <span className="text-[10px] text-gray-400">{formatRelative(v.createdAt)}</span>
            </div>
            <p className="text-[11px] text-gray-500 mt-0.5">{v.message}</p>
            <div className="flex items-center gap-1.5 mt-1">
              <Avatar user={v.author} size="xs" />
              <span className="text-[10px] text-gray-400">{v.author.name}</span>
              <span className="text-[10px] text-gray-300">· {v.changes} changes</span>
            </div>
            {i > 0 && (
              <button className="text-[10px] text-blue-500 hover:text-blue-600 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                Restore
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

function AIPanel() {
  const suggestions = [
    'Summarize this experiment',
    'Suggest next synthesis step',
    'Compare with similar experiments',
    'Generate patent draft',
    'Check literature for precedents',
    'Predict oral bioavailability',
  ];
  return (
    <div className="p-3 space-y-3">
      <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">AI Assistant</div>
      <div className="bg-blue-50 rounded-lg p-2.5 text-[11px] text-blue-700 leading-relaxed">
        <Robot size={13} className="inline mr-1" />
        Based on AUR-0252 data, recommend advancing to rat PK study. 3,4-difluoro substitution shows excellent metabolic improvement (t½ &gt;120 min) with preserved potency.
      </div>
      <div className="space-y-1.5">
        <div className="text-[10px] text-gray-400">Quick actions</div>
        {suggestions.map((s) => (
          <button key={s} className="w-full text-left text-[11px] px-2.5 py-1.5 rounded-lg hover:bg-gray-50 text-gray-600 hover:text-gray-800 transition-colors border border-transparent hover:border-gray-200">
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}
