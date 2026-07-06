import { useState } from 'react';
import {
  ArrowLeft, CloudArrowUp, Eye, PencilSimple,
  ChatCircle, ClockCounterClockwise, Robot, SlidersHorizontal, Plus,
  TextH, Table, Image, Atom, ArrowsClockwise, Sparkle, TextAlignLeft,
  MathOperations, Quotes, CheckCircle
} from '@phosphor-icons/react';
import { useAppStore } from '../../store/appStore';
import { EXPERIMENTS } from '../../data/mockData';
import { Badge } from '../ui/Badge';
// localExperiments are prepended so they take priority over mock data
import { Avatar } from '../ui/Avatar';
import { statusColor, formatRelative } from '../../lib/utils';

const STATUS_COLORS: Record<string, string> = {
  draft: '#9ca3af',
  in_review: '#d97706',
  approved: '#059669',
  rejected: '#e11d48',
  published: '#2563eb',
};

const INSERT_TOOLS = [
  { icon: TextAlignLeft, label: 'Text' },
  { icon: TextH, label: 'Heading' },
  { icon: Atom, label: 'Molecule' },
  { icon: ArrowsClockwise, label: 'Reaction' },
  { icon: Table, label: 'Table' },
  { icon: Image, label: 'Image' },
  { icon: MathOperations, label: 'Equation' },
  { icon: Quotes, label: 'Reference' },
  { icon: Robot, label: 'AI Note' },
];

export function ExperimentEditor() {
  const { selectedExperimentId, setView, setRightPanel, localExperiments } = useAppStore();
  const allExperiments = [...localExperiments, ...EXPERIMENTS];
  const exp = allExperiments.find((e) => e.id === selectedExperimentId) ?? allExperiments[0];
  const [mode, setMode] = useState<'edit' | 'preview'>('edit');

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-white">
      {/* ── Toolbar ── single row, ~44px */}
      <div className="h-11 flex items-center gap-1 px-3 border-b border-gray-100 bg-white shrink-0 min-w-0">
        {/* Back */}
        <button
          onClick={() => setView('experiments')}
          className="flex items-center gap-1 text-[11px] text-gray-400 hover:text-gray-600 transition-colors shrink-0"
        >
          <ArrowLeft size={12} />
          <span className="hidden sm:inline">{exp.code.split('-').slice(0, 2).join('-')}</span>
        </button>

        <span className="text-gray-200 shrink-0">·</span>

        {/* Code + version */}
        <div className="flex items-center gap-1 px-1.5 py-0.5 rounded border border-gray-100 bg-gray-50 shrink-0">
          <span className="text-[10px] font-mono text-gray-500">{exp.code}</span>
          <span className="text-[9px] text-gray-400 border-l border-gray-200 pl-1 ml-0.5">v{exp.version}</span>
        </div>

        {/* Status */}
        <span
          className="inline-flex items-center text-[10px] font-medium rounded-full px-1.5 py-0.5 whitespace-nowrap shrink-0"
          style={{ background: (STATUS_COLORS[exp.status] ?? '#9ca3af') + '18', color: STATUS_COLORS[exp.status] ?? '#9ca3af' }}
        >
          {exp.status.replace(/_/g, ' ')}
        </span>

        <div className="flex-1 min-w-0" />

        {/* Autosave — hidden on small viewports */}
        <div className="hidden md:flex items-center gap-1 text-[10px] text-gray-400 shrink-0">
          <CloudArrowUp size={12} />
          <span>Saved {formatRelative(exp.updatedAt)}</span>
        </div>

        {/* Edit / Preview toggle */}
        <div className="flex items-center bg-gray-100 rounded-md p-0.5 shrink-0">
          {(['edit', 'preview'] as const).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium transition-colors ${
                mode === m ? 'bg-white text-gray-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {m === 'edit' ? <PencilSimple size={10} /> : <Eye size={10} />}
              {m === 'edit' ? 'Edit' : 'Preview'}
            </button>
          ))}
        </div>

        {/* Right-panel icon buttons */}
        <div className="flex items-center shrink-0">
          {[
            { tab: 'comments' as const, icon: ChatCircle, count: exp.comments.filter((c) => !c.resolved).length },
            { tab: 'versions' as const, icon: ClockCounterClockwise, count: exp.versions.length },
            { tab: 'ai' as const, icon: Robot, count: 0 },
          ].map(({ tab, icon: Icon, count }) => (
            <button
              key={tab}
              onClick={() => setRightPanel(true, tab)}
              className="relative w-7 h-7 flex items-center justify-center rounded text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
              title={tab}
            >
              <Icon size={13} />
              {count > 0 && (
                <span className="absolute top-0.5 right-0.5 w-3 h-3 bg-blue-600 text-white text-[7px] rounded-full flex items-center justify-center font-bold leading-none">
                  {count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Submit */}
        <button
          title="Submit for Review"
          className="flex items-center gap-1 px-2 py-1 rounded-md bg-blue-600 text-white text-[10px] font-medium hover:bg-blue-700 transition-colors shrink-0"
        >
          <CheckCircle size={11} />
          <span>Submit</span>
        </button>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* ── Insert sidebar ── */}
        <div className="w-9 border-r border-gray-100 flex flex-col items-center py-2 gap-0.5 bg-gray-50 shrink-0">
          {INSERT_TOOLS.map(({ icon: Icon, label }) => (
            <button
              key={label}
              title={label}
              className="w-6 h-6 rounded flex items-center justify-center text-gray-400 hover:bg-white hover:text-gray-600 hover:shadow-sm transition-all"
            >
              <Icon size={13} />
            </button>
          ))}
        </div>

        {/* ── Document ── */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-[760px] mx-auto px-8 py-8">
            {/* Meta row */}
            <div className="flex items-center gap-2 mb-4 flex-wrap">
              <Avatar user={exp.author} size="xs" />
              <span className="text-[11px] text-gray-400">{exp.author.name} · {exp.author.department}</span>
              <span className="text-[10px] text-gray-300">·</span>
              <span className="text-[11px] text-gray-400">{formatRelative(exp.updatedAt)}</span>
              {exp.collaborators.map((c) => (
                <Avatar key={c.id} user={c} size="xs" />
              ))}
            </div>

            {/* Title */}
            <h1
              className="text-xl font-bold text-gray-900 leading-snug mb-2 outline-none"
              contentEditable={mode === 'edit'}
              suppressContentEditableWarning
            >
              {exp.title}
            </h1>

            {/* Tags */}
            <div className="flex items-center gap-1.5 flex-wrap mb-6">
              {exp.tags.map((t) => (
                <span key={t} className="text-[10px] px-1.5 py-0.5 bg-gray-100 text-gray-500 rounded">{t}</span>
              ))}
            </div>

            {/* Sections */}
            <div className="space-y-4">
              {exp.sections.map((section) => (
                <Section key={section.id} section={section} mode={mode} />
              ))}

              {mode === 'edit' && (
                <button className="flex items-center gap-2 px-3 py-2 w-full rounded-lg border-2 border-dashed border-gray-200 text-gray-400 hover:border-gray-300 hover:text-gray-500 transition-colors text-[11px] mt-4">
                  <Plus size={13} />
                  Add section
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Section({ section, mode }: {
  section: { id: string; type: string; content: string; title?: string; data?: Record<string, unknown> };
  mode: 'edit' | 'preview';
}) {
  if (section.type === 'heading') {
    return (
      <h2
        className="text-[14px] font-semibold text-gray-900 pt-2 pb-1 border-b border-gray-100 outline-none"
        contentEditable={mode === 'edit'}
        suppressContentEditableWarning
      >
        {section.content}
      </h2>
    );
  }

  if (section.type === 'text') {
    return (
      <p
        className="text-[13px] text-gray-700 leading-relaxed outline-none"
        contentEditable={mode === 'edit'}
        suppressContentEditableWarning
      >
        {section.content}
      </p>
    );
  }

  if (section.type === 'molecule') {
    return (
      <div className="border border-gray-200 rounded-xl overflow-hidden bg-white">
        <div className="px-3 py-2 border-b border-gray-100 flex items-center gap-2 bg-gray-50">
          <Atom size={12} className="text-blue-600 shrink-0" />
          <span className="text-[11px] font-medium text-gray-700">Chemical Structure</span>
        </div>
        <div className="p-4 flex items-start gap-6 flex-wrap">
          <MoleculeDisplay />
          <div className="flex-1 min-w-[160px]">
            <p className="text-[11px] font-medium text-gray-800 leading-snug mb-2 line-clamp-2">{section.content}</p>
            <div className="space-y-1">
              {[
                { label: 'MW', value: '312.4 g/mol' },
                { label: 'Formula', value: 'C₁₇H₁₃FN₂OS' },
                { label: 'IC₅₀', value: '8 nM' },
                { label: 'Selectivity', value: '>800× vs WT' },
                { label: 'cLogP', value: '3.1' },
                { label: 'HLM t½', value: '32 min' },
              ].map(({ label, value }) => (
                <div key={label} className="flex items-center gap-2">
                  <span className="text-[10px] text-gray-400 w-16 shrink-0 whitespace-nowrap">{label}</span>
                  <span className="text-[11px] text-gray-700 font-mono whitespace-nowrap">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (section.type === 'table' && section.data) {
    const { headers, rows } = section.data as { headers: string[]; rows: string[][] };
    return (
      <div className="border border-gray-200 rounded-xl overflow-hidden">
        <div className="px-3 py-2 border-b border-gray-100 bg-gray-50 flex items-center gap-2">
          <span className="text-[11px] font-medium text-gray-700">{section.content}</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-[11px]">
            <thead>
              <tr className="bg-gray-50">
                {headers.map((h) => (
                  <th key={h} className="text-left px-3 py-2 text-[10px] font-semibold text-gray-500 border-b border-gray-100 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={i} className={`hover:bg-blue-50/30 transition-colors ${i % 2 === 0 ? '' : 'bg-gray-50/40'}`}>
                  {row.map((cell, j) => (
                    <td key={j} className={`px-3 py-1.5 border-b border-gray-100 font-mono whitespace-nowrap ${j === 0 ? 'font-medium text-blue-700' : 'text-gray-600'}`}>
                      {j === 2 ? (
                        <span className={parseFloat(cell) <= 10 ? 'text-green-700 font-semibold' : parseFloat(cell) <= 50 ? 'text-amber-700' : 'text-gray-600'}>
                          {cell}
                        </span>
                      ) : cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  if (section.type === 'reaction') {
    return (
      <div className="border border-gray-200 rounded-xl overflow-hidden">
        <div className="px-3 py-2 border-b border-gray-100 bg-gray-50 flex items-center gap-2">
          <ArrowsClockwise size={12} className="text-purple-600 shrink-0" />
          <span className="text-[11px] font-medium text-gray-700">Reaction Scheme</span>
          {section.data && (
            <Badge color="#7c3aed" variant="soft" size="xs">
              {(section.data as { reactionType: string }).reactionType}
            </Badge>
          )}
        </div>
        <div className="px-4 py-3 bg-white">
          <ReactionDiagram />
          <p className="text-[12px] text-gray-600 mt-2 leading-relaxed">{section.content}</p>
        </div>
      </div>
    );
  }

  if (section.type === 'ai_note') {
    return (
      <div className="border border-blue-200 rounded-xl p-3 bg-blue-50/40">
        <div className="flex items-center gap-1.5 mb-1.5">
          <div className="w-4 h-4 rounded bg-blue-600 flex items-center justify-center shrink-0">
            <Sparkle size={9} color="white" weight="fill" />
          </div>
          <span className="text-[11px] font-semibold text-blue-700">AI Analysis</span>
          <span className="text-[10px] text-blue-400 ml-auto">Claude 3.5 Opus</span>
        </div>
        <p className="text-[12px] text-blue-800 leading-relaxed">{section.content}</p>
      </div>
    );
  }

  return (
    <div className="text-[11px] text-gray-400 italic">[{section.type}] {section.content}</div>
  );
}

function MoleculeDisplay() {
  return (
    <svg viewBox="0 0 200 160" className="w-40 h-28 shrink-0">
      <g stroke="#2563eb" fill="none" strokeWidth="1.5" strokeLinecap="round">
        <polygon points="55,80 70,55 95,55 110,80 95,105 70,105" />
        <line x1="70" y1="58" x2="55" y2="83" />
        <line x1="73" y1="102" x2="92" y2="102" />
        <polygon points="110,80 125,60 148,65 152,88 135,100" />
        <circle cx="148" cy="65" r="4" fill="#d97706" stroke="#d97706" />
        <text x="150" y="62" fontSize="8" fill="#d97706" fontFamily="sans-serif">S</text>
        <circle cx="125" cy="60" r="3.5" fill="#059669" stroke="#059669" />
        <text x="120" y="56" fontSize="8" fill="#059669" fontFamily="sans-serif">N</text>
        <line x1="152" y1="88" x2="170" y2="95" />
        <circle cx="174" cy="97" r="4" fill="#e11d48" stroke="#e11d48" />
        <text x="176" y="100" fontSize="8" fill="#e11d48" fontFamily="sans-serif">F</text>
        <line x1="55" y1="80" x2="36" y2="80" />
        <text x="20" y="83" fontSize="8" fill="#7c3aed" fontFamily="sans-serif">MeO</text>
        <line x1="72" y1="57" x2="93" y2="57" />
        <line x1="63" y1="91" x2="78" y2="101" />
      </g>
      <g stroke="#e11d48" fill="none" strokeWidth="1">
        <path d="M 110 120 Q 130 130 148 125" markerEnd="url(#arrow)" />
        <text x="104" y="136" fontSize="7" fill="#e11d48" fontFamily="sans-serif">covalent</text>
        <defs>
          <marker id="arrow" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
            <path d="M0,0 L6,3 L0,6 Z" fill="#e11d48" />
          </marker>
        </defs>
      </g>
    </svg>
  );
}

function ReactionDiagram() {
  return (
    <div className="flex items-center justify-center gap-4 py-2">
      <svg viewBox="0 0 80 60" className="w-16 h-12 shrink-0">
        <g stroke="#7c3aed" fill="none" strokeWidth="1.5">
          <polygon points="40,8 60,20 60,44 40,56 20,44 20,20" />
          <polygon points="40,18 52,25 52,39 40,46 28,39 28,25" fill="#7c3aed" opacity="0.1" />
          <circle cx="60" cy="20" r="4" fill="#f59e0b" stroke="#f59e0b" />
          <text x="62" y="17" fontSize="7" fill="#f59e0b" fontFamily="sans-serif">Br</text>
        </g>
      </svg>
      <div className="flex flex-col items-center gap-0.5 shrink-0">
        <div className="flex items-center">
          <div className="w-10 h-px bg-gray-400" />
          <div className="border-y-4 border-l-4 border-transparent border-l-gray-400 h-0" />
        </div>
        <span className="text-[9px] text-gray-500 font-mono">Pd(PPh₃)₄</span>
        <span className="text-[9px] text-gray-400">Suzuki</span>
      </div>
      <svg viewBox="0 0 80 60" className="w-16 h-12 shrink-0">
        <g stroke="#2563eb" fill="none" strokeWidth="1.5">
          <polygon points="40,8 60,20 60,44 40,56 20,44 20,20" />
          <polygon points="40,18 52,25 52,39 40,46 28,39 28,25" fill="#2563eb" opacity="0.1" />
          <line x1="60" y1="32" x2="72" y2="32" />
          <circle cx="36" cy="8" r="3" fill="#059669" stroke="#059669" opacity="0.7" />
          <text x="32" y="5" fontSize="7" fill="#059669" fontFamily="sans-serif">F</text>
        </g>
      </svg>
    </div>
  );
}
