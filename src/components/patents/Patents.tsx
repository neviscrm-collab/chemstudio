import { motion } from 'framer-motion';
import { Certificate, Plus } from '@phosphor-icons/react';
import { Badge } from '../ui/Badge';
import { PATENTS } from '../../data/mockData';
import { statusColor, formatDate } from '../../lib/utils';

export function Patents() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { duration: 0.2 } }} className="flex-1 overflow-y-auto" style={{ background: '#f7f8fc' }}>
      <div className="max-w-[1100px] mx-auto px-8 py-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Patents</h2>
            <p className="text-sm text-gray-400 mt-0.5">{PATENTS.length} filings · 4 jurisdictions</p>
          </div>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1.5 rounded-lg border border-gray-200 text-gray-500 text-xs hover:bg-gray-50">
              Export
            </button>
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 shadow-sm shadow-blue-200">
              <Plus size={12} weight="bold" />File Patent
            </button>
          </div>
        </div>

        {/* Patent cards */}
        <div className="space-y-3">
          {PATENTS.map((pat) => (
            <div
              key={pat.id}
              className="bg-white rounded-2xl border border-gray-100 p-5 hover:border-gray-200 hover:shadow-md transition-all cursor-pointer"
            >
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-red-50 flex items-center justify-center shrink-0">
                  <Certificate size={16} className="text-red-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-sm font-semibold text-gray-800 flex-1">{pat.title}</h3>
                    <Badge color={statusColor(pat.status)} variant="soft" size="xs">{pat.status}</Badge>
                  </div>
                  {pat.patentNumber && (
                    <div className="text-xs font-mono text-blue-600 mt-0.5">{pat.patentNumber}</div>
                  )}
                  <div className="flex items-center gap-3 mt-2 text-xs text-gray-400 flex-wrap">
                    <span>Filed: {formatDate(pat.filingDate)}</span>
                    <span>{pat.claims} claims</span>
                    <div className="flex gap-1">
                      {pat.jurisdiction.map((j) => (
                        <span key={j} className="px-1.5 py-0.5 bg-blue-50 rounded text-xs font-semibold text-blue-600 border border-blue-100">{j}</span>
                      ))}
                    </div>
                  </div>
                  <div className="text-xs text-gray-400 mt-1">Inventors: {pat.inventors.join(', ')}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
