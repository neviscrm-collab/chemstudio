import { motion } from 'framer-motion';
import { ArrowLeft, Flask, Atom, BookOpen, Certificate, CheckCircle, Clock, Plus, Users, ChartLine, Calendar } from '@phosphor-icons/react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Avatar, AvatarGroup } from '../ui/Avatar';
import { ProgressBar } from '../ui/ProgressBar';
import { useAppStore } from '../../store/appStore';
import { PROJECTS, EXPERIMENTS } from '../../data/mockData';
import { statusColor, phaseLabel, formatDate, formatRelative, formatCurrency } from '../../lib/utils';
import { useState } from 'react';

const TABS = ['Overview', 'Experiments', 'Molecules', 'Publications', 'Milestones', 'Team'];

export function ProjectDetail() {
  const { selectedProjectId, setView, selectExperiment } = useAppStore();
  const [tab, setTab] = useState('Overview');
  const project = PROJECTS.find((p) => p.id === selectedProjectId) ?? PROJECTS[0];
  const exps = EXPERIMENTS.filter((e) => e.projectId === project.id);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1 overflow-y-auto" style={{ background: '#f7f8fc' }}>
      {/* Hero */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-[1200px] mx-auto px-6 pt-4 pb-0">
          <button
            onClick={() => setView('projects')}
            className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-600 mb-3 transition-colors"
          >
            <ArrowLeft size={13} />
            Projects
          </button>

          <div className="flex items-start gap-4 pb-4">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold text-white shrink-0" style={{ background: project.color }}>
              {project.name.split(' ')[1]?.slice(0, 2) ?? project.name.slice(0, 2)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-xl font-bold text-gray-900">{project.name}</h1>
                <span className="text-xs text-gray-400 font-mono">{project.code}</span>
                <Badge color={statusColor(project.phase)} variant="soft">{phaseLabel(project.phase)}</Badge>
                <Badge color={statusColor(project.status)} variant="soft">{project.status}</Badge>
              </div>
              <p className="text-sm text-gray-500 mt-1 max-w-2xl">{project.description}</p>
              <div className="flex flex-wrap gap-4 mt-2 text-xs text-gray-500">
                <span className="flex items-center gap-1"><Users size={13} />Led by {project.leadScientist.name}</span>
                <span className="flex items-center gap-1"><Calendar size={13} />{formatDate(project.startDate)} → {formatDate(project.targetDate)}</span>
                {project.budget && (
                  <span className="flex items-center gap-1"><ChartLine size={13} />{formatCurrency(project.budget.spent)} of {formatCurrency(project.budget.allocated)} spent</span>
                )}
              </div>
            </div>
            <div className="text-right shrink-0">
              <div className="text-2xl font-bold text-gray-900">{project.progress}%</div>
              <div className="text-xs text-gray-400 mt-0.5">complete</div>
              <ProgressBar value={project.progress} color={project.color} size="md" className="w-24 mt-1.5" />
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 -mb-px">
            {TABS.map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-3 py-2 text-sm font-medium border-b-2 transition-colors ${
                  tab === t ? 'border-blue-600 text-blue-700' : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-6 py-5 space-y-5">
        {tab === 'Overview' && (
          <div className="grid grid-cols-3 gap-5">
            {/* Left */}
            <div className="col-span-2 space-y-4">
              {/* KPIs */}
              <div className="grid grid-cols-4 gap-3">
                {[
                  { label: 'Experiments', value: project.experiments, icon: Flask, color: '#2563eb' },
                  { label: 'Molecules', value: project.molecules, icon: Atom, color: '#7c3aed' },
                  { label: 'Publications', value: project.publications, icon: BookOpen, color: '#059669' },
                  { label: 'Patents', value: project.patents, icon: Certificate, color: '#d97706' },
                ].map(({ label, value, icon: Icon, color }) => (
                  <Card key={label} padding="md">
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center mb-2" style={{ background: color + '15' }}>
                      <Icon size={14} style={{ color }} />
                    </div>
                    <div className="text-xl font-bold text-gray-900">{value}</div>
                    <div className="text-xs text-gray-500 mt-0.5">{label}</div>
                  </Card>
                ))}
              </div>

              {/* Recent Experiments */}
              <Card padding="md">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-gray-800">Recent Experiments</h3>
                  <button className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1">
                    <Plus size={12} />New Experiment
                  </button>
                </div>
                <div className="space-y-2">
                  {exps.map((exp) => (
                    <div
                      key={exp.id}
                      className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                      onClick={() => selectExperiment(exp.id)}
                    >
                      <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                        <Flask size={14} className="text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-medium text-gray-800 truncate">{exp.title}</div>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-xs text-gray-400 font-mono">{exp.code}</span>
                          <span className="text-xs text-gray-400">v{exp.version}</span>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <Badge color={statusColor(exp.status)} variant="soft" size="xs">{exp.status.replace(/_/g, ' ')}</Badge>
                        <div className="text-xs text-gray-400 mt-0.5">{formatRelative(exp.updatedAt)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* Right */}
            <div className="space-y-4">
              {/* Team */}
              <Card padding="md">
                <h3 className="text-sm font-semibold text-gray-800 mb-3">Team</h3>
                <div className="space-y-2.5">
                  {project.team.map((user) => (
                    <div key={user.id} className="flex items-center gap-2.5">
                      <Avatar user={user} size="sm" showOnline />
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-medium text-gray-700 truncate">{user.name}</div>
                        <div className="text-xs text-gray-400">{user.title}</div>
                      </div>
                      {user.id === project.leadScientist.id && (
                        <span className="text-xs text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded-full font-medium">Lead</span>
                      )}
                    </div>
                  ))}
                </div>
              </Card>

              {/* Tags */}
              <Card padding="md">
                <h3 className="text-sm font-semibold text-gray-800 mb-2">Tags</h3>
                <div className="flex flex-wrap gap-1.5">
                  {project.tags.map((t) => (
                    <span key={t} className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-lg">{t}</span>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        )}

        {tab === 'Milestones' && (
          <Card padding="lg">
            <h3 className="text-sm font-semibold text-gray-800 mb-4">Project Milestones</h3>
            <div className="relative">
              <div className="absolute left-4 top-4 bottom-4 w-px bg-gray-200" />
              <div className="space-y-4 pl-10">
                {project.milestones.map((m) => (
                  <div key={m.id} className="relative">
                    <div className={`absolute -left-[26px] top-0.5 w-4 h-4 rounded-full border-2 flex items-center justify-center ${m.completed ? 'border-blue-600 bg-blue-600' : 'border-gray-300 bg-white'}`}>
                      {m.completed && <CheckCircle size={10} color="white" weight="fill" />}
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className={`text-sm font-medium ${m.completed ? 'text-gray-800' : 'text-gray-500'}`}>{m.title}</div>
                        <div className="text-xs text-gray-400 mt-0.5 flex items-center gap-1">
                          <Clock size={10} />
                          {formatDate(m.date)}
                        </div>
                      </div>
                      <Badge
                        color={m.completed ? '#059669' : '#9ca3af'}
                        variant="soft"
                        size="xs"
                      >
                        {m.completed ? 'Completed' : 'Upcoming'}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        )}

        {(tab === 'Experiments' || tab === 'Molecules' || tab === 'Publications' || tab === 'Team') && (
          <Card padding="lg">
            <p className="text-sm text-gray-400 text-center py-8">
              {tab} view — select an experiment to open the full workspace
            </p>
          </Card>
        )}
      </div>
    </motion.div>
  );
}
