import { motion } from 'framer-motion';
import {
  Flask, BookOpen, Certificate, Users, ArrowUpRight,
  TrendUp, Clock, Star, Robot, ArrowRight, CheckCircle, Timer, Atom
} from '@phosphor-icons/react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Avatar, AvatarGroup } from '../ui/Avatar';
import { ProgressBar } from '../ui/ProgressBar';
import { useAppStore } from '../../store/appStore';
import { PROJECTS, ACTIVITIES, NOTIFICATIONS, CURRENT_USER, EXPERIMENTS, MOLECULES } from '../../data/mockData';
import { formatRelative, statusColor, phaseLabel, cn } from '../../lib/utils';

const stagger = { animate: { transition: { staggerChildren: 0.05 } } };
const fadeUp = { initial: { opacity: 0, y: 6 }, animate: { opacity: 1, y: 0, transition: { duration: 0.25 } } };

export function Dashboard() {
  const { selectProject, selectExperiment } = useAppStore();
  const activeProjects = PROJECTS.filter((p) => p.status === 'active');

  return (
    <motion.div
      variants={stagger}
      initial="initial"
      animate="animate"
      className="flex-1 overflow-y-auto bg-gray-50/60"
    >
      <div className="max-w-[1360px] mx-auto px-6 py-6 space-y-6">

        {/* Greeting */}
        <motion.div variants={fadeUp} className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 tracking-tight">Good morning, Sarah</h2>
            <p className="text-sm text-gray-400 mt-0.5">Monday, July 6, 2026 · Novartis Pharma AG, Basel</p>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-gray-400 bg-white border border-gray-100 rounded-full px-3 py-1.5">
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
            4 colleagues online
          </div>
        </motion.div>

        {/* KPI Row */}
        <motion.div variants={fadeUp}>
          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3">
            {[
              { label: 'Active Projects', value: '4',     icon: Flask,       color: '#2563eb', delta: '+1 this quarter' },
              { label: 'Experiments',     value: '231',   icon: Flask,       color: '#7c3aed', delta: '+12 this month' },
              { label: 'Molecules',       value: '1,320', icon: Atom,        color: '#0891b2', delta: '+47 this week' },
              { label: 'Publications',    value: '17',    icon: BookOpen,    color: '#059669', delta: '2 in review' },
              { label: 'Patents',         value: '11',    icon: Certificate, color: '#d97706', delta: '3 pending' },
              { label: 'Team Members',    value: '24',    icon: Users,       color: '#e11d48', delta: 'Across 3 sites' },
            ].map((kpi) => {
              const Icon = kpi.icon;
              return (
                <div key={kpi.label} className="bg-white rounded-xl border border-gray-100 p-4 hover:border-gray-200 transition-colors">
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: kpi.color + '12' }}>
                      <Icon size={16} style={{ color: kpi.color }} />
                    </div>
                    <TrendUp size={12} className="text-green-500" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900 tabular-nums leading-none">{kpi.value}</div>
                  <div className="text-xs font-medium text-gray-500 mt-1.5 leading-none">{kpi.label}</div>
                  <div className="text-xs text-gray-300 mt-1">{kpi.delta}</div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_300px] gap-5">

          {/* Left: Projects + Molecules + Milestones */}
          <div className="space-y-5 min-w-0">

            {/* Active Projects */}
            <motion.div variants={fadeUp}>
              <SectionHeader title="Active Research Projects">
                <button
                  onClick={() => useAppStore.getState().setView('projects')}
                  className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1"
                >
                  View all <ArrowRight size={11} />
                </button>
              </SectionHeader>
              <div className="space-y-2">
                {activeProjects.map((project) => (
                  <div
                    key={project.id}
                    onClick={() => selectProject(project.id)}
                    className="bg-white rounded-xl border border-gray-100 px-4 py-3.5 hover:border-gray-200 hover:shadow-sm cursor-pointer transition-all"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold text-white" style={{ background: project.color }}>
                        {project.name.split(' ')[1]?.slice(0, 2) ?? project.name.slice(0, 2)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-semibold text-gray-800">{project.name}</span>
                          <span className="text-xs text-gray-400 font-mono">{project.code}</span>
                          <Badge color={statusColor(project.phase)} variant="soft" size="xs">{phaseLabel(project.phase)}</Badge>
                        </div>
                        <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">{project.description}</p>
                        <div className="flex items-center gap-4 mt-2.5">
                          <ProgressBar value={project.progress} color={project.color} size="xs" showLabel className="flex-1" />
                          <div className="flex items-center gap-3 shrink-0">
                            <span className="text-xs text-gray-400"><Flask size={10} className="inline mr-0.5" />{project.experiments}</span>
                            <span className="text-xs text-gray-400"><Atom size={10} className="inline mr-0.5" />{project.molecules}</span>
                            <AvatarGroup users={project.team} max={3} size="xs" />
                          </div>
                        </div>
                        {project.recentActivity && (
                          <div className="mt-1.5 text-xs text-gray-400 flex items-center gap-1">
                            <Clock size={10} />{project.recentActivity}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Recent Molecules */}
            <motion.div variants={fadeUp}>
              <SectionHeader title="Recently Created Molecules">
                <button
                  onClick={() => useAppStore.getState().setView('libraries')}
                  className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1"
                >
                  View library <ArrowRight size={11} />
                </button>
              </SectionHeader>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
                {MOLECULES.map((mol) => (
                  <div key={mol.id} className="bg-white rounded-xl border border-gray-100 p-3 hover:border-gray-200 hover:shadow-sm cursor-pointer transition-all">
                    <div
                      className="w-full h-[72px] rounded-lg mb-2.5 flex items-center justify-center"
                      style={{ background: statusColor(mol.status) + '0e' }}
                    >
                      <MoleculeSketch name={mol.name} color={statusColor(mol.status)} />
                    </div>
                    <div className="text-sm font-semibold text-gray-800 truncate">{mol.name}</div>
                    <div className="text-xs text-gray-400 font-mono mt-0.5 truncate">{mol.formula}</div>
                    <div className="flex items-center justify-between mt-2">
                      <Badge color={statusColor(mol.status)} variant="soft" size="xs">{mol.status}</Badge>
                      {mol.ic50 && <span className="text-xs text-gray-400">IC₅₀ {mol.ic50}</span>}
                    </div>
                    <div className="mt-2 pt-2 border-t border-gray-50 grid grid-cols-2 gap-x-2 gap-y-0.5">
                      <Prop label="MW" value={mol.mw.toFixed(1)} />
                      <Prop label="cLogP" value={mol.logP.toFixed(1)} />
                      <Prop label="HBD" value={mol.hbd} />
                      <Prop label="TPSA" value={mol.tpsa.toFixed(0)} />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Milestones */}
            <motion.div variants={fadeUp}>
              <SectionHeader title="Upcoming Milestones" />
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
                {PROJECTS.flatMap((p) =>
                  p.milestones.filter((m) => !m.completed).slice(0, 1).map((m) => ({ ...m, project: p }))
                ).slice(0, 4).map((m) => (
                  <div key={m.id} className="bg-white rounded-xl border border-gray-100 p-3.5 hover:border-gray-200 transition-colors">
                    <div className="flex items-center gap-2 mb-2.5">
                      <div className="w-6 h-6 rounded-md flex items-center justify-center shrink-0" style={{ background: m.project.color + '15' }}>
                        <MilestoneIcon type={m.type} color={m.project.color} />
                      </div>
                      <span className="text-xs text-gray-400 truncate">{m.project.name}</span>
                    </div>
                    <div className="text-sm font-semibold text-gray-800 leading-snug">{m.title}</div>
                    <div className="text-xs text-gray-400 mt-2 flex items-center gap-1">
                      <Clock size={10} />{formatRelative(m.date)}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

          </div>

          {/* Right Column */}
          <motion.div variants={fadeUp} className="space-y-3">

            {/* AI Insights */}
            <div className="bg-white rounded-xl border border-gray-100 p-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-6 h-6 rounded-md bg-blue-600 flex items-center justify-center shrink-0">
                  <Robot size={12} color="white" />
                </div>
                <span className="text-sm font-semibold text-gray-800 flex-1">AI Insights</span>
                <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full font-medium">3 new</span>
              </div>
              <div className="space-y-1.5">
                {[
                  { text: 'AUR-0252 shows best ADMET profile in Aurora-B series. Recommend rat PK study.', label: 'High',  color: '#059669' },
                  { text: 'HEL-047 IND package 87% complete. 2 pharmacology reports outstanding.',         label: 'Ready', color: '#2563eb' },
                  { text: 'Literature: 3 new KRAS G12C papers published this week. 1 may be competitive.',  label: 'Alert', color: '#d97706' },
                ].map((insight) => (
                  <div key={insight.label} className="flex gap-2.5 p-2.5 rounded-lg bg-gray-50 hover:bg-gray-100 cursor-pointer transition-colors">
                    <div className="w-1 rounded-full shrink-0" style={{ background: insight.color, minHeight: 14 }} />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-600 leading-relaxed">{insight.text}</p>
                      <span className="text-xs font-semibold mt-1 block" style={{ color: insight.color }}>{insight.label}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Pending Reviews */}
            <div className="bg-white rounded-xl border border-gray-100 p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Timer size={14} className="text-amber-500" />
                  <span className="text-sm font-semibold text-gray-800">Pending Reviews</span>
                </div>
                <span className="text-xs text-amber-600 font-medium bg-amber-50 px-2 py-0.5 rounded-full">2 waiting</span>
              </div>
              <div className="space-y-1">
                {EXPERIMENTS.slice(0, 2).map((exp) => (
                  <div
                    key={exp.id}
                    onClick={() => selectExperiment(exp.id)}
                    className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <div className="w-7 h-7 rounded-md bg-amber-50 flex items-center justify-center shrink-0">
                      <Flask size={12} className="text-amber-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-semibold text-gray-700 truncate">{exp.code}</div>
                      <div className="text-xs text-gray-400">{exp.status === 'in_review' ? 'Awaiting your review' : 'Under review'}</div>
                    </div>
                    <ArrowUpRight size={12} className="text-gray-300 shrink-0" />
                  </div>
                ))}
              </div>
            </div>

            {/* Team Activity */}
            <div className="bg-white rounded-xl border border-gray-100 p-4">
              <div className="flex items-center gap-2 mb-3">
                <Clock size={13} className="text-gray-400" />
                <span className="text-sm font-semibold text-gray-800">Team Activity</span>
              </div>
              <div className="space-y-3">
                {ACTIVITIES.slice(0, 5).map((a) => (
                  <div key={a.id} className="flex items-start gap-2.5">
                    <Avatar user={a.user} size="xs" className="mt-0.5 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-500 leading-snug">
                        <span className="font-semibold text-gray-700">{a.user.name.split(' ')[1]}</span>{' '}
                        {a.action}{' '}
                        <span className="font-semibold text-gray-700">{a.target}</span>
                      </p>
                      <span className="text-xs text-gray-400">{formatRelative(a.timestamp)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

function SectionHeader({ title, children }: { title: string; children?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between mb-2.5">
      <h3 className="text-sm font-semibold text-gray-800">{title}</h3>
      {children}
    </div>
  );
}

function Prop({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-xs text-gray-400">{label}</span>
      <span className="text-xs text-gray-500 font-mono">{value}</span>
    </div>
  );
}

function MoleculeSketch({ name, color }: { name: string; color: string }) {
  const seed = name.charCodeAt(0) + name.charCodeAt(1);
  const shapes = [
    <svg key="hex" viewBox="0 0 60 60" className="w-11 h-11 opacity-50">
      <polygon points="30,5 52,17.5 52,42.5 30,55 8,42.5 8,17.5" fill="none" stroke={color} strokeWidth="1.5" />
      <polygon points="30,15 44,22.5 44,37.5 30,45 16,37.5 16,22.5" fill={color} opacity="0.15" stroke={color} strokeWidth="1" />
      <line x1="30" y1="5" x2="30" y2="15" stroke={color} strokeWidth="1.5" />
      <line x1="52" y1="17.5" x2="44" y2="22.5" stroke={color} strokeWidth="1.5" />
      <line x1="52" y1="42.5" x2="44" y2="37.5" stroke={color} strokeWidth="1.5" />
    </svg>,
    <svg key="ring" viewBox="0 0 60 60" className="w-11 h-11 opacity-50">
      <circle cx="30" cy="30" r="20" fill="none" stroke={color} strokeWidth="1.5" />
      <circle cx="30" cy="30" r="12" fill={color} opacity="0.1" stroke={color} strokeWidth="1" />
      <line x1="30" y1="10" x2="30" y2="18" stroke={color} strokeWidth="1.5" />
      <line x1="30" y1="42" x2="30" y2="50" stroke={color} strokeWidth="1.5" />
      <line x1="10" y1="30" x2="50" y2="30" stroke={color} strokeWidth="0.8" strokeDasharray="2,2" />
    </svg>,
    <svg key="chain" viewBox="0 0 60 60" className="w-11 h-11 opacity-50">
      <polyline points="5,40 15,20 25,35 35,15 45,30 55,20" fill="none" stroke={color} strokeWidth="1.5" strokeLinejoin="round" />
      {[15, 25, 35, 45].map((x, i) => <circle key={i} cx={x} cy={i % 2 === 0 ? 20 : 35} r="2.5" fill={color} />)}
    </svg>,
  ];
  return shapes[seed % 3];
}

function MilestoneIcon({ type, color }: { type: string; color: string }) {
  const icons: Record<string, React.ElementType> = {
    discovery: Flask,
    patent: Certificate,
    publication: BookOpen,
    clinical: CheckCircle,
    approval: Star,
  };
  const Icon = icons[type] ?? Flask;
  return <Icon size={12} style={{ color }} />;
}
