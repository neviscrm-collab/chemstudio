import { useState } from 'react';
import { motion } from 'framer-motion';
import { Flask, Plus, FunnelSimple, ArrowUpRight } from '@phosphor-icons/react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Avatar, AvatarGroup } from '../ui/Avatar';
import { useAppStore } from '../../store/appStore';
import { EXPERIMENTS, PROJECTS } from '../../data/mockData';
import { statusColor, formatRelative } from '../../lib/utils';
import { NewExperimentModal } from './NewExperimentModal';
import type { Experiment } from '../../types';

export function ExperimentList() {
  const { selectExperiment, addExperiment, localExperiments } = useAppStore();
  const [modalOpen, setModalOpen] = useState(false);

  const allExperiments: Experiment[] = [...localExperiments, ...EXPERIMENTS];

  function handleCreate(exp: Experiment) {
    addExperiment(exp);
  }

  return (
    <>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1 overflow-y-auto bg-[#f8f9fb] p-6">
        <div className="max-w-[1000px] mx-auto space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Experiments</h2>
              <p className="text-sm text-gray-500 mt-0.5">{allExperiments.length} total · Across all projects</p>
            </div>
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-gray-200 text-gray-500 text-sm hover:bg-gray-50">
                <FunnelSimple size={13} /> Filter
              </button>
              <button
                onClick={() => setModalOpen(true)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                <Plus size={13} weight="bold" /> New Experiment
              </button>
            </div>
          </div>

          <div className="space-y-2.5">
            {allExperiments.map((exp) => {
              const project = PROJECTS.find((p) => p.id === exp.projectId);
              const isNew = localExperiments.some(e => e.id === exp.id);
              return (
                <Card key={exp.id} hover padding="md" onClick={() => selectExperiment(exp.id)}>
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                      <Flask size={16} className="text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="text-sm font-semibold text-gray-800 line-clamp-1">{exp.title}</h3>
                            {isNew && (
                              <span className="text-xs font-semibold px-1.5 py-0.5 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-full uppercase tracking-wide">New</span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 mt-1 flex-wrap">
                            <span className="text-xs font-mono text-gray-400">{exp.code}</span>
                            <span className="text-xs text-gray-300">·</span>
                            <span className="text-xs text-gray-400">v{exp.version}</span>
                            {project && (
                              <>
                                <span className="text-xs text-gray-300">·</span>
                                <span className="text-xs font-medium" style={{ color: project.color }}>{project.name}</span>
                              </>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <Badge color={statusColor(exp.status)} variant="soft" size="xs">
                            {exp.status.replace(/_/g, ' ')}
                          </Badge>
                          <ArrowUpRight size={14} className="text-gray-300" />
                        </div>
                      </div>
                      <div className="flex items-center gap-3 mt-2">
                        <Avatar user={exp.author} size="xs" />
                        <span className="text-xs text-gray-500">{exp.author.name}</span>
                        <AvatarGroup users={exp.collaborators} size="xs" max={2} />
                        <span className="text-xs text-gray-400 ml-auto">{formatRelative(exp.updatedAt)}</span>
                      </div>
                      {exp.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1.5">
                          {exp.tags.slice(0, 4).map((t) => (
                            <span key={t} className="text-xs px-1.5 py-0.5 bg-gray-100 text-gray-500 rounded">{t}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </motion.div>

      <NewExperimentModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onCreate={handleCreate}
      />
    </>
  );
}
