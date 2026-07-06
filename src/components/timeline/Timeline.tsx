import { useState } from 'react';
import { motion } from 'framer-motion';
import { Flask, Certificate, BookOpen, CheckCircle, Star, ArrowsOut } from '@phosphor-icons/react';
import { TIMELINE_EVENTS, PROJECTS } from '../../data/mockData';
import { Badge } from '../ui/Badge';
import { formatDate } from '../../lib/utils';

const TYPE_ICONS: Record<string, React.ElementType> = {
  discovery: Flask,
  patent: Certificate,
  publication: BookOpen,
  clinical: CheckCircle,
  approval: Star,
};

const TYPE_LABELS: Record<string, string> = {
  discovery: 'Discovery',
  patent: 'Patent',
  publication: 'Publication',
  clinical: 'Clinical',
  approval: 'Approval',
};

export function Timeline() {
  const [filter, setFilter] = useState<string | null>(null);

  const events = TIMELINE_EVENTS.filter((e) => !filter || e.projectId === filter);
  const years = [...new Set(events.map((e) => e.date.slice(0, 4)))].sort();

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1 overflow-y-auto bg-[#f8f9fb] p-6">
      <div className="max-w-[1100px] mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Research Timeline</h2>
            <p className="text-sm text-gray-500 mt-0.5">Complete scientific discovery journey · 2021–2026</p>
          </div>

          {/* Project filter */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setFilter(null)}
              className={`text-sm px-2.5 py-1 rounded-lg transition-colors ${!filter ? 'bg-gray-800 text-white' : 'bg-white text-gray-500 border border-gray-200 hover:bg-gray-50'}`}
            >
              All Projects
            </button>
            {PROJECTS.map((p) => (
              <button
                key={p.id}
                onClick={() => setFilter(filter === p.id ? null : p.id)}
                className={`text-sm px-2.5 py-1 rounded-lg transition-colors border ${filter === p.id ? 'text-white' : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'}`}
                style={filter === p.id ? { background: p.color, borderColor: p.color } : {}}
              >
                {p.name.split(' ')[1]}
              </button>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 mb-6 flex-wrap">
          {Object.entries(TYPE_LABELS).map(([type, label]) => {
            const Icon = TYPE_ICONS[type];
            return (
              <div key={type} className="flex items-center gap-1.5 text-xs text-gray-500">
                <Icon size={12} className="text-gray-400" />
                {label}
              </div>
            );
          })}
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Center line */}
          <div className="absolute left-[140px] top-0 bottom-0 w-px bg-gray-200" />

          <div className="space-y-1">
            {years.map((year) => {
              const yearEvents = events.filter((e) => e.date.startsWith(year));
              return (
                <div key={year}>
                  {/* Year marker */}
                  <div className="flex items-center gap-4 mb-2 mt-4">
                    <div className="w-[124px] text-right">
                      <span className="text-3xl font-bold text-gray-200 select-none">{year}</span>
                    </div>
                    <div className="w-3 h-3 rounded-full bg-gray-300 border-2 border-white -ml-[6px] z-10 relative" style={{ marginLeft: -6, boxShadow: '0 0 0 3px #f1f3f7' }} />
                  </div>

                  {yearEvents.map((event, i) => {
                    const Icon = TYPE_ICONS[event.type] ?? Flask;
                    const project = PROJECTS.find((p) => p.id === event.projectId);
                    const isLeft = i % 2 === 0;

                    return (
                      <motion.div
                        key={event.id}
                        initial={{ opacity: 0, x: isLeft ? -20 : 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="flex items-center gap-4 py-1 group"
                      >
                        <div className="w-[124px] text-right">
                          <span className="text-xs text-gray-400 tabular-nums">{formatDate(event.date)}</span>
                        </div>

                        {/* Node */}
                        <div
                          className="w-3 h-3 rounded-full border-2 border-white z-10 shrink-0 transition-transform group-hover:scale-125"
                          style={{
                            background: event.color,
                            marginLeft: -6,
                            boxShadow: `0 0 0 3px ${event.color}20, 0 0 0 6px ${event.color}10`,
                          }}
                        />

                        {/* Card */}
                        <div
                          className="flex-1 ml-2 py-2.5 px-3.5 bg-white rounded-xl border border-gray-100 hover:border-gray-200 hover:shadow-md transition-all cursor-pointer group-hover:-translate-y-0.5"
                          style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}
                        >
                          <div className="flex items-center gap-2">
                            <div className="w-5 h-5 rounded-md flex items-center justify-center shrink-0" style={{ background: event.color + '20' }}>
                              <Icon size={11} style={{ color: event.color }} />
                            </div>
                            <span className="text-sm font-medium text-gray-800 flex-1">{event.title}</span>
                            <div className="flex items-center gap-1.5">
                              <Badge color={event.color} variant="soft" size="xs">{TYPE_LABELS[event.type]}</Badge>
                              {project && (
                                <span
                                  className="text-xs font-medium px-1.5 py-0.5 rounded-full"
                                  style={{ background: project.color + '15', color: project.color }}
                                >
                                  {project.name}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>

        {/* Future */}
        <div className="mt-6 flex items-center gap-4">
          <div className="w-[124px] text-right">
            <span className="text-xs text-gray-300">2027+</span>
          </div>
          <div className="w-3 h-3 rounded-full border-2 border-dashed border-gray-300 -ml-[6px]" />
          <div className="flex-1 ml-2 py-2.5 px-3.5 rounded-xl border-2 border-dashed border-gray-200">
            <span className="text-sm text-gray-400">Upcoming milestones: Helios IND Filing · Aurora Phase I · Meridian Phase II Readout</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
