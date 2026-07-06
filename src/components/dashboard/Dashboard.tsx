import { motion } from 'framer-motion';
import {
  Flask, BookOpen, Certificate, Users, ArrowUpRight,
  TrendUp, Clock, Star, Robot, ArrowRight, CheckCircle,
  Timer, Atom, DotsThree, Sparkle, ArrowUpRight as Arrow
} from '@phosphor-icons/react';
import { Badge } from '../ui/Badge';
import { Avatar, AvatarGroup } from '../ui/Avatar';
import { ProgressBar } from '../ui/ProgressBar';
import { useAppStore } from '../../store/appStore';
import { PROJECTS, ACTIVITIES, NOTIFICATIONS, CURRENT_USER, EXPERIMENTS, MOLECULES } from '../../data/mockData';
import { formatRelative, statusColor, phaseLabel, cn } from '../../lib/utils';

const stagger = { animate: { transition: { staggerChildren: 0.06 } } };
const fadeUp = { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0, transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] } } };

const KPI_DATA = [
  { label: 'Active Projects', value: '4',     sub: '+1 this quarter', icon: Flask,       color: '#3b82f6', bg: '#eff6ff' },
  { label: 'Experiments',     value: '231',   sub: '+12 this month',  icon: Flask,       color: '#8b5cf6', bg: '#f5f3ff' },
  { label: 'Molecules',       value: '1,320', sub: '+47 this week',   icon: Atom,        color: '#06b6d4', bg: '#ecfeff' },
  { label: 'Publications',    value: '17',    sub: '2 in review',     icon: BookOpen,    color: '#10b981', bg: '#ecfdf5' },
  { label: 'Patents',         value: '11',    sub: '3 pending',       icon: Certificate, color: '#f59e0b', bg: '#fffbeb' },
  { label: 'Team Members',    value: '24',    sub: 'Across 3 sites',  icon: Users,       color: '#ef4444', bg: '#fef2f2' },
];

export function Dashboard() {
  const { selectProject, selectExperiment } = useAppStore();
  const activeProjects = PROJECTS.filter((p) => p.status === 'active');

  return (
    <motion.div
      variants={stagger}
      initial="initial"
      animate="animate"
      className="flex-1 overflow-y-auto"
      style={{ background: '#f7f8fc' }}
    >
      {/* Hero greeting */}
      <motion.div variants={fadeUp} className="relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #1e1b4b 0%, #1e40af 60%, #0369a1 100%)' }}>
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, #818cf8 0%, transparent 50%), radial-gradient(circle at 80% 20%, #38bdf8 0%, transparent 40%)' }} />
        <div className="max-w-[1360px] mx-auto px-8 py-8 relative">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Sparkle size={14} className="text-yellow-300" weight="fill" />
                <span className="text-xs text-blue-200 font-medium">Monday, July 6, 2026</span>
              </div>
              <h1 className="text-3xl font-bold text-white tracking-tight">Good morning, Sarah 👋</h1>
              <p className="text-sm text-blue-200 mt-1">Here's what's happening across your research today.</p>
            </div>
            <div className="hidden lg:flex items-center gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-white">87%</div>
                <div className="text-xs text-blue-200 mt-0.5">IND Progress</div>
              </div>
              <div className="w-px h-10 bg-white/10" />
              <div className="text-center">
                <div className="text-2xl font-bold text-white">3</div>
                <div className="text-xs text-blue-200 mt-0.5">Milestones due</div>
              </div>
              <div className="w-px h-10 bg-white/10" />
              <div className="flex items-center gap-2">
                <div className="flex -space-x-1.5">
                  {PROJECTS[0].team.slice(0, 4).map((u) => (
                    <Avatar key={u.id} user={u} size="sm" className="ring-2 ring-blue-800" />
                  ))}
                </div>
                <span className="text-xs text-blue-200">4 online</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="max-w-[1360px] mx-auto px-8 py-6 space-y-6">

        {/* KPI Strip */}
        <motion.div variants={fadeUp}>
          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3">
            {KPI_DATA.map((kpi) => {
              const Icon = kpi.icon;
              return (
                <div key={kpi.label} className="bg-white rounded-2xl p-4 border border-gray-100 hover:border-gray-200 hover:shadow-md transition-all cursor-default group">
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: kpi.bg }}>
                      <Icon size={17} style={{ color: kpi.color }} />
                    </div>
                    <TrendUp size={13} className="text-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900 tabular-nums leading-none">{kpi.value}</div>
                  <div className="text-xs font-medium text-gray-600 mt-1.5 leading-none">{kpi.label}</div>
                  <div className="text-xs text-gray-400 mt-1">{kpi.sub}</div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Body grid */}
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_308px] gap-5">

          {/* Left column */}
          <div className="space-y-5 min-w-0">

            {/* Active Projects */}
            <motion.div variants={fadeUp}>
              <SectionHead title="Active Research Projects">
                <TextBtn onClick={() => useAppStore.getState().setView('projects')}>View all <ArrowRight size={11} /></TextBtn>
              </SectionHead>
              <div className="space-y-2">
                {activeProjects.map((project) => (
                  <div
                    key={project.id}
                    onClick={() => selectProject(project.id)}
                    className="bg-white rounded-2xl border border-gray-100 px-5 py-4 hover:border-blue-100 hover:shadow-md cursor-pointer transition-all group"
                  >
                    <div className="flex items-start gap-3.5">
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 text-sm font-bold text-white shadow-sm" style={{ background: project.color }}>
                        {project.name.split(' ')[1]?.slice(0, 2) ?? project.name.slice(0, 2)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-semibold text-gray-900">{project.name}</span>
                          <span className="text-xs text-gray-400 font-mono bg-gray-50 px-1.5 py-0.5 rounded">{project.code}</span>
                          <Badge color={statusColor(project.phase)} variant="soft" size="xs">{phaseLabel(project.phase)}</Badge>
                        </div>
                        <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{project.description}</p>
                        <div className="flex items-center gap-4 mt-3">
                          <ProgressBar value={project.progress} color={project.color} size="xs" showLabel className="flex-1" />
                          <div className="flex items-center gap-3 shrink-0">
                            <span className="text-xs text-gray-400 flex items-center gap-1"><Flask size={11} />{project.experiments}</span>
                            <span className="text-xs text-gray-400 flex items-center gap-1"><Atom size={11} />{project.molecules}</span>
                            <AvatarGroup users={project.team} max={3} size="xs" />
                          </div>
                        </div>
                        {project.recentActivity && (
                          <div className="mt-2 text-xs text-gray-400 flex items-center gap-1">
                            <Clock size={10} />{project.recentActivity}
                          </div>
                        )}
                      </div>
                      <ArrowUpRight size={15} className="text-gray-200 group-hover:text-blue-400 transition-colors shrink-0 mt-0.5" />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Recent Molecules */}
            <motion.div variants={fadeUp}>
              <SectionHead title="Recently Created Molecules">
                <TextBtn onClick={() => useAppStore.getState().setView('libraries')}>View library <ArrowRight size={11} /></TextBtn>
              </SectionHead>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
                {MOLECULES.map((mol) => (
                  <div key={mol.id} className="bg-white rounded-2xl border border-gray-100 p-3.5 hover:border-gray-200 hover:shadow-md cursor-pointer transition-all group">
                    <div className="w-full h-[68px] rounded-xl mb-3 flex items-center justify-center" style={{ background: statusColor(mol.status) + '0c' }}>
                      <MoleculeSketch name={mol.name} color={statusColor(mol.status)} />
                    </div>
                    <div className="text-sm font-semibold text-gray-900 truncate">{mol.name}</div>
                    <div className="text-xs text-gray-400 font-mono mt-0.5 truncate">{mol.formula}</div>
                    <div className="flex items-center justify-between mt-2.5">
                      <Badge color={statusColor(mol.status)} variant="soft" size="xs">{mol.status}</Badge>
                      {mol.ic50 && <span className="text-xs text-gray-400">IC₅₀ {mol.ic50}</span>}
                    </div>
                    <div className="mt-2.5 pt-2.5 border-t border-gray-50 grid grid-cols-2 gap-x-2 gap-y-0.5">
                      <Prop label="MW"   value={mol.mw.toFixed(1)} />
                      <Prop label="cLogP" value={mol.logP.toFixed(1)} />
                      <Prop label="HBD"  value={mol.hbd} />
                      <Prop label="TPSA" value={mol.tpsa.toFixed(0)} />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Milestones */}
            <motion.div variants={fadeUp}>
              <SectionHead title="Upcoming Milestones" />
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
                {PROJECTS.flatMap((p) =>
                  p.milestones.filter((m) => !m.completed).slice(0, 1).map((m) => ({ ...m, project: p }))
                ).slice(0, 4).map((m) => (
                  <div key={m.id} className="bg-white rounded-2xl border border-gray-100 p-4 hover:border-gray-200 hover:shadow-md transition-all group cursor-pointer">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0" style={{ background: m.project.color + '15' }}>
                        <MilestoneIcon type={m.type} color={m.project.color} />
                      </div>
                      <span className="text-xs text-gray-400 truncate">{m.project.name}</span>
                    </div>
                    <div className="text-sm font-semibold text-gray-900 leading-snug">{m.title}</div>
                    <div className="text-xs text-gray-400 mt-2.5 flex items-center gap-1">
                      <Clock size={10} />{formatRelative(m.date)}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

          </div>

          {/* Right column */}
          <motion.div variants={fadeUp} className="space-y-3">

            {/* AI Insights */}
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-50 flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center shrink-0">
                  <Robot size={12} color="white" />
                </div>
                <span className="text-sm font-semibold text-gray-900 flex-1">AI Insights</span>
                <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full font-semibold">3 new</span>
              </div>
              <div className="p-3 space-y-1.5">
                {[
                  { text: 'AUR-0252 shows best ADMET profile in Aurora-B series. Recommend rat PK study.', label: 'High',  color: '#10b981', dot: '#10b981' },
                  { text: 'HEL-047 IND package 87% complete. 2 pharmacology reports outstanding.',         label: 'Ready', color: '#3b82f6', dot: '#3b82f6' },
                  { text: 'Literature: 3 new KRAS G12C papers published this week. 1 may be competitive.',  label: 'Alert', color: '#f59e0b', dot: '#f59e0b' },
                ].map((insight) => (
                  <div key={insight.label} className="flex gap-2.5 p-2.5 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors group">
                    <div className="w-1 rounded-full shrink-0 mt-0.5" style={{ background: insight.dot, minHeight: 36 }} />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-600 leading-relaxed">{insight.text}</p>
                      <span className="text-xs font-semibold mt-1 block" style={{ color: insight.color }}>{insight.label}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Pending Reviews */}
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-50 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Timer size={14} className="text-amber-500" />
                  <span className="text-sm font-semibold text-gray-900">Pending Reviews</span>
                </div>
                <span className="text-xs bg-amber-50 text-amber-600 px-2 py-0.5 rounded-full font-semibold">2 waiting</span>
              </div>
              <div className="p-2">
                {EXPERIMENTS.slice(0, 2).map((exp) => (
                  <div
                    key={exp.id}
                    onClick={() => selectExperiment(exp.id)}
                    className="flex items-center gap-2.5 px-2.5 py-2.5 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors group"
                  >
                    <div className="w-8 h-8 rounded-xl bg-amber-50 flex items-center justify-center shrink-0">
                      <Flask size={13} className="text-amber-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-semibold text-gray-800 truncate">{exp.code}</div>
                      <div className="text-xs text-gray-400">{exp.status === 'in_review' ? 'Awaiting your review' : 'Under review'}</div>
                    </div>
                    <ArrowUpRight size={13} className="text-gray-200 group-hover:text-blue-400 transition-colors shrink-0" />
                  </div>
                ))}
              </div>
            </div>

            {/* Team Activity */}
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-50 flex items-center gap-2">
                <Clock size={13} className="text-gray-400" />
                <span className="text-sm font-semibold text-gray-900 flex-1">Team Activity</span>
                <DotsThree size={16} className="text-gray-300 cursor-pointer hover:text-gray-500" />
              </div>
              <div className="p-3 space-y-3">
                {ACTIVITIES.slice(0, 5).map((a) => (
                  <div key={a.id} className="flex items-start gap-2.5">
                    <Avatar user={a.user} size="xs" className="mt-0.5 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-500 leading-snug">
                        <span className="font-semibold text-gray-800">{a.user.name.split(' ')[1]}</span>{' '}
                        {a.action}{' '}
                        <span className="font-semibold text-gray-800">{a.target}</span>
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

function SectionHead({ title, children }: { title: string; children?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between mb-3">
      <h3 className="text-sm font-bold text-gray-900">{title}</h3>
      {children}
    </div>
  );
}

function TextBtn({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return (
    <button onClick={onClick} className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1 font-medium">
      {children}
    </button>
  );
}

function Prop({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-xs text-gray-400">{label}</span>
      <span className="text-xs font-mono text-gray-600">{value}</span>
    </div>
  );
}

function MoleculeSketch({ name, color }: { name: string; color: string }) {
  const seed = name.charCodeAt(0) + name.charCodeAt(1);
  const shapes = [
    <svg key="hex" viewBox="0 0 60 60" className="w-10 h-10 opacity-60">
      <polygon points="30,5 52,17.5 52,42.5 30,55 8,42.5 8,17.5" fill="none" stroke={color} strokeWidth="1.5" />
      <polygon points="30,15 44,22.5 44,37.5 30,45 16,37.5 16,22.5" fill={color} opacity="0.15" stroke={color} strokeWidth="1" />
      <line x1="30" y1="5" x2="30" y2="15" stroke={color} strokeWidth="1.5" />
      <line x1="52" y1="17.5" x2="44" y2="22.5" stroke={color} strokeWidth="1.5" />
      <line x1="52" y1="42.5" x2="44" y2="37.5" stroke={color} strokeWidth="1.5" />
    </svg>,
    <svg key="ring" viewBox="0 0 60 60" className="w-10 h-10 opacity-60">
      <circle cx="30" cy="30" r="20" fill="none" stroke={color} strokeWidth="1.5" />
      <circle cx="30" cy="30" r="12" fill={color} opacity="0.1" stroke={color} strokeWidth="1" />
      <line x1="30" y1="10" x2="30" y2="18" stroke={color} strokeWidth="1.5" />
      <line x1="30" y1="42" x2="30" y2="50" stroke={color} strokeWidth="1.5" />
      <line x1="10" y1="30" x2="50" y2="30" stroke={color} strokeWidth="0.8" strokeDasharray="2,2" />
    </svg>,
    <svg key="chain" viewBox="0 0 60 60" className="w-10 h-10 opacity-60">
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
  return <Icon size={13} style={{ color }} />;
}
