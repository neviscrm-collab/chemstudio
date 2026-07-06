import { motion } from 'framer-motion';
import { BookOpen, ArrowUpRight, Plus } from '@phosphor-icons/react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { PUBLICATIONS } from '../../data/mockData';
import { statusColor } from '../../lib/utils';

export function Publications() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1 overflow-y-auto bg-[#f8f9fb] p-6">
      <div className="max-w-[900px] mx-auto space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Publications</h2>
            <p className="text-sm text-gray-500 mt-0.5">{PUBLICATIONS.length} papers · 90 total citations</p>
          </div>
          <button className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-medium hover:bg-blue-700">
            <Plus size={13} weight="bold" />New Publication
          </button>
        </div>
        <div className="space-y-3">
          {PUBLICATIONS.map((pub) => (
            <Card key={pub.id} hover padding="md">
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
            </Card>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
