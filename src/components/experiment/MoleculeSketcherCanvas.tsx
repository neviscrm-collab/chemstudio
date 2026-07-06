import { useState, useRef, useCallback, useEffect } from 'react';
import { PencilSimple, Eraser, ArrowsOut, ArrowCounterClockwise } from '@phosphor-icons/react';

interface Atom { id: string; x: number; y: number; element: string }
interface Bond { id: string; from: string; to: string; order: 1 | 2 | 3 }
type Tool = 'draw' | 'erase' | 'move'

const ELEMENTS = ['C', 'N', 'O', 'S', 'P', 'F', 'Cl', 'Br', 'I'];
const HIT_R = 14;

const nextId = () => `m${Math.random().toString(36).slice(2, 9)}`;

function atomAt(atoms: Atom[], x: number, y: number, r = HIT_R): Atom | null {
  let best: Atom | null = null, bestD = r;
  for (const a of atoms) {
    const d = Math.hypot(a.x - x, a.y - y);
    if (d < bestD) { best = a; bestD = d; }
  }
  return best;
}

function bondAt(atoms: Atom[], bonds: Bond[], x: number, y: number, r = 7): Bond | null {
  for (const b of bonds) {
    const a1 = atoms.find(a => a.id === b.from);
    const a2 = atoms.find(a => a.id === b.to);
    if (!a1 || !a2) continue;
    const dx = a2.x - a1.x, dy = a2.y - a1.y;
    const l2 = dx * dx + dy * dy;
    if (l2 < 1) continue;
    const t = Math.max(0, Math.min(1, ((x - a1.x) * dx + (y - a1.y) * dy) / l2));
    if (Math.hypot(a1.x + t * dx - x, a1.y + t * dy - y) < r) return b;
  }
  return null;
}

function genRing(cx: number, cy: number, n: number, alternateDouble: boolean, r = 46) {
  const atoms: Atom[] = Array.from({ length: n }, (_, i) => ({
    id: nextId(),
    x: cx + r * Math.cos((2 * Math.PI * i / n) - Math.PI / 2),
    y: cy + r * Math.sin((2 * Math.PI * i / n) - Math.PI / 2),
    element: 'C',
  }));
  const bonds: Bond[] = atoms.map((a, i) => ({
    id: nextId(),
    from: a.id,
    to: atoms[(i + 1) % n].id,
    order: (alternateDouble && i % 2 === 0 ? 2 : 1) as 1 | 2 | 3,
  }));
  return { atoms, bonds };
}

export interface MolSketchData { atoms: Atom[]; bonds: Bond[] }

interface Props {
  className?: string;
  onMolChange?: (data: MolSketchData) => void;
}

export function MoleculeSketcherCanvas({ className, onMolChange }: Props) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [atoms, setAtoms] = useState<Atom[]>([]);
  const [bonds, setBonds] = useState<Bond[]>([]);
  const [tool, setTool] = useState<Tool>('draw');
  const [element, setElement] = useState('C');
  const [bondOrder, setBondOrder] = useState<1 | 2 | 3>(1);
  const [dragBond, setDragBond] = useState<{ fromId: string; x: number; y: number } | null>(null);
  const [dragAtom, setDragAtom] = useState<{ id: string; dx: number; dy: number } | null>(null);

  const getPos = useCallback((e: React.MouseEvent<SVGSVGElement>) => {
    const r = svgRef.current!.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  }, []);

  const onMouseDown = useCallback((e: React.MouseEvent<SVGSVGElement>) => {
    e.preventDefault();
    const { x, y } = getPos(e);
    const nearby = atomAt(atoms, x, y);

    if (tool === 'move') {
      if (nearby) setDragAtom({ id: nearby.id, dx: x - nearby.x, dy: y - nearby.y });
      return;
    }

    if (tool === 'erase') {
      if (nearby) {
        setBonds(prev => prev.filter(b => b.from !== nearby.id && b.to !== nearby.id));
        setAtoms(prev => prev.filter(a => a.id !== nearby.id));
      } else {
        const nb = bondAt(atoms, bonds, x, y);
        if (nb) setBonds(prev => prev.filter(b => b.id !== nb.id));
      }
      return;
    }

    // draw tool
    if (nearby) {
      setDragBond({ fromId: nearby.id, x, y });
    } else {
      const newAtom: Atom = { id: nextId(), x, y, element };
      setAtoms(prev => [...prev, newAtom]);
      setDragBond({ fromId: newAtom.id, x, y });
    }
  }, [atoms, bonds, tool, element, getPos]);

  const onMouseMove = useCallback((e: React.MouseEvent<SVGSVGElement>) => {
    const { x, y } = getPos(e);
    if (dragBond) setDragBond(d => d ? { ...d, x, y } : null);
    if (dragAtom) {
      setAtoms(prev => prev.map(a =>
        a.id === dragAtom.id ? { ...a, x: x - dragAtom.dx, y: y - dragAtom.dy } : a
      ));
    }
  }, [dragBond, dragAtom, getPos]);

  const onMouseUp = useCallback((e: React.MouseEvent<SVGSVGElement>) => {
    setDragAtom(null);
    if (!dragBond) return;
    const { x, y } = getPos(e);
    const target = atomAt(atoms, x, y);

    if (target && target.id !== dragBond.fromId) {
      const exists = bonds.some(b =>
        (b.from === dragBond.fromId && b.to === target.id) ||
        (b.from === target.id && b.to === dragBond.fromId)
      );
      if (!exists) {
        setBonds(prev => [...prev, { id: nextId(), from: dragBond.fromId, to: target.id, order: bondOrder }]);
      }
    } else {
      const fromAtom = atoms.find(a => a.id === dragBond.fromId);
      if (fromAtom && Math.hypot(x - fromAtom.x, y - fromAtom.y) > 22) {
        const newAtom: Atom = { id: nextId(), x, y, element };
        setBonds(prev => [...prev, { id: nextId(), from: dragBond.fromId, to: newAtom.id, order: bondOrder }]);
        setAtoms(prev => [...prev, newAtom]);
      }
    }
    setDragBond(null);
  }, [atoms, bonds, dragBond, bondOrder, element, getPos]);

  const undo = useCallback(() => {
    setAtoms(prev => {
      if (!prev.length) return prev;
      const last = prev[prev.length - 1];
      setBonds(b => b.filter(x => x.from !== last.id && x.to !== last.id));
      return prev.slice(0, -1);
    });
  }, []);

  const clear = () => { setAtoms([]); setBonds([]); };

  const addRing = (n: number, alt: boolean) => {
    const svg = svgRef.current;
    const cx = svg ? svg.clientWidth / 2 : 200;
    const cy = svg ? svg.clientHeight / 2 : 140;
    const { atoms: ra, bonds: rb } = genRing(cx, cy, n, alt);
    setAtoms(p => [...p, ...ra]);
    setBonds(p => [...p, ...rb]);
  };

  useEffect(() => {
    onMolChange?.({ atoms, bonds });
  }, [atoms, bonds, onMolChange]);

  function showLabel(a: Atom) {
    if (a.element !== 'C') return true;
    return bonds.filter(b => b.from === a.id || b.to === a.id).length <= 1;
  }

  function renderBond(bond: Bond) {
    const a = atoms.find(x => x.id === bond.from);
    const b = atoms.find(x => x.id === bond.to);
    if (!a || !b) return null;
    const dx = b.x - a.x, dy = b.y - a.y;
    const len = Math.hypot(dx, dy);
    if (len < 1) return null;
    const ox = -dy / len, oy = dx / len;

    if (bond.order === 1) {
      return <line key={bond.id} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="#374151" strokeWidth="1.8" strokeLinecap="round" />;
    }
    if (bond.order === 2) {
      const d = 3.5;
      return (
        <g key={bond.id}>
          <line x1={a.x + ox * d} y1={a.y + oy * d} x2={b.x + ox * d} y2={b.y + oy * d} stroke="#374151" strokeWidth="1.6" strokeLinecap="round" />
          <line x1={a.x - ox * d} y1={a.y - oy * d} x2={b.x - ox * d} y2={b.y - oy * d} stroke="#374151" strokeWidth="1.6" strokeLinecap="round" />
        </g>
      );
    }
    // Triple
    const d = 2.8;
    return (
      <g key={bond.id}>
        <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="#374151" strokeWidth="1.5" strokeLinecap="round" />
        <line x1={a.x + ox * d * 2} y1={a.y + oy * d * 2} x2={b.x + ox * d * 2} y2={b.y + oy * d * 2} stroke="#374151" strokeWidth="1.4" strokeLinecap="round" />
        <line x1={a.x - ox * d * 2} y1={a.y - oy * d * 2} x2={b.x - ox * d * 2} y2={b.y - oy * d * 2} stroke="#374151" strokeWidth="1.4" strokeLinecap="round" />
      </g>
    );
  }

  const dragFromAtom = dragBond ? atoms.find(a => a.id === dragBond.fromId) : null;
  const approxMW = atoms.reduce((s, a) => {
    const w: Record<string, number> = { C: 12, N: 14, O: 16, S: 32, P: 31, F: 19, Cl: 35.5, Br: 80, I: 127, H: 1 };
    return s + (w[a.element] ?? 12);
  }, 0);

  return (
    <div className={`flex flex-col bg-white border border-gray-200 rounded-xl overflow-hidden ${className ?? ''}`}>
      {/* Toolbar */}
      <div className="flex items-center gap-1.5 px-3 py-2 border-b border-gray-100 bg-gray-50/80 flex-wrap shrink-0">
        {/* Tool group */}
        <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden bg-white">
          {([
            { key: 'draw' as Tool, Icon: PencilSimple, label: 'Draw (D)' },
            { key: 'erase' as Tool, Icon: Eraser, label: 'Erase (E)' },
            { key: 'move' as Tool, Icon: ArrowsOut, label: 'Move (M)' },
          ]).map(({ key, Icon, label }) => (
            <button
              key={key}
              onClick={() => setTool(key)}
              title={label}
              className={`w-7 h-7 flex items-center justify-center transition-colors ${tool === key ? 'bg-blue-600 text-white' : 'text-gray-500 hover:bg-gray-100'}`}
            >
              <Icon size={13} />
            </button>
          ))}
        </div>

        {/* Bond order */}
        <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden bg-white">
          {([1, 2, 3] as const).map(o => (
            <button
              key={o}
              onClick={() => setBondOrder(o)}
              title={`${o === 1 ? 'Single' : o === 2 ? 'Double' : 'Triple'} bond`}
              className={`w-7 h-7 flex items-center justify-center text-[12px] font-bold transition-colors ${bondOrder === o ? 'bg-blue-600 text-white' : 'text-gray-500 hover:bg-gray-100'}`}
            >
              {o === 1 ? '—' : o === 2 ? '=' : '≡'}
            </button>
          ))}
        </div>

        <div className="w-px h-5 bg-gray-200 shrink-0" />

        {/* Element palette */}
        <div className="flex items-center gap-0.5 flex-wrap">
          {ELEMENTS.map(el => (
            <button
              key={el}
              onClick={() => { setElement(el); setTool('draw'); }}
              className={`min-w-[24px] h-6 px-1 rounded text-[11px] font-semibold transition-colors ${element === el && tool === 'draw' ? 'bg-blue-600 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-blue-50 hover:border-blue-300'}`}
            >
              {el}
            </button>
          ))}
        </div>

        <div className="w-px h-5 bg-gray-200 shrink-0" />

        {/* Ring templates */}
        <div className="flex items-center gap-1">
          <button onClick={() => addRing(6, true)} title="Insert benzene ring" className="px-2 h-6 text-[10px] font-medium bg-white border border-gray-200 text-purple-600 hover:bg-purple-50 hover:border-purple-300 rounded transition-colors">⬡ Benzene</button>
          <button onClick={() => addRing(6, false)} title="Insert cyclohexane" className="px-2 h-6 text-[10px] font-medium bg-white border border-gray-200 text-gray-600 hover:bg-gray-100 rounded transition-colors">⬡ C₆</button>
          <button onClick={() => addRing(5, false)} title="Insert cyclopentane" className="px-2 h-6 text-[10px] font-medium bg-white border border-gray-200 text-gray-600 hover:bg-gray-100 rounded transition-colors">⬠ C₅</button>
        </div>

        <div className="ml-auto flex items-center gap-1">
          <button onClick={undo} title="Undo last atom" className="w-7 h-7 flex items-center justify-center rounded hover:bg-gray-100 text-gray-400 transition-colors">
            <ArrowCounterClockwise size={13} />
          </button>
          <button onClick={clear} className="px-2 h-6 text-[10px] font-medium text-red-500 hover:bg-red-50 border border-red-200 rounded transition-colors">
            Clear
          </button>
        </div>
      </div>

      {/* SVG Canvas */}
      <svg
        ref={svgRef}
        className="flex-1 w-full select-none"
        style={{
          cursor: tool === 'erase' ? 'cell' : tool === 'move' ? 'grab' : 'crosshair',
          background: '#fafbfc',
          minHeight: 220,
        }}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={() => { setDragBond(null); setDragAtom(null); }}
      >
        <defs>
          <pattern id="sketcher-grid" width="20" height="20" patternUnits="userSpaceOnUse">
            <circle cx="10" cy="10" r="0.6" fill="#dde3ec" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#sketcher-grid)" />

        {/* Bonds */}
        {bonds.map(renderBond)}

        {/* Preview drag line */}
        {dragFromAtom && dragBond && (
          <line
            x1={dragFromAtom.x} y1={dragFromAtom.y}
            x2={dragBond.x} y2={dragBond.y}
            stroke="#2563eb" strokeWidth="1.5" strokeDasharray="5,3" strokeLinecap="round"
            style={{ pointerEvents: 'none' }}
          />
        )}

        {/* Atoms */}
        {atoms.map(a => {
          const active = dragBond?.fromId === a.id;
          const label = showLabel(a);
          return (
            <g key={a.id}>
              <circle
                cx={a.x} cy={a.y} r={HIT_R}
                fill={active ? '#2563eb12' : 'transparent'}
                stroke={active ? '#2563eb' : 'transparent'}
                strokeWidth={1.5}
              />
              {label ? (
                <text
                  x={a.x} y={a.y}
                  textAnchor="middle" dominantBaseline="central"
                  fontSize={a.element.length > 1 ? 10 : 13}
                  fontFamily="'SF Mono', ui-monospace, monospace"
                  fontWeight="700"
                  fill={active ? '#2563eb' : '#111827'}
                  style={{ pointerEvents: 'none', userSelect: 'none' }}
                >
                  {a.element}
                </text>
              ) : (
                <circle cx={a.x} cy={a.y} r={2.5} fill={active ? '#2563eb' : '#374151'} style={{ pointerEvents: 'none' }} />
              )}
            </g>
          );
        })}

        {/* Empty state hint */}
        {atoms.length === 0 && (
          <>
            <text x="50%" y="42%" textAnchor="middle" fill="#b0bac9" fontSize="12" fontFamily="system-ui, sans-serif">
              Click to place atoms · Drag between atoms to draw bonds
            </text>
            <text x="50%" y="54%" textAnchor="middle" fill="#c8d1de" fontSize="10" fontFamily="system-ui, sans-serif">
              Use ring templates above to insert ring systems like benzene
            </text>
          </>
        )}
      </svg>

      {/* Status bar */}
      <div className="flex items-center gap-2.5 px-3 py-1.5 border-t border-gray-100 bg-gray-50/60 shrink-0">
        <span className="text-[10px] font-semibold text-gray-600">{atoms.length} atoms</span>
        <span className="text-[10px] text-gray-300">·</span>
        <span className="text-[10px] text-gray-400">{bonds.length} bonds</span>
        {atoms.length > 0 && (
          <>
            <span className="text-[10px] text-gray-300">·</span>
            <span className="text-[10px] text-gray-400">~MW {approxMW.toFixed(0)}</span>
          </>
        )}
        <span className="ml-auto text-[10px] text-gray-300 italic capitalize">{tool} mode</span>
      </div>
    </div>
  );
}
