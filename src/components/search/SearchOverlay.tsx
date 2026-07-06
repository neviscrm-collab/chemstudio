import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MagnifyingGlass, Flask, Atom, BookOpen, Certificate, X, Users, ArrowUpRight } from '@phosphor-icons/react';
import { useAppStore } from '../../store/appStore';
import { PROJECTS, EXPERIMENTS, MOLECULES, PUBLICATIONS } from '../../data/mockData';
import { cn } from '../../lib/utils';

interface Result {
  id: string;
  type: string;
  title: string;
  subtitle: string;
  color: string;
}

function buildResults(q: string): Result[] {
  if (!q.trim()) return [];
  const lq = q.toLowerCase();
  const results: Result[] = [];

  PROJECTS.filter((p) => p.name.toLowerCase().includes(lq) || p.code.toLowerCase().includes(lq)).forEach((p) =>
    results.push({ id: p.id, type: 'project', title: p.name, subtitle: p.code + ' · ' + p.phase, color: '#2563eb' })
  );
  EXPERIMENTS.filter((e) => e.title.toLowerCase().includes(lq) || e.code.toLowerCase().includes(lq)).forEach((e) =>
    results.push({ id: e.id, type: 'experiment', title: e.title, subtitle: e.code + ' · v' + e.version, color: '#7c3aed' })
  );
  MOLECULES.filter((m) => m.name.toLowerCase().includes(lq) || m.formula.toLowerCase().includes(lq)).forEach((m) =>
    results.push({ id: m.id, type: 'molecule', title: m.name, subtitle: m.formula + (m.ic50 ? ' · IC₅₀ ' + m.ic50 : ''), color: '#0891b2' })
  );
  PUBLICATIONS.filter((p) => p.title.toLowerCase().includes(lq) || p.journal.toLowerCase().includes(lq)).forEach((p) =>
    results.push({ id: p.id, type: 'publication', title: p.title, subtitle: p.journal + ' · ' + p.year, color: '#d97706' })
  );

  return results.slice(0, 10);
}

const ICONS: Record<string, React.ElementType> = {
  project: Flask,
  experiment: Flask,
  molecule: Atom,
  publication: BookOpen,
  patent: Certificate,
  scientist: Users,
};

const SUGGESTIONS = [
  { label: 'KRAS G12C inhibitors', type: 'molecule' },
  { label: 'Project Aurora experiments', type: 'project' },
  { label: 'Recent IND packages', type: 'experiment' },
  { label: 'Helios publications', type: 'publication' },
];

export function SearchOverlay() {
  const { searchOpen, setSearchOpen, selectProject, selectExperiment } = useAppStore();
  const [query, setQuery] = useState('');
  const results = buildResults(query);

  useEffect(() => {
    if (!searchOpen) setQuery('');
  }, [searchOpen]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(true);
      }
      if (e.key === 'Escape') setSearchOpen(false);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [setSearchOpen]);

  const handleSelect = (result: Result) => {
    if (result.type === 'project') selectProject(result.id);
    else if (result.type === 'experiment') selectExperiment(result.id);
    setSearchOpen(false);
  };

  return (
    <AnimatePresence>
      {searchOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
            onClick={() => setSearchOpen(false)}
          />
          <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: -8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: -8 }}
              transition={{ duration: 0.15 }}
              className="w-full max-w-[620px] bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100"
            >
              {/* Input */}
              <div className="flex items-center gap-3 px-4 py-3.5 border-b border-gray-100">
                <MagnifyingGlass size={18} className="text-gray-400 shrink-0" />
                <input
                  autoFocus
                  type="text"
                  placeholder="Search projects, experiments, molecules, publications..."
                  className="flex-1 text-[14px] text-gray-800 placeholder:text-gray-400 outline-none bg-transparent"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
                {query && (
                  <button onClick={() => setQuery('')} className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center">
                    <X size={10} className="text-gray-400" />
                  </button>
                )}
                <kbd className="text-[10px] text-gray-400 border border-gray-200 rounded px-1.5 py-0.5">Esc</kbd>
              </div>

              {/* Results */}
              <div className="max-h-[420px] overflow-y-auto">
                {query === '' ? (
                  <div className="p-3">
                    <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider px-2 mb-2">Suggestions</div>
                    {SUGGESTIONS.map((s) => {
                      const Icon = ICONS[s.type] ?? Flask;
                      return (
                        <button
                          key={s.label}
                          className="w-full flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-gray-50 transition-colors text-left"
                        >
                          <Icon size={14} className="text-gray-400" />
                          <span className="text-[13px] text-gray-700">{s.label}</span>
                        </button>
                      );
                    })}
                  </div>
                ) : results.length === 0 ? (
                  <div className="py-12 text-center text-gray-400 text-sm">No results for "{query}"</div>
                ) : (
                  <div className="p-2">
                    {(['project', 'experiment', 'molecule', 'publication'] as const).map((type) => {
                      const typeResults = results.filter((r) => r.type === type);
                      if (!typeResults.length) return null;
                      const Icon = ICONS[type];
                      return (
                        <div key={type} className="mb-2">
                          <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider px-2 py-1.5 capitalize">{type}s</div>
                          {typeResults.map((result) => (
                            <button
                              key={result.id}
                              onClick={() => handleSelect(result)}
                              className="w-full flex items-center gap-3 px-2 py-2.5 rounded-lg hover:bg-blue-50 transition-colors text-left group"
                            >
                              <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0" style={{ background: result.color + '15' }}>
                                <Icon size={13} style={{ color: result.color }} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="text-[13px] font-medium text-gray-800 truncate">{result.title}</div>
                                <div className="text-[11px] text-gray-400 truncate">{result.subtitle}</div>
                              </div>
                              <ArrowUpRight size={13} className="text-gray-300 opacity-0 group-hover:opacity-100 shrink-0" />
                            </button>
                          ))}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between px-4 py-2.5 border-t border-gray-100 bg-gray-50">
                <div className="flex items-center gap-3 text-[11px] text-gray-400">
                  <span><kbd className="border border-gray-200 rounded px-1 bg-white">↵</kbd> to open</span>
                  <span><kbd className="border border-gray-200 rounded px-1 bg-white">↑↓</kbd> navigate</span>
                  <span><kbd className="border border-gray-200 rounded px-1 bg-white">Esc</kbd> close</span>
                </div>
                {results.length > 0 && (
                  <span className="text-[11px] text-gray-400">{results.length} results</span>
                )}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
