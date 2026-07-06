import { motion } from 'framer-motion';
import { Atom, Plus, FunnelSimple, MagnifyingGlass } from '@phosphor-icons/react';
import { Badge } from '../ui/Badge';
import { MOLECULES } from '../../data/mockData';
import { statusColor, formatDate } from '../../lib/utils';

export function MoleculeLibrary() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { duration: 0.2 } }} className="flex-1 overflow-y-auto" style={{ background: '#f7f8fc' }}>
      <div className="max-w-[1100px] mx-auto px-8 py-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Molecule Library</h2>
            <p className="text-sm text-gray-400 mt-0.5">1,320 structures · 4 projects</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-200 bg-white text-xs text-gray-400">
              <MagnifyingGlass size={12} />
              <input placeholder="Search by name, SMILES, formula..." className="outline-none bg-transparent w-52 text-gray-700 placeholder:text-gray-400 text-xs" />
            </div>
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 text-gray-500 text-xs hover:bg-gray-50">
              <FunnelSimple size={12} />Filter
            </button>
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 shadow-sm shadow-blue-200">
              <Plus size={12} weight="bold" />Draw Structure
            </button>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
          {MOLECULES.map((mol) => (
            <div
              key={mol.id}
              className="bg-white rounded-2xl border border-gray-100 p-4 hover:border-gray-200 hover:shadow-md transition-all cursor-pointer"
            >
              {/* Molecule visualization */}
              <div className="w-full h-28 rounded-xl mb-3 flex items-center justify-center" style={{ background: statusColor(mol.status) + '0d' }}>
                <svg viewBox="0 0 80 80" className="w-16 h-16">
                  <g stroke={statusColor(mol.status)} fill="none" strokeWidth="1.5" strokeLinecap="round">
                    <polygon points="40,10 58,20 58,40 40,50 22,40 22,20" opacity="0.8" />
                    <polygon points="40,18 52,25 52,35 40,42 28,35 28,25" fill={statusColor(mol.status)} opacity="0.1" />
                    <line x1="58" y1="30" x2="70" y2="30" />
                    <line x1="22" y1="30" x2="10" y2="30" />
                    <circle cx="70" cy="30" r="4" fill={statusColor(mol.status)} opacity="0.6" />
                    <circle cx="10" cy="30" r="3" fill={statusColor(mol.status)} opacity="0.4" />
                  </g>
                </svg>
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-gray-800">{mol.name}</span>
                  <Badge color={statusColor(mol.status)} variant="soft" size="xs">{mol.status}</Badge>
                </div>
                <div className="text-xs text-gray-400 font-mono">{mol.formula}</div>
                {mol.ic50 && (
                  <div className="text-xs text-blue-700 font-medium">IC₅₀ {mol.ic50}</div>
                )}
                <div className="grid grid-cols-2 gap-x-2 pt-1 border-t border-gray-100">
                  {[
                    { l: 'MW', v: mol.mw.toFixed(1) },
                    { l: 'cLogP', v: mol.logP.toFixed(1) },
                    { l: 'HBD', v: mol.hbd },
                    { l: 'TPSA', v: mol.tpsa.toFixed(0) },
                  ].map(({ l, v }) => (
                    <div key={l} className="flex items-center justify-between py-0.5">
                      <span className="text-xs text-gray-400">{l}</span>
                      <span className="text-xs text-gray-600 font-mono">{v}</span>
                    </div>
                  ))}
                </div>
                <div className="text-xs text-gray-400 pt-0.5">{formatDate(mol.createdAt)}</div>
              </div>
            </div>
          ))}

          {/* Placeholder cards for the rest of the library */}
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={`ph-${i}`} className="bg-white rounded-2xl border border-gray-100 p-4 opacity-40">
              <div className="w-full h-28 rounded-xl mb-3 bg-gray-100 flex items-center justify-center">
                <Atom size={24} className="text-gray-300" />
              </div>
              <div className="h-3 bg-gray-100 rounded w-3/4 mb-1.5" />
              <div className="h-2.5 bg-gray-100 rounded w-1/2" />
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
