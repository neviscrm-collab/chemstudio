import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Flask, CaretDown, Plus } from '@phosphor-icons/react';
import { MoleculeSketcherCanvas } from './MoleculeSketcherCanvas';
import type { MolSketchData } from './MoleculeSketcherCanvas';
import type { Experiment } from '../../types';
import { PROJECTS, CURRENT_USER } from '../../data/mockData';

interface Props {
  open: boolean;
  onClose: () => void;
  onCreate: (exp: Experiment) => void;
}

const EXP_TYPES = [
  'SAR Study', 'ADMET Profiling', 'Metabolic Stability', 'Permeability Assay',
  'Kinase Selectivity', 'In Vitro Pharmacology', 'In Vivo PK', 'Toxicology Screen',
  'Synthetic Chemistry', 'Analytical Characterization', 'Formulation Study',
];

let _expN = 200;

export function NewExperimentModal({ open, onClose, onCreate }: Props) {
  const [title, setTitle] = useState('');
  const [projectId, setProjectId] = useState(PROJECTS[0].id);
  const [expType, setExpType] = useState(EXP_TYPES[0]);
  const [objective, setObjective] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [molData, setMolData] = useState<MolSketchData>({ atoms: [], bonds: [] });

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, onClose]);

  function addTag(val: string) {
    const t = val.trim().replace(/,+$/, '');
    if (t && !tags.includes(t)) setTags(p => [...p, t]);
    setTagInput('');
  }

  function handleCreate() {
    if (!title.trim()) return;
    const project = PROJECTS.find(p => p.id === projectId)!;
    const n = ++_expN;
    const now = new Date().toISOString();
    const code = `${project.code.split('-')[0]}-EXP-${n.toString().padStart(3, '0')}`;
    const allTags = [...new Set([...tags, expType.toLowerCase().replace(/ /g, '_')])];

    const exp: Experiment = {
      id: `exp-new-${n}`,
      title: title.trim(),
      code,
      projectId,
      version: '1.0',
      status: 'draft',
      objective: objective.trim() || `${expType} for ${project.name}`,
      background: '',
      author: CURRENT_USER,
      collaborators: [],
      createdAt: now,
      updatedAt: now,
      sections: [
        { id: `s1-${n}`, type: 'heading', content: 'Objective' },
        { id: `s2-${n}`, type: 'text', content: objective.trim() || `${expType}: objective to be defined.` },
        { id: `s3-${n}`, type: 'heading', content: 'Methods' },
        { id: `s4-${n}`, type: 'text', content: 'Experimental protocol to be added.' },
        ...(molData.atoms.length > 0
          ? [{ id: `s5-${n}`, type: 'molecule' as const, content: `Sketched structure (${molData.atoms.length} atoms, ${molData.bonds.length} bonds)` }]
          : []),
      ],
      molecules: [],
      reactions: [],
      tags: allTags,
      comments: [],
      versions: [{ id: `v1-${n}`, version: '1.0', createdAt: now, author: CURRENT_USER, message: 'Initial draft', changes: 1 }],
    };

    onCreate(exp);

    // Reset
    setTitle(''); setObjective(''); setTags([]); setTagInput('');
    setProjectId(PROJECTS[0].id); setExpType(EXP_TYPES[0]);
    setMolData({ atoms: [], bonds: [] });
  }

  const activeProject = PROJECTS.find(p => p.id === projectId);
  const isValid = title.trim().length > 0;

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-[2px] z-50"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.97 }}
            transition={{ type: 'spring', damping: 30, stiffness: 400 }}
            className="fixed z-50 flex flex-col bg-white rounded-2xl shadow-2xl overflow-hidden"
            style={{
              inset: '5%',
              maxWidth: 1020,
              maxHeight: 720,
              margin: 'auto',
            }}
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center shrink-0">
                  <Flask size={14} color="white" />
                </div>
                <div>
                  <h2 className="text-[14px] font-semibold text-gray-900">New Experiment</h2>
                  <p className="text-[11px] text-gray-400 mt-0.5">Create a new experiment record with an optional chemical structure</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-400 transition-colors"
              >
                <X size={15} />
              </button>
            </div>

            {/* Body */}
            <div className="flex flex-1 overflow-hidden min-h-0">

              {/* Left: Form */}
              <div className="w-[300px] shrink-0 border-r border-gray-100 overflow-y-auto p-5 space-y-4">

                {/* Title */}
                <div>
                  <label className="block text-[10px] font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                    Experiment Title <span className="text-red-400">*</span>
                  </label>
                  <input
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    placeholder="e.g. AUR-0252 ADMET Profiling"
                    autoFocus
                    className="w-full text-[13px] px-3 py-2 rounded-lg border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition-all placeholder:text-gray-300"
                  />
                </div>

                {/* Project */}
                <div>
                  <label className="block text-[10px] font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Project</label>
                  <div className="relative">
                    <select
                      value={projectId}
                      onChange={e => setProjectId(e.target.value)}
                      className="w-full appearance-none text-[13px] px-3 py-2 pr-8 rounded-lg border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none bg-white cursor-pointer"
                    >
                      {PROJECTS.filter(p => p.status === 'active').map(p => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                      ))}
                    </select>
                    <CaretDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>
                  {activeProject && (
                    <div className="mt-1.5 flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full shrink-0" style={{ background: activeProject.color }} />
                      <span className="text-[10px] text-gray-400">{activeProject.code} · {activeProject.phase.replace(/_/g, ' ')} · {activeProject.experiments} exps</span>
                    </div>
                  )}
                </div>

                {/* Experiment Type */}
                <div>
                  <label className="block text-[10px] font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Experiment Type</label>
                  <div className="relative">
                    <select
                      value={expType}
                      onChange={e => setExpType(e.target.value)}
                      className="w-full appearance-none text-[13px] px-3 py-2 pr-8 rounded-lg border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none bg-white cursor-pointer"
                    >
                      {EXP_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                    <CaretDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                {/* Objective */}
                <div>
                  <label className="block text-[10px] font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Objective</label>
                  <textarea
                    value={objective}
                    onChange={e => setObjective(e.target.value)}
                    placeholder="Describe the scientific goal of this experiment..."
                    rows={4}
                    className="w-full text-[12px] px-3 py-2 rounded-lg border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none resize-none transition-all placeholder:text-gray-300 leading-relaxed"
                  />
                </div>

                {/* Tags */}
                <div>
                  <label className="block text-[10px] font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Tags</label>
                  {tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-2">
                      {tags.map(t => (
                        <span key={t} className="flex items-center gap-1 text-[10px] bg-blue-50 text-blue-700 border border-blue-100 px-2 py-0.5 rounded-full">
                          {t}
                          <button onClick={() => setTags(p => p.filter(x => x !== t))} className="hover:text-red-500 transition-colors leading-none">×</button>
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="flex gap-1">
                    <input
                      value={tagInput}
                      onChange={e => setTagInput(e.target.value)}
                      onKeyDown={e => {
                        if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); addTag(tagInput); }
                      }}
                      placeholder="Add tag, press Enter"
                      className="flex-1 text-[11px] px-2.5 py-1.5 rounded-lg border border-gray-200 focus:border-blue-400 focus:ring-1 focus:ring-blue-100 outline-none placeholder:text-gray-300"
                    />
                    <button
                      onClick={() => addTag(tagInput)}
                      className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-400 transition-colors"
                    >
                      <Plus size={12} />
                    </button>
                  </div>
                </div>

                {/* Molecule indicator */}
                {molData.atoms.length > 0 && (
                  <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-100">
                    <p className="text-[11px] font-semibold text-emerald-700">Structure attached</p>
                    <p className="text-[10px] text-emerald-600 mt-0.5">
                      {molData.atoms.length} atoms · {molData.bonds.length} bonds · ~MW {molData.atoms.reduce((s, a) => {
                        const w: Record<string, number> = { C: 12, N: 14, O: 16, S: 32, P: 31, F: 19, Cl: 35.5, Br: 80, I: 127, H: 1 };
                        return s + (w[a.element] ?? 12);
                      }, 0).toFixed(0)}
                    </p>
                  </div>
                )}
              </div>

              {/* Right: Molecule Sketcher */}
              <div className="flex-1 flex flex-col overflow-hidden min-w-0">
                <div className="flex items-center justify-between px-4 py-2.5 border-b border-gray-100 bg-gray-50/40 shrink-0">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                    <span className="text-[12px] font-semibold text-gray-700">Molecule Sketcher</span>
                    <span className="text-[10px] text-gray-400">optional — attach a chemical structure</span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 bg-violet-50 text-violet-600 border border-violet-100 rounded-full font-medium">ChemDraw-lite</span>
                </div>
                <div className="flex-1 overflow-hidden p-3 min-h-0">
                  <MoleculeSketcherCanvas
                    className="h-full"
                    onMolChange={setMolData}
                  />
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100 bg-gray-50/60 shrink-0">
              <p className="text-[11px] text-gray-400">
                Will be created as <span className="font-mono text-gray-600 font-medium">draft</span> · v1.0
                {activeProject && (
                  <> in <span className="font-medium text-gray-600">{activeProject.name}</span></>
                )}
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-[12px] font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreate}
                  disabled={!isValid}
                  className="flex items-center gap-1.5 px-4 py-2 text-[12px] font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <Flask size={13} />
                  Create Experiment
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
