import { motion } from 'framer-motion';
import { Flask, BookOpen, Certificate, Atom, MagnifyingGlass, Plus, ArrowUpRight, Star } from '@phosphor-icons/react';

const TEMPLATES = [
  { id: 't1', name: 'SAR Campaign',         icon: Flask,       color: '#3b82f6', bg: '#eff6ff', category: 'Experiment', uses: 142, starred: true,  desc: 'Standard structure-activity relationship study with IC₅₀ measurements, selectivity panel, and ADMET profiling.' },
  { id: 't2', name: 'ADMET Profiling',       icon: Atom,        color: '#8b5cf6', bg: '#f5f3ff', category: 'Experiment', uses: 98,  starred: true,  desc: 'Comprehensive absorption, distribution, metabolism, excretion and toxicity assessment protocol.' },
  { id: 't3', name: 'Hit-to-Lead',           icon: Flask,       color: '#06b6d4', bg: '#ecfeff', category: 'Experiment', uses: 76,  starred: false, desc: 'Optimization workflow from screening hit to drug-like lead compound with defined go/no-go criteria.' },
  { id: 't4', name: 'IND Package',           icon: BookOpen,    color: '#10b981', bg: '#ecfdf5', category: 'Document',   uses: 54,  starred: true,  desc: 'Investigational new drug application template covering CMC, pharmacology, and toxicology sections.' },
  { id: 't5', name: 'Patent Claim Set',      icon: Certificate, color: '#f59e0b', bg: '#fffbeb', category: 'Patent',     uses: 31,  starred: false, desc: 'Compound genus claims, method of treatment claims, and composition claims for small molecule drugs.' },
  { id: 't6', name: 'PK/PD Report',          icon: BookOpen,    color: '#ef4444', bg: '#fef2f2', category: 'Document',   uses: 67,  starred: false, desc: 'Pharmacokinetic and pharmacodynamic data analysis report with standard plots and summary tables.' },
  { id: 't7', name: 'Fragment Screen',       icon: Atom,        color: '#6366f1', bg: '#eef2ff', category: 'Experiment', uses: 44,  starred: false, desc: 'Fragment-based drug discovery screen with biophysical confirmation and crystallography follow-up.' },
  { id: 't8', name: 'Clinical Synopsis',     icon: BookOpen,    color: '#0369a1', bg: '#e0f2fe', category: 'Document',   uses: 22,  starred: false, desc: 'Phase I/II clinical trial synopsis with primary endpoints, inclusion/exclusion criteria and statistical plan.' },
];

const CATEGORIES = ['All', 'Experiment', 'Document', 'Patent'];

const stagger = { animate: { transition: { staggerChildren: 0.04 } } };
const fadeUp = { initial: { opacity: 0, y: 8 }, animate: { opacity: 1, y: 0, transition: { duration: 0.2 } } };

export function Templates() {
  return (
    <motion.div
      variants={stagger}
      initial="initial"
      animate="animate"
      className="flex-1 overflow-y-auto"
      style={{ background: '#f7f8fc' }}
    >
      <div className="max-w-[1100px] mx-auto px-8 py-6 space-y-6">

        {/* Header */}
        <motion.div variants={fadeUp} className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Templates</h2>
            <p className="text-sm text-gray-400 mt-0.5">{TEMPLATES.length} templates · Experiments, documents & patents</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-200 bg-white text-xs text-gray-400">
              <MagnifyingGlass size={13} />
              <input placeholder="Search templates..." className="outline-none bg-transparent w-40 text-gray-700 placeholder:text-gray-400 text-xs" />
            </div>
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 shadow-sm shadow-blue-200 transition-colors">
              <Plus size={13} weight="bold" /> New Template
            </button>
          </div>
        </motion.div>

        {/* Category filter */}
        <motion.div variants={fadeUp} className="flex items-center gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                cat === 'All'
                  ? 'bg-gray-900 text-white'
                  : 'bg-white border border-gray-200 text-gray-500 hover:bg-gray-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </motion.div>

        {/* Featured */}
        <motion.div variants={fadeUp}>
          <div className="flex items-center gap-2 mb-3">
            <Star size={14} className="text-amber-400" weight="fill" />
            <h3 className="text-sm font-bold text-gray-900">Starred Templates</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {TEMPLATES.filter((t) => t.starred).map((t) => {
              const Icon = t.icon;
              return (
                <div key={t.id} className="bg-white rounded-2xl border border-gray-100 p-5 hover:border-blue-100 hover:shadow-md cursor-pointer transition-all group">
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: t.bg }}>
                      <Icon size={18} style={{ color: t.color }} />
                    </div>
                    <span className="text-xs text-gray-400 bg-gray-50 px-2 py-0.5 rounded-full">{t.category}</span>
                  </div>
                  <div className="text-sm font-bold text-gray-900 mb-1">{t.name}</div>
                  <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">{t.desc}</p>
                  <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-50">
                    <span className="text-xs text-gray-400">{t.uses} uses</span>
                    <button className="text-xs text-blue-600 font-semibold flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      Use template <ArrowUpRight size={11} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* All templates */}
        <motion.div variants={fadeUp}>
          <h3 className="text-sm font-bold text-gray-900 mb-3">All Templates</h3>
          <div className="space-y-2">
            {TEMPLATES.map((t) => {
              const Icon = t.icon;
              return (
                <div key={t.id} className="bg-white rounded-2xl border border-gray-100 px-5 py-4 hover:border-gray-200 hover:shadow-sm cursor-pointer transition-all group flex items-center gap-4">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: t.bg }}>
                    <Icon size={16} style={{ color: t.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-gray-900">{t.name}</span>
                      {t.starred && <Star size={11} className="text-amber-400" weight="fill" />}
                      <span className="text-xs text-gray-400 bg-gray-50 px-1.5 py-0.5 rounded-full">{t.category}</span>
                    </div>
                    <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">{t.desc}</p>
                  </div>
                  <div className="flex items-center gap-4 shrink-0">
                    <span className="text-xs text-gray-400">{t.uses} uses</span>
                    <button className="px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-medium text-gray-600 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600 transition-colors opacity-0 group-hover:opacity-100">
                      Use
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

      </div>
    </motion.div>
  );
}
