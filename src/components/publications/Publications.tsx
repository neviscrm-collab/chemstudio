import { motion } from 'framer-motion';
import { BookOpen, ArrowUpRight, Plus } from '@phosphor-icons/react';
import { Badge } from '../ui/Badge';
import { PUBLICATIONS } from '../../data/mockData';
import { statusColor } from '../../lib/utils';

export function Publications() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { duration: 0.2 } }} className="flex-1 overflow-y-auto" style={{ background: '#f7f8fc' }}>
      <div className="max-w-[1100px] mx-auto px-8 py-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Publications</h2>
            <p className="text-sm text-gray-400 mt-0.5">Manage and track your scientific publications</p>
          </div>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1.5 rounded-lg border border-gray-200 text-gray-500 text-xs hover:bg-gray-50">
              Export
            </button>
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 shadow-sm shadow-blue-200">
              <Plus size={12} weight="bold" />New Publication
            </button>
          </div>
        </div>

        {/* Stats bar */}
        <div className="flex items-center gap-6 px-5 py-3 bg-white rounded-2xl border border-gray-100">
          {[
            { label: 'Papers', value: '17' },
            { label: 'Citations', value: '90' },
            { label: 'In Review', value: '3' },
            { label: 'Impact Factor Avg', value: '8.4' },
          ].map(({ label, value }) => (
            <div key={label} className="flex items-center gap-3">
              <div>
                <div className="text-lg font-bold text-gray-900">{value}</div>
                <div className="text-xs text-gray-400">{label}</div>
              </div>
              <div className="w-px h-8 bg-gray-100 last:hidden" />
            </div>
          ))}
        </div>

        {/* Publication cards */}
        <div className="space-y-3">
          {PUBLICATIONS.map((pub) => (
            <div
              key={pub.id}
              className="bg-white rounded-2xl border border-gray-100 p-5 hover:border-gray-200 hover:shadow-md transition-all cursor-pointer"
            >
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center shrink-0">
                  <BookOpen size={16} className="text-amber-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-sm font-semibold text-gray-800 line-clamp-2 flex-1">{pub.title}</h3>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <Badge color={statusColor(pub.status)} variant="soft" size="xs">{pub.status.replace(/_/g, ' ')}</Badge>
                      <ArrowUpRight size={13} className="text-gray-300" />
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1 line-clamp-2">{pub.abstract}</p>
                  <div className="flex items-center gap-3 mt-2 text-xs text-gray-400 flex-wrap">
                    <span className="font-medium text-gray-600">{pub.journal}</span>
                    <span>{pub.year}</span>
                    {pub.impactFactor && <span>IF: {pub.impactFactor}</span>}
                    {pub.citations !== undefined && pub.citations > 0 && (
                      <span className="text-blue-600 font-medium">{pub.citations} citations</span>
                    )}
                    {pub.doi && <span className="font-mono text-xs">{pub.doi}</span>}
                  </div>
                  <div className="text-xs text-gray-400 mt-1">{pub.authors.join(', ')}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
