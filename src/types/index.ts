export type UserRole = 'admin' | 'principal_scientist' | 'scientist' | 'associate' | 'viewer' | 'patent_team' | 'regulatory';
export type ProjectStatus = 'active' | 'paused' | 'completed' | 'archived';
export type ExperimentStatus = 'draft' | 'in_review' | 'approved' | 'rejected' | 'published';
export type TherapeuticArea = 'oncology' | 'neuroscience' | 'cardiovascular' | 'infectious_disease' | 'immunology' | 'rare_disease';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  initials: string;
  department: string;
  title: string;
  color: string;
  isOnline?: boolean;
}

export interface Organization {
  id: string;
  name: string;
  type: 'pharma' | 'biotech' | 'academia';
  divisions: Division[];
}

export interface Division {
  id: string;
  name: string;
  departments: string[];
}

export interface Milestone {
  id: string;
  title: string;
  date: string;
  completed: boolean;
  type: 'discovery' | 'patent' | 'publication' | 'clinical' | 'approval';
}

export interface Project {
  id: string;
  name: string;
  code: string;
  description: string;
  therapeuticArea: TherapeuticArea;
  status: ProjectStatus;
  leadScientist: User;
  team: User[];
  startDate: string;
  targetDate: string;
  experiments: number;
  molecules: number;
  publications: number;
  patents: number;
  phase: 'discovery' | 'lead_optimization' | 'preclinical' | 'clinical' | 'approved';
  progress: number;
  milestones: Milestone[];
  tags: string[];
  budget?: { allocated: number; spent: number; currency: string };
  color: string;
  recentActivity?: string;
}

export interface Molecule {
  id: string;
  name: string;
  smiles: string;
  formula: string;
  mw: number;
  logP: number;
  hbd: number;
  hba: number;
  tpsa: number;
  activity?: string;
  ic50?: string;
  selectivity?: string;
  status: 'active' | 'inactive' | 'promising' | 'failed' | 'lead';
  createdBy: string;
  createdAt: string;
  experimentId?: string;
  series?: string;
  modifications?: string;
}

export interface Reaction {
  id: string;
  name: string;
  type: 'synthesis' | 'modification' | 'optimization';
  reagents: string[];
  conditions: string;
  yield?: number;
  purity?: number;
  notes?: string;
}

export interface ExperimentSection {
  id: string;
  type: 'text' | 'molecule' | 'reaction' | 'table' | 'image' | 'spectra' | 'equation' | 'reference' | 'ai_note' | 'heading';
  content: string;
  title?: string;
  data?: Record<string, unknown>;
}

export interface Experiment {
  id: string;
  title: string;
  code: string;
  projectId: string;
  version: string;
  status: ExperimentStatus;
  objective: string;
  background: string;
  author: User;
  collaborators: User[];
  createdAt: string;
  updatedAt: string;
  sections: ExperimentSection[];
  molecules: Molecule[];
  reactions: Reaction[];
  tags: string[];
  parentId?: string;
  childIds?: string[];
  reviewedBy?: User;
  approvedBy?: User;
  comments: Comment[];
  versions: VersionEntry[];
}

export interface VersionEntry {
  id: string;
  version: string;
  createdAt: string;
  author: User;
  message: string;
  changes: number;
}

export interface Comment {
  id: string;
  author: User;
  content: string;
  createdAt: string;
  resolved?: boolean;
  position?: { section: string; offset: number };
  replies?: Comment[];
}

export interface Publication {
  id: string;
  title: string;
  authors: string[];
  journal: string;
  year: number;
  doi?: string;
  status: 'draft' | 'submitted' | 'in_review' | 'accepted' | 'published';
  projectId: string;
  abstract: string;
  citations?: number;
  impactFactor?: number;
}

export interface Patent {
  id: string;
  title: string;
  inventors: string[];
  filingDate: string;
  status: 'provisional' | 'filed' | 'pending' | 'granted' | 'abandoned';
  projectId: string;
  patentNumber?: string;
  claims: number;
  jurisdiction: string[];
}

export interface ActivityItem {
  id: string;
  user: User;
  action: string;
  target: string;
  targetType: 'experiment' | 'molecule' | 'project' | 'publication' | 'patent';
  projectName?: string;
  timestamp: string;
  metadata?: Record<string, unknown>;
}

export interface Notification {
  id: string;
  type: 'mention' | 'review_request' | 'approval' | 'comment' | 'publication' | 'milestone';
  title: string;
  body: string;
  from: User;
  timestamp: string;
  read: boolean;
  href?: string;
}

export type ViewType = 'dashboard' | 'projects' | 'project_detail' | 'experiments' | 'experiment_detail' | 'publications' | 'patents' | 'knowledge_graph' | 'timeline' | 'templates' | 'libraries' | 'settings' | 'search';
