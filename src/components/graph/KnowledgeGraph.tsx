import { useCallback } from 'react';
import ReactFlow, {
  type Node, type Edge, Background, Controls, MiniMap,
  useNodesState, useEdgesState, Handle, Position, type NodeProps, BackgroundVariant
} from 'reactflow';
import 'reactflow/dist/style.css';
import { motion } from 'framer-motion';
import { Flask, Atom, BookOpen, Certificate, Users } from '@phosphor-icons/react';
import { PROJECTS, USERS, MOLECULES } from '../../data/mockData';

const NODE_TYPES_CONFIG: Record<string, { color: string; icon: React.ElementType }> = {
  project: { color: '#2563eb', icon: Flask },
  molecule: { color: '#7c3aed', icon: Atom },
  scientist: { color: '#059669', icon: Users },
  publication: { color: '#d97706', icon: BookOpen },
  patent: { color: '#e11d48', icon: Certificate },
};

function CustomNode({ data }: NodeProps) {
  const config = NODE_TYPES_CONFIG[data.type] ?? NODE_TYPES_CONFIG.project;
  const Icon = config.icon;
  return (
    <div
      className="px-3 py-2 rounded-xl border bg-white shadow-md cursor-pointer hover:shadow-lg transition-shadow"
      style={{ borderColor: config.color + '40', minWidth: 120 }}
    >
      <Handle type="target" position={Position.Left} style={{ background: config.color, width: 6, height: 6 }} />
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 rounded-md flex items-center justify-center shrink-0" style={{ background: config.color + '15' }}>
          <Icon size={12} style={{ color: config.color }} />
        </div>
        <div className="min-w-0">
          <div className="text-[11px] font-semibold text-gray-800 truncate max-w-[120px]">{data.label}</div>
          <div className="text-[9px] text-gray-400 capitalize">{data.type}</div>
        </div>
      </div>
      <Handle type="source" position={Position.Right} style={{ background: config.color, width: 6, height: 6 }} />
    </div>
  );
}

const INITIAL_NODES: Node[] = [
  { id: 'proj-001', type: 'custom', position: { x: 300, y: 200 }, data: { label: 'Project Aurora', type: 'project' } },
  { id: 'proj-002', type: 'custom', position: { x: 300, y: 380 }, data: { label: 'Project Helios', type: 'project' } },
  { id: 'proj-003', type: 'custom', position: { x: 300, y: 560 }, data: { label: 'Project Solaris', type: 'project' } },
  { id: 'proj-004', type: 'custom', position: { x: 300, y: 100 }, data: { label: 'Project Meridian', type: 'project' } },

  // Molecules
  { id: 'mol-001', type: 'custom', position: { x: 600, y: 150 }, data: { label: 'AUR-0147', type: 'molecule' } },
  { id: 'mol-002', type: 'custom', position: { x: 600, y: 250 }, data: { label: 'AUR-0203', type: 'molecule' } },
  { id: 'mol-003', type: 'custom', position: { x: 600, y: 380 }, data: { label: 'HEL-047', type: 'molecule' } },
  { id: 'mol-005', type: 'custom', position: { x: 600, y: 560 }, data: { label: 'SOL-0012', type: 'molecule' } },

  // Scientists
  { id: 'u-001', type: 'custom', position: { x: 50, y: 180 }, data: { label: 'Dr. Sarah Chen', type: 'scientist' } },
  { id: 'u-002', type: 'custom', position: { x: 50, y: 280 }, data: { label: 'Dr. Marcus Webb', type: 'scientist' } },
  { id: 'u-003', type: 'custom', position: { x: 50, y: 380 }, data: { label: 'Dr. Priya Nair', type: 'scientist' } },
  { id: 'u-004', type: 'custom', position: { x: 50, y: 480 }, data: { label: 'Dr. James Okafor', type: 'scientist' } },

  // Publications
  { id: 'pub-001', type: 'custom', position: { x: 860, y: 200 }, data: { label: 'J. Med. Chem. 2024', type: 'publication' } },
  { id: 'pub-002', type: 'custom', position: { x: 860, y: 380 }, data: { label: 'Nat. Chem. Bio. 2024', type: 'publication' } },

  // Patents
  { id: 'pat-001', type: 'custom', position: { x: 860, y: 110 }, data: { label: 'WO2024/198765', type: 'patent' } },
  { id: 'pat-002', type: 'custom', position: { x: 860, y: 450 }, data: { label: 'WO2024/112034', type: 'patent' } },
];

const INITIAL_EDGES: Edge[] = [
  // Scientists → Projects
  { id: 'e1', source: 'u-001', target: 'proj-001', label: 'leads', style: { stroke: '#059669', strokeWidth: 1.5 }, labelStyle: { fontSize: 9 } },
  { id: 'e2', source: 'u-002', target: 'proj-002', label: 'leads', style: { stroke: '#059669', strokeWidth: 1.5 }, labelStyle: { fontSize: 9 } },
  { id: 'e3', source: 'u-003', target: 'proj-003', label: 'leads', style: { stroke: '#059669', strokeWidth: 1.5 }, labelStyle: { fontSize: 9 } },
  { id: 'e4', source: 'u-001', target: 'proj-003', label: 'collab', style: { stroke: '#059669', strokeWidth: 1, strokeDasharray: '4,2' }, labelStyle: { fontSize: 9 } },
  { id: 'e5', source: 'u-004', target: 'proj-001', label: 'collab', style: { stroke: '#059669', strokeWidth: 1, strokeDasharray: '4,2' }, labelStyle: { fontSize: 9 } },
  { id: 'e6', source: 'u-004', target: 'proj-004', label: 'leads', style: { stroke: '#059669', strokeWidth: 1.5 }, labelStyle: { fontSize: 9 } },

  // Projects → Molecules
  { id: 'e7', source: 'proj-001', target: 'mol-001', label: 'created', style: { stroke: '#2563eb', strokeWidth: 1.5 }, labelStyle: { fontSize: 9 } },
  { id: 'e8', source: 'proj-001', target: 'mol-002', label: 'created', style: { stroke: '#2563eb', strokeWidth: 1.5 }, labelStyle: { fontSize: 9 } },
  { id: 'e9', source: 'proj-002', target: 'mol-003', label: 'created', style: { stroke: '#7c3aed', strokeWidth: 1.5 }, labelStyle: { fontSize: 9 } },
  { id: 'e10', source: 'proj-003', target: 'mol-005', label: 'created', style: { stroke: '#0891b2', strokeWidth: 1.5 }, labelStyle: { fontSize: 9 } },
  { id: 'e11', source: 'mol-001', target: 'mol-002', label: 'derived from', style: { stroke: '#7c3aed', strokeWidth: 1, strokeDasharray: '3,2' }, labelStyle: { fontSize: 9 } },

  // Projects → Publications
  { id: 'e12', source: 'proj-001', target: 'pub-001', label: 'published', style: { stroke: '#d97706', strokeWidth: 1.5 }, labelStyle: { fontSize: 9 } },
  { id: 'e13', source: 'proj-002', target: 'pub-002', label: 'published', style: { stroke: '#d97706', strokeWidth: 1.5 }, labelStyle: { fontSize: 9 } },
  { id: 'e14', source: 'mol-002', target: 'pub-001', label: 'reported in', style: { stroke: '#d97706', strokeWidth: 1 }, labelStyle: { fontSize: 9 } },
  { id: 'e15', source: 'mol-003', target: 'pub-002', label: 'reported in', style: { stroke: '#d97706', strokeWidth: 1 }, labelStyle: { fontSize: 9 } },

  // Projects → Patents
  { id: 'e16', source: 'proj-001', target: 'pat-001', label: 'protects', style: { stroke: '#e11d48', strokeWidth: 1.5 }, labelStyle: { fontSize: 9 } },
  { id: 'e17', source: 'proj-002', target: 'pat-002', label: 'protects', style: { stroke: '#e11d48', strokeWidth: 1.5 }, labelStyle: { fontSize: 9 } },
];

const nodeTypes = { custom: CustomNode };

export function KnowledgeGraph() {
  const [nodes, setNodes, onNodesChange] = useNodesState(INITIAL_NODES);
  const [edges, setEdges, onEdgesChange] = useEdgesState(INITIAL_EDGES);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1 flex flex-col bg-[#f8f9fb]">
      {/* Legend */}
      <div className="flex items-center gap-4 px-6 py-3 border-b border-gray-100 bg-white flex-wrap">
        <span className="text-[12px] font-semibold text-gray-600 mr-2">Knowledge Graph</span>
        {Object.entries(NODE_TYPES_CONFIG).map(([type, { color, icon: Icon }]) => (
          <div key={type} className="flex items-center gap-1.5 text-[11px] text-gray-500">
            <div className="w-4 h-4 rounded flex items-center justify-center" style={{ background: color + '20' }}>
              <Icon size={10} style={{ color }} />
            </div>
            <span className="capitalize">{type}</span>
          </div>
        ))}
        <div className="ml-auto flex items-center gap-3 text-[11px] text-gray-400">
          <span>─── direct</span>
          <span>- - - inferred</span>
        </div>
      </div>

      <div className="flex-1">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          nodeTypes={nodeTypes}
          fitView
          fitViewOptions={{ padding: 0.15 }}
          defaultEdgeOptions={{ type: 'smoothstep', animated: false }}
        >
          <Background variant={BackgroundVariant.Dots} gap={20} size={1} color="#e4e8ef" />
          <Controls style={{ bottom: 20, right: 20, left: 'auto', top: 'auto' }} />
          <MiniMap
            nodeColor={(n) => {
              const type = (n.data as { type: string }).type;
              return NODE_TYPES_CONFIG[type]?.color ?? '#e5e7eb';
            }}
            style={{ bottom: 20, left: 20, background: '#fff', border: '1px solid #e4e8ef', borderRadius: 8 }}
          />
        </ReactFlow>
      </div>
    </motion.div>
  );
}
