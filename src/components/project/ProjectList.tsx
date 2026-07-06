import { motion } from 'framer-motion';
import { Flask, Atom, BookOpen, Certificate, ArrowUpRight, Plus, FunnelSimple } from '@phosphor-icons/react';
import { Badge } from '../ui/Badge';
import { Avatar, AvatarGroup } from '../ui/Avatar';
import { ProgressBar } from '../ui/ProgressBar';
import { useAppStore } from '../../store/appStore';
import { PROJECTS } from '../../data/mockData';
import { statusColor, phaseLabel, formatCurrency, formatDate } from '../../lib/utils';

const stagger = { animate: { transition: { staggerChildren: 0.05 } } };
const fadeUp = { initial: { opacity: 0, y: 8 }, animate: { opacity: 1, y: 0 } };

const AREA_COLORS: Record<string, string> = {
  oncology: '#e11d48',
  neuroscience: '#7c3aed',
  cardiovascular: '#059669',
  infectious_disease: '#0891b2',
  immunology: '#d97706',
  rare_disease: '#6366f1',
};

export function ProjectList() {
  const { selectProject } = useAppStore();

  return (
    <motion.div variants={stagger} initial="initial" animate="animate" className="flex-1 overflow-y-auto" style={{ background: '#f7f8fc' }}>
      <div className="max-w-[1100px] mx-auto px-8 py-6 space-y-6">
        {/* Header */}
        <motion.div variants={fadeUp} className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Research Projects</h2>
            <p className="text-sm text-gray-400 mt-0.5">4 active · 0 paused · 12 completed lifetime</p>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 text-gray-500 text-xs hover:bg-gray-50 transition-colors">
              <FunnelSimple size={12} />
              Filter
            </button>
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition-colors shadow-sm shadow-blue-200">
              <Plus size={12} weight="bold" />
              New Project
            </button>
          </div>
        </motion.div>

        {/* Project cards */}
        <motion.div variants={stagger} className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {PROJECTS.map((project) => (
            <motion.div key={project.id} variants={fadeUp}>
              <div
                className="bg-white rounded-2xl border border-gray-100 hover:border-gray-200 hover:shadow-md transition-all cursor-pointer overflow-hidden"
                onClick={() => selectProject(project.id)}
              >
                {/* Color bar */}
                <div className="h-1" style={{ background: project.color }} />
                <div className="p-5">
                  {/* Top */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center text-base font-bold text-white shrink-0" style={{ background: project.color }}>
                        {project.name.split(' ')[1]?.slice(0, 2) ?? project.name.slice(0, 2)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-semibold text-gray-900">{project.name}</h3>
                          <span className="text-xs text-gray-400 font-mono">{project.code}</span>
                        </div>
                        <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                          <Badge color={statusColor(project.phase)} variant="soft" size="xs">{phaseLabel(project.phase)}</Badge>
                          <Badge color={AREA_COLORS[project.therapeuticArea] ?? '#9ca3af'} variant="soft" size="xs">
                            {project.therapeuticArea.replace(/_/g, ' ')}
                          </Badge>
                          {project.status !== 'active' && (
                            <Badge color={statusColor(project.status)} variant="soft" size="xs">{project.status}</Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    <ArrowUpRight size={16} className="text-gray-300 shrink-0 mt-1" />
                  </div>

                  <p className="text-sm text-gray-500 leading-relaxed mb-3 line-clamp-2">{project.description}</p>

                  {/* Progress */}
                  <div className="mb-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-gray-500">Overall progress</span>
                      <span className="text-xs font-medium text-gray-700">{project.progress}%</span>
                    </div>
                    <ProgressBar value={project.progress} color={project.color} size="sm" />
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-4 gap-2 mb-3">
                    {[
                      { label: 'Experiments', value: project.experiments, icon: Flask },
                      { label: 'Molecules', value: project.molecules, icon: Atom },
                      { label: 'Publications', value: project.publications, icon: BookOpen },
                      { label: 'Patents', value: project.patents, icon: Certificate },
                    ].map(({ label, value, icon: Icon }) => (
                      <div key={label} className="text-center py-2 rounded-xl bg-gray-50">
                        <div className="text-sm font-bold text-gray-800">{value}</div>
                        <div className="text-xs text-gray-400 mt-0.5">{label}</div>
                      </div>
                    ))}
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-2.5 border-t border-gray-100">
                    <div className="flex items-center gap-2">
                      <AvatarGroup users={project.team} max={4} size="xs" />
                      <span className="text-xs text-gray-400">{project.team.length} members</span>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-gray-400">{formatDate(project.startDate)} → {formatDate(project.targetDate)}</div>
                      {project.budget && (
                        <div className="text-xs text-gray-500 font-medium mt-0.5">
                          {formatCurrency(project.budget.spent)} / {formatCurrency(project.budget.allocated)}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Milestones mini timeline */}
                  <div className="mt-3 flex items-center gap-1 overflow-hidden">
                    {project.milestones.map((m) => (
                      <div
                        key={m.id}
                        title={m.title}
                        className="flex-1 h-1 rounded-full min-w-0"
                        style={{ background: m.completed ? project.color : '#e5e7eb' }}
                      />
                    ))}
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-xs text-gray-400">{project.milestones.filter((m) => m.completed).length}/{project.milestones.length} milestones</span>
                    {project.tags.slice(0, 3).map((t) => (
                      <span key={t} className="text-xs text-gray-400">{t}</span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
}
